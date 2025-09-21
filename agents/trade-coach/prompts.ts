/**
 * Trade Coach Agent Prompts
 * 
 * This module contains all prompt templates and system instructions used by the
 * Trade Coach Agent for personalized trading coaching and behavioral analysis.
 */

// System instruction for the Trade Coach Agent
export function getSystemInstruction(): string {
  return `You are an expert trading coach and behavioral analyst for AlgoMentor AI, specializing in personalized trading education and performance improvement.

Your role is to provide comprehensive coaching that helps traders improve their skills, manage emotions, and develop better trading habits through:

1. Behavioral Analysis: Identify trading patterns, emotional triggers, and discipline issues
2. Performance Assessment: Analyze trading results and identify improvement areas
3. Risk Management: Evaluate risk-taking behavior and provide mitigation strategies
4. Educational Guidance: Provide actionable insights and learning recommendations
5. Progress Tracking: Monitor improvement and celebrate achievements

Key principles:
- Be supportive but honest in your feedback
- Focus on actionable, specific recommendations
- Consider both technical and psychological aspects
- Provide educational context for all suggestions
- Encourage continuous learning and improvement

Always provide constructive, personalized advice that helps traders become more successful and disciplined.`;
}

// Main coaching analysis prompt
export function buildCoachingPrompt(trades: any[], request: any): string {
  return `Analyze the following trading history and provide comprehensive coaching advice:

TRADING HISTORY:
${JSON.stringify(trades, null, 2)}

REQUEST OPTIONS:
${JSON.stringify(request.options || {}, null, 2)}

TIMEFRAME: ${request.timeframe || 'all'}

Please provide a comprehensive coaching analysis covering:

1. OVERALL ASSESSMENT:
   - Performance grade (A+ to F)
   - Executive summary of trading performance
   - Key strengths and areas for improvement
   - Overall score (0-100)

2. BEHAVIORAL ANALYSIS:
   - Trading patterns and habits identified
   - Emotional indicators and triggers
   - Discipline score (0-100)
   - Consistency score (0-100)
   - Risk tolerance assessment
   - Trading style classification

3. RISK ASSESSMENT:
   - Overall risk score (0-100)
   - Position sizing analysis
   - Risk management evaluation
   - Drawdown analysis
   - Risk factors and mitigation strategies

4. PERFORMANCE ANALYSIS:
   - Win rate and profit factor
   - Average win/loss analysis
   - Expectancy and Sharpe ratio
   - Maximum drawdown and recovery
   - Trade frequency and holding periods

5. COACHING RECOMMENDATIONS:
   - Specific improvement areas with priority levels
   - Actionable steps for each recommendation
   - Expected impact and difficulty level
   - Time estimates for implementation

6. EDUCATIONAL INSIGHTS:
   - Key learnings from the analysis
   - Common mistakes to avoid
   - Best practices demonstrated
   - Next steps for improvement
   - Related concepts to study
   - Recommended resources

7. PROGRESS TRACKING:
   - Current skill level assessment
   - XP and achievements earned
   - Milestones reached
   - Next milestone to work toward
   - Progress percentage

Respond with a comprehensive JSON object containing all analysis components. Be specific, actionable, and educational in your recommendations. Focus on helping the trader improve their skills and develop better trading habits.`;
}

// Behavioral analysis specific prompt
export function buildBehavioralAnalysisPrompt(trades: any[]): string {
  return `Conduct a detailed behavioral analysis of the following trading history:

TRADING HISTORY:
${JSON.stringify(trades, null, 2)}

Focus specifically on behavioral patterns:

1. TRADING PATTERNS:
   - Frequency and timing patterns
   - Position sizing consistency
   - Entry and exit behaviors
   - Market condition responses

2. EMOTIONAL INDICATORS:
   - Fear-based decisions (premature exits, avoiding trades)
   - Greed-based decisions (overtrading, holding too long)
   - Frustration responses (revenge trading, abandoning strategy)
   - Overconfidence indicators (increasing position sizes, ignoring risk)

3. DISCIPLINE ASSESSMENT:
   - Adherence to trading plan
   - Risk management consistency
   - Emotional control during losses
   - Patience and waiting for setups

4. TRADING STYLE IDENTIFICATION:
   - Scalping vs day trading vs swing trading
   - Aggressive vs conservative approach
   - Technical vs fundamental focus
   - Momentum vs contrarian tendencies

5. BEHAVIORAL RECOMMENDATIONS:
   - Specific habits to develop
   - Emotional triggers to manage
   - Discipline improvements needed
   - Mindset adjustments required

Respond with a detailed JSON object focusing on behavioral analysis and improvement strategies.`;
}

// Risk assessment specific prompt
export function buildRiskAssessmentPrompt(trades: any[]): string {
  return `Analyze the risk management behavior in the following trading history:

TRADING HISTORY:
${JSON.stringify(trades, null, 2)}

Focus specifically on risk assessment:

1. POSITION SIZING ANALYSIS:
   - Consistency in position sizes
   - Appropriateness relative to account size
   - Risk per trade assessment
   - Position sizing issues identified

2. RISK MANAGEMENT EVALUATION:
   - Stop loss usage and effectiveness
   - Take profit implementation
   - Risk-reward ratio analysis
   - Risk management gaps

3. DRAWDOWN ANALYSIS:
   - Maximum drawdown periods
   - Recovery time analysis
   - Drawdown frequency
   - Severity assessment

4. RISK FACTORS:
   - Concentration risk
   - Correlation risk
   - Market timing risk
   - Emotional risk factors

5. RISK MITIGATION STRATEGIES:
   - Specific risk management improvements
   - Position sizing recommendations
   - Stop loss optimization
   - Portfolio diversification suggestions

Respond with a detailed JSON object focusing on risk assessment and mitigation strategies.`;
}

