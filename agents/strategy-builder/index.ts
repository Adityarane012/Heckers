/**
 * Strategy Builder Agent
 * 
 * This agent converts natural language trading ideas into structured strategy configurations.
 * It uses advanced prompt engineering and validation to ensure reliable strategy generation.
 * 
 * Usage:
 * ```typescript
 * const agent = new StrategyBuilderAgent();
 * const result = await agent.buildStrategy({
 *   prompt: "Buy when RSI drops below 30 and sell when it goes above 70",
 *   userId: "user123"
 * });
 * ```
 */

import { AgentResponse, StrategyDefinition, AgentConfig } from '../shared/types';
import { AgentError, ErrorFactory, withErrorHandling, ProgressTracker } from '../shared/errors';
import { StrategyValidator } from '../shared/validation';
import { getGeminiClient } from '../../services/ai/gemini-client';
import { prompts } from './prompts';

export interface StrategyBuilderRequest {
  prompt: string;
  userId?: string;
  sessionId?: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    includeEducationalContent?: boolean;
  };
}

export interface StrategyBuilderResponse {
  strategy: StrategyDefinition;
  explanation: string;
  educationalSummary: string;
  confidence: number;
  alternatives?: StrategyDefinition[];
}

export class StrategyBuilderAgent {
  private config: AgentConfig;
  private validator: StrategyValidator;
  private geminiClient: ReturnType<typeof getGeminiClient>;

  constructor(config?: Partial<AgentConfig>) {
    this.config = {
      id: 'strategy-builder',
      name: 'Strategy Builder Agent',
      description: 'Converts natural language trading ideas into structured strategy configurations',
      version: '1.0.0',
      enabled: true,
      timeout: 30000,
      retryAttempts: 3,
      ...config,
    };

    this.validator = new StrategyValidator();
    this.geminiClient = getGeminiClient();
  }

