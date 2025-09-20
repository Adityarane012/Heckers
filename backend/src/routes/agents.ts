import express from 'express';
import { strategyArchitectAgent, backtestAnalystAgent, tradeCoachAgent, ohlcvAnalystAgent, GeminiApiError } from '../services/agents/geminiAgent.js';

const router = express.Router();

// Middleware for error handling
const handleAgentError = (error: any, res: express.Response) => {
  if (error instanceof GeminiApiError) {
    return res.status(error.status || 500).json({
      error: error.message,
      code: error.code,
      powered_by: 'Gemini AI'
    });
  }
  
  console.error('Unexpected agent error:', error);
  return res.status(500).json({
    error: 'An unexpected error occurred with the AI agent',
    code: 'INTERNAL_ERROR',
    powered_by: 'Gemini AI'
  });
};

// 1. Strategy Architect Agent
router.post('/strategy-builder', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide a valid strategy description',
        code: 'MISSING_PROMPT'
      });
    }

    if (prompt.length > 1000) {
      return res.status(400).json({
        error: 'Strategy description is too long (max 1000 characters)',
        code: 'PROMPT_TOO_LONG'
      });
    }

    const result = await strategyArchitectAgent(prompt.trim());
    
    // Try to parse the JSON response to validate it
    let strategy;
    try {
      strategy = JSON.parse(result);
    } catch (parseError) {
      // If parsing fails, return the raw response but indicate it might need manual review
      return res.json({
        strategy: result,
        parsed: false,
        powered_by: 'Gemini AI',
        note: 'Strategy generated but may need manual formatting'
      });
    }

    res.json({
      strategy: result,
      parsed: true,
      powered_by: 'Gemini AI'
    });
  } catch (error) {
    handleAgentError(error, res);
  }
});

// 2. Backtest Analyst Agent
router.post('/backtest-analyst', async (req, res) => {
  try {
    const { stats } = req.body;
    
    if (!stats || typeof stats !== 'object') {
      return res.status(400).json({
        error: 'Please provide valid backtest statistics',
        code: 'MISSING_STATS'
      });
    }

    // Validate that stats contains some expected fields
    const requiredFields = ['totalTrades', 'winRate', 'totalReturn'];
    const hasValidStats = requiredFields.some(field => stats.hasOwnProperty(field));
    
    if (!hasValidStats) {
      return res.status(400).json({
        error: 'Backtest stats should contain trading performance metrics',
        code: 'INVALID_STATS'
      });
    }

    const result = await backtestAnalystAgent(stats);
    
    res.json({
      summary: result,
      powered_by: 'Gemini AI'
    });
  } catch (error) {
    handleAgentError(error, res);
  }
});

// 3. Trade Coach Agent
router.post('/trade-coach', async (req, res) => {
  try {
    const { trades } = req.body;
    
    if (!trades || !Array.isArray(trades)) {
      return res.status(400).json({
        error: 'Please provide an array of trade records',
        code: 'MISSING_TRADES'
      });
    }

    if (trades.length === 0) {
      return res.status(400).json({
        error: 'No trades provided for analysis',
        code: 'EMPTY_TRADES'
      });
    }

    if (trades.length > 100) {
      // Limit to most recent 100 trades to avoid token limits
      trades.splice(0, trades.length - 100);
    }

    const result = await tradeCoachAgent(trades);
    
    res.json({
      advice: result,
      trades_analyzed: trades.length,
      powered_by: 'Gemini AI'
    });
  } catch (error) {
    handleAgentError(error, res);
  }
});

// 4. OHLCV Data Analyst Agent
router.post('/ohlcv-analyst', async (req, res) => {
  try {
    const { ohlcvData, symbol, analysisType } = req.body;
    
    if (!ohlcvData || !Array.isArray(ohlcvData)) {
      return res.status(400).json({
        error: 'Please provide valid OHLCV data array',
        code: 'MISSING_OHLCV_DATA'
      });
    }

    if (ohlcvData.length === 0) {
      return res.status(400).json({
        error: 'No OHLCV data provided for analysis',
        code: 'EMPTY_OHLCV_DATA'
      });
    }

    // Validate OHLCV data structure
    const requiredFields = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];
    const hasValidStructure = ohlcvData.every(item => 
      requiredFields.every(field => typeof item[field] === 'number')
    );
    
    if (!hasValidStructure) {
      return res.status(400).json({
        error: 'OHLCV data must contain numeric fields: timestamp, open, high, low, close, volume',
        code: 'INVALID_OHLCV_STRUCTURE'
      });
    }

    // Limit data size to prevent token limits (keep last 200 data points)
    const limitedData = ohlcvData.length > 200 ? ohlcvData.slice(-200) : ohlcvData;

    const result = await ohlcvAnalystAgent(limitedData, symbol, analysisType);
    
    res.json({
      analysis: result,
      data_points_analyzed: limitedData.length,
      symbol: symbol || 'Unknown',
      analysis_type: analysisType || 'Comprehensive Market Analysis',
      powered_by: 'Gemini AI'
    });
  } catch (error) {
    handleAgentError(error, res);
  }
});

// Health check endpoint for agents
router.get('/health', (req, res) => {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'ok',
    agents: ['strategy-builder', 'backtest-analyst', 'trade-coach', 'ohlcv-analyst'],
    gemini_configured: hasApiKey,
    powered_by: 'Gemini AI'
  });
});

export { router as agentsRouter };
