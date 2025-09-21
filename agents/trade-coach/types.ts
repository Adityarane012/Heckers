/**
 * Trade Coach Agent Types
 * 
 * This module defines all TypeScript interfaces and types specific to the
 * Trade Coach Agent functionality.
 */

import { Trade } from '../shared/types';

// Request types
export interface TradeCoachRequest {
  trades: Trade[];
  userId?: string;
  sessionId?: string;
  timeframe?: 'week' | 'month' | 'quarter' | 'year' | 'all';
  options?: TradeCoachOptions;
}

export interface TradeCoachOptions {
  includeBehavioralAnalysis?: boolean;
  includeRiskAssessment?: boolean;
  includeEducationalContent?: boolean;
  focusAreas?: CoachingFocusArea[];
  coachingStyle?: 'supportive' | 'direct' | 'analytical' | 'motivational';
}

export type CoachingFocusArea = 
  | 'risk_management' 
  | 'entry_timing' 
  | 'exit_strategy' 
  | 'position_sizing' 
  | 'emotional_control' 
  | 'strategy_optimization'
  | 'discipline'
  | 'consistency';

// Response types
export interface TradeCoachResponse {
  overallAssessment: OverallAssessment;
  behavioralAnalysis: BehavioralAnalysis;
  riskAssessment: RiskAssessment;
  performanceAnalysis: PerformanceAnalysis;
  coachingRecommendations: CoachingRecommendation[];
  educationalInsights: EducationalInsights;
  progressTracking: ProgressTracking;
  confidence: number;
  metadata?: TradeCoachMetadata;
}

export interface TradeCoachMetadata {
  analysisDate: number;
  tradesAnalyzed: number;
  timeframe: string;
  processingTime: number;
  model: string;
  version: string;
}

// Assessment types
export interface OverallAssessment {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  overallScore: number; // 0-100
  trendDirection: 'improving' | 'declining' | 'stable';
  keyInsights: string[];
}

export interface BehavioralAnalysis {
  tradingPatterns: TradingPattern[];
  emotionalIndicators: EmotionalIndicator[];
  disciplineScore: number; // 0-100
  consistencyScore: number; // 0-100
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  tradingStyle: 'scalper' | 'day_trader' | 'swing_trader' | 'position_trader';
  behavioralTrends: BehavioralTrend[];
  improvementSuggestions: string[];
}

export interface RiskAssessment {
  riskScore: number; // 0-100
  positionSizing: PositionSizingAnalysis;
  riskManagement: RiskManagementAnalysis;
  drawdownAnalysis: DrawdownAnalysis;
  riskFactors: RiskFactor[];
  riskTrends: RiskTrend[];
  mitigationStrategies: string[];
}

export interface PerformanceAnalysis {
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  expectancy: number;
  sharpeRatio: number;
  maxDrawdown: number;
  recoveryTime: number;
  tradeFrequency: number;
  holdingPeriod: number;
  performanceTrends: PerformanceTrend[];
  benchmarkComparison?: BenchmarkComparison;
}

// Detailed analysis types
export interface TradingPattern {
  type: string;
  frequency: number; // 0-1
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  examples: string[];
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
}

export interface EmotionalIndicator {
  type: 'fear' | 'greed' | 'frustration' | 'overconfidence' | 'impatience' | 'euphoria' | 'panic';
  severity: 'low' | 'medium' | 'high';
  frequency: number; // 0-1
  impact: string;
  triggers: string[];
  mitigation: string;
  examples: string[];
}

export interface PositionSizingAnalysis {
  consistency: number; // 0-100
  appropriateness: number; // 0-100
  averageSize: number;
  sizeVariability: number;
  issues: string[];
  recommendations: string[];
  riskPerTrade: number;
  maxRiskExposure: number;
}

export interface RiskManagementAnalysis {
  stopLossUsage: number; // 0-100
  takeProfitUsage: number; // 0-100
  riskRewardRatio: number;
  averageRiskReward: number;
  issues: string[];
  recommendations: string[];
  riskManagementScore: number; // 0-100
}

export interface DrawdownAnalysis {
  maxDrawdown: number;
  averageDrawdown: number;
  recoveryTime: number;
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  drawdownPeriods: DrawdownPeriod[];
  recoveryStrategies: string[];
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  mitigation: string;
  probability: number; // 0-1
  examples: string[];
}

// Coaching types
export interface CoachingRecommendation {
  id: string;
  category: CoachingFocusArea;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: ActionStep[];
  expectedImpact: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  successMetrics: string[];
  resources: string[];
  confidence: number; // 0-1
}

export interface ActionStep {
  step: number;
  description: string;
  timeframe: string;
  resources: string[];
  successCriteria: string;
}

