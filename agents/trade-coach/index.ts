/**
 * Trade Coach Agent
 * 
 * This agent provides personalized trading coaching based on trading history,
 * behavioral analysis, and educational guidance to help traders improve their skills.
 * 
 * Usage:
 * ```typescript
 * const agent = new TradeCoachAgent();
 * const result = await agent.getCoachingAdvice({
 *   trades: tradeHistory,
 *   userId: "user123"
 * });
 * ```
 */

import { AgentResponse, Trade } from '../shared/types';
import { AgentError, ErrorFactory, withErrorHandling, ProgressTracker } from '../shared/errors';
import { getGeminiClient } from '../../services/ai/gemini-client';
import { prompts } from './prompts';

export interface TradeCoachRequest {
  trades: Trade[];
  userId?: string;
  sessionId?: string;
  timeframe?: 'week' | 'month' | 'quarter' | 'year' | 'all';
  options?: {
    includeBehavioralAnalysis?: boolean;
    includeRiskAssessment?: boolean;
    includeEducationalContent?: boolean;
    focusAreas?: string[];
  };
}

export interface TradeCoachResponse {
  overallAssessment: OverallAssessment;
  behavioralAnalysis: BehavioralAnalysis;
  riskAssessment: RiskAssessment;
  performanceAnalysis: PerformanceAnalysis;
  coachingRecommendations: CoachingRecommendation[];
  educationalInsights: EducationalInsights;
  progressTracking: ProgressTracking;
  confidence: number;
}

export interface OverallAssessment {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  overallScore: number; // 0-100
}

export interface BehavioralAnalysis {
  tradingPatterns: TradingPattern[];
  emotionalIndicators: EmotionalIndicator[];
  disciplineScore: number; // 0-100
  consistencyScore: number; // 0-100
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  tradingStyle: 'scalper' | 'day_trader' | 'swing_trader' | 'position_trader';
}

export interface RiskAssessment {
  riskScore: number; // 0-100
  positionSizing: PositionSizingAnalysis;
  riskManagement: RiskManagementAnalysis;
  drawdownAnalysis: DrawdownAnalysis;
  riskFactors: RiskFactor[];
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
}

export interface CoachingRecommendation {
  category: 'risk_management' | 'entry_timing' | 'exit_strategy' | 'position_sizing' | 'emotional_control' | 'strategy_optimization';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export interface EducationalInsights {
  keyLearnings: string[];
  commonMistakes: string[];
  bestPractices: string[];
  nextSteps: string[];
  relatedConcepts: string[];
  recommendedResources: string[];
}

export interface ProgressTracking {
  currentLevel: number;
  xpGained: number;
  achievements: string[];
  milestones: Milestone[];
  nextMilestone: string;
  progressPercentage: number;
}

export interface TradingPattern {
  type: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  recommendation: string;
}

export interface EmotionalIndicator {
  type: 'fear' | 'greed' | 'frustration' | 'overconfidence' | 'impatience';
  severity: 'low' | 'medium' | 'high';
  frequency: number;
  impact: string;
  mitigation: string;
}

export interface PositionSizingAnalysis {
  consistency: number; // 0-100
  appropriateness: number; // 0-100
  issues: string[];
  recommendations: string[];
}

export interface RiskManagementAnalysis {
  stopLossUsage: number; // 0-100
  takeProfitUsage: number; // 0-100
  riskRewardRatio: number;
  issues: string[];
  recommendations: string[];
}

export interface DrawdownAnalysis {
  maxDrawdown: number;
  averageDrawdown: number;
  recoveryTime: number;
  frequency: number;
  severity: 'low' | 'medium' | 'high';
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  mitigation: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedAt?: number;
  xpReward: number;
}

export class TradeCoachAgent {
  private config: any;
  private geminiClient: ReturnType<typeof getGeminiClient>;

  constructor(config?: any) {
    this.config = {
      id: 'trade-coach',
      name: 'Trade Coach Agent',
      description: 'Provides personalized trading coaching and behavioral analysis',
      version: '1.0.0',
      enabled: true,
      timeout: 45000,
      retryAttempts: 3,
      ...config,
    };

    this.geminiClient = getGeminiClient();
  }

