import request from 'supertest';
import express from 'express';
import { agentsRouter } from '../routes/agents.js';

// Mock the Gemini service
jest.mock('../services/agents/geminiAgent', () => ({
  strategyArchitectAgent: jest.fn(),
  backtestAnalystAgent: jest.fn(),
  tradeCoachAgent: jest.fn(),
  GeminiApiError: class GeminiApiError extends Error {
    status?: number;
    code?: string;
    constructor(message: string, status?: number, code?: string) {
      super(message);
      this.name = 'GeminiApiError';
      this.status = status;
      this.code = code;
    }
  }
}));

import { strategyArchitectAgent, backtestAnalystAgent, tradeCoachAgent } from '../services/agents/geminiAgent.js';

const app = express();
app.use(express.json());
app.use('/agents', agentsRouter);

describe('AI Agents API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /agents/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/agents/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        agents: ['strategy-builder', 'backtest-analyst', 'trade-coach'],
        gemini_configured: false, // No API key in test environment
        powered_by: 'Gemini AI'
      });
    });
  });

  describe('POST /agents/strategy-builder', () => {
    it('should build strategy successfully', async () => {
      const mockStrategy = '{"type": "smaCross", "params": {"fastPeriod": 10, "slowPeriod": 20}}';
      (strategyArchitectAgent as jest.Mock).mockResolvedValue(mockStrategy);

      const response = await request(app)
        .post('/agents/strategy-builder')
        .send({ prompt: 'Create a simple moving average crossover strategy' })
        .expect(200);

      expect(response.body).toEqual({
        strategy: mockStrategy,
        parsed: true,
        powered_by: 'Gemini AI'
      });

      expect(strategyArchitectAgent).toHaveBeenCalledWith('Create a simple moving average crossover strategy');
    });

    it('should handle invalid JSON response', async () => {
      const invalidJson = 'This is not valid JSON';
      (strategyArchitectAgent as jest.Mock).mockResolvedValue(invalidJson);

      const response = await request(app)
        .post('/agents/strategy-builder')
        .send({ prompt: 'Create a strategy' })
        .expect(200);

      expect(response.body).toEqual({
        strategy: invalidJson,
        parsed: false,
        powered_by: 'Gemini AI',
        note: 'Strategy generated but may need manual formatting'
      });
    });

    it('should validate prompt input', async () => {
      const response = await request(app)
        .post('/agents/strategy-builder')
        .send({ prompt: '' })
        .expect(400);

      expect(response.body.error).toBe('Please provide a valid strategy description');
      expect(response.body.code).toBe('MISSING_PROMPT');
    });

    it('should reject prompts that are too long', async () => {
      const longPrompt = 'x'.repeat(1001);
      const response = await request(app)
        .post('/agents/strategy-builder')
        .send({ prompt: longPrompt })
        .expect(400);

      expect(response.body.error).toBe('Strategy description is too long (max 1000 characters)');
      expect(response.body.code).toBe('PROMPT_TOO_LONG');
    });
  });

  describe('POST /agents/backtest-analyst', () => {
    it('should analyze backtest successfully', async () => {
      const mockAnalysis = 'Your strategy shows strong performance with a 65% win rate...';
      (backtestAnalystAgent as jest.Mock).mockResolvedValue(mockAnalysis);

      const backtestStats = {
        totalTrades: 100,
        winRate: 0.65,
        totalReturn: 0.15,
        maxDrawdown: -0.08
      };

      const response = await request(app)
        .post('/agents/backtest-analyst')
        .send({ stats: backtestStats })
        .expect(200);

      expect(response.body).toEqual({
        summary: mockAnalysis,
        powered_by: 'Gemini AI'
      });

      expect(backtestAnalystAgent).toHaveBeenCalledWith(backtestStats);
    });

    it('should validate stats input', async () => {
      const response = await request(app)
        .post('/agents/backtest-analyst')
        .send({ stats: null })
        .expect(400);

      expect(response.body.error).toBe('Please provide valid backtest statistics');
      expect(response.body.code).toBe('MISSING_STATS');
    });

    it('should validate stats contains expected fields', async () => {
      const response = await request(app)
        .post('/agents/backtest-analyst')
        .send({ stats: { randomField: 'value' } })
        .expect(400);

      expect(response.body.error).toBe('Backtest stats should contain trading performance metrics');
      expect(response.body.code).toBe('INVALID_STATS');
    });
  });

  describe('POST /agents/trade-coach', () => {
    it('should provide coaching advice successfully', async () => {
      const mockAdvice = 'Based on your recent trades, I notice you have excellent discipline...';
      (tradeCoachAgent as jest.Mock).mockResolvedValue(mockAdvice);

      const trades = [
        {
          symbol: 'AAPL',
          side: 'buy',
          quantity: 100,
          price: 150.00,
          timestamp: '2024-01-15T10:30:00Z',
          pnl: 500
        },
        {
          symbol: 'GOOGL',
          side: 'sell',
          quantity: 50,
          price: 2800.00,
          timestamp: '2024-01-16T14:20:00Z',
          pnl: -200
        }
      ];

      const response = await request(app)
        .post('/agents/trade-coach')
        .send({ trades })
        .expect(200);

      expect(response.body).toEqual({
        advice: mockAdvice,
        trades_analyzed: 2,
        powered_by: 'Gemini AI'
      });

      expect(tradeCoachAgent).toHaveBeenCalledWith(trades);
    });

    it('should validate trades input', async () => {
      const response = await request(app)
        .post('/agents/trade-coach')
        .send({ trades: null })
        .expect(400);

      expect(response.body.error).toBe('Please provide an array of trade records');
      expect(response.body.code).toBe('MISSING_TRADES');
    });

    it('should reject empty trades array', async () => {
      const response = await request(app)
        .post('/agents/trade-coach')
        .send({ trades: [] })
        .expect(400);

      expect(response.body.error).toBe('No trades provided for analysis');
      expect(response.body.code).toBe('EMPTY_TRADES');
    });

    it('should limit trades to 100 for analysis', async () => {
      const mockAdvice = 'Analysis complete';
      (tradeCoachAgent as jest.Mock).mockResolvedValue(mockAdvice);

      // Create 150 trades
      const manyTrades = Array.from({ length: 150 }, (_, i) => ({
        symbol: 'AAPL',
        side: 'buy' as const,
        quantity: 100,
        price: 150.00,
        timestamp: `2024-01-${String(i % 30 + 1).padStart(2, '0')}T10:30:00Z`,
        pnl: 100
      }));

      const response = await request(app)
        .post('/agents/trade-coach')
        .send({ trades: manyTrades })
        .expect(200);

      expect(response.body.trades_analyzed).toBe(100);
      
      // Should have been called with only the last 100 trades
      expect(tradeCoachAgent).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ symbol: 'AAPL' })
      ]));
      
      const calledTrades = (tradeCoachAgent as jest.Mock).mock.calls[0][0];
      expect(calledTrades).toHaveLength(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle Gemini API errors gracefully', async () => {
      const { GeminiApiError } = require('../services/agents/geminiAgent');
      (strategyArchitectAgent as jest.Mock).mockRejectedValue(
        new GeminiApiError('Rate limit exceeded', 429, 'RATE_LIMIT')
      );

      const response = await request(app)
        .post('/agents/strategy-builder')
        .send({ prompt: 'Create a strategy' })
        .expect(429);

      expect(response.body).toEqual({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT',
        powered_by: 'Gemini AI'
      });
    });

    it('should handle unexpected errors', async () => {
      (strategyArchitectAgent as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app)
        .post('/agents/strategy-builder')
        .send({ prompt: 'Create a strategy' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'An unexpected error occurred with the AI agent',
        code: 'INTERNAL_ERROR',
        powered_by: 'Gemini AI'
      });
    });
  });
});
