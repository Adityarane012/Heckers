/**
 * Strategy Builder Agent Prompts
 * 
 * This module contains all prompt templates and system instructions used by the
 * Strategy Builder Agent for generating trading strategies from natural language.
 */

// System instruction for the Strategy Builder Agent
export function getSystemInstruction(): string {
  return `You are an expert quantitative trading strategy architect for AlgoMentor AI, a comprehensive educational trading platform.

Your role is to convert natural language trading ideas into structured, executable strategy configurations that can be used for backtesting and live trading.

Key responsibilities:
1. Analyze user input to identify trading concepts and indicators
2. Map concepts to appropriate strategy types from the available options
3. Extract and validate numerical parameters
4. Generate clear, educational explanations
5. Ensure strategies are production-ready and well-documented

Available strategy types:
- smaCross: Simple Moving Average Crossover
- rsiReversion: RSI Mean Reversion
- macd: MACD Signal Line Crossover
- breakout: Price Breakout Strategy
- momentum: Momentum-based Strategy

Always respond with valid JSON in the exact format specified. Be precise, educational, and focus on creating strategies that align with the user's intent.`;
}

// Main strategy building prompt
export function buildStrategyPrompt(userPrompt: string): string {
  return `Convert the following natural language trading idea into an AlgoMentor AI-compatible JSON strategy configuration.

User's trading idea: "${userPrompt}"

Requirements:
1. Analyze the input to identify the core trading concept
2. Select the most appropriate strategy type from: smaCross, rsiReversion, macd, breakout, momentum
3. Extract relevant parameters with sensible default values
4. Provide a clear rationale explaining the strategy logic

Available strategy types and their parameters:
- smaCross: { fastPeriod: number, slowPeriod: number }
- rsiReversion: { period: number, oversold: number, overbought: number }
- macd: { fastEMA: number, slowEMA: number, signalEMA: number }
- breakout: { period: number, multiplier: number }
- momentum: { period: number, threshold: number }

Respond with ONLY a valid JSON object in this exact format:
{
  "type": "strategy_type",
  "params": {
    "parameter_name": value
  },
  "rationale": "Clear explanation of why this strategy fits the user's idea and how it works"
}

Guidelines:
- Use standard parameter names as shown above
- Provide reasonable default values based on common trading practices
- Ensure parameters are within typical ranges (e.g., RSI oversold < overbought)
- Make the rationale educational and clear
- Focus on the user's specific request while maintaining trading best practices`;
}

// Educational content generation prompt
export function buildEducationalPrompt(strategy: any, originalPrompt: string): string {
  return `Generate educational content for a trading strategy that was created from this user prompt: "${originalPrompt}"

Strategy Details:
- Type: ${strategy.type}
- Parameters: ${JSON.stringify(strategy.params, null, 2)}
- Description: ${strategy.description}

Please provide educational content in this format:

Explanation:
[Provide a detailed explanation of how this strategy works, including:
- What indicators or concepts it uses
- How the parameters affect the strategy behavior
- When this strategy typically works well
- What market conditions it's suited for
- How the buy/sell signals are generated]

Summary:
[Provide a concise summary suitable for learning, including:
- Key takeaways about this strategy type
- Important considerations for traders
- How it relates to the user's original idea
- Next steps for further learning]

Make the content educational, accurate, and helpful for someone learning about algorithmic trading.`;
}

// Strategy validation prompt
export function buildValidationPrompt(strategy: any): string {
  return `Review this trading strategy configuration for correctness and best practices:

Strategy:
${JSON.stringify(strategy, null, 2)}

Please analyze and provide feedback on:
1. Parameter validity and ranges
2. Strategy logic consistency
3. Potential issues or improvements
4. Educational value and clarity

Respond with a JSON object containing:
{
  "isValid": boolean,
  "issues": ["list of issues found"],
  "suggestions": ["list of improvement suggestions"],
  "educationalNotes": ["list of educational points"]
}`;
}

// Alternative strategy generation prompt
export function buildAlternativePrompt(userPrompt: string, excludeType?: string): string {
  const excludeText = excludeType ? ` (excluding ${excludeType} which was already generated)` : '';
  
  return `Generate an alternative trading strategy${excludeText} for this user idea: "${userPrompt}"

Consider different approaches such as:
- Different technical indicators
- Alternative parameter values
- Complementary strategies
- Risk management variations

Provide a strategy that offers a different perspective while still addressing the core concept in the user's request.

Respond with ONLY a valid JSON object in this format:
{
  "type": "strategy_type",
  "params": {
    "parameter_name": value
  },
  "rationale": "Explanation of how this alternative approach works and why it's different"
}`;
}

// Strategy optimization prompt
export function buildOptimizationPrompt(strategy: any, backtestResults?: any): string {
  return `Analyze this trading strategy and suggest optimizations:

Current Strategy:
${JSON.stringify(strategy, null, 2)}

${backtestResults ? `Backtest Results:
${JSON.stringify(backtestResults, null, 2)}` : ''}

Please suggest optimizations focusing on:
1. Parameter tuning based on performance
2. Risk management improvements
3. Market condition adaptations
4. Educational value enhancements

Respond with a JSON object:
{
  "optimizations": [
    {
      "type": "parameter|risk|market|educational",
      "description": "What to change",
      "reason": "Why this change helps",
      "implementation": "How to implement"
    }
  ],
  "priority": "high|medium|low",
  "expectedImpact": "description of expected improvement"
}`;
}

// Strategy explanation prompt for complex strategies
export function buildComplexExplanationPrompt(strategy: any): string {
  return `Provide a comprehensive explanation of this trading strategy for educational purposes:

Strategy:
${JSON.stringify(strategy, null, 2)}

Please explain:
1. The underlying trading concept and theory
2. How each parameter affects the strategy
3. Step-by-step signal generation process
4. Risk characteristics and considerations
5. When this strategy works best
6. Common pitfalls and how to avoid them
7. How to monitor and adjust the strategy

Make the explanation suitable for someone learning algorithmic trading, with clear examples and practical insights.`;
}

// Export all prompts for easy access
export const prompts = {
  getSystemInstruction,
  buildStrategyPrompt,
  buildEducationalPrompt,
  buildValidationPrompt,
  buildAlternativePrompt,
  buildOptimizationPrompt,
  buildComplexExplanationPrompt,
};
