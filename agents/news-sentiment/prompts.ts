/**
 * News Sentiment Agent Prompts
 * 
 * This module contains all prompt templates and system instructions used by the
 * News Sentiment Agent for analyzing news and market sentiment.
 */

// System instruction for the News Sentiment Agent
export function getSystemInstruction(): string {
  return `You are an expert financial news analyst and sentiment specialist for AlgoMentor AI, specializing in analyzing news sentiment and its impact on financial markets.

Your role is to provide comprehensive sentiment analysis that helps traders understand market mood and make informed decisions through:

1. Sentiment Analysis: Analyze news articles for emotional tone and market implications
2. Market Impact Assessment: Evaluate how news sentiment affects specific assets and sectors
3. Trading Signal Generation: Provide actionable trading insights based on sentiment
4. Educational Guidance: Explain sentiment analysis concepts and market psychology
5. Risk Assessment: Identify sentiment-driven risks and opportunities

Key principles:
- Focus on actionable insights for traders
- Consider both short-term and long-term sentiment trends
- Provide educational context for all analysis
- Be objective and data-driven in assessments
- Consider market context and timing factors

Always provide clear, actionable analysis that helps traders understand and leverage market sentiment effectively.`;
}

// Main sentiment analysis prompt
export function buildSentimentAnalysisPrompt(articles: any[], request: any): string {
  return `Analyze the sentiment of the following news articles and provide comprehensive market insights:

NEWS ARTICLES:
${JSON.stringify(articles, null, 2)}

ANALYSIS REQUEST:
- Symbols: ${request.symbols?.join(', ') || 'Not specified'}
- Timeframe: ${request.timeframe || '24h'}
- Keywords: ${request.keywords?.join(', ') || 'Not specified'}
- Options: ${JSON.stringify(request.options || {}, null, 2)}

Please provide a comprehensive sentiment analysis covering:

1. OVERALL SENTIMENT:
   - Overall sentiment score (-1 to 1)
   - Sentiment magnitude (0 to 1)
   - Sentiment label (very_negative to very_positive)
   - Trend direction (improving/declining/stable)
   - Confidence level (0 to 1)
   - Executive summary

2. NEWS ANALYSIS:
   - Processed articles with sentiment scores
   - Total articles analyzed
   - Sentiment distribution across articles
   - Key themes and topics identified
   - Trending topics and their sentiment
   - Source analysis and credibility

3. MARKET IMPACT:
   - Expected impact level (high/medium/low/minimal)
   - Impact direction (bullish/bearish/neutral)
   - Confidence in impact assessment
   - Timeframe for impact
   - Affected sectors and assets
   - Risk factors identified
   - Opportunities identified

4. TRADING SIGNALS:
   - Specific trading signals for each symbol
   - Signal strength and confidence
   - Reasoning for each signal
   - Expected timeframe
   - Risk level assessment
   - Expected price movement
   - Key drivers for each signal

5. EDUCATIONAL INSIGHTS:
   - Key learnings about sentiment analysis
   - Sentiment analysis concepts demonstrated
   - Market impact factors to consider
   - Trading considerations and best practices
   - Risk warnings and limitations
   - Recommended actions for traders

Respond with a comprehensive JSON object containing all analysis components. Be specific, actionable, and educational in your recommendations. Focus on helping traders understand and leverage market sentiment effectively.`;
}

// Article sentiment analysis prompt
export function buildArticleSentimentPrompt(articles: any[]): string {
  return `Analyze the sentiment of each individual news article:

ARTICLES TO ANALYZE:
${JSON.stringify(articles, null, 2)}

For each article, provide:

1. SENTIMENT ANALYSIS:
   - Sentiment score (-1 to 1)
   - Sentiment magnitude (0 to 1)
   - Sentiment label (positive/negative/neutral)
   - Confidence level (0 to 1)

2. RELEVANCE ASSESSMENT:
   - Market relevance score (0 to 1)
   - Impact level (high/medium/low)
   - Key points extracted
   - Market relevance factors

3. PROCESSING DETAILS:
   - Article ID and metadata
   - Source credibility assessment
   - Publication timing relevance
   - Content quality evaluation

Respond with a JSON array of processed articles, each containing detailed sentiment analysis and market relevance assessment.`;
}

// Market impact assessment prompt
export function buildMarketImpactPrompt(sentimentData: any, symbols: string[]): string {
  return `Assess the market impact of the following sentiment analysis:

SENTIMENT DATA:
${JSON.stringify(sentimentData, null, 2)}

TARGET SYMBOLS:
${symbols.join(', ')}

Provide detailed market impact assessment:

1. IMPACT ASSESSMENT:
   - Expected impact level (high/medium/low/minimal)
   - Impact direction (bullish/bearish/neutral)
   - Confidence level (0 to 1)
   - Timeframe for impact

2. SECTOR ANALYSIS:
   - Affected sectors and industries
   - Sector-specific impact levels
   - Cross-sector correlations
   - Sector rotation implications

3. RISK FACTORS:
   - Sentiment-driven risks
   - Market volatility factors
   - Contrarian indicators
   - Risk mitigation strategies

4. OPPORTUNITIES:
   - Sentiment-driven opportunities
   - Undervalued/overvalued sectors
   - Timing considerations
   - Position sizing recommendations

5. MARKET CONTEXT:
   - Current market conditions
   - Historical sentiment comparisons
   - Seasonal factors
   - External influences

Respond with a detailed JSON object focusing on market impact assessment and trading implications.`;
}

