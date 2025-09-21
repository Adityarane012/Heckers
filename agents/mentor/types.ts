/**
 * Mentor Agent Types
 * 
 * This module defines all TypeScript interfaces and types specific to the
 * Mentor Agent functionality.
 */

// Request types
export interface MentorRequest {
  userId: string;
  sessionId?: string;
  currentLevel?: number;
  goals?: string[];
  preferences?: UserPreferences;
  context?: UserContext;
  options?: MentorOptions;
}

export interface MentorOptions {
  includeLearningPath?: boolean;
  includeAgentRecommendations?: boolean;
  includeProgressTracking?: boolean;
  includeEducationalContent?: boolean;
  includeRiskAssessment?: boolean;
  includeGoalSetting?: boolean;
  coachingStyle?: 'supportive' | 'direct' | 'analytical' | 'motivational';
  focusAreas?: string[];
  timeHorizon?: 'short' | 'medium' | 'long';
}

// Response types
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

export interface MentorMetadata {
  analysisDate: number;
  userId: string;
  sessionId?: string;
  processingTime: number;
  agentsUsed: string[];
  model: string;
  version: string;
  lastUpdated?: number;
  nextUpdate?: number;
}

// User profile types
export interface UserPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeCommitment: 'low' | 'medium' | 'high' | 'intensive';
  focusAreas: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive';
  tradingStyle: 'scalper' | 'day_trader' | 'swing_trader' | 'position_trader' | 'mixed';
  preferredMarkets: string[];
  availableTime: TimeAvailability;
  learningGoals: string[];
  motivation: string[];
}

export interface TimeAvailability {
  daily: number; // minutes per day
  weekly: number; // minutes per week
  preferredTimes: string[];
  timezone: string;
  flexibility: 'low' | 'medium' | 'high';
}

export interface UserContext {
  recentActivity: Activity[];
  currentGoals: string[];
  challenges: string[];
  successes: string[];
  timeAvailable: number; // minutes per day
  learningStreak: number;
  lastSession: number;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
  behavior: BehaviorMetrics;
}

export interface Activity {
  id: string;
  type: 'strategy_built' | 'backtest_analyzed' | 'coaching_received' | 'news_analyzed' | 'lesson_completed' | 'assessment_taken' | 'exercise_completed';
  timestamp: number;
  details: string;
  xpGained: number;
  agent: string;
  duration: number; // minutes
  success: boolean;
  feedback?: string;
}

export interface EngagementMetrics {
  sessionFrequency: number; // sessions per week
  averageSessionDuration: number; // minutes
  completionRate: number; // 0-1
  returnRate: number; // 0-1
  interactionLevel: 'low' | 'medium' | 'high';
  preferredContent: string[];
  activeTime: string[];
}

export interface PerformanceMetrics {
  overallScore: number; // 0-100
  improvementRate: number; // percentage per month
  consistency: number; // 0-1
  mastery: number; // 0-1
  speed: number; // 0-1
  accuracy: number; // 0-1
  retention: number; // 0-1
}

export interface BehaviorMetrics {
  riskTaking: number; // 0-1
  patience: number; // 0-1
  discipline: number; // 0-1
  curiosity: number; // 0-1
  persistence: number; // 0-1
  adaptability: number; // 0-1
  confidence: number; // 0-1
}

// Mentorship types
export interface Mentorship {
  overallAssessment: OverallAssessment;
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  encouragement: string;
  warnings: string[];
  focusAreas: FocusArea[];
  personality: PersonalityProfile;
  motivation: MotivationProfile;
  challenges: Challenge[];
  opportunities: Opportunity[];
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
  comparison: ComparisonData;
  trajectory: TrajectoryData;
}

export interface ComparisonData {
  peerGroup: string;
  percentile: number; // 0-100
  relativeStrengths: string[];
  relativeWeaknesses: string[];
  benchmark: number; // 0-100
}

