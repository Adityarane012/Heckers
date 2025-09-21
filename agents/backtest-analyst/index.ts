/**
 * Backtest Analyst Agent
 * 
 * This agent provides comprehensive analysis of backtest results with institutional-grade
 * insights, risk assessment, and actionable recommendations for strategy improvement.
 * 
 * Usage:
 * ```typescript
 * const agent = new BacktestAnalystAgent();
 * const result = await agent.analyzeBacktest({
 *   backtestResults: backtestData,
 *   strategy: strategyDefinition,
 *   userId: "user123"
 * });
 * ```
 */

import { AgentResponse, BacktestResult, StrategyDefinition } from '../shared/types';
import { AgentError, ErrorFactory, withErrorHandling, ProgressTracker } from '../shared/errors';
import { getGeminiClient } from '../../services/ai/gemini-client';
import { prompts } from './prompts';

export interface BacktestAnalysisRequest {
  backtestResults: BacktestResult;
  strategy: StrategyDefinition;
  userId?: string;
  sessionId?: string;
  options?: {
    includeRiskAnalysis?: boolean;
    includeMarketRegimeAnalysis?: boolean;
    includeOptimizationSuggestions?: boolean;
    benchmarkComparison?: boolean;
  };
}

export interface BacktestAnalysisResponse {
  overallAssessment: OverallAssessment;
  performanceAnalysis: PerformanceAnalysis;
  riskAnalysis: RiskAnalysis;
  tradeAnalysis: TradeAnalysis;
  marketRegimeAnalysis?: MarketRegimeAnalysis;
  optimizationSuggestions: OptimizationSuggestion[];
  educationalInsights: EducationalInsights;
  confidence: number;
}

export interface OverallAssessment {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'excellent' | 'good' | 'needs_improvement' | 'poor' | 'avoid';
}

export interface PerformanceAnalysis {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  volatility: number;
  benchmarkComparison?: BenchmarkComparison;
  consistencyScore: number;
}

export interface RiskAnalysis {
  valueAtRisk: number;
  expectedShortfall: number;
  tailRisk: number;
  correlationRisk: number;
  concentrationRisk: number;
  liquidityRisk: number;
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
}

export interface TradeAnalysis {
  totalTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  expectancy: number;
  tradeDuration: {
    average: number;
    median: number;
    distribution: number[];
  };
  tradeQuality: TradeQuality[];
}

export interface MarketRegimeAnalysis {
  bullMarketPerformance: number;
  bearMarketPerformance: number;
  sidewaysMarketPerformance: number;
  highVolatilityPerformance: number;
  lowVolatilityPerformance: number;
  regimeSuitability: string;
}

export interface OptimizationSuggestion {
  type: 'parameter' | 'risk_management' | 'entry_exit' | 'position_sizing';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: string;
  implementation: string;
  confidence: number;
}

export interface EducationalInsights {
  keyLearnings: string[];
  commonMistakes: string[];
  bestPractices: string[];
  nextSteps: string[];
  relatedConcepts: string[];
}

export interface BenchmarkComparison {
  benchmark: string;
  outperformance: number;
  correlation: number;
  beta: number;
  alpha: number;
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

export interface TradeQuality {
  metric: string;
  score: number;
  description: string;
  improvement: string;
}

export class BacktestAnalystAgent {
  private config: any;
  private geminiClient: ReturnType<typeof getGeminiClient>;

  constructor(config?: any) {
    this.config = {
      id: 'backtest-analyst',
      name: 'Backtest Analyst Agent',
      description: 'Provides comprehensive analysis of backtest results with institutional-grade insights',
      version: '1.0.0',
      enabled: true,
      timeout: 45000, // Longer timeout for complex analysis
      retryAttempts: 3,
      ...config,
    };

    this.geminiClient = getGeminiClient();
  }

