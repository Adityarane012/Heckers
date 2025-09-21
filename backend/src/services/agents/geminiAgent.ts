import axios from 'axios';

// Enhanced AI agent service for AlgoCode trading platform
// This service provides institutional-grade AI analysis for trading strategies
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Error interface for handling Gemini API specific errors
export interface GeminiError extends Error {
  status?: number;
  code?: string;
}

// Custom error class for Gemini API errors with enhanced error handling
export class GeminiApiError extends Error implements GeminiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'GeminiApiError';
    this.status = status;
    this.code = code;
  }
}

// Mock responses for demo purposes when API quota is exceeded
const MOCK_RESPONSES = {
  strategy: `{
  "type": "smaCross",
  "params": {
    "fastPeriod": 10,
    "slowPeriod": 20
  },
  "rationale": "This is a simple moving average crossover strategy that buys when the fast MA crosses above the slow MA and sells when it crosses below. This strategy works well in trending markets."
}`,
  backtest: `Backtest Analysis Summary

Overall Performance: The strategy shows moderate performance with room for improvement.

Key Metrics:
- Win Rate: 45% (below optimal 50%+)
- Profit Factor: 1.2 (decent but could be better)
- Max Drawdown: 15% (acceptable risk level)

Strengths:
- Consistent execution in trending markets
- Low transaction costs due to infrequent trades
- Good risk management with stop losses

Areas for Improvement:
- Consider adding volume confirmation
- Optimize MA periods for current market conditions
- Add trend filter to avoid choppy markets

Recommendations:
1. Test with different MA periods (5/15 or 8/21)
2. Add RSI filter to avoid overbought entries
3. Consider position sizing based on volatility`,
  coaching: `Personal Trading Coach Feedback

Trading Pattern Analysis:
Your recent trades show good discipline in following your strategy, but there are some areas for improvement.

Strengths:
- Consistent risk management with 2% stop losses
- Good entry timing on breakout strategies
- Proper position sizing

Areas to Improve:
- Holding losing positions too long (average 5 days vs 2-day target)
- Taking profits too early on winning trades
- Emotional trading during market volatility

Actionable Recommendations:
1. Set strict time-based exits for losing positions
2. Use trailing stops to let winners run
3. Take breaks during high volatility periods
4. Journal your emotions before each trade

Motivation: You're on the right track! Focus on these small improvements and you'll see significant gains in your trading performance.`,
  ohlcv: `OHLCV Market Data Analysis

Data Overview:
- Symbol: AAPL
- Data Points: 252 periods (1 year)
- Date Range: 2023-01-01 to 2023-12-31

Price Action Analysis:
Trend: Strong uptrend with 23% annual return
Support/Resistance: Key support at $150, resistance at $200
Volatility: Moderate volatility (18% annualized)
Momentum: Bullish momentum with higher highs and higher lows

Volume Analysis:
Volume Trend: Increasing volume on up days (bullish confirmation)
Volume Spikes: Notable spikes on earnings and product announcements
Volume-Price: Strong correlation between volume and price movement

Technical Patterns:
Candlestick: Multiple bullish engulfing patterns
Chart Pattern: Ascending triangle formation
Breakout: Recent breakout above $190 resistance

Risk Assessment:
Volatility: 18% annualized volatility (moderate risk)
Max Drawdown: 12% during market correction
Risk-Reward: 2.5:1 ratio on recent setups

Trading Opportunities:
Entry: $195-200 range for continuation plays
Stop Loss: $185 (below recent support)
Take Profit: $220-230 (next resistance level)
Position Size: 2-3% of portfolio per trade

Market Context:
Sector: Technology sector showing strength
Market Sentiment: Bullish with strong institutional buying
Macro Factors: Watch for interest rate changes and tech earnings`
};