export interface TrajectoryData {
  direction: 'upward' | 'downward' | 'stable';
  velocity: number; // rate of change
  acceleration: number; // rate of acceleration
  projectedOutcome: string;
  confidence: number; // 0-1
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
  timeline: string;
  successCriteria: string[];
  challenges: string[];
}

export interface PersonalityProfile {
  traits: PersonalityTrait[];
  learningStyle: string;
  communicationStyle: string;
  motivationStyle: string;
  riskProfile: string;
  decisionStyle: string;
}

export interface PersonalityTrait {
  trait: string;
  score: number; // 0-1
  description: string;
  implications: string[];
  recommendations: string[];
}

export interface MotivationProfile {
  primaryMotivators: string[];
  secondaryMotivators: string[];
  demotivators: string[];
  rewardPreferences: string[];
  challengePreferences: string[];
  supportNeeds: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact: string[];
  causes: string[];
  solutions: string[];
  timeline: string;
  resources: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  potential: 'low' | 'medium' | 'high';
  benefits: string[];
  requirements: string[];
  timeline: string;
  resources: string[];
  risks: string[];
}

// Learning path types
export interface LearningPath {
  id: string;
  currentLevel: number;
  targetLevel: number;
  lessons: Lesson[];
  milestones: Milestone[];
  prerequisites: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100
  personalized: boolean;
  adaptive: boolean;
  version: string;
  lastUpdated: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'practice' | 'assessment' | 'project' | 'simulation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  prerequisites: string[];
  objectives: string[];
  content: string;
  exercises: string[];
  completed: boolean;
  xpReward: number;
  category: string;
  tags: string[];
  resources: LessonResource[];
  assessments: string[];
  feedback: string[];
}

export interface LessonResource {
  type: 'video' | 'article' | 'interactive' | 'tool' | 'template';
  title: string;
  url: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  required: boolean;
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
  category: string;
  significance: 'minor' | 'major' | 'major';
  celebration: string;
}

// Agent recommendation types
export interface AgentRecommendation {
  agentId: string;
  agentName: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  expectedBenefit: string;
  estimatedTime: string;
  prerequisites: string[];
  actionItems: string[];
  integration: AgentIntegration;
  customization: AgentCustomization;
  monitoring: AgentMonitoring;
}

export interface AgentIntegration {
  withAgents: string[];
  sequence: number;
  dependencies: string[];
  dataSharing: string[];
  workflow: string[];
}

export interface AgentCustomization {
  settings: Record<string, any>;
  preferences: Record<string, any>;
  adaptations: string[];
  personalization: string[];
}

export interface AgentMonitoring {
  metrics: string[];
  frequency: string;
  alerts: string[];
  reporting: string[];
}

// Progress tracking types
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
  statistics: ProgressStatistics;
  trends: ProgressTrend[];
  predictions: ProgressPrediction;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'trading' | 'consistency' | 'mastery' | 'social' | 'special';
  earnedAt: number;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
  display: AchievementDisplay;
  social: AchievementSocial;
}

export interface AchievementDisplay {
  icon: string;
  color: string;
  animation: string;
  badge: string;
  title: string;
}

export interface AchievementSocial {
  shareable: boolean;
  public: boolean;
  celebration: string;
  community: string;
}

export interface ProgressEntry {
  date: number;
  activity: string;
  xpGained: number;
  level: number;
  achievements: string[];
  notes: string;
  duration: number;
  quality: number; // 0-1
  satisfaction: number; // 0-1
}

export interface ProgressStatistics {
  totalSessions: number;
  averageSessionDuration: number;
  completionRate: number;
  improvementRate: number;
  consistency: number;
  engagement: number;
  satisfaction: number;
}

export interface ProgressTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  period: string;
  significance: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
}

export interface ProgressPrediction {
  nextLevel: number;
  estimatedTime: string;
  requiredXP: number;
  confidence: number; // 0-1
  factors: string[];
  recommendations: string[];
}