export interface EducationalInsights {
  keyLearnings: string[];
  commonMistakes: string[];
  bestPractices: string[];
  nextSteps: string[];
  relatedConcepts: string[];
  recommendedResources: EducationalResource[];
  learningPath: LearningPathStep[];
}

export interface EducationalResource {
  type: 'book' | 'article' | 'video' | 'course' | 'tool' | 'template';
  title: string;
  description: string;
  url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export interface LearningPathStep {
  step: number;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
  estimatedTime: string;
  prerequisites: string[];
}

// Progress tracking types
export interface ProgressTracking {
  currentLevel: number;
  xpGained: number;
  totalXP: number;
  achievements: Achievement[];
  milestones: Milestone[];
  nextMilestone: string;
  progressPercentage: number;
  skillLevels: SkillLevel[];
  learningStreak: number;
  lastActive: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'trading' | 'risk_management' | 'discipline' | 'learning' | 'consistency';
  earnedAt: number;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedAt?: number;
  xpReward: number;
  requirements: MilestoneRequirement[];
  rewards: string[];
}

export interface MilestoneRequirement {
  type: 'trades' | 'win_rate' | 'profit_factor' | 'days_active' | 'level';
  value: number;
  current: number;
  completed: boolean;
}

export interface SkillLevel {
  skill: string;
  level: number;
  xp: number;
  nextLevelXP: number;
  progress: number; // 0-100
  lastImproved: number;
}

// Trend analysis types
export interface BehavioralTrend {
  metric: string;
  direction: 'improving' | 'declining' | 'stable';
  change: number;
  period: string;
  significance: 'low' | 'medium' | 'high';
}

export interface RiskTrend {
  metric: string;
  direction: 'improving' | 'declining' | 'stable';
  change: number;
  period: string;
  significance: 'low' | 'medium' | 'high';
}

export interface PerformanceTrend {
  metric: string;
  direction: 'improving' | 'declining' | 'stable';
  change: number;
  period: string;
  significance: 'low' | 'medium' | 'high';
}

export interface DrawdownPeriod {
  startDate: number;
  endDate: number;
  duration: number;
  magnitude: number;
  recoveryTime: number;
  cause: string;
}

export interface BenchmarkComparison {
  benchmark: string;
  outperformance: number;
  correlation: number;
  beta: number;
  alpha: number;
  volatility: number;
  sharpeRatio: number;
}

// Coaching session types
export interface CoachingSession {
  id: string;
  userId: string;
  sessionDate: number;
  tradesAnalyzed: number;
  timeframe: string;
  focusAreas: CoachingFocusArea[];
  recommendations: CoachingRecommendation[];
  followUpActions: string[];
  nextSessionDate?: number;
  progressNotes: string[];
}

export interface CoachingPlan {
  id: string;
  userId: string;
  createdDate: number;
  goals: CoachingGoal[];
  timeline: string;
  milestones: Milestone[];
  resources: EducationalResource[];
  progress: CoachingProgress;
}

export interface CoachingGoal {
  id: string;
  title: string;
  description: string;
  category: CoachingFocusArea;
  targetDate: number;
  currentProgress: number; // 0-100
  successCriteria: string[];
  actionItems: string[];
}

export interface CoachingProgress {
  overallProgress: number; // 0-100
  goalProgress: { [goalId: string]: number };
  lastUpdated: number;
  achievements: string[];
  challenges: string[];
  nextSteps: string[];
}

// Error types specific to trade coaching
export enum TradeCoachErrorCode {
  INVALID_TRADES = 'INVALID_TRADES',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  BEHAVIORAL_ANALYSIS_FAILED = 'BEHAVIORAL_ANALYSIS_FAILED',
  RISK_ASSESSMENT_FAILED = 'RISK_ASSESSMENT_FAILED',
  PROGRESS_TRACKING_FAILED = 'PROGRESS_TRACKING_FAILED',
}

// Configuration types
export interface TradeCoachConfig {
  maxTradesPerAnalysis: number;
  minTradesForAnalysis: number;
  defaultTimeframe: string;
  coachingStyles: string[];
  focusAreas: CoachingFocusArea[];
  educationalContentEnabled: boolean;
  progressTrackingEnabled: boolean;
  behavioralAnalysisEnabled: boolean;
  riskAssessmentEnabled: boolean;
}

// Export commonly used types
export type {
  Trade,
  TradeCoachRequest,
  TradeCoachResponse,
  TradeCoachOptions,
  OverallAssessment,
  BehavioralAnalysis,
  RiskAssessment,
  PerformanceAnalysis,
  CoachingRecommendation,
  EducationalInsights,
  ProgressTracking,
};
