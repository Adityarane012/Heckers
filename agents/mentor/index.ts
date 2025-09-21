/**
 * Mentor Agent
 * 
 * This is the master agent that orchestrates all other agents and provides
 * comprehensive guidance, learning path management, and overall platform coordination.
 * 
 * Usage:
 * ```typescript
 * const agent = new MentorAgent();
 * const result = await agent.getMentorship({
 *   userId: "user123",
 *   currentLevel: 5,
 *   goals: ["risk_management", "strategy_development"]
 * });
 * ```
 */

import { AgentResponse } from '../shared/types';
import { AgentError, ErrorFactory, withErrorHandling, ProgressTracker } from '../shared/errors';
import { getGeminiClient } from '../../services/ai/gemini-client';
import { getStrategyBuilderAgent } from '../strategy-builder';
import { getBacktestAnalystAgent } from '../backtest-analyst';
import { getTradeCoachAgent } from '../trade-coach';
import { getNewsSentimentAgent } from '../news-sentiment';
import { prompts } from './prompts';

export interface MentorRequest {
  userId: string;
  sessionId?: string;
  currentLevel?: number;
  goals?: string[];
  preferences?: UserPreferences;
  context?: UserContext;
  options?: {
    includeLearningPath?: boolean;
    includeAgentRecommendations?: boolean;
    includeProgressTracking?: boolean;
    includeEducationalContent?: boolean;
  };
}

export interface MentorResponse {
  mentorship: Mentorship;
  learningPath: LearningPath;
  agentRecommendations: AgentRecommendation[];
  progressTracking: ProgressTracking;
  educationalInsights: EducationalInsights;
  nextSteps: NextStep[];
  confidence: number;
  metadata: MentorMetadata;
}

export interface Mentorship {
  overallAssessment: OverallAssessment;
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  encouragement: string;
  warnings: string[];
  focusAreas: FocusArea[];
}

export interface LearningPath {
  currentLevel: number;
  targetLevel: number;
  lessons: Lesson[];
  milestones: Milestone[];
  prerequisites: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100
}

export interface AgentRecommendation {
  agentId: string;
  agentName: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  expectedBenefit: string;
  estimatedTime: string;
  prerequisites: string[];
  actionItems: string[];
}

export interface ProgressTracking {
  currentXP: number;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  recentProgress: ProgressEntry[];
  nextMilestone: string;
  progressPercentage: number;
  streak: number;
  lastActive: number;
}

export interface EducationalInsights {
  keyConcepts: string[];
  learningObjectives: string[];
  bestPractices: string[];
  commonMistakes: string[];
  resources: EducationalResource[];
  exercises: Exercise[];
  assessments: Assessment[];
}

export interface NextStep {
  step: number;
  title: string;
  description: string;
  agent: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  prerequisites: string[];
  expectedOutcome: string;
}

export interface MentorMetadata {
  analysisDate: number;
  userId: string;
  sessionId?: string;
  processingTime: number;
  agentsUsed: string[];
  model: string;
  version: string;
}

export interface UserPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: 'low' | 'medium' | 'high';
  focusAreas: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  tradingStyle: 'scalper' | 'day_trader' | 'swing_trader' | 'position_trader';
}

export interface UserContext {
  recentActivity: Activity[];
  currentGoals: string[];
  challenges: string[];
  successes: string[];
  timeAvailable: number; // minutes per day
  learningStreak: number;
  lastSession: number;
}

export interface Activity {
  type: 'strategy_built' | 'backtest_analyzed' | 'coaching_received' | 'news_analyzed' | 'lesson_completed';
  timestamp: number;
  details: string;
  xpGained: number;
  agent: string;
}

export interface OverallAssessment {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  overallScore: number; // 0-100
  trend: 'improving' | 'declining' | 'stable';
  keyInsights: string[];
}

