/**
 * Mentor Agent Prompts
 * 
 * This module contains all prompt templates and system instructions used by the
 * Mentor Agent for comprehensive guidance and orchestration.
 */

// System instruction for the Mentor Agent
export function getSystemInstruction(): string {
  return `You are the Master Mentor for AlgoMentor AI, the ultimate trading education platform. You orchestrate all other AI agents and provide comprehensive, personalized guidance to help traders achieve their goals.

Your role is to be the wise, experienced mentor who:

1. ORCHESTRATES AGENTS: Coordinates Strategy Builder, Backtest Analyst, Trade Coach, and News Sentiment agents
2. PROVIDES GUIDANCE: Offers personalized mentorship based on individual needs and goals
3. MANAGES LEARNING: Creates customized learning paths and tracks progress
4. OFFERS WISDOM: Shares insights from years of trading experience
5. MOTIVATES LEARNERS: Encourages and supports traders on their journey

Key principles:
- Be supportive, encouraging, and wise
- Provide personalized guidance based on individual needs
- Focus on long-term development and sustainable success
- Balance challenge with support
- Always prioritize risk management and education
- Help traders build confidence through knowledge

You are the guiding light that helps traders navigate their journey from beginner to expert, always keeping their best interests and long-term success in mind.`;
}

// Main mentorship prompt
export function buildMentorshipPrompt(request: any, agentContext: any): string {
  return `Provide comprehensive mentorship guidance for this trader:

USER REQUEST:
${JSON.stringify(request, null, 2)}

AGENT CONTEXT:
${JSON.stringify(agentContext, null, 2)}

Please provide comprehensive mentorship covering:

1. OVERALL ASSESSMENT:
   - Performance grade (A+ to F)
   - Executive summary of current state
   - Key strengths and areas for improvement
   - Overall score (0-100)
   - Trend direction and key insights

2. MENTORSHIP GUIDANCE:
   - Personalized strengths to build upon
   - Specific improvement areas to focus on
   - Actionable recommendations
   - Encouragement and motivation
   - Important warnings and cautions
   - Focus areas with priorities

3. LEARNING PATH:
   - Current level assessment
   - Target level and timeline
   - Structured lessons and milestones
   - Prerequisites and dependencies
   - Estimated time commitment
   - Difficulty progression

4. AGENT RECOMMENDATIONS:
   - Which agents to use and when
   - Priority levels for each agent
   - Expected benefits from each agent
   - Time estimates and prerequisites
   - Specific action items for each agent

5. PROGRESS TRACKING:
   - Current XP and level
   - Recent achievements and progress
   - Next milestone to work toward
   - Progress percentage and streak
   - Motivation and encouragement

6. EDUCATIONAL INSIGHTS:
   - Key concepts to master
   - Learning objectives and goals
   - Best practices to follow
   - Common mistakes to avoid
   - Recommended resources and exercises
   - Assessment opportunities

7. NEXT STEPS:
   - Immediate action items
   - Short-term goals (1-2 weeks)
   - Medium-term objectives (1-3 months)
   - Long-term vision (6+ months)
   - Priority levels and timelines

Respond with a comprehensive JSON object containing all mentorship components. Be encouraging, specific, and actionable in your guidance. Focus on helping the trader achieve sustainable success through proper education and risk management.`;
}

// Learning path generation prompt
export function buildLearningPathPrompt(userId: string, currentLevel: number, goals: string[]): string {
  return `Create a personalized learning path for this trader:

USER ID: ${userId}
CURRENT LEVEL: ${currentLevel}
GOALS: ${goals.join(', ')}

Design a comprehensive learning path covering:

1. LEARNING PATH STRUCTURE:
   - Current level and target level
   - Estimated timeline and time commitment
   - Difficulty progression (beginner/intermediate/advanced)
   - Overall progress percentage

2. LESSONS:
   - Structured lessons with clear objectives
   - Lesson types (concept/practice/assessment/project)
   - Difficulty levels and prerequisites
   - Estimated time for each lesson
   - XP rewards and completion criteria

3. MILESTONES:
   - Key milestones to achieve
   - Level requirements and rewards
   - Achievement criteria
   - XP rewards and benefits

4. PREREQUISITES:
   - Required knowledge and skills
   - Dependencies between lessons
   - Recommended preparation
   - Foundation requirements

5. PROGRESSION:
   - Logical learning sequence
   - Skill building progression
   - Knowledge reinforcement
   - Practical application opportunities

Respond with a detailed JSON object containing a complete learning path tailored to the user's current level and goals.`;
}