// Educational content types
export interface EducationalInsights {
  keyConcepts: string[];
  learningObjectives: string[];
  bestPractices: string[];
  commonMistakes: string[];
  resources: EducationalResource[];
  exercises: Exercise[];
  assessments: Assessment[];
  caseStudies: CaseStudy[];
  bestPractices: BestPractice[];
  warnings: EducationalWarning[];
}

export interface EducationalResource {
  id: string;
  type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'template' | 'podcast' | 'webinar';
  title: string;
  description: string;
  url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  rating: number; // 0-5
  reviews: number;
  author: string;
  publisher: string;
  language: string;
  cost: 'free' | 'paid' | 'subscription';
  accessibility: string[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'simulation' | 'analysis' | 'creation' | 'reflection' | 'collaboration';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  objectives: string[];
  instructions: string[];
  successCriteria: string[];
  xpReward: number;
  category: string;
  prerequisites: string[];
  materials: string[];
  evaluation: ExerciseEvaluation;
}

export interface ExerciseEvaluation {
  method: 'self' | 'peer' | 'instructor' | 'automated';
  criteria: string[];
  rubric: string[];
  feedback: string[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'practical' | 'analysis' | 'project' | 'portfolio' | 'peer_review';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  questions: AssessmentQuestion[];
  passingScore: number; // 0-100
  xpReward: number;
  attempts: number;
  feedback: AssessmentFeedback;
  certification: boolean;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'practical';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface AssessmentFeedback {
  immediate: boolean;
  detailed: boolean;
  suggestions: boolean;
  resources: boolean;
  encouragement: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  scenario: string;
  outcome: string;
  lessons: string[];
  relevance: number; // 0-1
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  realWorld: boolean;
  anonymized: boolean;
  date: number;
  market: string;
}

export interface BestPractice {
  id: string;
  practice: string;
  description: string;
  benefits: string[];
  implementation: string[];
  examples: string[];
  category: 'analysis' | 'trading' | 'risk_management' | 'monitoring' | 'learning';
  evidence: string[];
  warnings: string[];
  alternatives: string[];
}

export interface EducationalWarning {
  type: 'safety' | 'financial' | 'educational' | 'psychological';
  severity: 'low' | 'medium' | 'high';
  message: string;
  context: string;
  prevention: string[];
  resources: string[];
}

// Next steps types
export interface NextStep {
  id: string;
  step: number;
  title: string;
  description: string;
  agent: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  prerequisites: string[];
  expectedOutcome: string;
  resources: string[];
  successCriteria: string[];
  alternatives: string[];
  timeline: string;
  dependencies: string[];
}

// Error types specific to mentor
export enum MentorErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  MENTORSHIP_FAILED = 'MENTORSHIP_FAILED',
  LEARNING_PATH_FAILED = 'LEARNING_PATH_FAILED',
  AGENT_ORCHESTRATION_FAILED = 'AGENT_ORCHESTRATION_FAILED',
  PROGRESS_TRACKING_FAILED = 'PROGRESS_TRACKING_FAILED',
}

// Configuration types
export interface MentorConfig {
  maxUsersPerSession: number;
  defaultCoachingStyle: string;
  learningPathVersion: string;
  progressTrackingEnabled: boolean;
  agentOrchestrationEnabled: boolean;
  educationalContentEnabled: boolean;
  personalizationEnabled: boolean;
  adaptiveLearningEnabled: boolean;
  socialFeaturesEnabled: boolean;
  gamificationEnabled: boolean;
}

// Export commonly used types
export type {
  MentorRequest,
  MentorResponse,
  MentorOptions,
  UserPreferences,
  UserContext,
  Activity,
  Mentorship,
  LearningPath,
  AgentRecommendation,
  ProgressTracking,
  EducationalInsights,
  NextStep,
  MentorMetadata,
};
