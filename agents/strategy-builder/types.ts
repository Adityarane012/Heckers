/**
 * Strategy Builder Agent Types
 * 
 * This module defines all TypeScript interfaces and types specific to the
 * Strategy Builder Agent functionality.
 */

import { StrategyDefinition } from '../shared/types';

// Request types
export interface StrategyBuilderRequest {
  prompt: string;
  userId?: string;
  sessionId?: string;
  options?: StrategyBuilderOptions;
}

export interface StrategyBuilderOptions {
  temperature?: number;
  maxTokens?: number;
  includeEducationalContent?: boolean;
  generateAlternatives?: boolean;
  alternativeCount?: number;
}

// Response types
export interface StrategyBuilderResponse {
  strategy: StrategyDefinition;
  explanation: string;
  educationalSummary: string;
  confidence: number;
  alternatives?: StrategyDefinition[];
  metadata?: StrategyBuilderMetadata;
}

export interface StrategyBuilderMetadata {
  processingTime: number;
  tokensUsed?: number;
  model: string;
  version: string;
  timestamp: number;
}

// Strategy generation result
export interface StrategyGenerationResult {
  success: boolean;
  strategy?: StrategyDefinition;
  error?: string;
  confidence: number;
  processingTime: number;
}

// Alternative strategy request
export interface AlternativeStrategyRequest {
  basePrompt: string;
  count: number;
  excludeTypes?: string[];
  options?: StrategyBuilderOptions;
}

// Strategy validation result
export interface StrategyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number; // 0-100
}

// Strategy optimization request
export interface StrategyOptimizationRequest {
  strategy: StrategyDefinition;
  backtestResults?: any;
  optimizationGoals?: OptimizationGoal[];
}

export interface OptimizationGoal {
  type: 'performance' | 'risk' | 'stability' | 'simplicity';
  weight: number; // 0-1
  target?: number;
}

// Strategy comparison result
export interface StrategyComparisonResult {
  strategies: StrategyDefinition[];
  comparison: {
    [strategyId: string]: {
      strengths: string[];
      weaknesses: string[];
      bestFor: string[];
      riskLevel: 'low' | 'medium' | 'high';
    };
  };
  recommendation: {
    bestOverall: string;
    bestForBeginners: string;
    bestForAdvanced: string;
    reasoning: string;
  };
}

// Educational content types
export interface EducationalContent {
  explanation: string;
  summary: string;
  keyConcepts: string[];
  examples: string[];
  nextSteps: string[];
  relatedStrategies: string[];
}

// Strategy template
export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'trend' | 'reversion' | 'momentum' | 'breakout' | 'volatility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  template: Partial<StrategyDefinition>;
  examples: string[];
  educationalContent: EducationalContent;
}

// User preferences for strategy generation
export interface StrategyPreferences {
  preferredTypes?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  marketFocus?: 'stocks' | 'forex' | 'crypto' | 'all';
  timeHorizon?: 'short' | 'medium' | 'long';
}

// Strategy generation context
export interface StrategyGenerationContext {
  userPreferences?: StrategyPreferences;
  marketConditions?: MarketConditions;
  historicalPerformance?: HistoricalPerformance;
  userHistory?: UserStrategyHistory;
}

export interface MarketConditions {
  volatility: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'sideways';
  volume: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface HistoricalPerformance {
  [strategyType: string]: {
    avgReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    winRate: number;
    sampleSize: number;
  };
}

export interface UserStrategyHistory {
  createdStrategies: string[];
  successfulStrategies: string[];
  preferredTypes: string[];
  averageConfidence: number;
  learningProgress: number;
}

// Error types specific to strategy building
export enum StrategyBuilderErrorCode {
  INVALID_PROMPT = 'INVALID_PROMPT',
  UNSUPPORTED_STRATEGY_TYPE = 'UNSUPPORTED_STRATEGY_TYPE',
  PARAMETER_VALIDATION_FAILED = 'PARAMETER_VALIDATION_FAILED',
  AI_GENERATION_FAILED = 'AI_GENERATION_FAILED',
  STRATEGY_PARSING_FAILED = 'STRATEGY_PARSING_FAILED',
  EDUCATIONAL_CONTENT_FAILED = 'EDUCATIONAL_CONTENT_FAILED',
}

// Strategy builder configuration
export interface StrategyBuilderConfig {
  maxPromptLength: number;
  minPromptLength: number;
  defaultTemperature: number;
  maxTokens: number;
  supportedStrategyTypes: string[];
  parameterRanges: {
    [strategyType: string]: {
      [paramName: string]: {
        min: number;
        max: number;
        default: number;
        step?: number;
      };
    };
  };
  educationalContentEnabled: boolean;
  alternativeGenerationEnabled: boolean;
  maxAlternatives: number;
}

// Export commonly used types
export type {
  StrategyDefinition,
  StrategyBuilderRequest,
  StrategyBuilderResponse,
  StrategyBuilderOptions,
  StrategyValidationResult,
  EducationalContent,
  StrategyTemplate,
  StrategyPreferences,
};