// Agent recommendations prompt
export function buildAgentRecommendationsPrompt(userId: string, context: any): string {
  return `Generate personalized agent recommendations for this trader:

USER ID: ${userId}
USER CONTEXT:
${JSON.stringify(context, null, 2)}

Available Agents:
- Strategy Builder: Creates trading strategies from natural language
- Backtest Analyst: Analyzes backtest results and provides insights
- Trade Coach: Provides personalized coaching and behavioral analysis
- News Sentiment: Analyzes news and market sentiment

Provide recommendations covering:

1. AGENT RECOMMENDATIONS:
   - Which agents to use based on user needs
   - Priority levels (high/medium/low) for each agent
   - Specific reasons for each recommendation
   - Expected benefits and outcomes
   - Time estimates for engagement

2. IMPLEMENTATION GUIDANCE:
   - Prerequisites for each agent
   - Specific action items for each agent
   - Recommended sequence of agent usage
   - Integration between agents

3. PERSONALIZATION:
   - Tailored to user's experience level
   - Aligned with user's goals and preferences
   - Considered user's time availability
   - Matched to user's learning style

4. EXPECTED OUTCOMES:
   - What the user will learn from each agent
   - Skills they will develop
   - Knowledge they will gain
   - Progress they will make

Respond with a JSON array of agent recommendations, each containing specific guidance for the user.`;
}

// Progress tracking prompt
export function buildProgressTrackingPrompt(userId: string, activities: any[]): string {
  return `Analyze progress and generate tracking insights for this trader:

USER ID: ${userId}
ACTIVITIES:
${JSON.stringify(activities, null, 2)}

Provide comprehensive progress tracking covering:

1. CURRENT STATUS:
   - Current XP and total XP
   - Current level and progress to next level
   - Recent activity summary
   - Learning streak and consistency

2. ACHIEVEMENTS:
   - Achievements earned and their significance
   - XP rewards and level progression
   - Milestones reached
   - Recognition of accomplishments

3. RECENT PROGRESS:
   - Recent activities and their impact
   - XP gained and level changes
   - New achievements unlocked
   - Progress notes and observations

4. NEXT MILESTONE:
   - Next milestone to work toward
   - Requirements and criteria
   - Estimated time to achieve
   - Motivation and encouragement

5. PROGRESS ANALYSIS:
   - Progress percentage and trajectory
   - Consistency and engagement patterns
   - Areas of strength and improvement
   - Recommendations for continued progress

Respond with a detailed JSON object containing comprehensive progress tracking and motivation.`;
}

// Educational content prompt
export function buildEducationalPrompt(mentorshipData: any, analysisType: string): string {
  return `Generate educational content for this mentorship analysis:

MENTORSHIP DATA:
${JSON.stringify(mentorshipData, null, 2)}

ANALYSIS TYPE: ${analysisType}

Create educational content covering:

1. KEY CONCEPTS:
   - Important trading concepts to master
   - Risk management principles
   - Strategy development fundamentals
   - Market analysis techniques

2. LEARNING OBJECTIVES:
   - What the trader should learn
   - Skills to develop
   - Knowledge to acquire
   - Behaviors to change

3. BEST PRACTICES:
   - Proven trading practices
   - Risk management techniques
   - Learning strategies
   - Success habits

4. COMMON MISTAKES:
   - Mistakes to avoid
   - Pitfalls to watch for
   - Warning signs to recognize
   - Prevention strategies

5. RESOURCES AND EXERCISES:
   - Recommended learning resources
   - Practical exercises to complete
   - Assessment opportunities
   - Practice scenarios

6. CASE STUDIES:
   - Real-world examples
   - Success stories
   - Learning opportunities
   - Practical applications

Make the content educational, practical, and suitable for traders at different experience levels.`;
}