  /**
   * Analyze backtest results comprehensively
   */
  async analyzeBacktest(request: BacktestAnalysisRequest): Promise<AgentResponse<BacktestAnalysisResponse>> {
    return withErrorHandling(
      async () => {
        // Validate input
        this.validateRequest(request);

        // Generate comprehensive analysis using AI
        const analysis = await this.generateAnalysisWithAI(request);

        // Parse and structure the response
        const structuredAnalysis = this.parseAnalysisResponse(analysis, request.backtestResults);

        // Calculate confidence score
        const confidence = this.calculateConfidence(request.backtestResults, structuredAnalysis);

        return {
          status: 'done',
          progress: 100,
          data: structuredAnalysis,
          explanation: `Comprehensive backtest analysis completed with ${structuredAnalysis.optimizationSuggestions.length} optimization suggestions`,
          educationalSummary: `Analysis reveals ${structuredAnalysis.overallAssessment.grade} performance with key insights for strategy improvement`,
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
   * Generate risk assessment specifically
   */
  async assessRisk(backtestResults: BacktestResult): Promise<AgentResponse<RiskAnalysis>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildRiskAnalysisPrompt(backtestResults);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.3, // Lower temperature for more consistent risk analysis
          maxTokens: 1536,
        });

        const riskAnalysis = this.parseRiskAnalysis(response.content, backtestResults);

        return {
          status: 'done',
          progress: 100,
          data: riskAnalysis,
          explanation: `Risk assessment completed with ${riskAnalysis.riskFactors.length} identified risk factors`,
          educationalSummary: `Risk analysis shows ${riskAnalysis.riskScore}/100 risk score with detailed mitigation strategies`,
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
   * Generate optimization suggestions
   */
  async generateOptimizationSuggestions(
    backtestResults: BacktestResult,
    strategy: StrategyDefinition
  ): Promise<AgentResponse<OptimizationSuggestion[]>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildOptimizationPrompt(backtestResults, strategy);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.5,
          maxTokens: 2048,
        });

        const suggestions = this.parseOptimizationSuggestions(response.content);

        return {
          status: 'done',
          progress: 100,
          data: suggestions,
          explanation: `Generated ${suggestions.length} optimization suggestions across different categories`,
          educationalSummary: `Optimization suggestions focus on improving ${suggestions.filter(s => s.priority === 'high').length} high-priority areas`,
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
   * Compare multiple backtest results
   */
  async compareBacktests(
    backtests: Array<{ results: BacktestResult; strategy: StrategyDefinition; name: string }>
  ): Promise<AgentResponse<any>> {
    return withErrorHandling(
      async () => {
        if (backtests.length < 2) {
          throw ErrorFactory.validationError('At least 2 backtests required for comparison');
        }

        const prompt = prompts.buildComparisonPrompt(backtests);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.4,
          maxTokens: 3072,
        });

        const comparison = this.parseComparisonResponse(response.content);

        return {
          status: 'done',
          progress: 100,
          data: comparison,
          explanation: `Comparison completed for ${backtests.length} strategies with detailed analysis`,
          educationalSummary: `Strategy comparison reveals best performing approach and key differences`,
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 60000, // Longer timeout for complex comparisons
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
          educationalSummary: 'Agent health monitoring ensures reliable backtest analysis',
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

  private validateRequest(request: BacktestAnalysisRequest): void {
    if (!request.backtestResults) {
      throw ErrorFactory.validationError('Backtest results are required');
    }

    if (!request.strategy) {
      throw ErrorFactory.validationError('Strategy definition is required');
    }

    if (!request.backtestResults.metrics) {
      throw ErrorFactory.validationError('Backtest results must include metrics');
    }

    if (!request.backtestResults.trades || !Array.isArray(request.backtestResults.trades)) {
      throw ErrorFactory.validationError('Backtest results must include trades array');
    }
  }

  private async generateAnalysisWithAI(request: BacktestAnalysisRequest): Promise<string> {
    const prompt = prompts.buildAnalysisPrompt(request.backtestResults, request.strategy, request.options);
    
    const response = await this.geminiClient.generateContentWithProgress({
      prompt,
      temperature: 0.4, // Lower temperature for more consistent analysis
      maxTokens: 4096,
      systemInstruction: prompts.getSystemInstruction(),
    });

    return response.content;
  }

  private parseAnalysisResponse(aiResponse: string, backtestResults: BacktestResult): BacktestAnalysisResponse {
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
        overallAssessment: analysisData.overallAssessment || this.generateDefaultAssessment(backtestResults),
        performanceAnalysis: this.calculatePerformanceMetrics(backtestResults, analysisData.performanceAnalysis),
        riskAnalysis: analysisData.riskAnalysis || this.generateDefaultRiskAnalysis(backtestResults),
        tradeAnalysis: this.calculateTradeMetrics(backtestResults, analysisData.tradeAnalysis),
        marketRegimeAnalysis: analysisData.marketRegimeAnalysis,
        optimizationSuggestions: analysisData.optimizationSuggestions || [],
        educationalInsights: analysisData.educationalInsights || this.generateDefaultEducationalInsights(),
        confidence: this.calculateAnalysisConfidence(analysisData),
      };
    } catch (error) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw ErrorFactory.validationError(
        'Failed to parse AI response as valid analysis',
        { originalError: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private parseRiskAnalysis(content: string, backtestResults: BacktestResult): RiskAnalysis {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to calculated risk analysis
    }

    return this.generateDefaultRiskAnalysis(backtestResults);
  }

  private parseOptimizationSuggestions(content: string): OptimizationSuggestion[] {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to default suggestions
    }

    return [];
  }

  private parseComparisonResponse(content: string): any {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to basic comparison
    }

    return { error: 'Failed to parse comparison results' };
  }

  private calculatePerformanceMetrics(backtestResults: BacktestResult, aiAnalysis?: any): PerformanceAnalysis {
    const metrics = backtestResults.metrics;
    
    return {
      totalReturn: metrics.totalReturn || 0,
      annualizedReturn: this.calculateAnnualizedReturn(backtestResults),
      sharpeRatio: metrics.sharpeRatio || 0,
      sortinoRatio: this.calculateSortinoRatio(backtestResults),
      calmarRatio: this.calculateCalmarRatio(backtestResults),
      maxDrawdown: metrics.maxDrawdown || 0,
      volatility: this.calculateVolatility(backtestResults),
      consistencyScore: this.calculateConsistencyScore(backtestResults),
      ...aiAnalysis,
    };
  }

  private calculateTradeMetrics(backtestResults: BacktestResult, aiAnalysis?: any): TradeAnalysis {
    const trades = backtestResults.trades;
    const metrics = backtestResults.metrics;
    
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    
    return {
      totalTrades: trades.length,
      winRate: metrics.winRate || 0,
      averageWin: wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0,
      averageLoss: losses.length > 0 ? losses.reduce((sum, t) => sum + Math.abs(t.pnl), 0) / losses.length : 0,
      profitFactor: metrics.profitFactor || 0,
      expectancy: this.calculateExpectancy(trades),
      tradeDuration: this.calculateTradeDuration(trades),
      tradeQuality: this.assessTradeQuality(trades),
      ...aiAnalysis,
    };
  }

  private generateDefaultAssessment(backtestResults: BacktestResult): OverallAssessment {
    const metrics = backtestResults.metrics;
    const grade = this.calculateGrade(metrics);
    
    return {
      grade,
      summary: `Strategy shows ${metrics.totalReturn > 0 ? 'positive' : 'negative'} returns with ${metrics.winRate}% win rate`,
      strengths: this.identifyStrengths(metrics),
      weaknesses: this.identifyWeaknesses(metrics),
      recommendation: this.getRecommendation(metrics),
    };
  }

  private generateDefaultRiskAnalysis(backtestResults: BacktestResult): RiskAnalysis {
    const metrics = backtestResults.metrics;
    
    return {
      valueAtRisk: this.calculateVaR(backtestResults.returns),
      expectedShortfall: this.calculateExpectedShortfall(backtestResults.returns),
      tailRisk: this.calculateTailRisk(backtestResults.returns),
      correlationRisk: 0.5, // Default value
      concentrationRisk: 0.3, // Default value
      liquidityRisk: 0.2, // Default value
      riskScore: this.calculateRiskScore(metrics),
      riskFactors: this.identifyRiskFactors(metrics),
    };
  }

  private generateDefaultEducationalInsights(): EducationalInsights {
    return {
      keyLearnings: [
        'Understanding backtest metrics is crucial for strategy evaluation',
        'Risk management is as important as returns',
        'Consistency often matters more than peak performance'
      ],
      commonMistakes: [
        'Overfitting to historical data',
        'Ignoring transaction costs',
        'Not considering market regime changes'
      ],
      bestPractices: [
        'Use out-of-sample testing',
        'Implement proper risk management',
        'Monitor strategy performance regularly'
      ],
      nextSteps: [
        'Analyze individual trade patterns',
        'Consider parameter optimization',
        'Test in different market conditions'
      ],
      relatedConcepts: [
        'Risk-adjusted returns',
        'Drawdown analysis',
        'Trade distribution analysis'
      ],
    };
  }

  private calculateConfidence(backtestResults: BacktestResult, analysis: BacktestAnalysisResponse): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence based on data quality
    if (backtestResults.trades.length > 100) confidence += 0.1;
    if (backtestResults.returns.length > 252) confidence += 0.1; // More than 1 year of data
    if (analysis.optimizationSuggestions.length > 0) confidence += 0.1;

    return Math.min(1.0, confidence);
  }

  // Helper calculation methods
  private calculateAnnualizedReturn(backtestResults: BacktestResult): number {
    const years = backtestResults.returns.length / 252; // Assuming daily data
    return Math.pow(1 + backtestResults.metrics.totalReturn, 1 / years) - 1;
  }

  private calculateSortinoRatio(backtestResults: BacktestResult): number {
    const returns = backtestResults.returns;
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const downsideReturns = returns.filter(r => r < 0);
    const downsideDeviation = Math.sqrt(downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length);
    
    return downsideDeviation > 0 ? avgReturn / downsideDeviation : 0;
  }

  private calculateCalmarRatio(backtestResults: BacktestResult): number {
    const annualizedReturn = this.calculateAnnualizedReturn(backtestResults);
    const maxDrawdown = Math.abs(backtestResults.metrics.maxDrawdown);
    
    return maxDrawdown > 0 ? annualizedReturn / maxDrawdown : 0;
  }

  private calculateVolatility(backtestResults: BacktestResult): number {
    const returns = backtestResults.returns;
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
  }

  private calculateConsistencyScore(backtestResults: BacktestResult): number {
    const returns = backtestResults.returns;
    const positiveMonths = returns.filter(r => r > 0).length;
    
    return (positiveMonths / returns.length) * 100;
  }

  private calculateExpectancy(trades: any[]): number {
    if (trades.length === 0) return 0;
    
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    return totalPnL / trades.length;
  }

  private calculateTradeDuration(trades: any[]): any {
    if (trades.length === 0) return { average: 0, median: 0, distribution: [] };
    
    const durations = trades.map(t => t.exitTime - t.entryTime);
    const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const sorted = durations.sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    
    return { average, median, distribution: durations };
  }

  private assessTradeQuality(trades: any[]): TradeQuality[] {
    return [
      {
        metric: 'Win Rate',
        score: trades.filter(t => t.pnl > 0).length / trades.length * 100,
        description: 'Percentage of profitable trades',
        improvement: 'Focus on entry timing and risk management',
      },
      {
        metric: 'Average Win/Loss Ratio',
        score: this.calculateWinLossRatio(trades),
        description: 'Ratio of average win to average loss',
        improvement: 'Let winners run and cut losses short',
      },
    ];
  }

  private calculateWinLossRatio(trades: any[]): number {
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    
    if (losses.length === 0) return wins.length > 0 ? 100 : 0;
    
    const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.reduce((sum, t) => sum + Math.abs(t.pnl), 0) / losses.length;
    
    return avgLoss > 0 ? avgWin / avgLoss : 0;
  }

  private calculateGrade(metrics: any): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
    const score = (metrics.totalReturn * 0.4) + (metrics.sharpeRatio * 0.3) + ((1 - Math.abs(metrics.maxDrawdown)) * 0.3);
    
    if (score > 0.8) return 'A+';
    if (score > 0.7) return 'A';
    if (score > 0.6) return 'B+';
    if (score > 0.5) return 'B';
    if (score > 0.4) return 'C+';
    if (score > 0.3) return 'C';
    if (score > 0.2) return 'D';
    return 'F';
  }

