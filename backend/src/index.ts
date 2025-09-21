// Enhanced AI-powered backend server for AlgoCode trading platform
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file with explicit path resolution
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env'),
  override: true 
});

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// Rate limiting for API protection
import rateLimit from 'express-rate-limit';

// Import API routes for AI agents and trading functionality
import { router as apiRouter } from './routes/api.js';

// Initialize Express application with enhanced middleware
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;

// Verify Gemini API key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
} else {
  console.log('✅ Gemini API key loaded successfully');
}

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
