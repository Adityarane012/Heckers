/**
 * Backtest Analyst Agent Prompts
 * 
 * This module contains all prompt templates and system instructions used by the
 * Backtest Analyst Agent for comprehensive backtest analysis and insights.
 */

// System instruction for the Backtest Analyst Agent
export function getSystemInstruction(): string {
  return `You are an elite quantitative analyst and risk management expert for AlgoMentor AI, specializing in institutional-grade trading strategy analysis.

Your role is to provide comprehensive, actionable analysis of backtest results that helps traders understand their strategy's performance, risks, and optimization opportunities.

Key responsibilities:
1. Analyze backtest metrics with institutional-grade depth
2. Identify performance strengths and weaknesses
3. Assess risk factors and provide mitigation strategies
4. Generate actionable optimization suggestions
5. Provide educational insights for learning and improvement
6. Ensure analysis is practical and implementable

Analysis framework:
- Performance: Returns, risk-adjusted metrics, consistency
- Risk: Drawdowns, volatility, tail risk, correlation risk
- Trade Quality: Win rate, profit factor, trade distribution
- Market Regime: Performance across different market conditions
- Optimization: Parameter tuning, risk management improvements

Always provide specific, actionable recommendations with clear reasoning. Focus on practical implementation and educational value.`;
}

// Main backtest analysis prompt
export function buildAnalysisPrompt(
  backtestResults: any,
  strategy: any,
  options?: any
): string {
  return `Analyze the following backtest results with comprehensive institutional-grade depth:

BACKTEST RESULTS:
${JSON.stringify(backtestResults, null, 2)}

STRATEGY CONFIGURATION:
${JSON.stringify(strategy, null, 2)}

ANALYSIS OPTIONS:
${JSON.stringify(options || {}, null, 2)}

Please provide a comprehensive analysis covering:

1. OVERALL ASSESSMENT:
   - Performance grade (A+ to F)
   - Executive summary
   - Key strengths and weaknesses
   - Overall recommendation

2. PERFORMANCE ANALYSIS:
   - Return analysis (total, annualized, risk-adjusted)
   - Sharpe, Sortino, and Calmar ratios
   - Volatility and consistency metrics
   - Benchmark comparison (if applicable)

3. RISK ANALYSIS:
   - Value at Risk (VaR) and Expected Shortfall
   - Maximum drawdown analysis
   - Tail risk assessment
   - Risk factors and mitigation strategies

4. TRADE ANALYSIS:
   - Win rate and profit factor
   - Trade distribution and duration
   - Entry/exit quality assessment
   - Trade pattern analysis

5. MARKET REGIME ANALYSIS (if requested):
   - Performance in bull/bear/sideways markets
   - Volatility regime performance
   - Market condition suitability

6. OPTIMIZATION SUGGESTIONS:
   - Parameter optimization opportunities
   - Risk management improvements
   - Entry/exit rule enhancements
   - Position sizing recommendations

7. EDUCATIONAL INSIGHTS:
   - Key learnings from this analysis
   - Common mistakes to avoid
   - Best practices demonstrated
   - Next steps for improvement

Respond with a comprehensive JSON object containing all analysis components. Be specific, actionable, and educational in your recommendations.`;
}

// Risk analysis specific prompt
export function buildRiskAnalysisPrompt(backtestResults: any): string {
  return `Conduct a detailed risk analysis of the following backtest results:

BACKTEST RESULTS:
${JSON.stringify(backtestResults, null, 2)}

Focus specifically on risk assessment:

1. QUANTITATIVE RISK METRICS:
   - Value at Risk (VaR) at 95% and 99% confidence levels
   - Expected Shortfall (Conditional VaR)
   - Maximum Drawdown and recovery time
   - Tail risk and extreme event analysis

2. RISK FACTORS:
   - Market risk (systematic risk exposure)
   - Concentration risk (position sizing issues)
   - Liquidity risk (execution challenges)
   - Model risk (strategy-specific risks)

3. RISK SCORING:
   - Overall risk score (0-100)
   - Risk level classification (low/medium/high)
   - Risk-adjusted performance assessment

4. RISK MITIGATION:
   - Specific risk management recommendations
   - Position sizing improvements
   - Stop-loss and take-profit strategies
   - Portfolio diversification suggestions

5. STRESS TESTING:
   - Scenario analysis recommendations
   - Monte Carlo simulation suggestions
   - Market crash impact assessment

Respond with a detailed JSON object focusing on risk analysis and mitigation strategies.`;
}