  /**
   * Build a strategy from natural language input
   */
  async buildStrategy(request: StrategyBuilderRequest): Promise<AgentResponse<StrategyBuilderResponse>> {
    const startTime = Date.now();
    
    return withErrorHandling(
      async () => {
        // Validate input
        this.validateRequest(request);

        // Generate strategy using AI
        const aiResponse = await this.generateStrategyWithAI(request);

        // Parse and validate the response
        const strategy = this.parseStrategyResponse(aiResponse);

        // Generate educational content
        const educationalContent = await this.generateEducationalContent(strategy, request.prompt);

        // Calculate confidence score
        const confidence = this.calculateConfidence(strategy, request.prompt);

        const response: StrategyBuilderResponse = {
          strategy,
          explanation: educationalContent.explanation,
          educationalSummary: educationalContent.summary,
          confidence,
        };

        return {
          status: 'done',
          progress: 100,
          data: response,
          explanation: `Generated ${strategy.type} strategy with ${Object.keys(strategy.params).length} parameters`,
          educationalSummary: `This strategy uses ${strategy.type} logic to identify trading opportunities based on your description: "${request.prompt}"`,
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: this.config.timeout,
        retryAttempts: this.config.retryAttempts,
        onProgress: (progress, message) => {
          console.log(`[${this.config.id}] ${progress}%: ${message}`);
        },
      }
    );
  }

  /**
   * Build multiple strategy alternatives
   */
  async buildStrategyAlternatives(
    request: StrategyBuilderRequest,
    count: number = 3
  ): Promise<AgentResponse<StrategyBuilderResponse[]>> {
    const startTime = Date.now();
    
    return withErrorHandling(
      async () => {
        this.validateRequest(request);

        const alternatives: StrategyBuilderResponse[] = [];
        
        for (let i = 0; i < count; i++) {
          const alternativeRequest = {
            ...request,
            options: {
              ...request.options,
              temperature: (request.options?.temperature || 0.7) + (i * 0.1), // Vary creativity
            },
          };

          const result = await this.buildStrategy(alternativeRequest);
          if (result.data) {
            alternatives.push(result.data);
          }
        }

        return {
          status: 'done',
          progress: 100,
          data: alternatives,
          explanation: `Generated ${alternatives.length} strategy alternatives`,
          educationalSummary: `Multiple approaches to implement your trading idea: "${request.prompt}"`,
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: this.config.timeout * 2, // Longer timeout for multiple strategies
        retryAttempts: this.config.retryAttempts,
      }
    );
  }

  /**
   * Validate a strategy configuration
   */
  async validateStrategy(strategy: StrategyDefinition): Promise<AgentResponse<{ isValid: boolean; errors: string[]; warnings: string[] }>> {
    return withErrorHandling(
      async () => {
        const validation = this.validator.validate(strategy);

        return {
          status: 'done',
          progress: 100,
          data: {
            isValid: validation.isValid,
            errors: validation.errors,
            warnings: validation.warnings,
          },
          explanation: `Strategy validation completed with ${validation.errors.length} errors and ${validation.warnings.length} warnings`,
          educationalSummary: 'Strategy validation helps ensure your trading logic is sound and parameters are within reasonable ranges',
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 5000, // Quick validation
        retryAttempts: 1,
      }
    );
  }

  /**
   * Get agent health status
   */
  async getHealth(): Promise<AgentResponse<{ status: string; dependencies: string[] }>> {
    return withErrorHandling(
      async () => {
        const geminiHealth = await this.geminiClient.healthCheck();

        return {
          status: 'done',
          progress: 100,
          data: {
            status: geminiHealth.status,
            dependencies: ['gemini-ai'],
          },
          explanation: 'Health check completed',
          educationalSummary: 'Agent health monitoring ensures reliable strategy generation',
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 10000,
        retryAttempts: 1,
      }
    );
  }

  private validateRequest(request: StrategyBuilderRequest): void {
    if (!request.prompt || typeof request.prompt !== 'string') {
      throw ErrorFactory.validationError('Prompt is required and must be a string');
    }

    if (request.prompt.length < 10) {
      throw ErrorFactory.validationError('Prompt must be at least 10 characters long');
    }

    if (request.prompt.length > 1000) {
      throw ErrorFactory.validationError('Prompt must be less than 1000 characters');
    }
  }

  private async generateStrategyWithAI(request: StrategyBuilderRequest): Promise<string> {
    const prompt = prompts.buildStrategyPrompt(request.prompt);
    
    const response = await this.geminiClient.generateContentWithProgress({
      prompt,
      temperature: request.options?.temperature || 0.7,
      maxTokens: request.options?.maxTokens || 2048,
      systemInstruction: prompts.getSystemInstruction(),
    });

    return response.content;
  }

  private parseStrategyResponse(aiResponse: string): StrategyDefinition {
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                       aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw ErrorFactory.validationError('No valid JSON found in AI response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const strategyData = JSON.parse(jsonStr);

      // Create a complete strategy definition
      const strategy: StrategyDefinition = {
        id: this.generateStrategyId(),
        name: strategyData.name || `Generated Strategy`,
        type: strategyData.type,
        params: strategyData.params || {},
        description: strategyData.rationale || 'AI-generated strategy',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Validate the strategy
      const validation = this.validator.validate(strategy);
      if (!validation.isValid) {
        throw ErrorFactory.validationError(
          `Strategy validation failed: ${validation.errors.join(', ')}`,
          { errors: validation.errors, warnings: validation.warnings }
        );
      }

      return strategy;
    } catch (error) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw ErrorFactory.validationError(
        'Failed to parse AI response as valid strategy',
        { originalError: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private async generateEducationalContent(
    strategy: StrategyDefinition,
    originalPrompt: string
  ): Promise<{ explanation: string; summary: string }> {
    try {
      const prompt = prompts.buildEducationalPrompt(strategy, originalPrompt);
      
      const response = await this.geminiClient.generateContent({
        prompt,
        temperature: 0.5, // Lower temperature for more consistent educational content
        maxTokens: 1024,
      });

      // Parse the educational content
      const content = response.content;
      const explanationMatch = content.match(/Explanation:\s*([\s\S]*?)(?=Summary:|$)/);
      const summaryMatch = content.match(/Summary:\s*([\s\S]*?)$/);

      return {
        explanation: explanationMatch?.[1]?.trim() || content,
        summary: summaryMatch?.[1]?.trim() || 'Educational content generated successfully',
      };
    } catch (error) {
      // Fallback educational content
      return {
        explanation: `This ${strategy.type} strategy was generated from your prompt: "${originalPrompt}". It uses technical indicators to identify trading opportunities.`,
        summary: `The strategy implements ${strategy.type} logic with parameters: ${Object.entries(strategy.params).map(([k, v]) => `${k}=${v}`).join(', ')}.`,
      };
    }
  }

  private calculateConfidence(strategy: StrategyDefinition, originalPrompt: string): number {
    let confidence = 0.5; // Base confidence

    // Check if strategy type matches common patterns in prompt
    const promptLower = originalPrompt.toLowerCase();
    const strategyTypeLower = strategy.type.toLowerCase();

    if (promptLower.includes('rsi') && strategyTypeLower.includes('rsi')) {
      confidence += 0.2;
    }
    if (promptLower.includes('moving average') && strategyTypeLower.includes('sma')) {
      confidence += 0.2;
    }
    if (promptLower.includes('macd') && strategyTypeLower.includes('macd')) {
      confidence += 0.2;
    }
    if (promptLower.includes('breakout') && strategyTypeLower.includes('breakout')) {
      confidence += 0.2;
    }
    if (promptLower.includes('momentum') && strategyTypeLower.includes('momentum')) {
      confidence += 0.2;
    }

    // Check parameter completeness
    const paramCount = Object.keys(strategy.params).length;
    if (paramCount >= 2) {
      confidence += 0.1;
    }

    // Check description quality
    if (strategy.description && strategy.description.length > 50) {
      confidence += 0.1;
    }

    return Math.min(1.0, Math.max(0.0, confidence));
  }

  private generateStrategyId(): string {
    return `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Update agent configuration
   */
  updateConfig(newConfig: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
let strategyBuilderInstance: StrategyBuilderAgent | null = null;

export function getStrategyBuilderAgent(config?: Partial<AgentConfig>): StrategyBuilderAgent {
  if (!strategyBuilderInstance) {
    strategyBuilderInstance = new StrategyBuilderAgent(config);
  }
  return strategyBuilderInstance;
}

export function initializeStrategyBuilderAgent(config?: Partial<AgentConfig>): StrategyBuilderAgent {
  strategyBuilderInstance = new StrategyBuilderAgent(config);
  return strategyBuilderInstance;
}
