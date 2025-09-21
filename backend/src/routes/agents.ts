/**
 * Agents API Routes
 * 
 * This module provides RESTful API endpoints for all AlgoMentor AI agents
 * with comprehensive error handling, progress tracking, and validation.
 * 
 * Endpoints:
 * - POST /api/agents/strategy-builder - Generate trading strategies
 * - POST /api/agents/backtest-analyst - Analyze backtest results
 * - POST /api/agents/trade-coach - Get trading coaching
 * - POST /api/agents/news-sentiment - Analyze news sentiment
 * - POST /api/agents/mentor - Get mentor guidance
 * - GET /api/agents/health - Health check for all agents
 */

import express from 'express';
import { AgentError, ErrorFactory, ErrorLogger } from '../../agents/shared/errors';
import { AgentResponse } from '../../agents/shared/types';
import { getStrategyBuilderAgent } from '../../agents/strategy-builder';
import { getBacktestAnalystAgent } from '../../agents/backtest-analyst';
// import { getTradeCoachAgent } from '../../agents/trade-coach';
// import { getNewsSentimentAgent } from '../../agents/news-sentiment';
// import { getMentorAgent } from '../../agents/mentor';

const router = express.Router();
const errorLogger = ErrorLogger.getInstance();

// Middleware for error handling
const handleAgentError = (error: any, res: express.Response, agentId: string) => {
  const agentError = error instanceof AgentError ? error : 
    ErrorFactory.aiServiceError(`Agent ${agentId} error: ${error.message}`, { originalError: error });

  errorLogger.log(agentError, { agentId, endpoint: res.req.path });

  const statusCode = agentError.status || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: agentError.code,
      message: agentError.message,
      suggestedFix: agentError.suggestedFix,
      timestamp: agentError.timestamp,
    },
    agentId,
    powered_by: 'AlgoMentor AI',
  });
};

// Middleware for progress tracking
const trackProgress = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const startTime = Date.now();
  req.startTime = startTime;
  
  // Override res.json to add timing information
  const originalJson = res.json;
  res.json = function(body: any) {
    if (body && typeof body === 'object') {
      body.metadata = {
        ...body.metadata,
        processingTime: Date.now() - startTime,
        timestamp: Date.now(),
      };
    }
    return originalJson.call(this, body);
  };
  
  next();
};

// Apply progress tracking to all routes
router.use(trackProgress);

