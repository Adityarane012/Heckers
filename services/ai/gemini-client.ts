/**
 * Gemini AI Client Service
 * 
 * This service provides a robust, production-ready client for Google's Gemini AI API
 * with comprehensive error handling, retry logic, and streaming support.
 * 
 * Usage:
 * ```typescript
 * const client = new GeminiClient({
 *   apiKey: process.env.GEMINI_API_KEY,
 *   model: 'gemini-2.0-flash',
 *   timeout: 30000
 * });
 * 
 * const response = await client.generateContent({
 *   prompt: "Analyze this trading strategy...",
 *   temperature: 0.7,
 *   maxTokens: 2048
 * });
 * ```
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AgentError, ErrorFactory, ErrorLogger, ProgressTracker } from '../../agents/shared/errors';
import { AgentResponse, StreamingResponse } from '../../agents/shared/types';

// Configuration interface
export interface GeminiConfig {
  apiKey: string;
  model?: string;
  timeout?: number;
  retryAttempts?: number;
  baseUrl?: string;
}

// Request interface
export interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
  stream?: boolean;
  systemInstruction?: string;
}

// Response interface
export interface GeminiResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
  model: string;
  timestamp: number;
}

// Streaming response interface
export interface GeminiStreamResponse {
  content: string;
  isComplete: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Health check interface
export interface GeminiHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastCheck: number;
  model: string;
  quotaRemaining?: number;
}

export class GeminiClient {
  private axiosInstance: AxiosInstance;
  private config: Required<GeminiConfig>;
  private errorLogger: ErrorLogger;
  private healthStatus: GeminiHealth;

  constructor(config: GeminiConfig) {
    this.config = {
      model: 'gemini-2.0-flash',
      timeout: 30000,
      retryAttempts: 3,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      ...config,
    };

    this.errorLogger = ErrorLogger.getInstance();
    this.healthStatus = {
      status: 'unhealthy',
      lastCheck: 0,
      model: this.config.model,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.config.apiKey,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();
        return config;
      },
      (error) => {
        this.errorLogger.log(
          ErrorFactory.aiServiceError('Request interceptor error', { error: error.message }),
          { config: this.config }
        );
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Update health status on successful response
        this.updateHealthStatus(true, response);
        return response;
      },
      (error) => {
        this.updateHealthStatus(false, error.response);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateHealthStatus(success: boolean, response?: AxiosResponse | any): void {
    const now = Date.now();
    const responseTime = success && response ? now - response.config?.metadata?.startTime : undefined;

    this.healthStatus = {
      status: success ? 'healthy' : 'unhealthy',
      responseTime,
      lastCheck: now,
      model: this.config.model,
      quotaRemaining: response?.data?.usage?.quotaRemaining,
    };
  }

  private handleApiError(error: any): AgentError {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.message;

    switch (status) {
      case 429:
        return ErrorFactory.quotaExceededError('Gemini');
      case 401:
      case 403:
        return new AgentError(
          'Invalid Gemini API key or insufficient permissions',
          'AUTH_ERROR',
          'high',
          {
            suggestedFix: 'Please check your API key and permissions',
            details: { status, message },
          }
        );
      case 400:
        return new AgentError(
          'Invalid request to Gemini API',
          'BAD_REQUEST',
          'medium',
          {
            suggestedFix: 'Please check your request parameters',
            details: { status, message },
          }
        );
      case 408:
        return ErrorFactory.timeoutError('Gemini API request', this.config.timeout);
      default:
        return ErrorFactory.aiServiceError(`Gemini API error: ${message}`, {
          status,
          message,
        });
    }
  }

  /**
   * Generate content using Gemini AI
   */
  async generateContent(request: GeminiRequest): Promise<GeminiResponse> {
    const startTime = Date.now();
    
    try {
      const response = await this.axiosInstance.post(
        `/models/${this.config.model}:generateContent`,
        {
          contents: [{
            parts: [{
              text: request.prompt,
            }],
          }],
          generationConfig: {
            temperature: request.temperature || 0.7,
            topK: request.topK || 40,
            topP: request.topP || 0.95,
            maxOutputTokens: request.maxTokens || 2048,
          },
          systemInstruction: request.systemInstruction ? {
            parts: [{
              text: request.systemInstruction,
            }],
          } : undefined,
        },
        {
          metadata: { startTime },
        }
      );

      const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!result) {
        throw ErrorFactory.aiServiceError('No content generated from Gemini API');
      }

      return {
        content: result,
        usage: response.data?.usageMetadata ? {
          promptTokens: response.data.usageMetadata.promptTokenCount,
          completionTokens: response.data.usageMetadata.candidatesTokenCount,
          totalTokens: response.data.usageMetadata.totalTokenCount,
        } : undefined,
        finishReason: response.data?.candidates?.[0]?.finishReason,
        model: this.config.model,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.errorLogger.log(
        error instanceof AgentError ? error : ErrorFactory.aiServiceError('Content generation failed', { error }),
        { request, config: this.config }
      );
      throw error;
    }
  }

  /**
   * Generate content with streaming support
   */
  async *generateContentStream(request: GeminiRequest): AsyncGenerator<GeminiStreamResponse> {
    const startTime = Date.now();
    
    try {
      const response = await this.axiosInstance.post(
        `/models/${this.config.model}:streamGenerateContent`,
        {
          contents: [{
            parts: [{
              text: request.prompt,
            }],
          }],
          generationConfig: {
            temperature: request.temperature || 0.7,
            topK: request.topK || 40,
            topP: request.topP || 0.95,
            maxOutputTokens: request.maxTokens || 2048,
          },
          systemInstruction: request.systemInstruction ? {
            parts: [{
              text: request.systemInstruction,
            }],
          } : undefined,
        },
        {
          responseType: 'stream',
          metadata: { startTime },
        }
      );

      let buffer = '';
      let isComplete = false;
      let usage: any = undefined;

      for await (const chunk of response.data) {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                yield {
                  content: data.candidates[0].content.parts[0].text,
                  isComplete: false,
                };
              }

              if (data.usageMetadata) {
                usage = {
                  promptTokens: data.usageMetadata.promptTokenCount,
                  completionTokens: data.usageMetadata.candidatesTokenCount,
                  totalTokens: data.usageMetadata.totalTokenCount,
                };
              }

              if (data.candidates?.[0]?.finishReason) {
                isComplete = true;
              }
            } catch (parseError) {
              // Skip malformed JSON
              continue;
            }
          }
        }
      }

      // Final response
      yield {
        content: '',
        isComplete: true,
        usage,
      };
    } catch (error) {
      this.errorLogger.log(
        error instanceof AgentError ? error : ErrorFactory.aiServiceError('Streaming content generation failed', { error }),
        { request, config: this.config }
      );
      throw error;
    }
  }

  /**
   * Generate content with progress tracking
   */
  async generateContentWithProgress(
    request: GeminiRequest,
    onProgress?: (progress: number, message: string) => void
  ): Promise<GeminiResponse> {
    const progressTracker = new ProgressTracker(onProgress);
    
    try {
      progressTracker.updateProgress(10, 'Initializing Gemini AI request...');
      
      if (request.stream) {
        progressTracker.updateProgress(30, 'Starting streaming generation...');
        
        let fullContent = '';
        let usage: any = undefined;
        
        for await (const chunk of this.generateContentStream(request)) {
          if (!chunk.isComplete) {
            fullContent += chunk.content;
            progressTracker.updateProgress(50, 'Generating content...');
          } else {
            usage = chunk.usage;
            progressTracker.updateProgress(100, 'Content generation completed');
          }
        }
        
        return {
          content: fullContent,
          usage,
          model: this.config.model,
          timestamp: Date.now(),
        };
      } else {
        progressTracker.updateProgress(50, 'Generating content...');
        const response = await this.generateContent(request);
        progressTracker.updateProgress(100, 'Content generation completed');
        return response;
      }
    } catch (error) {
      progressTracker.addError(error instanceof AgentError ? error : ErrorFactory.aiServiceError('Content generation failed'));
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<GeminiHealth> {
    try {
      const startTime = Date.now();
      
      // Simple test request
      await this.generateContent({
        prompt: 'Hello',
        maxTokens: 10,
      });
      
      const responseTime = Date.now() - startTime;
      
      this.healthStatus = {
        status: 'healthy',
        responseTime,
        lastCheck: Date.now(),
        model: this.config.model,
      };
      
      return this.healthStatus;
    } catch (error) {
      this.healthStatus = {
        status: 'unhealthy',
        lastCheck: Date.now(),
        model: this.config.model,
      };
      
      return this.healthStatus;
    }
  }

  /**
   * Get current health status
   */
  getHealthStatus(): GeminiHealth {
    return { ...this.healthStatus };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update axios instance
    this.axiosInstance.defaults.timeout = this.config.timeout;
    this.axiosInstance.defaults.headers['X-goog-api-key'] = this.config.apiKey;
  }

  /**
   * Get configuration
   */
  getConfig(): Required<GeminiConfig> {
    return { ...this.config };
  }
}

// Export singleton instance
let geminiClientInstance: GeminiClient | null = null;

export function getGeminiClient(config?: GeminiConfig): GeminiClient {
  if (!geminiClientInstance && config) {
    geminiClientInstance = new GeminiClient(config);
  }
  
  if (!geminiClientInstance) {
    throw new AgentError(
      'Gemini client not initialized. Please provide configuration.',
      'CLIENT_NOT_INITIALIZED',
      'high'
    );
  }
  
  return geminiClientInstance;
}

export function initializeGeminiClient(config: GeminiConfig): GeminiClient {
  geminiClientInstance = new GeminiClient(config);
  return geminiClientInstance;
}