// Optimization suggestions prompt
export function buildOptimizationPrompt(backtestResults: any, strategy: any): string {
  return `Generate specific optimization suggestions for this trading strategy:

BACKTEST RESULTS:
${JSON.stringify(backtestResults, null, 2)}

STRATEGY CONFIGURATION:
${JSON.stringify(strategy, null, 2)}

Provide optimization suggestions in these categories:

1. PARAMETER OPTIMIZATION:
   - Specific parameter adjustments
   - Sensitivity analysis recommendations
   - Walk-forward optimization suggestions
   - Multi-timeframe considerations

2. RISK MANAGEMENT OPTIMIZATION:
   - Position sizing improvements
   - Stop-loss optimization
   - Take-profit strategies
   - Portfolio-level risk controls

3. ENTRY/EXIT OPTIMIZATION:
   - Signal filtering improvements
   - Confirmation indicator suggestions
   - Market condition filters
   - Timing optimization

4. IMPLEMENTATION OPTIMIZATION:
   - Transaction cost considerations
   - Slippage mitigation
   - Execution timing improvements
   - Technology enhancements

For each suggestion, provide:
- Priority level (high/medium/low)
- Expected impact description
- Implementation steps
- Confidence level in the recommendation

Respond with a JSON array of optimization suggestions with detailed implementation guidance.`;
}

// Comparison analysis prompt
export function buildComparisonPrompt(backtests: Array<{ results: any; strategy: any; name: string }>): string {
  return `Compare the following trading strategies and provide a comprehensive analysis:

STRATEGIES TO COMPARE:
${backtests.map((bt, i) => `
Strategy ${i + 1}: ${bt.name}
Results: ${JSON.stringify(bt.results, null, 2)}
Configuration: ${JSON.stringify(bt.strategy, null, 2)}
`).join('\n')}

Provide a detailed comparison covering:

1. PERFORMANCE COMPARISON:
   - Return comparison (total, annualized, risk-adjusted)
   - Risk metrics comparison (drawdown, volatility, VaR)
   - Consistency and stability comparison
   - Trade quality comparison

2. STRENGTHS AND WEAKNESSES:
   - Each strategy's key strengths
   - Each strategy's main weaknesses
   - Relative performance in different market conditions

3. RISK PROFILE COMPARISON:
   - Risk level classification for each strategy
   - Risk factor analysis
   - Risk-adjusted performance ranking

4. SUITABILITY ANALYSIS:
   - Best strategy for different trader types
   - Market condition suitability
   - Implementation complexity comparison

5. RECOMMENDATIONS:
   - Overall best strategy
   - Best for beginners vs advanced traders
   - Best for different market conditions
   - Hybrid approach suggestions

6. EDUCATIONAL INSIGHTS:
   - Key differences between approaches
   - Lessons learned from comparison
   - Best practices demonstrated

Respond with a comprehensive JSON object containing detailed comparison analysis and recommendations.`;
}

// Market regime analysis prompt
export function buildMarketRegimePrompt(backtestResults: any, marketData?: any): string {
  return `Analyze how this strategy performs across different market regimes:

BACKTEST RESULTS:
${JSON.stringify(backtestResults, null, 2)}

${marketData ? `MARKET DATA:
${JSON.stringify(marketData, null, 2)}` : ''}

Focus on market regime analysis:

1. MARKET CONDITION PERFORMANCE:
   - Bull market performance
   - Bear market performance
   - Sideways/range-bound market performance
   - High volatility period performance
   - Low volatility period performance

2. REGIME IDENTIFICATION:
   - How to identify different market regimes
   - Strategy's sensitivity to regime changes
   - Regime transition impact analysis

3. REGIME-SPECIFIC OPTIMIZATION:
   - Parameter adjustments for different regimes
   - Regime-specific risk management
   - Adaptive strategy suggestions

4. REGIME PREDICTION:
   - Leading indicators for regime changes
   - Strategy preparation for regime shifts
   - Early warning systems

5. PORTFOLIO IMPLICATIONS:
   - Regime diversification benefits
   - Multi-strategy approach suggestions
   - Regime-aware position sizing

Respond with a detailed JSON object focusing on market regime analysis and adaptive strategies.`;
}

// Educational content prompt
export function buildEducationalPrompt(backtestResults: any, analysisType: string): string {
  return `Generate educational content for this backtest analysis:

BACKTEST RESULTS:
${JSON.stringify(backtestResults, null, 2)}

ANALYSIS TYPE: ${analysisType}

Create educational content covering:

1. KEY CONCEPTS:
   - Important trading concepts demonstrated
   - Risk management principles
   - Performance measurement techniques
   - Strategy evaluation methods

2. LEARNING OBJECTIVES:
   - What traders should learn from this analysis
   - Key takeaways for strategy development
   - Risk management lessons
   - Performance optimization insights

3. PRACTICAL APPLICATIONS:
   - How to apply these concepts
   - Real-world implementation tips
   - Common pitfalls to avoid
   - Best practices to follow

4. NEXT STEPS:
   - Recommended learning path
   - Additional analysis to perform
   - Strategy improvements to implement
   - Further research areas

5. RELATED CONCEPTS:
   - Related trading strategies
   - Complementary analysis techniques
   - Advanced topics to explore
   - Industry best practices

Make the content educational, practical, and suitable for traders at different experience levels.`;
}

// Export all prompts for easy access
export const prompts = {
  getSystemInstruction,
  buildAnalysisPrompt,
  buildRiskAnalysisPrompt,
  buildOptimizationPrompt,
  buildComparisonPrompt,
  buildMarketRegimePrompt,
  buildEducationalPrompt,
};