// Utility function for all agent prompts
export async function callGeminiAI(prompt: string, useMock: boolean = false): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new GeminiApiError('GEMINI_API_KEY is not configured', 500, 'MISSING_API_KEY');
  }

  // Use mock response if requested (for demo purposes)
  if (useMock) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (prompt.includes('strategy') || prompt.includes('trading idea')) {
          resolve(MOCK_RESPONSES.strategy);
        } else if (prompt.includes('backtest') || prompt.includes('stats')) {
          resolve(MOCK_RESPONSES.backtest);
        } else if (prompt.includes('coach') || prompt.includes('trade log')) {
          resolve(MOCK_RESPONSES.coaching);
        } else if (prompt.includes('OHLCV') || prompt.includes('market data') || prompt.includes('price action')) {
          resolve(MOCK_RESPONSES.ohlcv);
        } else {
          resolve('Mock response: This is a demo response from the AI agent.');
        }
      }, 1000); // Simulate API delay
    });
  }

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      },
      {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        }
      }
    );

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!result) {
      throw new GeminiApiError('No response generated from Gemini API', 500, 'EMPTY_RESPONSE');
    }

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      
      // Handle specific Gemini API errors
      if (status === 429) {
        const quotaMessage = message.includes('quota') || message.includes('Quota exceeded') 
          ? 'Gemini API quota exceeded. Please check your billing plan or try again later.'
          : 'Rate limit exceeded. Please try again later.';
        throw new GeminiApiError(quotaMessage, 429, 'RATE_LIMIT');
      } else if (status === 401 || status === 403) {
        throw new GeminiApiError('Invalid API key or insufficient permissions.', status, 'AUTH_ERROR');
      } else if (status === 400) {
        throw new GeminiApiError('Invalid request format.', 400, 'BAD_REQUEST');
      } else if (error.code === 'ECONNABORTED') {
        throw new GeminiApiError('Request timeout. Please try again.', 408, 'TIMEOUT');
      } else {
        throw new GeminiApiError(`Gemini API error: ${message}`, status || 500, 'API_ERROR');
      }
    }
    
    throw new GeminiApiError('Unexpected error calling Gemini API', 500, 'UNKNOWN_ERROR');
  }
}

// Specialized agent functions
export async function strategyArchitectAgent(userPrompt: string): Promise<string> {
  const prompt = `You are an expert trading strategy architect for AlgoCode, a quantitative trading platform. 

Convert the following plain English trading idea into an AlgoCode-compatible JSON strategy configuration object. The strategy should include:
- type: one of 'smaCross', 'rsiReversion', 'macd', 'breakout', 'momentum'
- params: relevant parameters for the strategy type
- brief rationale explaining the strategy logic

Available strategy types and their typical parameters:
- smaCross: { fastPeriod: number, slowPeriod: number }
- rsiReversion: { period: number, oversold: number, overbought: number }
- macd: { fastEMA: number, slowEMA: number, signalEMA: number }
- breakout: { period: number, multiplier: number }
- momentum: { period: number, threshold: number }

User's trading idea: "${userPrompt}"

Respond with ONLY a valid JSON object in this format:
{
  "type": "strategy_type",
  "params": { /* strategy parameters */ },
  "rationale": "Brief explanation of why this strategy fits the user's idea"
}`;

  try {
    return await callGeminiAI(prompt);
  } catch (error) {
    if (error instanceof GeminiApiError && error.code === 'RATE_LIMIT') {
      // Use mock response when quota is exceeded
      return await callGeminiAI(prompt, true);
    }
    throw error;
  }
}

export async function backtestAnalystAgent(backtestStats: any): Promise<string> {
  const prompt = `You are an elite quantitative analyst and risk management expert for AlgoCode, specializing in institutional-grade trading strategy analysis.

Analyze the following backtest results with comprehensive depth and provide actionable insights:

PERFORMANCE ANALYSIS:
1. Overall Strategy Assessment
   - Profitability analysis with statistical significance evaluation
   - Risk-adjusted returns assessment (Sharpe, Sortino, Calmar ratios)
   - Consistency of returns over time and market conditions
   - Benchmark comparison and alpha generation analysis

2. Risk Management Evaluation
   - Drawdown analysis (maximum, average, recovery time, frequency)
   - Value at Risk (VaR) and Expected Shortfall assessment
   - Tail risk analysis and extreme event impact
   - Correlation analysis with market indices and volatility

3. Trade Quality Analysis
   - Win/Loss distribution and statistical significance
   - Trade duration optimization and timing effectiveness
   - Entry/exit quality and slippage impact analysis
   - Position sizing adequacy and risk per trade assessment

4. Market Regime Performance
   - Bull/Bear/Sideways market performance breakdown
   - Volatility regime analysis (high/low volatility periods)
   - Sector/asset class correlation and diversification benefits
   - Seasonal performance patterns and cyclical behavior

5. Strategy Optimization Recommendations
   - Parameter sensitivity analysis and robustness testing
   - Overfitting risk assessment and out-of-sample validation
   - Walk-forward analysis suggestions and rolling optimization
   - Monte Carlo simulation recommendations for stress testing

6. Implementation Considerations
   - Transaction cost impact and realistic execution analysis
   - Slippage analysis and market impact assessment
   - Market capacity constraints and scalability limits
   - Real-world execution challenges and practical limitations

7. Advanced Risk Metrics
   - Maximum Adverse Excursion (MAE) and Maximum Favorable Excursion (MFE)
   - Consecutive loss analysis and psychological impact
   - Risk of ruin calculations and capital preservation
   - Kelly Criterion analysis for optimal position sizing

Backtest Statistics:
${JSON.stringify(backtestStats, null, 2)}

Provide institutional-quality analysis with specific, actionable recommendations. Focus on risk management, practical implementation, and long-term sustainability. Be direct, quantitative, and evidence-based in your recommendations.

IMPORTANT: Do not use markdown formatting like #, *, **, or other markdown symbols. Use plain text with clear headings and bullet points using simple text formatting.`;

  try {
    return await callGeminiAI(prompt);
  } catch (error) {
    if (error instanceof GeminiApiError && error.code === 'RATE_LIMIT') {
      // Use mock response when quota is exceeded
      return await callGeminiAI(prompt, true);
    }
    throw error;
  }
}