// Motivation and encouragement prompt
export function buildMotivationPrompt(progress: any, achievements: any[]): string {
  return `Provide motivation and encouragement based on this progress:

PROGRESS DATA:
${JSON.stringify(progress, null, 2)}

ACHIEVEMENTS:
${JSON.stringify(achievements, null, 2)}

Create motivational content covering:

1. CELEBRATION:
   - Acknowledge achievements and progress
   - Recognize effort and dedication
   - Highlight positive developments
   - Celebrate milestones reached

2. ENCOURAGEMENT:
   - Positive reinforcement
   - Confidence building
   - Motivation for continued learning
   - Recognition of growth

3. INSPIRATION:
   - Success stories and examples
   - Learning from challenges
   - Persistence and resilience
   - Long-term perspective

4. GUIDANCE:
   - Constructive feedback
   - Areas for continued improvement
   - Next steps and goals
   - Support and resources

5. MOTIVATION:
   - Reasons to stay motivated
   - Benefits of continued learning
   - Future possibilities
   - Personal growth opportunities

Be encouraging, supportive, and motivating while maintaining honesty about areas for improvement. Focus on building confidence and maintaining momentum.`;
}

// Risk assessment prompt
export function buildRiskAssessmentPrompt(userProfile: any, tradingHistory: any[]): string {
  return `Assess trading risks and provide guidance for this trader:

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

TRADING HISTORY:
${JSON.stringify(tradingHistory, null, 2)}

Provide comprehensive risk assessment covering:

1. RISK PROFILE:
   - Risk tolerance assessment
   - Risk capacity evaluation
   - Risk behavior analysis
   - Risk management gaps

2. TRADING RISKS:
   - Position sizing risks
   - Risk management issues
   - Emotional trading risks
   - Strategy risks

3. LEARNING RISKS:
   - Knowledge gaps
   - Skill deficiencies
   - Overconfidence risks
   - Underconfidence issues

4. MITIGATION STRATEGIES:
   - Risk reduction techniques
   - Education priorities
   - Practice recommendations
   - Monitoring requirements

5. SAFETY GUIDELINES:
   - Risk management rules
   - Position sizing guidelines
   - Stop loss requirements
   - Portfolio limits

Respond with a detailed JSON object focusing on risk assessment and safety guidance.`;
}

// Goal setting prompt
export function buildGoalSettingPrompt(userId: string, preferences: any, currentLevel: number): string {
  return `Help set appropriate goals for this trader:

USER ID: ${userId}
CURRENT LEVEL: ${currentLevel}
PREFERENCES:
${JSON.stringify(preferences, null, 2)}

Create goal-setting guidance covering:

1. GOAL CATEGORIES:
   - Learning goals
   - Trading goals
   - Skill development goals
   - Risk management goals

2. GOAL SETTING PRINCIPLES:
   - SMART goal criteria
   - Realistic expectations
   - Progressive difficulty
   - Measurable outcomes

3. SPECIFIC GOALS:
   - Short-term goals (1-4 weeks)
   - Medium-term goals (1-3 months)
   - Long-term goals (3-12 months)
   - Ultimate vision

4. GOAL TRACKING:
   - Progress measurement
   - Milestone identification
   - Success criteria
   - Adjustment strategies

5. MOTIVATION:
   - Goal alignment with values
   - Personal relevance
   - Achievement rewards
   - Progress celebration

Respond with a comprehensive JSON object containing specific, achievable goals tailored to the user's level and preferences.`;
}

// Export all prompts for easy access
export const prompts = {
  getSystemInstruction,
  buildMentorshipPrompt,
  buildLearningPathPrompt,
  buildAgentRecommendationsPrompt,
  buildProgressTrackingPrompt,
  buildEducationalPrompt,
  buildMotivationPrompt,
  buildRiskAssessmentPrompt,
  buildGoalSettingPrompt,
};
