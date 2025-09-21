/**
 * Shared validation utilities for all AlgoMentor AI agents
 * 
 * This module provides standardized validation functions for inputs, outputs,
 * and data structures used across all agents in the platform.
 */

import { AgentError, ErrorFactory } from './errors';
import { OHLCV, Trade, StrategyDefinition, NewsArticle, SentimentScore } from './types';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Base validator class
export abstract class BaseValidator<T> {
  abstract validate(data: T): ValidationResult;
  
  protected createError(message: string): string {
    return message;
  }
  
  protected createWarning(message: string): string {
    return message;
  }
}

// OHLCV data validator
export class OHLCVValidator extends BaseValidator<OHLCV> {
  validate(data: OHLCV): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (typeof data.timestamp !== 'number' || data.timestamp <= 0) {
      errors.push('Timestamp must be a positive number');
    }

    if (typeof data.open !== 'number' || data.open <= 0) {
      errors.push('Open price must be a positive number');
    }

    if (typeof data.high !== 'number' || data.high <= 0) {
      errors.push('High price must be a positive number');
    }

    if (typeof data.low !== 'number' || data.low <= 0) {
      errors.push('Low price must be a positive number');
    }

    if (typeof data.close !== 'number' || data.close <= 0) {
      errors.push('Close price must be a positive number');
    }

    if (typeof data.volume !== 'number' || data.volume < 0) {
      errors.push('Volume must be a non-negative number');
    }

    // Price consistency checks
    if (data.high < data.low) {
      errors.push('High price cannot be less than low price');
    }

    if (data.high < data.open || data.high < data.close) {
      errors.push('High price must be >= open and close prices');
    }

    if (data.low > data.open || data.low > data.close) {
      errors.push('Low price must be <= open and close prices');
    }

