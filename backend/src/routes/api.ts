import { Router } from 'express';
import { historyRouter } from './history.js';
import { backtestRouter } from './backtest.js';
import { strategiesRouter } from './strategies.js';
import { paperRouter } from './paper.js';
import { agentsRouter } from './agents.js';

export const router = Router();

router.use('/history', historyRouter);
router.use('/backtest', backtestRouter);
router.use('/strategies', strategiesRouter);
router.use('/paper', paperRouter);
router.use('/agents', agentsRouter);


