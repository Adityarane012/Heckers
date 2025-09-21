/**
 * News Sentiment Agent
 * 
 * This agent analyzes news and market sentiment to provide trading insights,
 * market impact assessments, and actionable sentiment-based trading signals.
 * 
 * Usage:
 * ```typescript
 * const agent = new NewsSentimentAgent();
 * const result = await agent.analyzeSentiment({
 *   symbols: ['AAPL', 'GOOGL'],
 *   timeframe: '24h',
 *   userId: "user123"
 * });
 * ```
 */

import { AgentResponse, NewsArticle, SentimentScore } from '../shared/types';
import { AgentError, ErrorFactory, withErrorHandling, ProgressTracker } from '../shared/errors';
import { getGeminiClient } from '../../services/ai/gemini-client';
import { prompts } from './prompts';

export interface NewsSentimentRequest {
  symbols?: string[];
  timeframe?: '1h' | '4h' | '24h' | '3d' | '1w' | '1m';
  keywords?: string[];
  sources?: string[];
  userId?: string;
  sessionId?: string;
  options?: {
    includeMarketImpact?: boolean;
    includeTradingSignals?: boolean;
    includeEducationalContent?: boolean;
    sentimentThreshold?: number;
  };
}

export interface NewsSentimentResponse {
  overallSentiment: OverallSentiment;
  newsAnalysis: NewsAnalysis;
  marketImpact: MarketImpact;
  tradingSignals: TradingSignal[];
  educationalInsights: EducationalInsights;
  confidence: number;
  metadata: SentimentMetadata;
}

export interface OverallSentiment {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  label: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  trend: 'improving' | 'declining' | 'stable';
  confidence: number; // 0 to 1
  summary: string;
}

export interface NewsAnalysis {
  articles: ProcessedArticle[];
  totalArticles: number;
  sentimentDistribution: SentimentDistribution;
  keyThemes: KeyTheme[];
  trendingTopics: TrendingTopic[];
  sourceAnalysis: SourceAnalysis;
}

export interface MarketImpact {
  expectedImpact: 'high' | 'medium' | 'low' | 'minimal';
  impactDirection: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0 to 1
  timeframe: string;
  affectedSectors: string[];
  riskFactors: RiskFactor[];
  opportunities: Opportunity[];
}

export interface TradingSignal {
  symbol: string;
  signal: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  confidence: number; // 0 to 1
  reasoning: string;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedMove: number; // percentage
  keyDrivers: string[];
}

export interface EducationalInsights {
  keyLearnings: string[];
  sentimentAnalysisConcepts: string[];
  marketImpactFactors: string[];
  tradingConsiderations: string[];
  riskWarnings: string[];
  recommendedActions: string[];
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
}

export interface SentimentDistribution {
  very_positive: number;
  positive: number;
  neutral: number;
  negative: number;
  very_negative: number;
}

export interface KeyTheme {
  theme: string;
  sentiment: number; // -1 to 1
  frequency: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  relatedArticles: string[];
}

export interface TrendingTopic {
  topic: string;
  trend: 'rising' | 'falling' | 'stable';
  mentions: number;
  sentiment: number; // -1 to 1
  relevance: number; // 0 to 1
}

export interface SourceAnalysis {
  sources: SourceSentiment[];
  credibility: number; // 0 to 1
  bias: 'bullish' | 'bearish' | 'neutral';
  reliability: number; // 0 to 1
}

export interface SourceSentiment {
  source: string;
  sentiment: number; // -1 to 1
  articleCount: number;
  credibility: number; // 0 to 1
  bias: 'bullish' | 'bearish' | 'neutral';
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  probability: number; // 0 to 1
  mitigation: string;
}

export interface Opportunity {
  type: string;
  description: string;
  potential: 'low' | 'medium' | 'high';
  timeframe: string;
  requirements: string[];
  risks: string[];
}

export class NewsSentimentAgent {
  private config: any;
  private geminiClient: ReturnType<typeof getGeminiClient>;

  constructor(config?: any) {
    this.config = {
      id: 'news-sentiment',
      name: 'News Sentiment Agent',
      description: 'Analyzes news and market sentiment for trading insights',
      version: '1.0.0',
      enabled: true,
      timeout: 60000, // Longer timeout for news processing
      retryAttempts: 3,
      ...config,
    };

    this.geminiClient = getGeminiClient();
  }

