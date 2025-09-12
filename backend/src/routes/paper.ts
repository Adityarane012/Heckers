import { Router } from 'express';
import { z } from 'zod';
import { fetchYahooDaily } from '../services/dataProvider.js';

type PaperAccount = {
  id: string;
  cash: number;
  positions: Record<string, { qty: number; avg: number }>;
  equityHistory: { t: number; equity: number }[];
};

const accounts = new Map<string, PaperAccount>();

export const paperRouter = Router();

paperRouter.post('/create', (_req, res) => {
  const id = Math.random().toString(36).slice(2);
  accounts.set(id, { id, cash: 10000, positions: {}, equityHistory: [] });
  res.json({ id });
});

const orderSchema = z.object({ accountId: z.string(), symbol: z.string(), side: z.enum(['buy', 'sell']), qty: z.number().positive() });

paperRouter.post('/order', async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { accountId, symbol, side, qty } = parsed.data;
  const acct = accounts.get(accountId);
  if (!acct) return res.status(404).json({ error: 'account not found' });
  const end = new Date().toISOString().slice(0,10);
  const start = new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString().slice(0,10);
  const candles = await fetchYahooDaily(symbol, start, end);
  const last = candles[candles.length - 1];
  if (!last) return res.status(400).json({ error: 'no price' });
  const price = last.close;

  const pos = acct.positions[symbol] || { qty: 0, avg: 0 };
  if (side === 'buy') {
    const cost = price * qty;
    if (acct.cash < cost) return res.status(400).json({ error: 'insufficient cash' });
    const newQty = pos.qty + qty;
    const newAvg = (pos.avg * pos.qty + price * qty) / newQty;
    acct.cash -= cost;
    acct.positions[symbol] = { qty: newQty, avg: newAvg };
  } else {
    if (pos.qty < qty) return res.status(400).json({ error: 'insufficient qty' });
    pos.qty -= qty;
    acct.cash += price * qty;
    acct.positions[symbol] = pos;
  }
  res.json({ ok: true, account: acct });
});

paperRouter.get('/account/:id', async (req, res) => {
  const acct = accounts.get(req.params.id);
  if (!acct) return res.status(404).json({ error: 'not found' });
  // mark-to-market equity
  let equity = acct.cash;
  for (const [sym, p] of Object.entries(acct.positions)) {
    const end = new Date().toISOString().slice(0,10);
    const start = new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString().slice(0,10);
    const candles = await fetchYahooDaily(sym, start, end);
    const last = candles[candles.length - 1];
    if (last) equity += p.qty * last.close;
  }
  acct.equityHistory.push({ t: Date.now(), equity });
  res.json(acct);
});