  private identifyStrengths(metrics: any): string[] {
    const strengths: string[] = [];
    
    if (metrics.totalReturn > 0.1) strengths.push('Strong positive returns');
    if (metrics.sharpeRatio > 1.0) strengths.push('Good risk-adjusted returns');
    if (metrics.winRate > 0.6) strengths.push('High win rate');
    if (Math.abs(metrics.maxDrawdown) < 0.1) strengths.push('Low maximum drawdown');
    
    return strengths;
  }

  private identifyWeaknesses(metrics: any): string[] {
    const weaknesses: string[] = [];
    
    if (metrics.totalReturn < 0) weaknesses.push('Negative returns');
    if (metrics.sharpeRatio < 0.5) weaknesses.push('Poor risk-adjusted returns');
    if (metrics.winRate < 0.4) weaknesses.push('Low win rate');
    if (Math.abs(metrics.maxDrawdown) > 0.2) weaknesses.push('High maximum drawdown');
    
    return weaknesses;
  }

  private getRecommendation(metrics: any): 'excellent' | 'good' | 'needs_improvement' | 'poor' | 'avoid' {
    const score = (metrics.totalReturn * 0.4) + (metrics.sharpeRatio * 0.3) + ((1 - Math.abs(metrics.maxDrawdown)) * 0.3);
    
    if (score > 0.7) return 'excellent';
    if (score > 0.5) return 'good';
    if (score > 0.3) return 'needs_improvement';
    if (score > 0.1) return 'poor';
    return 'avoid';
  }