  /**
   * Analyze news sentiment for given symbols
   */
  async analyzeSentiment(request: NewsSentimentRequest): Promise<AgentResponse<NewsSentimentResponse>> {
    return withErrorHandling(
      async () => {
        // Validate input
        this.validateRequest(request);

        // Fetch news articles (mock implementation for now)
        const articles = await this.fetchNewsArticles(request);

        // Generate comprehensive sentiment analysis using AI
        const analysis = await this.generateSentimentAnalysisWithAI(articles, request);

        // Parse and structure the response
        const structuredAnalysis = this.parseSentimentResponse(analysis, articles, request);

        // Calculate confidence score
        const confidence = this.calculateConfidence(articles, structuredAnalysis);

        return {
          status: 'done',
          progress: 100,
          data: structuredAnalysis,
          explanation: `Sentiment analysis completed for ${articles.length} articles with ${structuredAnalysis.tradingSignals.length} trading signals`,
          educationalSummary: `Analysis shows ${structuredAnalysis.overallSentiment.label} sentiment with ${structuredAnalysis.marketImpact.expectedImpact} market impact`,
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
   * Get sentiment for specific news articles
   */
  async analyzeArticleSentiment(articles: NewsArticle[]): Promise<AgentResponse<ProcessedArticle[]>> {
    return withErrorHandling(
      async () => {
        if (!articles || articles.length === 0) {
          throw ErrorFactory.validationError('Articles array is required and cannot be empty');
        }

        const prompt = prompts.buildArticleSentimentPrompt(articles);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.3,
          maxTokens: 4096,
        });

        const processedArticles = this.parseArticleSentiment(response.content, articles);

        return {
          status: 'done',
          progress: 100,
          data: processedArticles,
          explanation: `Article sentiment analysis completed for ${articles.length} articles`,
          educationalSummary: `Processed articles with sentiment scores and market relevance analysis`,
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
   * Get market impact assessment
   */
  async assessMarketImpact(sentimentData: any, symbols: string[]): Promise<AgentResponse<MarketImpact>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildMarketImpactPrompt(sentimentData, symbols);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.3,
          maxTokens: 2048,
        });

        const marketImpact = this.parseMarketImpact(response.content, sentimentData);

        return {
          status: 'done',
          progress: 100,
          data: marketImpact,
          explanation: `Market impact assessment completed for ${symbols.length} symbols`,
          educationalSummary: `Analysis shows ${marketImpact.expectedImpact} impact with ${marketImpact.impactDirection} direction`,
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
   * Generate trading signals based on sentiment
   */
  async generateTradingSignals(sentimentData: any, symbols: string[]): Promise<AgentResponse<TradingSignal[]>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildTradingSignalsPrompt(sentimentData, symbols);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.4,
          maxTokens: 2048,
        });

        const tradingSignals = this.parseTradingSignals(response.content, symbols);

        return {
          status: 'done',
          progress: 100,
          data: tradingSignals,
          explanation: `Generated ${tradingSignals.length} trading signals based on sentiment analysis`,
          educationalSummary: `Sentiment-based signals with confidence levels and risk assessments`,
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
   * Get trending topics and themes
   */
  async getTrendingTopics(request: NewsSentimentRequest): Promise<AgentResponse<{ topics: TrendingTopic[]; themes: KeyTheme[] }>> {
    return withErrorHandling(
      async () => {
        const articles = await this.fetchNewsArticles(request);
        const prompt = prompts.buildTrendingTopicsPrompt(articles);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.4,
          maxTokens: 2048,
        });

        const trendingData = this.parseTrendingTopics(response.content);

        return {
          status: 'done',
          progress: 100,
          data: trendingData,
          explanation: `Identified ${trendingData.topics.length} trending topics and ${trendingData.themes.length} key themes`,
          educationalSummary: `Trending analysis reveals market focus areas and sentiment drivers`,
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
            dependencies: ['gemini-ai', 'news-api'],
          },
          explanation: 'Health check completed',
          educationalSummary: 'Agent health monitoring ensures reliable sentiment analysis',
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

  private validateRequest(request: NewsSentimentRequest): void {
    if (!request.symbols && !request.keywords) {
      throw ErrorFactory.validationError('Either symbols or keywords must be provided');
    }

    if (request.symbols && !Array.isArray(request.symbols)) {
      throw ErrorFactory.validationError('Symbols must be an array');
    }

    if (request.symbols && request.symbols.length > 10) {
      throw ErrorFactory.validationError('Maximum 10 symbols allowed per analysis');
    }

    if (request.keywords && !Array.isArray(request.keywords)) {
      throw ErrorFactory.validationError('Keywords must be an array');
    }

    if (request.keywords && request.keywords.length > 20) {
      throw ErrorFactory.validationError('Maximum 20 keywords allowed per analysis');
    }
  }

  private async fetchNewsArticles(request: NewsSentimentRequest): Promise<NewsArticle[]> {
    // Mock implementation - in production, this would fetch from news APIs
    const mockArticles: NewsArticle[] = [
      {
        id: '1',
        title: 'Tech Stocks Rally on Strong Earnings Reports',
        content: 'Major technology companies reported better-than-expected earnings, driving stock prices higher across the sector.',
        source: 'Financial Times',
        publishedAt: Date.now() - 3600000, // 1 hour ago
        url: 'https://example.com/article1',
        sentiment: {
          score: 0.7,
          magnitude: 0.8,
          label: 'positive',
          confidence: 0.9,
        },
      },
      {
        id: '2',
        title: 'Market Volatility Concerns Investors',
        content: 'Rising interest rates and geopolitical tensions are causing increased market volatility.',
        source: 'Reuters',
        publishedAt: Date.now() - 7200000, // 2 hours ago
        url: 'https://example.com/article2',
        sentiment: {
          score: -0.4,
          magnitude: 0.6,
          label: 'negative',
          confidence: 0.8,
        },
      },
    ];

    return mockArticles;
  }

  private async generateSentimentAnalysisWithAI(articles: NewsArticle[], request: NewsSentimentRequest): Promise<string> {
    const prompt = prompts.buildSentimentAnalysisPrompt(articles, request);
    
    const response = await this.geminiClient.generateContentWithProgress({
      prompt,
      temperature: 0.4,
      maxTokens: 4096,
      systemInstruction: prompts.getSystemInstruction(),
    });

    return response.content;
  }

  private parseSentimentResponse(aiResponse: string, articles: NewsArticle[], request: NewsSentimentRequest): NewsSentimentResponse {
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
        overallSentiment: analysisData.overallSentiment || this.calculateOverallSentiment(articles),
        newsAnalysis: this.processNewsAnalysis(articles, analysisData.newsAnalysis),
        marketImpact: analysisData.marketImpact || this.generateDefaultMarketImpact(articles),
        tradingSignals: analysisData.tradingSignals || this.generateDefaultTradingSignals(request.symbols || []),
        educationalInsights: analysisData.educationalInsights || this.generateDefaultEducationalInsights(),
        confidence: this.calculateAnalysisConfidence(analysisData),
        metadata: this.generateMetadata(articles, request),
      };
    } catch (error) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw ErrorFactory.validationError(
        'Failed to parse AI response as valid sentiment analysis',
        { originalError: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private parseArticleSentiment(content: string, articles: NewsArticle[]): ProcessedArticle[] {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to processing articles with default sentiment
    }

    return articles.map(article => ({
      ...article,
      sentiment: article.sentiment || {
        score: 0,
        magnitude: 0.5,
        label: 'neutral',
        confidence: 0.5,
      },
      relevance: 0.5,
      impact: 'medium',
      keyPoints: [],
      marketRelevance: [],
    }));
  }

  private parseMarketImpact(content: string, sentimentData: any): MarketImpact {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to default market impact
    }

    return this.generateDefaultMarketImpact([]);
  }

  private parseTradingSignals(content: string, symbols: string[]): TradingSignal[] {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to default trading signals
    }

    return this.generateDefaultTradingSignals(symbols);
  }

  private parseTrendingTopics(content: string): { topics: TrendingTopic[]; themes: KeyTheme[] } {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to default trending data
    }

    return {
      topics: [],
      themes: [],
    };
  }

  private calculateOverallSentiment(articles: NewsArticle[]): OverallSentiment {
    if (articles.length === 0) {
      return {
        score: 0,
        magnitude: 0,
        label: 'neutral',
        trend: 'stable',
        confidence: 0,
        summary: 'No articles to analyze',
      };
    }

    const sentiments = articles.map(a => a.sentiment?.score || 0);
    const avgSentiment = sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length;
    const magnitude = Math.abs(avgSentiment);

    let label: OverallSentiment['label'];
    if (avgSentiment > 0.6) label = 'very_positive';
    else if (avgSentiment > 0.2) label = 'positive';
    else if (avgSentiment < -0.6) label = 'very_negative';
    else if (avgSentiment < -0.2) label = 'negative';
    else label = 'neutral';

    return {
      score: avgSentiment,
      magnitude,
      label,
      trend: 'stable',
      confidence: 0.8,
      summary: `Overall sentiment is ${label} with ${articles.length} articles analyzed`,
    };
  }

  private processNewsAnalysis(articles: NewsArticle[], aiAnalysis?: any): NewsAnalysis {
    const processedArticles = articles.map(article => ({
      ...article,
      sentiment: article.sentiment || {
        score: 0,
        magnitude: 0.5,
        label: 'neutral',
        confidence: 0.5,
      },
      relevance: 0.5,
      impact: 'medium' as const,
      keyPoints: [],
      marketRelevance: [],
    }));

    return {
      articles: processedArticles,
      totalArticles: articles.length,
      sentimentDistribution: this.calculateSentimentDistribution(articles),
      keyThemes: aiAnalysis?.keyThemes || [],
      trendingTopics: aiAnalysis?.trendingTopics || [],
      sourceAnalysis: this.analyzeSources(articles),
    };
  }

  private calculateSentimentDistribution(articles: NewsArticle[]): SentimentDistribution {
    const distribution = {
      very_positive: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      very_negative: 0,
    };

    articles.forEach(article => {
      const score = article.sentiment?.score || 0;
      if (score > 0.6) distribution.very_positive++;
      else if (score > 0.2) distribution.positive++;
      else if (score < -0.6) distribution.very_negative++;
      else if (score < -0.2) distribution.negative++;
      else distribution.neutral++;
    });

    return distribution;
  }

  private analyzeSources(articles: NewsArticle[]): SourceAnalysis {
    const sourceMap = new Map<string, { count: number; sentiment: number; credibility: number }>();

    articles.forEach(article => {
      const existing = sourceMap.get(article.source) || { count: 0, sentiment: 0, credibility: 0.5 };
      existing.count++;
      existing.sentiment += article.sentiment?.score || 0;
      sourceMap.set(article.source, existing);
    });

    const sources: SourceSentiment[] = Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      sentiment: data.sentiment / data.count,
      articleCount: data.count,
      credibility: data.credibility,
      bias: data.sentiment > 0.2 ? 'bullish' : data.sentiment < -0.2 ? 'bearish' : 'neutral',
    }));

