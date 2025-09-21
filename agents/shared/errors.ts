/**
 * Shared error handling utilities for all AlgoMentor AI agents
 * 
 * This module provides standardized error handling, logging, and error recovery
 * mechanisms used across all agents in the platform.
 */

import { AgentError, ProgressUpdate } from './types';

// Error codes for different types of failures
export enum ErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // AI/LLM errors
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED',
  AI_INVALID_RESPONSE = 'AI_INVALID_RESPONSE',
  AI_TIMEOUT = 'AI_TIMEOUT',
  
  // Data errors
  DATA_FETCH_ERROR = 'DATA_FETCH_ERROR',
  DATA_VALIDATION_ERROR = 'DATA_VALIDATION_ERROR',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  
  // Strategy errors
  STRATEGY_INVALID = 'STRATEGY_INVALID',
  STRATEGY_EXECUTION_ERROR = 'STRATEGY_EXECUTION_ERROR',
  BACKTEST_ERROR = 'BACKTEST_ERROR',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_UNAVAILABLE = 'API_UNAVAILABLE',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Custom error class for agent errors
export class AgentError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly suggestedFix?: string;
  public readonly details?: any;
  public readonly timestamp: number;
  public readonly agentId?: string;

  constructor(
    message: string,
    code: string = ErrorCode.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    options?: {
      suggestedFix?: string;
      details?: any;
      agentId?: string;
    }
  ) {
    super(message);
    this.name = 'AgentError';
    this.code = code;
    this.severity = severity;
    this.suggestedFix = options?.suggestedFix;
    this.details = options?.details;
    this.timestamp = Date.now();
    this.agentId = options?.agentId;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgentError);
    }
  }

  toJSON(): AgentError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      suggestedFix: this.suggestedFix,
      timestamp: this.timestamp,
    };
  }
}

// Error factory functions for common error types
export class ErrorFactory {
  static validationError(message: string, details?: any): AgentError {
    return new AgentError(
      message,
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM,
      {
        suggestedFix: 'Please check your input and try again',
        details,
      }
    );
  }

  static aiServiceError(message: string, details?: any): AgentError {
    return new AgentError(
      message,
      ErrorCode.AI_SERVICE_ERROR,
      ErrorSeverity.HIGH,
      {
        suggestedFix: 'The AI service is temporarily unavailable. Please try again later.',
        details,
      }
    );
  }

  static quotaExceededError(service: string): AgentError {
    return new AgentError(
      `${service} API quota exceeded`,
      ErrorCode.AI_QUOTA_EXCEEDED,
      ErrorSeverity.HIGH,
      {
        suggestedFix: 'Please check your API billing plan or try again later',
        details: { service },
      }
    );
  }

  static timeoutError(operation: string, timeout: number): AgentError {
    return new AgentError(
      `${operation} timed out after ${timeout}ms`,
      ErrorCode.TIMEOUT_ERROR,
      ErrorSeverity.MEDIUM,
      {
        suggestedFix: 'The operation took too long. Please try again with simpler parameters.',
        details: { operation, timeout },
      }
    );
  }

  static dataFetchError(source: string, details?: any): AgentError {
    return new AgentError(
      `Failed to fetch data from ${source}`,
      ErrorCode.DATA_FETCH_ERROR,
      ErrorSeverity.MEDIUM,
      {
        suggestedFix: 'Please check your internet connection and try again',
        details: { source, ...details },
      }
    );
  }

  static strategyError(message: string, strategyId?: string): AgentError {
    return new AgentError(
      message,
      ErrorCode.STRATEGY_EXECUTION_ERROR,
      ErrorSeverity.HIGH,
      {
        suggestedFix: 'Please review your strategy parameters and try again',
        details: { strategyId },
      }
    );
  }
}

// Error recovery strategies
export interface ErrorRecoveryStrategy {
  canRecover(error: AgentError): boolean;
  recover(error: AgentError): Promise<any>;
  getRecoveryMessage(error: AgentError): string;
}