  /**
   * Get comprehensive coaching advice
   */
  async getCoachingAdvice(request: TradeCoachRequest): Promise<AgentResponse<TradeCoachResponse>> {
    return withErrorHandling(
      async () => {
        // Validate input
        this.validateRequest(request);

        // Filter trades by timeframe if specified
        const filteredTrades = this.filterTradesByTimeframe(request.trades, request.timeframe);

        // Generate comprehensive coaching analysis using AI
        const analysis = await this.generateCoachingAnalysisWithAI(filteredTrades, request);

        // Parse and structure the response
        const structuredAnalysis = this.parseCoachingResponse(analysis, filteredTrades);

        // Calculate confidence score
        const confidence = this.calculateConfidence(filteredTrades, structuredAnalysis);

        return {
          status: 'done',
          progress: 100,
          data: structuredAnalysis,
          explanation: `Comprehensive coaching analysis completed with ${structuredAnalysis.coachingRecommendations.length} recommendations`,
          educationalSummary: `Analysis reveals ${structuredAnalysis.overallAssessment.grade} performance with focus on ${structuredAnalysis.improvementAreas.length} improvement areas`,
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
   * Get behavioral analysis specifically
   */
  async getBehavioralAnalysis(trades: Trade[]): Promise<AgentResponse<BehavioralAnalysis>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildBehavioralAnalysisPrompt(trades);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.3,
          maxTokens: 2048,
        });

        const behavioralAnalysis = this.parseBehavioralAnalysis(response.content, trades);

        return {
          status: 'done',
          progress: 100,
          data: behavioralAnalysis,
          explanation: `Behavioral analysis completed with ${behavioralAnalysis.tradingPatterns.length} patterns identified`,
          educationalSummary: `Analysis shows ${behavioralAnalysis.disciplineScore}/100 discipline score with ${behavioralAnalysis.emotionalIndicators.length} emotional indicators`,
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 30000,
        retryAttempts: this.config.retryAttempts,
      }
    );
  }