    // Volume warnings
    if (data.volume === 0) {
      warnings.push('Volume is zero - this might indicate a data issue');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Trade validator
export class TradeValidator extends BaseValidator<Trade> {
  validate(data: Trade): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.id || typeof data.id !== 'string') {
      errors.push('Trade ID is required and must be a string');
    }

    if (!data.symbol || typeof data.symbol !== 'string') {
      errors.push('Symbol is required and must be a string');
    }

    if (!['buy', 'sell'].includes(data.side)) {
      errors.push('Side must be either "buy" or "sell"');
    }

    if (typeof data.quantity !== 'number' || data.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Price must be a positive number');
    }

    if (typeof data.timestamp !== 'number' || data.timestamp <= 0) {
      errors.push('Timestamp must be a positive number');
    }

    // Optional fields validation
    if (data.pnl !== undefined && typeof data.pnl !== 'number') {
      errors.push('PnL must be a number if provided');
    }

    if (data.fees !== undefined && (typeof data.fees !== 'number' || data.fees < 0)) {
      errors.push('Fees must be a non-negative number if provided');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Strategy definition validator
export class StrategyValidator extends BaseValidator<StrategyDefinition> {
  private readonly validStrategyTypes = ['smaCross', 'rsiReversion', 'macd', 'breakout', 'momentum', 'custom'];

  validate(data: StrategyDefinition): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.id || typeof data.id !== 'string') {
      errors.push('Strategy ID is required and must be a string');
    }

    if (!data.name || typeof data.name !== 'string') {
      errors.push('Strategy name is required and must be a string');
    }

    if (!this.validStrategyTypes.includes(data.type)) {
      errors.push(`Strategy type must be one of: ${this.validStrategyTypes.join(', ')}`);
    }

    if (!data.params || typeof data.params !== 'object') {
      errors.push('Strategy parameters are required and must be an object');
    }

    if (!data.description || typeof data.description !== 'string') {
      errors.push('Strategy description is required and must be a string');
    }

    if (typeof data.createdAt !== 'number' || data.createdAt <= 0) {
      errors.push('Created timestamp must be a positive number');
    }

    if (typeof data.updatedAt !== 'number' || data.updatedAt <= 0) {
      errors.push('Updated timestamp must be a positive number');
    }

    // Strategy-specific parameter validation
    if (data.params) {
      const paramErrors = this.validateStrategyParams(data.type, data.params);
      errors.push(...paramErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateStrategyParams(type: string, params: Record<string, any>): string[] {
    const errors: string[] = [];

    switch (type) {
      case 'smaCross':
        if (typeof params.fastPeriod !== 'number' || params.fastPeriod <= 0) {
          errors.push('SMA Cross: fastPeriod must be a positive number');
        }
        if (typeof params.slowPeriod !== 'number' || params.slowPeriod <= 0) {
          errors.push('SMA Cross: slowPeriod must be a positive number');
        }
        if (params.fastPeriod >= params.slowPeriod) {
          errors.push('SMA Cross: fastPeriod must be less than slowPeriod');
        }
        break;

      case 'rsiReversion':
        if (typeof params.period !== 'number' || params.period <= 0) {
          errors.push('RSI Reversion: period must be a positive number');
        }
        if (typeof params.oversold !== 'number' || params.oversold < 0 || params.oversold > 100) {
          errors.push('RSI Reversion: oversold must be between 0 and 100');
        }
        if (typeof params.overbought !== 'number' || params.overbought < 0 || params.overbought > 100) {
          errors.push('RSI Reversion: overbought must be between 0 and 100');
        }
        if (params.oversold >= params.overbought) {
          errors.push('RSI Reversion: oversold must be less than overbought');
        }
        break;

      case 'macd':
        if (typeof params.fastEMA !== 'number' || params.fastEMA <= 0) {
          errors.push('MACD: fastEMA must be a positive number');
        }
        if (typeof params.slowEMA !== 'number' || params.slowEMA <= 0) {
          errors.push('MACD: slowEMA must be a positive number');
        }
        if (typeof params.signalEMA !== 'number' || params.signalEMA <= 0) {
          errors.push('MACD: signalEMA must be a positive number');
        }
        if (params.fastEMA >= params.slowEMA) {
          errors.push('MACD: fastEMA must be less than slowEMA');
        }
        break;

      case 'breakout':
        if (typeof params.period !== 'number' || params.period <= 0) {
          errors.push('Breakout: period must be a positive number');
        }
        if (typeof params.multiplier !== 'number' || params.multiplier <= 0) {
          errors.push('Breakout: multiplier must be a positive number');
        }
        break;

      case 'momentum':
        if (typeof params.period !== 'number' || params.period <= 0) {
          errors.push('Momentum: period must be a positive number');
        }
        if (typeof params.threshold !== 'number') {
          errors.push('Momentum: threshold must be a number');
        }
        break;
    }

    return errors;
  }
}

// News article validator
export class NewsValidator extends BaseValidator<NewsArticle> {
  validate(data: NewsArticle): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.id || typeof data.id !== 'string') {
      errors.push('Article ID is required and must be a string');
    }

    if (!data.title || typeof data.title !== 'string') {
      errors.push('Article title is required and must be a string');
    }

    if (!data.content || typeof data.content !== 'string') {
      errors.push('Article content is required and must be a string');
    }

    if (!data.source || typeof data.source !== 'string') {
      errors.push('Article source is required and must be a string');
    }

    if (typeof data.publishedAt !== 'number' || data.publishedAt <= 0) {
      errors.push('Published timestamp must be a positive number');
    }

    if (!data.url || typeof data.url !== 'string') {
      errors.push('Article URL is required and must be a string');
    }

    // Content quality checks
    if (data.title.length < 10) {
      warnings.push('Article title is very short');
    }

    if (data.content.length < 50) {
      warnings.push('Article content is very short');
    }

    // URL validation
    try {
      new URL(data.url);
    } catch {
      errors.push('Article URL is not valid');
    }

    // Sentiment validation if present
    if (data.sentiment) {
      const sentimentErrors = this.validateSentiment(data.sentiment);
      errors.push(...sentimentErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateSentiment(sentiment: SentimentScore): string[] {
    const errors: string[] = [];

    if (typeof sentiment.score !== 'number' || sentiment.score < -1 || sentiment.score > 1) {
      errors.push('Sentiment score must be between -1 and 1');
    }

    if (typeof sentiment.magnitude !== 'number' || sentiment.magnitude < 0 || sentiment.magnitude > 1) {
      errors.push('Sentiment magnitude must be between 0 and 1');
    }

    if (!['positive', 'negative', 'neutral'].includes(sentiment.label)) {
      errors.push('Sentiment label must be positive, negative, or neutral');
    }

    if (typeof sentiment.confidence !== 'number' || sentiment.confidence < 0 || sentiment.confidence > 1) {
      errors.push('Sentiment confidence must be between 0 and 1');
    }

    return errors;
  }
}

// Generic array validator
export class ArrayValidator<T> extends BaseValidator<T[]> {
  constructor(private itemValidator: BaseValidator<T>) {
    super();
  }

  validate(data: T[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { isValid: false, errors, warnings };
    }

    if (data.length === 0) {
      warnings.push('Array is empty');
    }

    // Validate each item
    data.forEach((item, index) => {
      const itemResult = this.itemValidator.validate(item);
      if (!itemResult.isValid) {
        errors.push(`Item ${index}: ${itemResult.errors.join(', ')}`);
      }
      warnings.push(...itemResult.warnings.map(w => `Item ${index}: ${w}`));
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Validation utility functions
export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validateTimestamp(timestamp: number): boolean {
    return typeof timestamp === 'number' && timestamp > 0 && timestamp < Date.now() + 86400000; // Not more than 1 day in future
  }

  static validateSymbol(symbol: string): boolean {
    return typeof symbol === 'string' && symbol.length > 0 && symbol.length <= 10 && /^[A-Z0-9.]+$/.test(symbol);
  }

  static validatePrice(price: number): boolean {
    return typeof price === 'number' && price > 0 && price < 1000000; // Reasonable price range
  }

  static validateQuantity(quantity: number): boolean {
    return typeof quantity === 'number' && quantity > 0 && Number.isInteger(quantity);
  }
}

// Validation decorator for functions
export function validateInput<T>(validator: BaseValidator<T>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const input = args[0];
      const result = validator.validate(input);
      
      if (!result.isValid) {
        throw ErrorFactory.validationError(
          `Validation failed: ${result.errors.join(', ')}`,
          { errors: result.errors, warnings: result.warnings }
        );
      }

      return method.apply(this, args);
    };
  };
}

// Export commonly used validators
export const validators = {
  ohlcv: new OHLCVValidator(),
  trade: new TradeValidator(),
  strategy: new StrategyValidator(),
  news: new NewsValidator(),
  ohlcvArray: new ArrayValidator(new OHLCVValidator()),
  tradeArray: new ArrayValidator(new TradeValidator()),
  newsArray: new ArrayValidator(new NewsValidator()),
};
