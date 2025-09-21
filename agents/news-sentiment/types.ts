/**
 * News Sentiment Agent Types
 * 
 * This module defines all TypeScript interfaces and types specific to the
 * News Sentiment Agent functionality.
 */

import { NewsArticle, SentimentScore } from '../shared/types';

// Request types
export interface NewsSentimentRequest {
  symbols?: string[];
  timeframe?: '1h' | '4h' | '24h' | '3d' | '1w' | '1m';
  keywords?: string[];
  sources?: string[];
  userId?: string;
  sessionId?: string;
  options?: NewsSentimentOptions;
}

export interface NewsSentimentOptions {
  includeMarketImpact?: boolean;
  includeTradingSignals?: boolean;
  includeEducationalContent?: boolean;
  sentimentThreshold?: number;
  maxArticles?: number;
  language?: string;
  region?: string;
  excludeSources?: string[];
  includeSocialMedia?: boolean;
  realTimeUpdates?: boolean;
}

// Response types
export interface NewsSentimentResponse {
  overallSentiment: OverallSentiment;
  newsAnalysis: NewsAnalysis;
  marketImpact: MarketImpact;
  tradingSignals: TradingSignal[];
  educationalInsights: EducationalInsights;
  confidence: number;
  metadata: SentimentMetadata;
}

export interface SentimentMetadata {
  analysisDate: number;
  timeframe: string;
  symbolsAnalyzed: string[];
  articlesProcessed: number;
  processingTime: number;
  dataSources: string[];
  model: string;
  version: string;
  lastUpdated?: number;
  nextUpdate?: number;
}

// Sentiment analysis types
export interface OverallSentiment {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  label: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  trend: 'improving' | 'declining' | 'stable';
  confidence: number; // 0 to 1
  summary: string;
  historicalComparison?: HistoricalComparison;
  volatility: number; // 0 to 1
}

export interface HistoricalComparison {
  previousPeriod: number;
  change: number;
  trend: 'improving' | 'declining' | 'stable';
  significance: 'low' | 'medium' | 'high';
}

export interface NewsAnalysis {
  articles: ProcessedArticle[];
  totalArticles: number;
  sentimentDistribution: SentimentDistribution;
  keyThemes: KeyTheme[];
  trendingTopics: TrendingTopic[];
  sourceAnalysis: SourceAnalysis;
  temporalAnalysis: TemporalAnalysis;
  qualityMetrics: QualityMetrics;
}

export interface ProcessedArticle {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: number;
  url: string;
  sentiment: SentimentScore;
  relevance: number; // 0 to 1
  impact: 'high' | 'medium' | 'low';
  keyPoints: string[];
  marketRelevance: string[];
  entities: Entity[];
  categories: string[];
  language: string;
  wordCount: number;
  readabilityScore: number;
}

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'product' | 'event';
  relevance: number; // 0 to 1
  sentiment: number; // -1 to 1
  mentions: number;
}

export interface SentimentDistribution {
  very_positive: number;
  positive: number;
  neutral: number;
  negative: number;
  very_negative: number;
  percentages: {
    very_positive: number;
    positive: number;
    neutral: number;
    negative: number;
    very_negative: number;
  };
}

export interface KeyTheme {
  theme: string;
  sentiment: number; // -1 to 1
  frequency: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  relatedArticles: string[];
  keywords: string[];
  trend: 'rising' | 'falling' | 'stable';
  confidence: number; // 0 to 1
}

export interface TrendingTopic {
  topic: string;
  trend: 'rising' | 'falling' | 'stable';
  mentions: number;
  sentiment: number; // -1 to 1
  relevance: number; // 0 to 1
  growthRate: number;
  peakMentions: number;
  category: string;
  relatedSymbols: string[];
}

export interface SourceAnalysis {
  sources: SourceSentiment[];
  credibility: number; // 0 to 1
  bias: 'bullish' | 'bearish' | 'neutral';
  reliability: number; // 0 to 1
  diversity: number; // 0 to 1
  coverage: number; // 0 to 1
}

export interface SourceSentiment {
  source: string;
  sentiment: number; // -1 to 1
  articleCount: number;
  credibility: number; // 0 to 1
  bias: 'bullish' | 'bearish' | 'neutral';
  reach: number; // 0 to 1
  influence: number; // 0 to 1
}

export interface TemporalAnalysis {
  sentimentOverTime: SentimentTimePoint[];
  peakSentiment: SentimentTimePoint;
  lowSentiment: SentimentTimePoint;
  volatility: number; // 0 to 1
  trend: 'improving' | 'declining' | 'stable';
}

export interface SentimentTimePoint {
  timestamp: number;
  sentiment: number; // -1 to 1
  volume: number;
  confidence: number; // 0 to 1
}

export interface QualityMetrics {
  dataQuality: number; // 0 to 1
  sourceDiversity: number; // 0 to 1
  temporalCoverage: number; // 0 to 1
  contentRelevance: number; // 0 to 1
  overallReliability: number; // 0 to 1
}

// Market impact types
export interface MarketImpact {
  expectedImpact: 'high' | 'medium' | 'low' | 'minimal';
  impactDirection: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0 to 1
  timeframe: string;
  affectedSectors: string[];
  riskFactors: RiskFactor[];
  opportunities: Opportunity[];
  marketConditions: MarketConditions;
  historicalPrecedent: HistoricalPrecedent[];
}