  private calculateVaR(returns: number[]): number {
    const sorted = returns.sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.05); // 5% VaR
    return sorted[index] || 0;
  }

  private calculateExpectedShortfall(returns: number[]): number {
    const var95 = this.calculateVaR(returns);
    const tailReturns = returns.filter(r => r <= var95);
    return tailReturns.length > 0 ? tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length : 0;
  }

  private calculateTailRisk(returns: number[]): number {
    const sorted = returns.sort((a, b) => a - b);
    const tailCount = Math.floor(sorted.length * 0.1); // Bottom 10%
    const tailReturns = sorted.slice(0, tailCount);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    
    return tailReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / tailReturns.length;
  }

  private calculateRiskScore(metrics: any): number {
    const drawdownRisk = Math.abs(metrics.maxDrawdown) * 50; // 0-50 points
    const volatilityRisk = this.calculateVolatility({ returns: [], metrics, trades: [] }) * 20; // 0-20 points
    const returnRisk = metrics.totalReturn < 0 ? 30 : 0; // 0-30 points
    
    return Math.min(100, drawdownRisk + volatilityRisk + returnRisk);
  }

  private identifyRiskFactors(metrics: any): RiskFactor[] {
    const factors: RiskFactor[] = [];
    
    if (Math.abs(metrics.maxDrawdown) > 0.15) {
      factors.push({
        type: 'Drawdown Risk',
        severity: 'high',
        description: 'High maximum drawdown indicates significant loss potential',
        mitigation: 'Implement stop-losses and position sizing rules',
      });
    }
    
    if (metrics.sharpeRatio < 0.5) {
      factors.push({
        type: 'Risk-Adjusted Returns',
        severity: 'medium',
        description: 'Low Sharpe ratio suggests poor risk-adjusted performance',
        mitigation: 'Optimize strategy parameters and improve risk management',
      });
    }
    
    return factors;
  }

  private calculateAnalysisConfidence(analysisData: any): number {
    let confidence = 0.8; // Base confidence for AI analysis
    
    // Increase confidence based on analysis completeness
    if (analysisData.overallAssessment) confidence += 0.05;
    if (analysisData.performanceAnalysis) confidence += 0.05;
    if (analysisData.riskAnalysis) confidence += 0.05;
    if (analysisData.optimizationSuggestions?.length > 0) confidence += 0.05;
    
    return Math.min(1.0, confidence);
  }
}

// Export singleton instance
let backtestAnalystInstance: BacktestAnalystAgent | null = null;

export function getBacktestAnalystAgent(config?: any): BacktestAnalystAgent {
  if (!backtestAnalystInstance) {
    backtestAnalystInstance = new BacktestAnalystAgent(config);
  }
  return backtestAnalystInstance;
}

export function initializeBacktestAnalystAgent(config?: any): BacktestAnalystAgent {
  backtestAnalystInstance = new BacktestAnalystAgent(config);
  return backtestAnalystInstance;
}