// Default recovery strategies
export class DefaultRecoveryStrategies {
  static retryStrategy: ErrorRecoveryStrategy = {
    canRecover: (error: AgentError) => 
      error.code === ErrorCode.NETWORK_ERROR || 
      error.code === ErrorCode.AI_TIMEOUT,
    
    recover: async (error: AgentError) => {
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw error; // Re-throw to trigger retry
    },
    
    getRecoveryMessage: (error: AgentError) => 
      'Retrying the operation...',
  };

  static fallbackStrategy: ErrorRecoveryStrategy = {
    canRecover: (error: AgentError) => 
      error.code === ErrorCode.AI_QUOTA_EXCEEDED,
    
    recover: async (error: AgentError) => {
      // Return mock/fallback data
      return { fallback: true, originalError: error };
    },
    
    getRecoveryMessage: (error: AgentError) => 
      'Using fallback data due to service limitations',
  };
}

// Error logging utility
export class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: Array<{ error: AgentError; timestamp: number; context?: any }> = [];

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: AgentError, context?: any): void {
    const logEntry = {
      error,
      timestamp: Date.now(),
      context,
    };
    
    this.logs.push(logEntry);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Agent Error:', {
        code: error.code,
        message: error.message,
        severity: error.severity,
        suggestedFix: error.suggestedFix,
        context,
      });
    }
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  getRecentErrors(limit: number = 100): Array<{ error: AgentError; timestamp: number; context?: any }> {
    return this.logs.slice(-limit);
  }

  getErrorsByCode(code: string): AgentError[] {
    return this.logs
      .filter(log => log.error.code === code)
      .map(log => log.error);
  }
}

// Progress tracking with error handling
export class ProgressTracker {
  private progress: number = 0;
  private errors: AgentError[] = [];
  private onUpdate?: (update: ProgressUpdate) => void;

  constructor(onUpdate?: (update: ProgressUpdate) => void) {
    this.onUpdate = onUpdate;
  }

  updateProgress(progress: number, message: string, partialResults?: any): void {
    this.progress = Math.max(0, Math.min(100, progress));
    
    const update: ProgressUpdate = {
      progress: this.progress,
      message,
      partialResults,
      errors: this.errors.length > 0 ? this.errors : undefined,
    };
    
    this.onUpdate?.(update);
  }

  addError(error: AgentError): void {
    this.errors.push(error);
    ErrorLogger.getInstance().log(error);
  }

  getProgress(): number {
    return this.progress;
  }

  getErrors(): AgentError[] {
    return [...this.errors];
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Utility function to wrap async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  agentId: string,
  options?: {
    timeout?: number;
    retries?: number;
    onProgress?: (progress: number, message: string) => void;
  }
): Promise<T> {
  const timeout = options?.timeout || 30000;
  const retries = options?.retries || 3;
  const progressTracker = new ProgressTracker(
    options?.onProgress ? 
      (update) => options.onProgress!(update.progress, update.message) : 
      undefined
  );

  let lastError: AgentError | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      progressTracker.updateProgress(10, `Starting operation (attempt ${attempt}/${retries})`);
      
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(ErrorFactory.timeoutError('Operation', timeout)), timeout)
        ),
      ]);

      progressTracker.updateProgress(100, 'Operation completed successfully');
      return result;
    } catch (error) {
      lastError = error instanceof AgentError ? error : 
        new AgentError(
          error instanceof Error ? error.message : 'Unknown error',
          ErrorCode.UNKNOWN_ERROR,
          ErrorSeverity.MEDIUM,
          { agentId }
        );

      progressTracker.addError(lastError);
      progressTracker.updateProgress(50, `Error on attempt ${attempt}: ${lastError.message}`);

      if (attempt === retries) {
        throw lastError;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw lastError || ErrorFactory.validationError('Operation failed after all retries');
}
