import { Router } from 'express';
import { z } from 'zod';

type Strategy = {
  id: string;
  name: string;
  definition: {
    kind: 'smaCross' | 'rsiReversion';
    params: Record<string, number>;
  };
  createdAt: number;
};

const db = new Map<string, Strategy>();

export const strategiesRouter = Router();

const upsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(64),
  definition: z.object({
    kind: z.enum(['smaCross', 'rsiReversion']),
    params: z.record(z.number()).default({})
  })
});

strategiesRouter.get('/', (_req, res) => {
  res.json({ strategies: Array.from(db.values()) });
});

strategiesRouter.post('/', (req, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { id, name, definition } = parsed.data;
  const newId = id ?? Math.random().toString(36).slice(2);
  const s: Strategy = { id: newId, name, definition, createdAt: Date.now() };
  db.set(newId, s);
  res.json(s);
});

strategiesRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.delete(id);
  res.json({ ok: true });
});