// Progress tracking prompt
export function buildProgressTrackingPrompt(trades: any[], userId?: string): string {
  return `Generate progress tracking and achievement analysis for this trading history:

TRADING HISTORY:
${JSON.stringify(trades, null, 2)}

USER ID: ${userId || 'anonymous'}

Create a comprehensive progress tracking analysis:

1. SKILL LEVEL ASSESSMENT:
   - Current trading level (1-20)
   - Skills demonstrated
   - Areas of competence
   - Development needs

2. XP AND ACHIEVEMENTS:
   - XP gained from trades
   - Achievements unlocked
   - Milestones reached
   - Progress indicators

3. LEARNING PROGRESS:
   - Concepts mastered
   - Skills improved
   - Knowledge gaps identified
   - Learning trajectory

4. NEXT MILESTONES:
   - Upcoming achievements
   - Skills to develop next
   - Goals to work toward
   - Progress requirements

5. MOTIVATIONAL ELEMENTS:
   - Strengths to celebrate
   - Progress to acknowledge
   - Encouragement for continued learning
   - Positive reinforcement

Respond with a detailed JSON object focusing on progress tracking and motivation.`;
}

// Coaching recommendations prompt
export function buildCoachingRecommendationsPrompt(trades: any[], focusAreas?: string[]): string {
  return `Generate specific coaching recommendations based on this trading history:

TRADING HISTORY:
${JSON.stringify(trades, null, 2)}

FOCUS AREAS: ${focusAreas ? focusAreas.join(', ') : 'comprehensive'}

Provide detailed coaching recommendations:

1. HIGH PRIORITY RECOMMENDATIONS:
   - Most critical improvements needed
   - Immediate action items
   - High-impact changes
   - Quick wins available

2. MEDIUM PRIORITY RECOMMENDATIONS:
   - Important but not urgent improvements
   - Skill development areas
   - Process enhancements
   - Medium-term goals

3. LOW PRIORITY RECOMMENDATIONS:
   - Nice-to-have improvements
   - Advanced techniques
   - Long-term development
   - Optional enhancements

For each recommendation, provide:
- Clear title and description
- Specific action steps
- Expected impact and benefits
- Difficulty level and time estimate
- Implementation guidance
- Success metrics

4. IMPLEMENTATION PLAN:
   - Recommended order of implementation
   - Dependencies between recommendations
   - Timeline suggestions
   - Progress tracking methods

Respond with a detailed JSON object containing specific, actionable coaching recommendations.`;
}

// Educational content prompt
export function buildEducationalPrompt(trades: any[], analysisType: string): string {
  return `Generate educational content for this trading analysis:

TRADING HISTORY:
${JSON.stringify(trades, null, 2)}

ANALYSIS TYPE: ${analysisType}

Create educational content covering:

1. KEY CONCEPTS DEMONSTRATED:
   - Trading concepts shown in the data
   - Risk management principles
   - Behavioral patterns
   - Performance metrics

2. LEARNING OBJECTIVES:
   - What the trader should learn
   - Skills to develop
   - Knowledge to acquire
   - Behaviors to change

3. PRACTICAL APPLICATIONS:
   - How to apply the concepts
   - Real-world implementation
   - Common pitfalls to avoid
   - Best practices to follow

4. NEXT STEPS:
   - Recommended learning path
   - Skills to practice
   - Resources to study
   - Exercises to complete

5. RELATED CONCEPTS:
   - Advanced topics to explore
   - Complementary skills
   - Industry best practices
   - Professional development

Make the content educational, practical, and suitable for traders at different experience levels.`;
}

// Motivational coaching prompt
export function buildMotivationalPrompt(trades: any[], performance: any): string {
  return `Provide motivational coaching based on this trading performance:

TRADING HISTORY:
${JSON.stringify(trades, null, 2)}

PERFORMANCE SUMMARY:
${JSON.stringify(performance, null, 2)}

Create motivational coaching content:

1. STRENGTHS TO CELEBRATE:
   - Positive aspects of trading
   - Skills demonstrated
   - Improvements made
   - Achievements earned

2. ENCOURAGEMENT AND SUPPORT:
   - Positive reinforcement
   - Confidence building
   - Motivation for continued learning
   - Recognition of effort

3. CONSTRUCTIVE FEEDBACK:
   - Honest but supportive assessment
   - Areas for improvement
   - Growth opportunities
   - Development potential

4. INSPIRATIONAL GUIDANCE:
   - Success stories and examples
   - Learning from setbacks
   - Persistence and resilience
   - Long-term perspective

5. ACTIONABLE MOTIVATION:
   - Specific goals to work toward
   - Reasons to stay motivated
   - Progress to build upon
   - Future possibilities

Be encouraging, supportive, and motivating while maintaining honesty about areas for improvement.`;
}

// Export all prompts for easy access
export const prompts = {
  getSystemInstruction,
  buildCoachingPrompt,
  buildBehavioralAnalysisPrompt,
  buildRiskAssessmentPrompt,
  buildProgressTrackingPrompt,
  buildCoachingRecommendationsPrompt,
  buildEducationalPrompt,
  buildMotivationalPrompt,
};
