import { Router } from 'express';
import { z } from 'zod';
import { fetchYahooDaily } from '../services/dataProvider.js';
import { runBacktest, StrategyDefinition } from '../services/backtester.js';

export const backtestRouter = Router();

const schema = z.object({
  symbol: z.string().min(1).max(10),
  start: z.string(),
  end: z.string(),
  strategy: z.object({
    kind: z.enum(['smaCross', 'rsiReversion', 'macd', 'breakout', 'momentum']),
    params: z.record(z.number()).default({})
  })
});

backtestRouter.post('/', async (req, res) => {
  try {
    console.log('Backtest request received:', req.body);
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      console.log('Validation error:', parsed.error.flatten());
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { symbol, start, end, strategy } = parsed.data;
    console.log('Parsed data:', { symbol, start, end, strategy });

    // Safeguards
    const startDate = new Date(start);
    const endDate = new Date(end);
    const maxDays = 5 * 365;
    const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000));
    if (diffDays > maxDays) return res.status(400).json({ error: 'Range too large (max 5 years)' });

    console.log('Fetching data for symbol:', symbol);
    const data = await fetchYahooDaily(symbol, start, end);
    console.log('Data fetched, rows:', data.length);
    const result = runBacktest(data, strategy as StrategyDefinition);
    console.log('Backtest completed, returning result');
    res.json({ symbol, ...result });
  } catch (e: any) {
    console.error('Backtest error:', e);
    res.status(500).json({ error: e.message || 'failed' });
  }
});


