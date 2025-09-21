/**
 * AlgoMentor AI Backend Server
 * 
 * This is the main entry point for the AlgoMentor AI backend API server.
 * It provides RESTful endpoints for all AI agents and trading services.
 * 
 * Features:
 * - Multi-agent AI system (Strategy Builder, Backtest Analyst, Trade Coach, etc.)
 * - Comprehensive error handling and logging
 * - Progress tracking and streaming responses
 * - Health monitoring and diagnostics
 * - Input validation and security
 * 
 * Usage:
 * ```bash
 * npm run dev    # Development server
 * npm run build  # Production build
 * npm start      # Production server
 * ```
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ErrorLogger } from '../agents/shared/errors';
import { initializeGeminiClient } from '../services/ai/gemini-client';

// Import route handlers
import { agentsRouter } from './routes/agents';
// import { backtestRouter } from './routes/backtest';
// import { healthRouter } from './routes/health';

// Load environment variables
dotenv.config();

// Initialize error logger
const errorLogger = ErrorLogger.getInstance();

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Gemini AI client
try {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
    console.warn('   AI agents will use fallback/mock responses');
  } else {
    initializeGeminiClient({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      timeout: parseInt(process.env.GEMINI_TIMEOUT || '30000'),
    });
    console.log('✅ Gemini AI client initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI client:', error);
  console.warn('   AI agents will use fallback/mock responses');
}

// Security middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later',
      suggestedFix: 'Please wait 15 minutes before making more requests',
      timestamp: Date.now(),
    },
    powered_by: 'AlgoMentor AI',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request ID middleware
app.use((req, res, next) => {
  req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Global error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorLogger.log(
    ErrorFactory.aiServiceError('Unhandled server error', { 
      error: error.message,
      stack: error.stack,
      requestId: req.id,
      path: req.path,
    }),
    { request: req.body, headers: req.headers }
  );

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      suggestedFix: 'Please try again later or contact support',
      timestamp: Date.now(),
    },
    requestId: req.id,
    powered_by: 'AlgoMentor AI',
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: NODE_ENV,
      services: {
        gemini: !!process.env.GEMINI_API_KEY,
        // Add other service checks as needed
      },
    },
    powered_by: 'AlgoMentor AI',
  });
});

// API routes
app.use('/api/agents', agentsRouter);
// app.use('/api/backtest', backtestRouter);
// app.use('/api/health', healthRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Welcome to AlgoMentor AI API',
      version: process.env.npm_package_version || '1.0.0',
      documentation: '/api/docs',
      health: '/health',
      agents: '/api/agents/health',
    },
    powered_by: 'AlgoMentor AI',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint '${req.originalUrl}' not found`,
      suggestedFix: 'Please check the API documentation for available endpoints',
      timestamp: Date.now(),
    },
    requestId: req.id,
    powered_by: 'AlgoMentor AI',
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 AlgoMentor AI Backend Server Started');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Agents health: http://localhost:${PORT}/api/agents/health`);
  console.log(`📚 API documentation: http://localhost:${PORT}/api/docs`);
  
  if (NODE_ENV === 'development') {
    console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8081'}`);
  }
});

// Handle server errors
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('   Please try a different port or stop the existing server');
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Export app for testing
export default app;