// Strategy Builder Agent Routes
router.post('/strategy-builder', async (req, res) => {
  const agentId = 'strategy-builder';
  
  try {
    const { prompt, userId, sessionId, options } = req.body;
    
    // Input validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Prompt is required and must be a non-empty string',
          suggestedFix: 'Please provide a valid trading strategy description',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    if (prompt.length > 1000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Prompt is too long (maximum 1000 characters)',
          suggestedFix: 'Please shorten your strategy description',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    // Get agent instance
    const agent = getStrategyBuilderAgent();
    
    // Generate strategy
    const result = await agent.buildStrategy({
      prompt: prompt.trim(),
      userId,
      sessionId,
      options,
    });

    res.json({
      success: true,
      data: result.data,
      explanation: result.explanation,
      educationalSummary: result.educationalSummary,
      agentId,
      powered_by: 'AlgoMentor AI',
    });

  } catch (error) {
    handleAgentError(error, res, agentId);
  }
});

// Strategy Builder Alternatives Route
router.post('/strategy-builder/alternatives', async (req, res) => {
  const agentId = 'strategy-builder';
  
  try {
    const { prompt, count = 3, userId, sessionId, options } = req.body;
    
    // Input validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Prompt is required and must be a non-empty string',
          suggestedFix: 'Please provide a valid trading strategy description',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    if (count < 1 || count > 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Count must be between 1 and 5',
          suggestedFix: 'Please specify a count between 1 and 5',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    const agent = getStrategyBuilderAgent();
    const result = await agent.buildStrategyAlternatives({
      prompt: prompt.trim(),
      userId,
      sessionId,
      options,
    }, count);

    res.json({
      success: true,
      data: result.data,
      explanation: result.explanation,
      educationalSummary: result.educationalSummary,
      agentId,
      powered_by: 'AlgoMentor AI',
    });

  } catch (error) {
    handleAgentError(error, res, agentId);
  }
});

// Backtest Analyst Agent Routes
router.post('/backtest-analyst', async (req, res) => {
  const agentId = 'backtest-analyst';
  
  try {
    const { backtestResults, strategy, userId, sessionId, options } = req.body;
    
    // Input validation
    if (!backtestResults || typeof backtestResults !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Backtest results are required and must be an object',
          suggestedFix: 'Please provide valid backtest results data',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    if (!strategy || typeof strategy !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Strategy definition is required and must be an object',
          suggestedFix: 'Please provide a valid strategy configuration',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    // Validate required fields
    const requiredFields = ['metrics', 'trades'];
    const missingFields = requiredFields.filter(field => !backtestResults[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Missing required fields: ${missingFields.join(', ')}`,
          suggestedFix: 'Please ensure backtest results include metrics and trades',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    const agent = getBacktestAnalystAgent();
    const result = await agent.analyzeBacktest({
      backtestResults,
      strategy,
      userId,
      sessionId,
      options,
    });

    res.json({
      success: true,
      data: result.data,
      explanation: result.explanation,
      educationalSummary: result.educationalSummary,
      agentId,
      powered_by: 'AlgoMentor AI',
    });

  } catch (error) {
    handleAgentError(error, res, agentId);
  }
});

// Risk Analysis Route
router.post('/backtest-analyst/risk', async (req, res) => {
  const agentId = 'backtest-analyst';
  
  try {
    const { backtestResults } = req.body;
    
    if (!backtestResults || typeof backtestResults !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Backtest results are required and must be an object',
          suggestedFix: 'Please provide valid backtest results data',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    const agent = getBacktestAnalystAgent();
    const result = await agent.assessRisk(backtestResults);

    res.json({
      success: true,
      data: result.data,
      explanation: result.explanation,
      educationalSummary: result.educationalSummary,
      agentId,
      powered_by: 'AlgoMentor AI',
    });

  } catch (error) {
    handleAgentError(error, res, agentId);
  }
});

// Optimization Suggestions Route
router.post('/backtest-analyst/optimization', async (req, res) => {
  const agentId = 'backtest-analyst';
  
  try {
    const { backtestResults, strategy } = req.body;
    
    if (!backtestResults || !strategy) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Both backtest results and strategy are required',
          suggestedFix: 'Please provide both backtest results and strategy configuration',
          timestamp: Date.now(),
        },
        agentId,
      });
    }

    const agent = getBacktestAnalystAgent();
    const result = await agent.generateOptimizationSuggestions(backtestResults, strategy);

    res.json({
      success: true,
      data: result.data,
      explanation: result.explanation,
      educationalSummary: result.educationalSummary,
      agentId,
      powered_by: 'AlgoMentor AI',
    });

  } catch (error) {
    handleAgentError(error, res, agentId);
  }
});

// Health Check Route for All Agents
router.get('/health', async (req, res) => {
  try {
    const healthChecks = await Promise.allSettled([
      getStrategyBuilderAgent().getHealth(),
      getBacktestAnalystAgent().getHealth(),
      // Add other agents as they're implemented
    ]);

    const agentHealth = healthChecks.map((result, index) => {
      const agentNames = ['strategy-builder', 'backtest-analyst', 'trade-coach', 'news-sentiment', 'mentor'];
      
      if (result.status === 'fulfilled') {
        return {
          agent: agentNames[index],
          status: result.value.data?.status || 'unknown',
          healthy: true,
        };
      } else {
        return {
          agent: agentNames[index],
          status: 'unhealthy',
          healthy: false,
          error: result.reason?.message || 'Health check failed',
        };
      }
    });

    const overallHealth = agentHealth.every(agent => agent.healthy) ? 'healthy' : 'degraded';

    res.json({
      success: true,
      data: {
        overall: overallHealth,
        agents: agentHealth,
        timestamp: Date.now(),
      },
      powered_by: 'AlgoMentor AI',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_ERROR',
        message: 'Failed to perform health checks',
        suggestedFix: 'Please try again later or contact support',
        timestamp: Date.now(),
      },
      powered_by: 'AlgoMentor AI',
    });
  }
});

// Individual Agent Health Check
router.get('/health/:agentId', async (req, res) => {
  const { agentId } = req.params;
  
  try {
    let healthResult;
    
    switch (agentId) {
      case 'strategy-builder':
        healthResult = await getStrategyBuilderAgent().getHealth();
        break;
      case 'backtest-analyst':
        healthResult = await getBacktestAnalystAgent().getHealth();
        break;
      // Add other agents as they're implemented
      default:
        return res.status(404).json({
          success: false,
          error: {
            code: 'AGENT_NOT_FOUND',
            message: `Agent '${agentId}' not found`,
            suggestedFix: 'Please check the agent ID and try again',
            timestamp: Date.now(),
          },
        });
    }

    res.json({
      success: true,
      data: healthResult.data,
      agentId,
      powered_by: 'AlgoMentor AI',
    });

  } catch (error) {
    handleAgentError(error, res, agentId);
  }
});

// Error handling middleware for unmatched routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Agent endpoint '${req.originalUrl}' not found`,
      suggestedFix: 'Please check the endpoint URL and try again',
      timestamp: Date.now(),
    },
    powered_by: 'AlgoMentor AI',
  });
});

export { router as agentsRouter };