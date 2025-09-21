/**
 * Shared types for all AlgoMentor AI agents
 * 
 * This file defines common interfaces and types used across all agents
 * to ensure consistency and type safety throughout the platform.
 */

// Base agent response structure
export interface AgentResponse<T = any> {
  status: 'pending' | 'in_progress' | 'done' | 'error';
  progress: number; // 0-100
  data?: T;
  error?: AgentError;
  explanation?: string; // Educational explanation of the logic used
  educationalSummary?: string; // Summary for learning purposes
  timestamp: number;
  agentId: string;
}

// Standardized error structure
export interface AgentError {
  code: string;
  message: string;
  details?: any;
  suggestedFix?: string;
  timestamp: number;
}

// Progress tracking for long-running operations
export interface ProgressUpdate {
  progress: number;
  message: string;
  partialResults?: any;
  errors?: AgentError[];
}

// Base agent configuration
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  timeout: number; // milliseconds
  retryAttempts: number;
}

// Agent health status
export interface AgentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  responseTime?: number;
  errorRate?: number;
  dependencies: string[];
}

// Common data structures
export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: number;
  pnl?: number;
  fees?: number;
}

export interface BacktestResult {
  equityCurve: number[];
  returns: number[];
  trades: Trade[];
  metrics: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    totalTrades: number;
  };
}

// Strategy types
export type StrategyType = 'smaCross' | 'rsiReversion' | 'macd' | 'breakout' | 'momentum' | 'custom';

export interface StrategyDefinition {
  id: string;
  name: string;
  type: StrategyType;
  params: Record<string, any>;
  description: string;
  createdAt: number;
  updatedAt: number;
}

// News and sentiment types
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: number;
  url: string;
  sentiment?: SentimentScore;
}

export interface SentimentScore {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  label: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0 to 1
}

// Educational content types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  completed: boolean;
  unlocked: boolean;
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  currentLevel: number;
  totalXp: number;
  achievements: string[];
  lastActive: number;
}

// API request/response types
export interface ApiRequest<T = any> {
  data: T;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AgentError;
  metadata?: {
    requestId?: string;
    timestamp: number;
    processingTime?: number;
  };
}

// Streaming response types
export interface StreamingResponse {
  type: 'progress' | 'data' | 'error' | 'complete';
  data: any;
  progress?: number;
  message?: string;
}

// Agent communication types
export interface AgentMessage {
  from: string;
  to: string;
  type: 'request' | 'response' | 'notification';
  data: any;
  timestamp: number;
  correlationId?: string;
}

// Configuration types
export interface AppConfig {
  agents: Record<string, AgentConfig>;
  services: {
    gemini: {
      apiKey: string;
      model: string;
      timeout: number;
    };
    newsApi: {
      apiKey: string;
      sources: string[];
    };
    marketData: {
      providers: string[];
      fallbackEnabled: boolean;
    };
  };
  features: {
    streamingEnabled: boolean;
    educationalMode: boolean;
    realTimeUpdates: boolean;
  };
}
