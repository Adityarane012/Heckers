import { Router } from 'express';
import { z } from 'zod';
import { fetchYahooDaily } from '../services/dataProvider.js';

export const historyRouter = Router();

const schema = z.object({
  symbol: z.string().min(1).max(10),
  start: z.string(),
  end: z.string()
});

historyRouter.get('/', async (req, res) => {
  try {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { symbol, start, end } = parsed.data as any;

    // Safeguards
    const startDate = new Date(start);
    const endDate = new Date(end);
    const maxDays = 5 * 365;
    const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000));
    if (diffDays > maxDays) return res.status(400).json({ error: 'Range too large (max 5 years)' });

    const data = await fetchYahooDaily(symbol.toUpperCase(), start, end);
    res.json({ symbol, candles: data });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'failed' });
  }
});