    return {
      sources,
      credibility: 0.7,
      bias: 'neutral',
      reliability: 0.8,
    };
  }

  private generateDefaultMarketImpact(articles: NewsArticle[]): MarketImpact {
    return {
      expectedImpact: 'medium',
      impactDirection: 'neutral',
      confidence: 0.6,
      timeframe: '24h',
      affectedSectors: [],
      riskFactors: [],
      opportunities: [],
    };
  }

  private generateDefaultTradingSignals(symbols: string[]): TradingSignal[] {
    return symbols.map(symbol => ({
      symbol,
      signal: 'hold',
      confidence: 0.5,
      reasoning: 'Insufficient sentiment data for strong signal',
      timeframe: '24h',
      riskLevel: 'medium',
      expectedMove: 0,
      keyDrivers: [],
    }));
  }

  private generateDefaultEducationalInsights(): EducationalInsights {
    return {
      keyLearnings: [
        'Sentiment analysis helps identify market mood and potential price movements',
        'News sentiment should be combined with technical analysis for better decisions',
        'Market sentiment can be a contrarian indicator at extremes'
      ],
      sentimentAnalysisConcepts: [
        'Sentiment scoring and magnitude',
        'Source credibility and bias',
        'Market impact assessment'
      ],
      marketImpactFactors: [
        'News volume and frequency',
        'Source credibility',
        'Market timing and context'
      ],
      tradingConsiderations: [
        'Use sentiment as one factor in decision making',
        'Consider market context and timing',
        'Be aware of sentiment extremes'
      ],
      riskWarnings: [
        'Sentiment can change quickly',
        'Past performance doesn\'t guarantee future results',
        'Always use proper risk management'
      ],
      recommendedActions: [
        'Monitor sentiment trends over time',
        'Combine with other analysis methods',
        'Use sentiment for position sizing decisions'
      ],
    };
  }

  private generateMetadata(articles: NewsArticle[], request: NewsSentimentRequest): SentimentMetadata {
    return {
      analysisDate: Date.now(),
      timeframe: request.timeframe || '24h',
      symbolsAnalyzed: request.symbols || [],
      articlesProcessed: articles.length,
      processingTime: 0,
      dataSources: ['mock-news-api'],
      model: 'gemini-2.0-flash',
      version: '1.0.0',
    };
  }

  private calculateConfidence(articles: NewsArticle[], analysis: NewsSentimentResponse): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence based on data quality
    if (articles.length > 10) confidence += 0.1;
    if (articles.length > 50) confidence += 0.1;
    if (analysis.tradingSignals.length > 0) confidence += 0.1;

    return Math.min(1.0, confidence);
  }

  private calculateAnalysisConfidence(analysisData: any): number {
    let confidence = 0.8; // Base confidence for AI analysis
    
    // Increase confidence based on analysis completeness
    if (analysisData.overallSentiment) confidence += 0.05;
    if (analysisData.newsAnalysis) confidence += 0.05;
    if (analysisData.marketImpact) confidence += 0.05;
    if (analysisData.tradingSignals?.length > 0) confidence += 0.05;
    
    return Math.min(1.0, confidence);
  }
}

// Export singleton instance
let newsSentimentInstance: NewsSentimentAgent | null = null;

export function getNewsSentimentAgent(config?: any): NewsSentimentAgent {
  if (!newsSentimentInstance) {
    newsSentimentInstance = new NewsSentimentAgent(config);
  }
  return newsSentimentInstance;
}

export function initializeNewsSentimentAgent(config?: any): NewsSentimentAgent {
  newsSentimentInstance = new NewsSentimentAgent(config);
  return newsSentimentInstance;
}