// Trading signals generation prompt
export function buildTradingSignalsPrompt(sentimentData: any, symbols: string[]): string {
  return `Generate trading signals based on sentiment analysis:

SENTIMENT DATA:
${JSON.stringify(sentimentData, null, 2)}

TARGET SYMBOLS:
${symbols.join(', ')}

Generate specific trading signals for each symbol:

1. SIGNAL GENERATION:
   - Signal type (strong_buy/buy/hold/sell/strong_sell)
   - Confidence level (0 to 1)
   - Detailed reasoning
   - Expected timeframe
   - Risk level (low/medium/high)

2. PRICE EXPECTATIONS:
   - Expected price movement (percentage)
   - Price targets and support/resistance
   - Volatility expectations
   - Time horizon for moves

3. KEY DRIVERS:
   - Primary sentiment drivers
   - Supporting factors
   - Contrarian indicators
   - Risk factors to monitor

4. IMPLEMENTATION GUIDANCE:
   - Entry strategies
   - Position sizing recommendations
   - Risk management rules
   - Exit strategies

5. MONITORING REQUIREMENTS:
   - Key metrics to watch
   - Sentiment change triggers
   - Market condition changes
   - News flow monitoring

Respond with a JSON array of trading signals, each containing specific recommendations for the target symbols.`;
}

// Trending topics analysis prompt
export function buildTrendingTopicsPrompt(articles: any[]): string {
  return `Identify trending topics and themes from the following news articles:

NEWS ARTICLES:
${JSON.stringify(articles, null, 2)}

Analyze and identify:

1. TRENDING TOPICS:
   - Most mentioned topics
   - Topic trend direction (rising/falling/stable)
   - Mention frequency and growth
   - Sentiment for each topic
   - Market relevance score

2. KEY THEMES:
   - Major themes across articles
   - Theme sentiment analysis
   - Theme frequency and impact
   - Theme descriptions
   - Related articles for each theme

3. TOPIC ANALYSIS:
   - Topic categorization
   - Sentiment distribution
   - Market implications
   - Trading relevance
   - Risk/opportunity assessment

4. TREND INSIGHTS:
   - Emerging trends
   - Declining trends
   - Stable trends
   - Trend significance
   - Future trend predictions

Respond with a JSON object containing trending topics and key themes with detailed analysis.`;
}

// Educational content prompt
export function buildEducationalPrompt(sentimentData: any, analysisType: string): string {
  return `Generate educational content for this sentiment analysis:

SENTIMENT DATA:
${JSON.stringify(sentimentData, null, 2)}

ANALYSIS TYPE: ${analysisType}

Create educational content covering:

1. SENTIMENT ANALYSIS CONCEPTS:
   - How sentiment analysis works
   - Key metrics and their meanings
   - Sentiment vs. fundamental analysis
   - Market psychology principles

2. PRACTICAL APPLICATIONS:
   - How to use sentiment in trading
   - Combining sentiment with technical analysis
   - Sentiment-based position sizing
   - Risk management with sentiment

3. MARKET PSYCHOLOGY:
   - Fear and greed indicators
   - Contrarian sentiment signals
   - Market cycle implications
   - Behavioral finance concepts

4. RISK CONSIDERATIONS:
   - Sentiment analysis limitations
   - False signals and noise
   - Market manipulation risks
   - Overreliance on sentiment

5. BEST PRACTICES:
   - Sentiment analysis workflow
   - Data source evaluation
   - Interpretation guidelines
   - Integration with other methods

Make the content educational, practical, and suitable for traders at different experience levels.`;
}

// Risk assessment prompt
export function buildRiskAssessmentPrompt(sentimentData: any, symbols: string[]): string {
  return `Assess sentiment-driven risks for the following analysis:

SENTIMENT DATA:
${JSON.stringify(sentimentData, null, 2)}

TARGET SYMBOLS:
${symbols.join(', ')}

Provide comprehensive risk assessment:

1. SENTIMENT RISKS:
   - Overly optimistic sentiment risks
   - Excessive pessimism risks
   - Sentiment reversal risks
   - Market manipulation risks

2. TIMING RISKS:
   - Sentiment timing issues
   - Market cycle risks
   - News flow timing
   - Event-driven risks

3. DATA QUALITY RISKS:
   - Source credibility issues
   - Data bias risks
   - Sample size limitations
   - Historical accuracy concerns

4. IMPLEMENTATION RISKS:
   - Position sizing risks
   - Entry/exit timing risks
   - Risk management gaps
   - Portfolio concentration risks

5. MITIGATION STRATEGIES:
   - Risk reduction techniques
   - Diversification strategies
   - Monitoring requirements
   - Contingency plans

Respond with a detailed JSON object focusing on risk assessment and mitigation strategies.`;
}

// Export all prompts for easy access
export const prompts = {
  getSystemInstruction,
  buildSentimentAnalysisPrompt,
  buildArticleSentimentPrompt,
  buildMarketImpactPrompt,
  buildTradingSignalsPrompt,
  buildTrendingTopicsPrompt,
  buildEducationalPrompt,
  buildRiskAssessmentPrompt,
};