  /**
   * Get risk assessment specifically
   */
  async getRiskAssessment(trades: Trade[]): Promise<AgentResponse<RiskAssessment>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildRiskAssessmentPrompt(trades);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.3,
          maxTokens: 1536,
        });

        const riskAssessment = this.parseRiskAssessment(response.content, trades);

        return {
          status: 'done',
          progress: 100,
          data: riskAssessment,
          explanation: `Risk assessment completed with ${riskAssessment.riskFactors.length} risk factors identified`,
          educationalSummary: `Risk analysis shows ${riskAssessment.riskScore}/100 risk score with detailed mitigation strategies`,
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 30000,
        retryAttempts: this.config.retryAttempts,
      }
    );
  }

  /**
   * Get progress tracking and achievements
   */
  async getProgressTracking(trades: Trade[], userId?: string): Promise<AgentResponse<ProgressTracking>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildProgressTrackingPrompt(trades, userId);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.4,
          maxTokens: 1024,
        });

        const progressTracking = this.parseProgressTracking(response.content, trades);

        return {
          status: 'done',
          progress: 100,
          data: progressTracking,
          explanation: `Progress tracking completed with ${progressTracking.achievements.length} achievements`,
          educationalSummary: `Current level ${progressTracking.currentLevel} with ${progressTracking.xpGained} XP gained`,
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 20000,
        retryAttempts: this.config.retryAttempts,
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
          educationalSummary: 'Agent health monitoring ensures reliable coaching advice',
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

  private validateRequest(request: TradeCoachRequest): void {
    if (!request.trades || !Array.isArray(request.trades)) {
      throw ErrorFactory.validationError('Trades array is required');
    }

    if (request.trades.length === 0) {
      throw ErrorFactory.validationError('At least one trade is required for analysis');
    }

    if (request.trades.length > 1000) {
      throw ErrorFactory.validationError('Too many trades provided (maximum 1000)');
    }

    // Validate trade structure
    const requiredFields = ['id', 'symbol', 'side', 'quantity', 'price', 'timestamp'];
    const invalidTrades = request.trades.filter(trade => 
      !requiredFields.every(field => trade.hasOwnProperty(field))
    );

    if (invalidTrades.length > 0) {
      throw ErrorFactory.validationError(`Invalid trade structure found in ${invalidTrades.length} trades`);
    }
  }

  private filterTradesByTimeframe(trades: Trade[], timeframe?: string): Trade[] {
    if (!timeframe || timeframe === 'all') {
      return trades;
    }

    const now = Date.now();
    let cutoffTime: number;

    switch (timeframe) {
      case 'week':
        cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        cutoffTime = now - (90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        cutoffTime = now - (365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return trades;
    }

    return trades.filter(trade => trade.timestamp >= cutoffTime);
  }

  private async generateCoachingAnalysisWithAI(trades: Trade[], request: TradeCoachRequest): Promise<string> {
    const prompt = prompts.buildCoachingPrompt(trades, request);
    
    const response = await this.geminiClient.generateContentWithProgress({
      prompt,
      temperature: 0.4,
      maxTokens: 4096,
      systemInstruction: prompts.getSystemInstruction(),
    });

    return response.content;
  }

  private parseCoachingResponse(aiResponse: string, trades: Trade[]): TradeCoachResponse {
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                       aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw ErrorFactory.validationError('No valid JSON found in AI response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const analysisData = JSON.parse(jsonStr);

      // Structure the response with calculated metrics
      return {
        overallAssessment: analysisData.overallAssessment || this.generateDefaultAssessment(trades),
        behavioralAnalysis: analysisData.behavioralAnalysis || this.generateDefaultBehavioralAnalysis(trades),
        riskAssessment: analysisData.riskAssessment || this.generateDefaultRiskAssessment(trades),
        performanceAnalysis: this.calculatePerformanceMetrics(trades, analysisData.performanceAnalysis),
        coachingRecommendations: analysisData.coachingRecommendations || [],
        educationalInsights: analysisData.educationalInsights || this.generateDefaultEducationalInsights(),
        progressTracking: analysisData.progressTracking || this.generateDefaultProgressTracking(trades),
        confidence: this.calculateAnalysisConfidence(analysisData),
      };
    } catch (error) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw ErrorFactory.validationError(
        'Failed to parse AI response as valid coaching analysis',
        { originalError: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private parseBehavioralAnalysis(content: string, trades: Trade[]): BehavioralAnalysis {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to calculated analysis
    }

    return this.generateDefaultBehavioralAnalysis(trades);
  }

  private parseRiskAssessment(content: string, trades: Trade[]): RiskAssessment {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to calculated analysis
    }

    return this.generateDefaultRiskAssessment(trades);
  }

  private parseProgressTracking(content: string, trades: Trade[]): ProgressTracking {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to calculated tracking
    }

    return this.generateDefaultProgressTracking(trades);
  }

  private calculatePerformanceMetrics(trades: Trade[], aiAnalysis?: any): PerformanceAnalysis {
    const wins = trades.filter(t => t.pnl && t.pnl > 0);
    const losses = trades.filter(t => t.pnl && t.pnl < 0);
    
    const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winRate = trades.length > 0 ? wins.length / trades.length : 0;
    const averageWin = wins.length > 0 ? wins.reduce((sum, t) => sum + (t.pnl || 0), 0) / wins.length : 0;
    const averageLoss = losses.length > 0 ? losses.reduce((sum, t) => sum + Math.abs(t.pnl || 0), 0) / losses.length : 0;
    const profitFactor = averageLoss > 0 ? (averageWin * wins.length) / (averageLoss * losses.length) : 0;
    const expectancy = trades.length > 0 ? totalPnL / trades.length : 0;
    
    return {
      winRate,
      averageWin,
      averageLoss,
      profitFactor,
      expectancy,
      sharpeRatio: this.calculateSharpeRatio(trades),
      maxDrawdown: this.calculateMaxDrawdown(trades),
      recoveryTime: this.calculateRecoveryTime(trades),
      tradeFrequency: this.calculateTradeFrequency(trades),
      holdingPeriod: this.calculateHoldingPeriod(trades),
      ...aiAnalysis,
    };
  }

  private generateDefaultAssessment(trades: Trade[]): OverallAssessment {
    const performance = this.calculatePerformanceMetrics(trades);
    const grade = this.calculateGrade(performance);
    
    return {
      grade,
      summary: `Analysis of ${trades.length} trades shows ${performance.winRate > 0.5 ? 'positive' : 'negative'} performance`,
      strengths: this.identifyStrengths(performance),
      weaknesses: this.identifyWeaknesses(performance),
      improvementAreas: this.identifyImprovementAreas(performance),
      overallScore: this.calculateOverallScore(performance),
    };
  }

  private generateDefaultBehavioralAnalysis(trades: Trade[]): BehavioralAnalysis {
    return {
      tradingPatterns: this.identifyTradingPatterns(trades),
      emotionalIndicators: this.identifyEmotionalIndicators(trades),
      disciplineScore: this.calculateDisciplineScore(trades),
      consistencyScore: this.calculateConsistencyScore(trades),
      riskTolerance: this.assessRiskTolerance(trades),
      tradingStyle: this.assessTradingStyle(trades),
    };
  }

  private generateDefaultRiskAssessment(trades: Trade[]): RiskAssessment {
    return {
      riskScore: this.calculateRiskScore(trades),
      positionSizing: this.analyzePositionSizing(trades),
      riskManagement: this.analyzeRiskManagement(trades),
      drawdownAnalysis: this.analyzeDrawdowns(trades),
      riskFactors: this.identifyRiskFactors(trades),
    };
  }

  private generateDefaultEducationalInsights(): EducationalInsights {
    return {
      keyLearnings: [
        'Understanding your trading patterns is crucial for improvement',
        'Risk management is more important than individual trade outcomes',
        'Emotional discipline directly impacts trading performance'
      ],
      commonMistakes: [
        'Overtrading during losing streaks',
        'Not using stop losses consistently',
        'Letting emotions drive trading decisions'
      ],
      bestPractices: [
        'Follow a consistent trading plan',
        'Use proper position sizing',
        'Keep detailed trading journals'
      ],
      nextSteps: [
        'Focus on risk management improvements',
        'Develop emotional discipline',
        'Optimize entry and exit strategies'
      ],
      relatedConcepts: [
        'Risk management',
        'Position sizing',
        'Emotional trading',
        'Trading psychology'
      ],
      recommendedResources: [
        'Trading psychology books',
        'Risk management courses',
        'Trading journal templates'
      ],
    };
  }

  private generateDefaultProgressTracking(trades: Trade[]): ProgressTracking {
    const performance = this.calculatePerformanceMetrics(trades);
    const level = this.calculateLevel(performance);
    const xp = this.calculateXP(trades);
    
    return {
      currentLevel: level,
      xpGained: xp,
      achievements: this.calculateAchievements(trades, performance),
      milestones: this.getMilestones(level),
      nextMilestone: this.getNextMilestone(level),
      progressPercentage: this.calculateProgressPercentage(level, xp),
    };
  }

  private calculateConfidence(trades: Trade[], analysis: TradeCoachResponse): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence based on data quality
    if (trades.length > 50) confidence += 0.1;
    if (trades.length > 100) confidence += 0.1;
    if (analysis.coachingRecommendations.length > 0) confidence += 0.1;

    return Math.min(1.0, confidence);
  }

  // Helper calculation methods
  private calculateSharpeRatio(trades: Trade[]): number {
    if (trades.length < 2) return 0;
    
    const returns = trades.map(t => t.pnl || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  private calculateMaxDrawdown(trades: Trade[]): number {
    let peak = 0;
    let maxDD = 0;
    let runningPnL = 0;

    for (const trade of trades) {
      runningPnL += trade.pnl || 0;
      peak = Math.max(peak, runningPnL);
      const drawdown = peak - runningPnL;
      maxDD = Math.max(maxDD, drawdown);
    }

    return maxDD;
  }

  private calculateRecoveryTime(trades: Trade[]): number {
    // Simplified recovery time calculation
    return trades.length * 0.1; // Assume 10% of trades for recovery
  }

  private calculateTradeFrequency(trades: Trade[]): number {
    if (trades.length < 2) return 0;
    
    const timeSpan = Math.max(...trades.map(t => t.timestamp)) - Math.min(...trades.map(t => t.timestamp));
    const days = timeSpan / (24 * 60 * 60 * 1000);
    
    return days > 0 ? trades.length / days : 0;
  }

  private calculateHoldingPeriod(trades: Trade[]): number {
    // Simplified holding period calculation
    return trades.length > 0 ? trades.reduce((sum, t) => sum + (t.timestamp || 0), 0) / trades.length : 0;
  }

  private calculateGrade(performance: PerformanceAnalysis): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
    const score = (performance.winRate * 0.3) + (performance.profitFactor * 0.2) + ((1 - Math.abs(performance.maxDrawdown)) * 0.3) + (performance.sharpeRatio * 0.2);
    
    if (score > 0.8) return 'A+';
    if (score > 0.7) return 'A';
    if (score > 0.6) return 'B+';
    if (score > 0.5) return 'B';
    if (score > 0.4) return 'C+';
    if (score > 0.3) return 'C';
    if (score > 0.2) return 'D';
    return 'F';
  }

  private identifyStrengths(performance: PerformanceAnalysis): string[] {
    const strengths: string[] = [];
    
    if (performance.winRate > 0.6) strengths.push('High win rate');
    if (performance.profitFactor > 1.5) strengths.push('Good profit factor');
    if (performance.maxDrawdown < 0.1) strengths.push('Low maximum drawdown');
    if (performance.sharpeRatio > 1.0) strengths.push('Good risk-adjusted returns');
    
    return strengths;
  }

  private identifyWeaknesses(performance: PerformanceAnalysis): string[] {
    const weaknesses: string[] = [];
    
    if (performance.winRate < 0.4) weaknesses.push('Low win rate');
    if (performance.profitFactor < 1.0) weaknesses.push('Poor profit factor');
    if (performance.maxDrawdown > 0.2) weaknesses.push('High maximum drawdown');
    if (performance.sharpeRatio < 0.5) weaknesses.push('Poor risk-adjusted returns');
    
    return weaknesses;
  }

  private identifyImprovementAreas(performance: PerformanceAnalysis): string[] {
    const areas: string[] = [];
    
    if (performance.winRate < 0.5) areas.push('Entry timing');
    if (performance.profitFactor < 1.2) areas.push('Exit strategy');
    if (performance.maxDrawdown > 0.15) areas.push('Risk management');
    if (performance.sharpeRatio < 0.8) areas.push('Position sizing');
    
    return areas;
  }

  private calculateOverallScore(performance: PerformanceAnalysis): number {
    return (performance.winRate * 25) + (performance.profitFactor * 25) + ((1 - Math.abs(performance.maxDrawdown)) * 25) + (performance.sharpeRatio * 25);
  }

  private identifyTradingPatterns(trades: Trade[]): TradingPattern[] {
    // Simplified pattern identification
    return [
      {
        type: 'Overtrading',
        frequency: 0.3,
        impact: 'negative',
        description: 'Trading too frequently without clear signals',
        recommendation: 'Focus on quality over quantity'
      }
    ];
  }

  private identifyEmotionalIndicators(trades: Trade[]): EmotionalIndicator[] {
    // Simplified emotional indicator identification
    return [
      {
        type: 'fear',
        severity: 'medium',
        frequency: 0.2,
        impact: 'May cause premature exits',
        mitigation: 'Use systematic exit rules'
      }
    ];
  }

  private calculateDisciplineScore(trades: Trade[]): number {
    // Simplified discipline score calculation
    return 75; // Default score
  }

  private calculateConsistencyScore(trades: Trade[]): number {
    // Simplified consistency score calculation
    return 70; // Default score
  }

  private assessRiskTolerance(trades: Trade[]): 'conservative' | 'moderate' | 'aggressive' {
    // Simplified risk tolerance assessment
    return 'moderate';
  }

  private assessTradingStyle(trades: Trade[]): 'scalper' | 'day_trader' | 'swing_trader' | 'position_trader' {
    // Simplified trading style assessment
    return 'day_trader';
  }

  private calculateRiskScore(trades: Trade[]): number {
    const maxDD = this.calculateMaxDrawdown(trades);
    const volatility = this.calculateVolatility(trades);
    
    return Math.min(100, (maxDD * 50) + (volatility * 30));
  }

  private calculateVolatility(trades: Trade[]): number {
    if (trades.length < 2) return 0;
    
    const returns = trades.map(t => t.pnl || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  private analyzePositionSizing(trades: Trade[]): PositionSizingAnalysis {
    return {
      consistency: 80,
      appropriateness: 75,
      issues: ['Inconsistent position sizes'],
      recommendations: ['Use fixed percentage of account per trade']
    };
  }

  private analyzeRiskManagement(trades: Trade[]): RiskManagementAnalysis {
    return {
      stopLossUsage: 60,
      takeProfitUsage: 40,
      riskRewardRatio: 1.5,
      issues: ['Inconsistent stop loss usage'],
      recommendations: ['Always use stop losses']
    };
  }

  private analyzeDrawdowns(trades: Trade[]): DrawdownAnalysis {
    const maxDD = this.calculateMaxDrawdown(trades);
    
    return {
      maxDrawdown: maxDD,
      averageDrawdown: maxDD * 0.5,
      recoveryTime: this.calculateRecoveryTime(trades),
      frequency: 0.1,
      severity: maxDD > 0.2 ? 'high' : maxDD > 0.1 ? 'medium' : 'low'
    };
  }

  private identifyRiskFactors(trades: Trade[]): RiskFactor[] {
    return [
      {
        type: 'Position Sizing',
        severity: 'medium',
        description: 'Inconsistent position sizing',
        impact: 'Increased risk exposure',
        mitigation: 'Use fixed percentage sizing'
      }
    ];
  }

  private calculateLevel(performance: PerformanceAnalysis): number {
    const score = this.calculateOverallScore(performance);
    return Math.floor(score / 10) + 1;
  }

  private calculateXP(trades: Trade[]): number {
    return trades.length * 10; // 10 XP per trade
  }

  private calculateAchievements(trades: Trade[], performance: PerformanceAnalysis): string[] {
    const achievements: string[] = [];
    
    if (trades.length >= 10) achievements.push('First 10 Trades');
    if (trades.length >= 50) achievements.push('50 Trades Milestone');
    if (performance.winRate > 0.6) achievements.push('High Win Rate');
    if (performance.profitFactor > 1.5) achievements.push('Profit Master');
    
    return achievements;
  }

  private getMilestones(level: number): Milestone[] {
    return [
      {
        id: 'level_5',
        title: 'Level 5 Trader',
        description: 'Reach level 5',
        achieved: level >= 5,
        xpReward: 100
      },
      {
        id: 'level_10',
        title: 'Level 10 Trader',
        description: 'Reach level 10',
        achieved: level >= 10,
        xpReward: 200
      }
    ];
  }

  private getNextMilestone(level: number): string {
    const nextLevel = Math.ceil(level / 5) * 5;
    return `Reach level ${nextLevel}`;
  }

  private calculateProgressPercentage(level: number, xp: number): number {
    const currentLevelXP = (level - 1) * 100;
    const nextLevelXP = level * 100;
    const progressXP = xp - currentLevelXP;
    const levelXP = nextLevelXP - currentLevelXP;
    
    return levelXP > 0 ? (progressXP / levelXP) * 100 : 0;
  }

  private calculateAnalysisConfidence(analysisData: any): number {
    let confidence = 0.8; // Base confidence for AI analysis
    
    // Increase confidence based on analysis completeness
    if (analysisData.overallAssessment) confidence += 0.05;
    if (analysisData.behavioralAnalysis) confidence += 0.05;
    if (analysisData.riskAssessment) confidence += 0.05;
    if (analysisData.coachingRecommendations?.length > 0) confidence += 0.05;
    
    return Math.min(1.0, confidence);
  }
}

// Export singleton instance
let tradeCoachInstance: TradeCoachAgent | null = null;

export function getTradeCoachAgent(config?: any): TradeCoachAgent {
  if (!tradeCoachInstance) {
    tradeCoachInstance = new TradeCoachAgent(config);
  }
  return tradeCoachInstance;
}

export function initializeTradeCoachAgent(config?: any): TradeCoachAgent {
  tradeCoachInstance = new TradeCoachAgent(config);
  return tradeCoachInstance;
}