export interface MarketConditions {
  volatility: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'sideways';
  volume: 'low' | 'medium' | 'high';
  liquidity: 'low' | 'medium' | 'high';
  sentiment: 'fearful' | 'neutral' | 'greedy';
}

export interface HistoricalPrecedent {
  event: string;
  date: number;
  impact: number; // -1 to 1
  duration: number;
  similarity: number; // 0 to 1
  lessons: string[];
}

// Trading signal types
export interface TradingSignal {
  symbol: string;
  signal: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  confidence: number; // 0 to 1
  reasoning: string;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedMove: number; // percentage
  keyDrivers: string[];
  entryStrategy: EntryStrategy;
  exitStrategy: ExitStrategy;
  riskManagement: RiskManagement;
  monitoring: Monitoring[];
}

export interface EntryStrategy {
  method: 'immediate' | 'gradual' | 'wait_for_pullback' | 'wait_for_confirmation';
  conditions: string[];
  timing: string;
  positionSize: string;
}

export interface ExitStrategy {
  method: 'time_based' | 'price_target' | 'sentiment_change' | 'technical_signal';
  conditions: string[];
  timeframe: string;
  profitTarget: number;
  stopLoss: number;
}

export interface RiskManagement {
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  monitoringFrequency: string;
}

export interface Monitoring {
  metric: string;
  threshold: number;
  action: string;
  frequency: string;
}

// Risk and opportunity types
export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  probability: number; // 0 to 1
  mitigation: string;
  timeframe: string;
  indicators: string[];
}

export interface Opportunity {
  type: string;
  description: string;
  potential: 'low' | 'medium' | 'high';
  timeframe: string;
  requirements: string[];
  risks: string[];
  probability: number; // 0 to 1
  expectedReturn: number;
  keyFactors: string[];
}

// Educational content types
export interface EducationalInsights {
  keyLearnings: string[];
  sentimentAnalysisConcepts: string[];
  marketImpactFactors: string[];
  tradingConsiderations: string[];
  riskWarnings: string[];
  recommendedActions: string[];
  caseStudies: CaseStudy[];
  bestPractices: BestPractice[];
}

export interface CaseStudy {
  title: string;
  description: string;
  scenario: string;
  outcome: string;
  lessons: string[];
  relevance: number; // 0 to 1
}

export interface BestPractice {
  practice: string;
  description: string;
  benefits: string[];
  implementation: string[];
  examples: string[];
  category: 'analysis' | 'trading' | 'risk_management' | 'monitoring';
}

// Data source types
export interface NewsSource {
  id: string;
  name: string;
  type: 'news' | 'blog' | 'social_media' | 'analyst' | 'government';
  credibility: number; // 0 to 1
  bias: 'bullish' | 'bearish' | 'neutral';
  reach: number; // 0 to 1;
  updateFrequency: string;
  coverage: string[];
  language: string;
  region: string;
}

export interface DataSource {
  name: string;
  type: 'api' | 'rss' | 'scraping' | 'manual';
  reliability: number; // 0 to 1
  latency: number; // milliseconds
  cost: number;
  rateLimit: number;
  coverage: string[];
}

// Configuration types
export interface NewsSentimentConfig {
  maxArticlesPerAnalysis: number;
  minArticlesForAnalysis: number;
  defaultTimeframe: string;
  sentimentThreshold: number;
  dataSources: DataSource[];
  newsSources: NewsSource[];
  updateFrequency: string;
  cacheDuration: number;
  realTimeEnabled: boolean;
  educationalContentEnabled: boolean;
  tradingSignalsEnabled: boolean;
  marketImpactEnabled: boolean;
}

// Error types specific to news sentiment
export enum NewsSentimentErrorCode {
  NO_ARTICLES_FOUND = 'NO_ARTICLES_FOUND',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  SENTIMENT_ANALYSIS_FAILED = 'SENTIMENT_ANALYSIS_FAILED',
  MARKET_IMPACT_FAILED = 'MARKET_IMPACT_FAILED',
  TRADING_SIGNALS_FAILED = 'TRADING_SIGNALS_FAILED',
  DATA_SOURCE_ERROR = 'DATA_SOURCE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// Real-time update types
export interface SentimentUpdate {
  id: string;
  timestamp: number;
  type: 'sentiment_change' | 'new_article' | 'trending_topic' | 'market_impact';
  data: any;
  confidence: number; // 0 to 1
  priority: 'low' | 'medium' | 'high';
}

export interface SentimentAlert {
  id: string;
  type: 'sentiment_spike' | 'trending_topic' | 'market_impact' | 'risk_factor';
  severity: 'low' | 'medium' | 'high';
  message: string;
  data: any;
  timestamp: number;
  acknowledged: boolean;
}

// Export commonly used types
export type {
  NewsArticle,
  SentimentScore,
  NewsSentimentRequest,
  NewsSentimentResponse,
  NewsSentimentOptions,
  OverallSentiment,
  NewsAnalysis,
  MarketImpact,
  TradingSignal,
  EducationalInsights,
  SentimentMetadata,
};