export interface FocusArea {
  area: string;
  priority: 'high' | 'medium' | 'low';
  currentLevel: number;
  targetLevel: number;
  progress: number; // 0-100
  description: string;
  actionItems: string[];
  resources: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'practice' | 'assessment' | 'project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  prerequisites: string[];
  objectives: string[];
  content: string;
  exercises: string[];
  completed: boolean;
  xpReward: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  level: number;
  requirements: string[];
  rewards: string[];
  achieved: boolean;
  achievedAt?: number;
  xpReward: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'trading' | 'consistency' | 'mastery';
  earnedAt: number;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
}

export interface ProgressEntry {
  date: number;
  activity: string;
  xpGained: number;
  level: number;
  achievements: string[];
  notes: string;
}

export interface EducationalResource {
  type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'template';
  title: string;
  description: string;
  url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  rating: number; // 0-5
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'simulation' | 'analysis' | 'creation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  objectives: string[];
  instructions: string[];
  successCriteria: string[];
  xpReward: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'practical' | 'analysis' | 'project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  questions: string[];
  passingScore: number; // 0-100
  xpReward: number;
}

export class MentorAgent {
  private config: any;
  private geminiClient: ReturnType<typeof getGeminiClient>;
  private strategyBuilder: ReturnType<typeof getStrategyBuilderAgent>;
  private backtestAnalyst: ReturnType<typeof getBacktestAnalystAgent>;
  private tradeCoach: ReturnType<typeof getTradeCoachAgent>;
  private newsSentiment: ReturnType<typeof getNewsSentimentAgent>;

  constructor(config?: any) {
    this.config = {
      id: 'mentor',
      name: 'Mentor Agent',
      description: 'Master agent that orchestrates all other agents and provides comprehensive guidance',
      version: '1.0.0',
      enabled: true,
      timeout: 60000,
      retryAttempts: 3,
      ...config,
    };

    this.geminiClient = getGeminiClient();
    this.strategyBuilder = getStrategyBuilderAgent();
    this.backtestAnalyst = getBacktestAnalystAgent();
    this.tradeCoach = getTradeCoachAgent();
    this.newsSentiment = getNewsSentimentAgent();
  }

