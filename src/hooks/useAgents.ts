import { useState } from 'react';

const env = (import.meta as any)?.env ?? {};
const BASE_URL = env.VITE_API_URL ?? env.VITE_APP_API_URL ?? env.VITE_BACKEND_URL ?? 'http://localhost:4000';

export interface AgentResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  powered_by?: string;
}

export interface StrategyBuilderResponse {
  strategy: string;
  parsed: boolean;
  powered_by: string;
  note?: string;
}

export interface BacktestAnalystResponse {
  summary: string;
  powered_by: string;
}

export interface TradeCoachResponse {
  advice: string;
  trades_analyzed: number;
  powered_by: string;
}

export interface OHLCVAnalystResponse {
  analysis: string;
  data_points_analyzed: number;
  symbol: string;
  analysis_type: string;
  powered_by: string;
}

// Strategy Architect Hook
export function useStrategyArchitect() {
  const [state, setState] = useState<AgentResponse<StrategyBuilderResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const buildStrategy = async (prompt: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/api/agents/strategy-builder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to build strategy';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return {
    ...state,
    buildStrategy,
    reset,
  };
}

// Backtest Analyst Hook
export function useBacktestAnalyst() {
  const [state, setState] = useState<AgentResponse<BacktestAnalystResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const analyzeBacktest = async (stats: Record<string, any>) => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/api/agents/backtest-analyst`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze backtest';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return {
    ...state,
    analyzeBacktest,
    reset,
  };
}

// Trade Coach Hook
export function useTradeCoach() {
  const [state, setState] = useState<AgentResponse<TradeCoachResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const getCoachingAdvice = async (trades: any[]) => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/api/agents/trade-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trades }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get coaching advice';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return {
    ...state,
    getCoachingAdvice,
    reset,
  };
}

// OHLCV Analyst Hook
export function useOHLCVAnalyst() {
  const [state, setState] = useState<AgentResponse<OHLCVAnalystResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const analyzeOHLCV = async (ohlcvData: any[], symbol?: string, analysisType?: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/api/agents/ohlcv-analyst`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ohlcvData, symbol, analysisType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze OHLCV data';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return {
    ...state,
    analyzeOHLCV,
    reset,
  };
}

// Combined hook for all agents
export function useAgents() {
  const strategyArchitect = useStrategyArchitect();
  const backtestAnalyst = useBacktestAnalyst();
  const tradeCoach = useTradeCoach();
  const ohlcvAnalyst = useOHLCVAnalyst();

  return {
    strategyArchitect,
    backtestAnalyst,
    tradeCoach,
    ohlcvAnalyst,
  };
}

// Health check hook for agents
export function useAgentsHealth() {
  const [state, setState] = useState<AgentResponse<{
    status: string;
    agents: string[];
    gemini_configured: boolean;
    powered_by: string;
  }>>({
    data: null,
    loading: false,
    error: null,
  });

  const checkHealth = async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/api/agents/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check agent health';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return {
    ...state,
    checkHealth,
  };
}