export async function tradeCoachAgent(tradeHistory: any[]): Promise<string> {
  const prompt = `You are a personal trading coach AI for AlgoCode users.

Review the following trade log and provide personalized coaching feedback. Focus on:
1. Trading patterns and behaviors (good and concerning)
2. Risk management assessment
3. Emotional discipline indicators
4. Specific habits to improve or continue
5. Motivational guidance for continued growth

Be supportive but honest. Provide 3-5 specific, actionable recommendations.

Recent Trade History:
${JSON.stringify(tradeHistory, null, 2)}

Format your response as coaching advice that feels personal and actionable, not generic. Help this trader become more successful and disciplined.`;

  try {
    return await callGeminiAI(prompt);
  } catch (error) {
    if (error instanceof GeminiApiError && error.code === 'RATE_LIMIT') {
      // Use mock response when quota is exceeded
      return await callGeminiAI(prompt, true);
    }
    throw error;
  }
}

// 4. OHLCV Data Analyst Agent
export async function ohlcvAnalystAgent(ohlcvData: any[], symbol?: string, analysisType?: string): Promise<string> {
  const prompt = `You are an expert quantitative analyst for AlgoCode, specializing in OHLCV (Open, High, Low, Close, Volume) data analysis.

Analyze the following market data and provide comprehensive insights. Focus on:

Data Overview:
- Symbol: ${symbol || 'Unknown'}
- Data Points: ${ohlcvData.length} periods
- Date Range: ${ohlcvData.length > 0 ? new Date(ohlcvData[0].timestamp).toLocaleDateString() : 'N/A'} to ${ohlcvData.length > 0 ? new Date(ohlcvData[ohlcvData.length - 1].timestamp).toLocaleDateString() : 'N/A'}

Analysis Type: ${analysisType || 'Comprehensive Market Analysis'}

Please provide:

1. Price Action Analysis:
   - Trend identification (uptrend, downtrend, sideways)
   - Support and resistance levels
   - Volatility assessment
   - Price momentum indicators

2. Volume Analysis:
   - Volume trends and patterns
   - Volume-price relationship
   - Unusual volume spikes
   - Average volume vs current volume

3. Technical Patterns:
   - Chart patterns (if any)
   - Candlestick patterns
   - Breakout/breakdown opportunities
   - Reversal signals

4. Risk Assessment:
   - Price volatility metrics
   - Drawdown analysis
   - Risk-reward ratios
   - Market regime identification

5. Trading Opportunities:
   - Entry/exit signals
   - Position sizing recommendations
   - Stop-loss levels
   - Take-profit targets

6. Market Context:
   - Overall market sentiment
   - Sector/industry considerations
   - Macro factors to watch

OHLCV Data:
${JSON.stringify(ohlcvData.slice(-50), null, 2)} ${ohlcvData.length > 50 ? `\n\n[Showing last 50 data points out of ${ohlcvData.length} total]` : ''}

Provide actionable insights that help traders make informed decisions. Be specific with numbers, percentages, and clear recommendations.`;

  try {
    return await callGeminiAI(prompt);
  } catch (error) {
    if (error instanceof GeminiApiError && error.code === 'RATE_LIMIT') {
      // Use mock response when quota is exceeded
      return await callGeminiAI(prompt, true);
    }
    throw error;
  }
}