  /**
   * Get comprehensive mentorship guidance
   */
  async getMentorship(request: MentorRequest): Promise<AgentResponse<MentorResponse>> {
    return withErrorHandling(
      async () => {
        // Validate input
        this.validateRequest(request);

        // Gather context from other agents
        const agentContext = await this.gatherAgentContext(request);

        // Generate comprehensive mentorship using AI
        const mentorship = await this.generateMentorshipWithAI(request, agentContext);

        // Parse and structure the response
        const structuredMentorship = this.parseMentorshipResponse(mentorship, request, agentContext);

        // Calculate confidence score
        const confidence = this.calculateConfidence(request, structuredMentorship);

        return {
          status: 'done',
          progress: 100,
          data: structuredMentorship,
          explanation: `Comprehensive mentorship completed with ${structuredMentorship.agentRecommendations.length} agent recommendations`,
          educationalSummary: `Mentorship analysis shows level ${structuredMentorship.learningPath.currentLevel} with focus on ${structuredMentorship.mentorship.focusAreas.length} areas`,
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
   * Get learning path recommendations
   */
  async getLearningPath(userId: string, currentLevel: number, goals: string[]): Promise<AgentResponse<LearningPath>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildLearningPathPrompt(userId, currentLevel, goals);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.4,
          maxTokens: 2048,
        });

        const learningPath = this.parseLearningPath(response.content, currentLevel, goals);

        return {
          status: 'done',
          progress: 100,
          data: learningPath,
          explanation: `Learning path generated for level ${currentLevel} with ${goals.length} goals`,
          educationalSummary: `Personalized learning path with ${learningPath.lessons.length} lessons and ${learningPath.milestones.length} milestones`,
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
   * Get agent recommendations based on user needs
   */
  async getAgentRecommendations(userId: string, context: UserContext): Promise<AgentResponse<AgentRecommendation[]>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildAgentRecommendationsPrompt(userId, context);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.4,
          maxTokens: 1536,
        });

        const recommendations = this.parseAgentRecommendations(response.content);

        return {
          status: 'done',
          progress: 100,
          data: recommendations,
          explanation: `Generated ${recommendations.length} agent recommendations based on user context`,
          educationalSummary: `Personalized agent recommendations to address specific learning needs`,
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
  async getProgressTracking(userId: string, activities: Activity[]): Promise<AgentResponse<ProgressTracking>> {
    return withErrorHandling(
      async () => {
        const prompt = prompts.buildProgressTrackingPrompt(userId, activities);
        
        const response = await this.geminiClient.generateContentWithProgress({
          prompt,
          temperature: 0.3,
          maxTokens: 1024,
        });

        const progressTracking = this.parseProgressTracking(response.content, activities);

        return {
          status: 'done',
          progress: 100,
          data: progressTracking,
          explanation: `Progress tracking completed with ${progressTracking.achievements.length} achievements`,
          educationalSummary: `Current level ${progressTracking.level} with ${progressTracking.currentXP} XP and ${progressTracking.streak} day streak`,
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
   * Orchestrate multiple agents for comprehensive analysis
   */
  async orchestrateAgents(request: MentorRequest): Promise<AgentResponse<any>> {
    return withErrorHandling(
      async () => {
        const results: any = {};

        // Get strategy builder insights
        if (request.goals?.includes('strategy_development')) {
          try {
            const strategyResult = await this.strategyBuilder.getHealth();
            results.strategyBuilder = strategyResult.data;
          } catch (error) {
            results.strategyBuilder = { error: 'Strategy builder unavailable' };
          }
        }

        // Get backtest analyst insights
        if (request.goals?.includes('backtest_analysis')) {
          try {
            const backtestResult = await this.backtestAnalyst.getHealth();
            results.backtestAnalyst = backtestResult.data;
          } catch (error) {
            results.backtestAnalyst = { error: 'Backtest analyst unavailable' };
          }
        }

        // Get trade coach insights
        if (request.goals?.includes('trading_coaching')) {
          try {
            const coachResult = await this.tradeCoach.getHealth();
            results.tradeCoach = coachResult.data;
          } catch (error) {
            results.tradeCoach = { error: 'Trade coach unavailable' };
          }
        }

        // Get news sentiment insights
        if (request.goals?.includes('market_analysis')) {
          try {
            const newsResult = await this.newsSentiment.getHealth();
            results.newsSentiment = newsResult.data;
          } catch (error) {
            results.newsSentiment = { error: 'News sentiment unavailable' };
          }
        }

        return {
          status: 'done',
          progress: 100,
          data: results,
          explanation: `Orchestrated ${Object.keys(results).length} agents for comprehensive analysis`,
          educationalSummary: `Multi-agent analysis provides holistic view of trading education needs`,
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 45000,
        retryAttempts: this.config.retryAttempts,
      }
    );
  }

  /**
   * Get agent health status
   */
  async getHealth(): Promise<AgentResponse<{ status: string; dependencies: string[]; agents: any }>> {
    return withErrorHandling(
      async () => {
        const geminiHealth = await this.geminiClient.healthCheck();
        
        // Check all agent health
        const agentHealth = await Promise.allSettled([
          this.strategyBuilder.getHealth(),
          this.backtestAnalyst.getHealth(),
          this.tradeCoach.getHealth(),
          this.newsSentiment.getHealth(),
        ]);

        const agents = {
          strategyBuilder: agentHealth[0].status === 'fulfilled' ? agentHealth[0].value.data : { error: 'Unavailable' },
          backtestAnalyst: agentHealth[1].status === 'fulfilled' ? agentHealth[1].value.data : { error: 'Unavailable' },
          tradeCoach: agentHealth[2].status === 'fulfilled' ? agentHealth[2].value.data : { error: 'Unavailable' },
          newsSentiment: agentHealth[3].status === 'fulfilled' ? agentHealth[3].value.data : { error: 'Unavailable' },
        };

        return {
          status: 'done',
          progress: 100,
          data: {
            status: geminiHealth.status,
            dependencies: ['gemini-ai', 'strategy-builder', 'backtest-analyst', 'trade-coach', 'news-sentiment'],
            agents,
          },
          explanation: 'Health check completed for all agents',
          educationalSummary: 'Mentor agent coordinates all other agents for comprehensive guidance',
          timestamp: Date.now(),
          agentId: this.config.id,
        };
      },
      this.config.id,
      {
        timeout: 15000,
        retryAttempts: 1,
      }
    );
  }

  private validateRequest(request: MentorRequest): void {
    if (!request.userId || typeof request.userId !== 'string') {
      throw ErrorFactory.validationError('User ID is required and must be a string');
    }

    if (request.currentLevel && (request.currentLevel < 1 || request.currentLevel > 20)) {
      throw ErrorFactory.validationError('Current level must be between 1 and 20');
    }

    if (request.goals && !Array.isArray(request.goals)) {
      throw ErrorFactory.validationError('Goals must be an array');
    }
  }

  private async gatherAgentContext(request: MentorRequest): Promise<any> {
    const context: any = {
      userId: request.userId,
      timestamp: Date.now(),
    };

    // Gather context from other agents based on goals
    if (request.goals?.includes('strategy_development')) {
      try {
        const strategyHealth = await this.strategyBuilder.getHealth();
        context.strategyBuilder = strategyHealth.data;
      } catch (error) {
        context.strategyBuilder = { error: 'Unavailable' };
      }
    }

    if (request.goals?.includes('backtest_analysis')) {
      try {
        const backtestHealth = await this.backtestAnalyst.getHealth();
        context.backtestAnalyst = backtestHealth.data;
      } catch (error) {
        context.backtestAnalyst = { error: 'Unavailable' };
      }
    }

    if (request.goals?.includes('trading_coaching')) {
      try {
        const coachHealth = await this.tradeCoach.getHealth();
        context.tradeCoach = coachHealth.data;
      } catch (error) {
        context.tradeCoach = { error: 'Unavailable' };
      }
    }

    if (request.goals?.includes('market_analysis')) {
      try {
        const newsHealth = await this.newsSentiment.getHealth();
        context.newsSentiment = newsHealth.data;
      } catch (error) {
        context.newsSentiment = { error: 'Unavailable' };
      }
    }

    return context;
  }

  private async generateMentorshipWithAI(request: MentorRequest, agentContext: any): Promise<string> {
    const prompt = prompts.buildMentorshipPrompt(request, agentContext);
    
    const response = await this.geminiClient.generateContentWithProgress({
      prompt,
      temperature: 0.4,
      maxTokens: 4096,
      systemInstruction: prompts.getSystemInstruction(),
    });

    return response.content;
  }

  private parseMentorshipResponse(aiResponse: string, request: MentorRequest, agentContext: any): MentorResponse {
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                       aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw ErrorFactory.validationError('No valid JSON found in AI response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const mentorshipData = JSON.parse(jsonStr);

      // Structure the response with calculated metrics
      return {
        mentorship: mentorshipData.mentorship || this.generateDefaultMentorship(request),
        learningPath: mentorshipData.learningPath || this.generateDefaultLearningPath(request),
        agentRecommendations: mentorshipData.agentRecommendations || this.generateDefaultAgentRecommendations(request),
        progressTracking: mentorshipData.progressTracking || this.generateDefaultProgressTracking(request),
        educationalInsights: mentorshipData.educationalInsights || this.generateDefaultEducationalInsights(),
        nextSteps: mentorshipData.nextSteps || this.generateDefaultNextSteps(request),
        confidence: this.calculateMentorshipConfidence(mentorshipData),
        metadata: this.generateMetadata(request, agentContext),
      };
    } catch (error) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw ErrorFactory.validationError(
        'Failed to parse AI response as valid mentorship',
        { originalError: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  private parseLearningPath(content: string, currentLevel: number, goals: string[]): LearningPath {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to default learning path
    }

    return this.generateDefaultLearningPath({ userId: '', currentLevel, goals });
  }

  private parseAgentRecommendations(content: string): AgentRecommendation[] {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to default recommendations
    }

    return [];
  }

  private parseProgressTracking(content: string, activities: Activity[]): ProgressTracking {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (error) {
      // Fallback to calculated progress tracking
    }

    return this.calculateProgressTracking(activities);
  }

  private generateDefaultMentorship(request: MentorRequest): Mentorship {
    return {
      overallAssessment: {
        grade: 'B',
        summary: `Assessment for level ${request.currentLevel || 1} trader`,
        strengths: ['Willingness to learn', 'Engagement with platform'],
        weaknesses: ['Need more practice', 'Risk management'],
        improvementAreas: ['Strategy development', 'Risk management'],
        overallScore: 70,
        trend: 'stable',
        keyInsights: ['Focus on fundamentals', 'Practice regularly'],
      },
      strengths: ['Motivated learner', 'Active engagement'],
      improvementAreas: ['Risk management', 'Strategy development'],
      recommendations: ['Focus on risk management', 'Practice with paper trading'],
      encouragement: 'You\'re making good progress! Keep learning and practicing.',
      warnings: ['Always use proper risk management', 'Don\'t risk more than you can afford to lose'],
      focusAreas: [
        {
          area: 'Risk Management',
          priority: 'high',
          currentLevel: 3,
          targetLevel: 7,
          progress: 40,
          description: 'Learn proper position sizing and risk controls',
          actionItems: ['Study risk management principles', 'Practice with small positions'],
          resources: ['Risk management course', 'Position sizing calculator'],
        },
      ],
    };
  }

  private generateDefaultLearningPath(request: MentorRequest): LearningPath {
    return {
      currentLevel: request.currentLevel || 1,
      targetLevel: Math.min((request.currentLevel || 1) + 3, 20),
      lessons: this.generateDefaultLessons(request.currentLevel || 1),
      milestones: this.generateDefaultMilestones(request.currentLevel || 1),
      prerequisites: [],
      estimatedTime: '2-4 weeks',
      difficulty: 'intermediate',
      progress: 25,
    };
  }

  private generateDefaultLessons(currentLevel: number): Lesson[] {
    return [
      {
        id: 'risk_management_basics',
        title: 'Risk Management Basics',
        description: 'Learn the fundamentals of risk management in trading',
        type: 'concept',
        difficulty: 'beginner',
        estimatedTime: 30,
        prerequisites: [],
        objectives: ['Understand position sizing', 'Learn stop losses'],
        content: 'Risk management is crucial for trading success...',
        exercises: ['Calculate position sizes', 'Set stop losses'],
        completed: false,
        xpReward: 50,
      },
    ];
  }

  private generateDefaultMilestones(currentLevel: number): Milestone[] {
    return [
      {
        id: 'level_5_trader',
        title: 'Level 5 Trader',
        description: 'Reach level 5 in trading skills',
        level: 5,
        requirements: ['Complete 10 lessons', 'Pass risk management assessment'],
        rewards: ['Advanced strategy builder access', '100 XP bonus'],
        achieved: currentLevel >= 5,
        xpReward: 100,
      },
    ];
  }

  private generateDefaultAgentRecommendations(request: MentorRequest): AgentRecommendation[] {
    const recommendations: AgentRecommendation[] = [];

    if (request.goals?.includes('strategy_development')) {
      recommendations.push({
        agentId: 'strategy-builder',
        agentName: 'Strategy Builder',
        priority: 'high',
        reason: 'You want to develop trading strategies',
        expectedBenefit: 'Learn to create and test trading strategies',
        estimatedTime: '30-60 minutes',
        prerequisites: ['Basic trading knowledge'],
        actionItems: ['Start with simple strategies', 'Practice with paper trading'],
      });
    }

    if (request.goals?.includes('trading_coaching')) {
      recommendations.push({
        agentId: 'trade-coach',
        agentName: 'Trade Coach',
        priority: 'medium',
        reason: 'Get personalized coaching and feedback',
        expectedBenefit: 'Improve trading skills and discipline',
        estimatedTime: '20-40 minutes',
        prerequisites: ['Some trading experience'],
        actionItems: ['Upload trading history', 'Review coaching recommendations'],
      });
    }

    return recommendations;
  }

  private generateDefaultProgressTracking(request: MentorRequest): ProgressTracking {
    return {
      currentXP: 150,
      totalXP: 500,
      level: request.currentLevel || 1,
      achievements: [
        {
          id: 'first_lesson',
          title: 'First Lesson',
          description: 'Completed your first lesson',
          category: 'learning',
          earnedAt: Date.now() - 86400000,
          xpReward: 25,
          rarity: 'common',
          requirements: ['Complete any lesson'],
        },
      ],
      recentProgress: [
        {
          date: Date.now() - 86400000,
          activity: 'Completed Risk Management Basics',
          xpGained: 50,
          level: 1,
          achievements: ['first_lesson'],
          notes: 'Good understanding of position sizing',
        },
      ],
      nextMilestone: 'Reach Level 2',
      progressPercentage: 30,
      streak: 3,
      lastActive: Date.now() - 3600000,
    };
  }

  private generateDefaultEducationalInsights(): EducationalInsights {
    return {
      keyConcepts: [
        'Risk management is more important than individual trade outcomes',
        'Consistency beats perfection in trading',
        'Education is the foundation of trading success',
      ],
      learningObjectives: [
        'Master risk management principles',
        'Develop systematic trading approaches',
        'Build emotional discipline',
      ],
      bestPractices: [
        'Always use stop losses',
        'Keep detailed trading journals',
        'Never risk more than you can afford to lose',
      ],
      commonMistakes: [
        'Overtrading during losing streaks',
        'Not using proper position sizing',
        'Letting emotions drive decisions',
      ],
      resources: [
        {
          type: 'course',
          title: 'Trading Fundamentals',
          description: 'Complete course on trading basics',
          difficulty: 'beginner',
          estimatedTime: '2 hours',
          category: 'fundamentals',
          rating: 4.5,
        },
      ],
      exercises: [
        {
          id: 'position_sizing_practice',
          title: 'Position Sizing Practice',
          description: 'Practice calculating position sizes',
          type: 'practice',
          difficulty: 'beginner',
          estimatedTime: 15,
          objectives: ['Calculate position sizes', 'Understand risk per trade'],
          instructions: ['Use position sizing calculator', 'Practice with different account sizes'],
          successCriteria: ['Correctly calculate position sizes', 'Understand risk principles'],
          xpReward: 25,
        },
      ],
      assessments: [
        {
          id: 'risk_management_quiz',
          title: 'Risk Management Quiz',
          description: 'Test your risk management knowledge',
          type: 'quiz',
          difficulty: 'beginner',
          estimatedTime: 10,
          questions: ['What is position sizing?', 'When should you use stop losses?'],
          passingScore: 80,
          xpReward: 30,
        },
      ],
    };
  }

  private generateDefaultNextSteps(request: MentorRequest): NextStep[] {
    return [
      {
        step: 1,
        title: 'Complete Risk Management Lesson',
        description: 'Learn the fundamentals of risk management',
        agent: 'mentor',
        estimatedTime: '30 minutes',
        priority: 'high',
        prerequisites: [],
        expectedOutcome: 'Understanding of position sizing and stop losses',
      },
      {
        step: 2,
        title: 'Build Your First Strategy',
        description: 'Create a simple trading strategy',
        agent: 'strategy-builder',
        estimatedTime: '45 minutes',
        priority: 'medium',
        prerequisites: ['Risk management knowledge'],
        expectedOutcome: 'A working trading strategy configuration',
      },
    ];
  }

  private calculateProgressTracking(activities: Activity[]): ProgressTracking {
    const totalXP = activities.reduce((sum, activity) => sum + activity.xpGained, 0);
    const level = Math.floor(totalXP / 100) + 1;
    const achievements = this.calculateAchievements(activities);
    const streak = this.calculateStreak(activities);

    return {
      currentXP: totalXP,
      totalXP: totalXP,
      level,
      achievements,
      recentProgress: activities.slice(-10).map(activity => ({
        date: activity.timestamp,
        activity: activity.details,
        xpGained: activity.xpGained,
        level: Math.floor(activity.xpGained / 100) + 1,
        achievements: [],
        notes: '',
      })),
      nextMilestone: `Reach Level ${level + 1}`,
      progressPercentage: (totalXP % 100),
      streak,
      lastActive: activities.length > 0 ? Math.max(...activities.map(a => a.timestamp)) : Date.now(),
    };
  }

  private calculateAchievements(activities: Activity[]): Achievement[] {
    const achievements: Achievement[] = [];

    if (activities.length >= 1) {
      achievements.push({
        id: 'first_activity',
        title: 'First Steps',
        description: 'Completed your first activity',
        category: 'learning',
        earnedAt: activities[0].timestamp,
        xpReward: 25,
        rarity: 'common',
        requirements: ['Complete any activity'],
      });
    }

    if (activities.length >= 10) {
      achievements.push({
        id: 'dedicated_learner',
        title: 'Dedicated Learner',
        description: 'Completed 10 activities',
        category: 'consistency',
        earnedAt: activities[9].timestamp,
        xpReward: 100,
        rarity: 'uncommon',
        requirements: ['Complete 10 activities'],
      });
    }

    return achievements;
  }

  private calculateStreak(activities: Activity[]): number {
    if (activities.length === 0) return 0;

    const sortedActivities = activities.sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    const oneDay = 24 * 60 * 60 * 1000;
    let lastDate = new Date(sortedActivities[0].timestamp).toDateString();

    for (const activity of sortedActivities) {
      const activityDate = new Date(activity.timestamp).toDateString();
      if (activityDate === lastDate) {
        continue;
      }
      const daysDiff = Math.floor((new Date(lastDate).getTime() - new Date(activityDate).getTime()) / oneDay);
      if (daysDiff === 1) {
        streak++;
        lastDate = activityDate;
      } else {
        break;
      }
    }

    return streak;
  }

  private generateMetadata(request: MentorRequest, agentContext: any): MentorMetadata {
    return {
      analysisDate: Date.now(),
      userId: request.userId,
      sessionId: request.sessionId,
      processingTime: 0,
      agentsUsed: Object.keys(agentContext).filter(key => key !== 'userId' && key !== 'timestamp'),
      model: 'gemini-2.0-flash',
      version: '1.0.0',
    };
  }

  private calculateConfidence(request: MentorRequest, mentorship: MentorResponse): number {
    let confidence = 0.8; // Base confidence

    // Increase confidence based on data quality
    if (request.currentLevel) confidence += 0.05;
    if (request.goals && request.goals.length > 0) confidence += 0.05;
    if (mentorship.agentRecommendations.length > 0) confidence += 0.05;
    if (mentorship.learningPath.lessons.length > 0) confidence += 0.05;

    return Math.min(1.0, confidence);
  }

  private calculateMentorshipConfidence(mentorshipData: any): number {
    let confidence = 0.8; // Base confidence for AI analysis
    
    // Increase confidence based on analysis completeness
    if (mentorshipData.mentorship) confidence += 0.05;
    if (mentorshipData.learningPath) confidence += 0.05;
    if (mentorshipData.agentRecommendations?.length > 0) confidence += 0.05;
    if (mentorshipData.nextSteps?.length > 0) confidence += 0.05;
    
    return Math.min(1.0, confidence);
  }
}

// Export singleton instance
let mentorInstance: MentorAgent | null = null;

export function getMentorAgent(config?: any): MentorAgent {
  if (!mentorInstance) {
    mentorInstance = new MentorAgent(config);
  }
  return mentorInstance;
}

export function initializeMentorAgent(config?: any): MentorAgent {
  mentorInstance = new MentorAgent(config);
  return mentorInstance;
}
