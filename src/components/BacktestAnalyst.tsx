import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, Brain, TrendingUp, AlertTriangle, Zap, Target, Shield, BarChart3, CheckCircle, Copy, Eye, Settings, Database } from 'lucide-react';
import { useBacktestAnalyst } from '../hooks/useAgents';
// Enhanced charting library for interactive data visualization
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Props interface for the enhanced AI Backtest Analyst component
interface BacktestAnalystProps {
  backtestResults?: any;
  onAnalyze?: (analysis: string) => void;
  autoAnalyze?: boolean;
}

// Main AI Backtest Analyst component with institutional-grade analysis capabilities
export default function BacktestAnalyst({ 
  backtestResults, 
  onAnalyze, 
  autoAnalyze = false 
}: BacktestAnalystProps) {
  // State management for analysis display and sample data toggle
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);
  const { data, loading, error, analyzeBacktest, reset } = useBacktestAnalyst();

  // Enhanced sample backtest data with comprehensive metrics for demonstration
  const sampleBacktestData = {
    // Basic Performance Metrics
    totalTrades: 127,
    winRate: 0.68,
    totalReturn: 0.24,
    maxDrawdown: 0.08,
    profitFactor: 2.1,
    sharpeRatio: 1.6,
    avgWin: 0.015,
    avgLoss: -0.008,
    largestWin: 0.045,
    largestLoss: -0.032,
    winStreak: 8,
    lossStreak: 4,
    avgTradeDuration: 2.5,
    
    // Advanced Risk Metrics
    sortinoRatio: 2.3,
    calmarRatio: 3.0,
    omegaRatio: 1.8,
    var95: 0.025,
    expectedShortfall: 0.035,
    maxConsecutiveLosses: 4,
    maxConsecutiveWins: 8,
    recoveryTime: 12,
    
    // Trade Quality Metrics
    avgWinLossRatio: 1.875,
    expectancy: 0.0085,
    kellyPercentage: 0.12,
    riskOfRuin: 0.05,
    mae: 0.015,
    mfe: 0.025,
    
    // Market Regime Performance
    bullMarketReturn: 0.18,
    bearMarketReturn: -0.05,
    sidewaysMarketReturn: 0.08,
    highVolatilityReturn: 0.12,
    lowVolatilityReturn: 0.15,
    
    // Time-based Analysis
    bestMonth: "March",
    worstMonth: "September",
    monthlyVolatility: 0.045,
    quarterlyReturns: [0.08, 0.06, 0.05, 0.05],
    
    // Strategy Information
    strategy: "RSI Mean Reversion",
    timeframe: "1H",
    symbol: "EURUSD",
    period: "2024-01-01 to 2024-06-30",
    commission: 0.0001,
    slippage: 0.0002,
    
    // Benchmark Comparison
    benchmarkReturn: 0.15,
    alpha: 0.09,
    beta: 0.85,
    informationRatio: 1.2,
    
    // Implementation Metrics
    avgSlippage: 0.00015,
    executionQuality: 0.92,
    fillRate: 0.98,
    latency: 45
  };

  // Sample chart data for visualization
  const sampleChartData = {
    equityCurve: [
      { date: '2024-01', equity: 10000 },
      { date: '2024-02', equity: 10250 },
      { date: '2024-03', equity: 10800 },
      { date: '2024-04', equity: 11200 },
      { date: '2024-05', equity: 11500 },
      { date: '2024-06', equity: 12400 }
    ],
    drawdowns: [
      { date: '2024-01', drawdown: 0 },
      { date: '2024-02', drawdown: -0.02 },
      { date: '2024-03', drawdown: -0.01 },
      { date: '2024-04', drawdown: -0.03 },
      { date: '2024-05', drawdown: -0.02 },
      { date: '2024-06', drawdown: 0 }
    ],
    monthlyReturns: [
      { month: 'Jan', return: 2.5 },
      { month: 'Feb', return: 5.4 },
      { month: 'Mar', return: 3.7 },
      { month: 'Apr', return: 2.7 },
      { month: 'May', return: 2.6 },
      { month: 'Jun', return: 7.8 }
    ],
    winLossDistribution: [
      { name: 'Wins', value: 68, color: '#10B981' },
      { name: 'Losses', value: 32, color: '#EF4444' }
    ]
  };

  const currentBacktestData = useSampleData ? sampleBacktestData : backtestResults;

  const handleAnalyze = async () => {
    if (!currentBacktestData || loading) return;

    try {
      const result = await analyzeBacktest(currentBacktestData);
      setShowAnalysis(true);
      onAnalyze?.(result.summary);
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const handleReset = () => {
    reset();
    setShowAnalysis(false);
  };

  // Auto-analyze when backtest results are provided and autoAnalyze is true
  React.useEffect(() => {
    if (autoAnalyze && currentBacktestData && !data && !loading && !error) {
      handleAnalyze();
    }
  }, [autoAnalyze, currentBacktestData, data, loading, error]);

  const hasResults = currentBacktestData && Object.keys(currentBacktestData).length > 0;

  if (!hasResults && !data) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-gray-700">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  AI Backtest Analyst
                </CardTitle>
                <CardDescription className="text-gray-300 mt-1">
                  Run a backtest to get AI-powered analysis of your strategy's performance.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-600 text-white border-purple-500">
              <Zap className="h-3 w-3 mr-1" />
              Powered by Gemini AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="bg-gray-900">
          <div className="text-center py-12 text-gray-400">
            <div className="p-4 bg-purple-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Backtest Results Available</h3>
            <p className="text-gray-300 mb-4">Complete a backtest to unlock AI-powered performance analysis.</p>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 max-w-md mx-auto">
              <h4 className="font-medium text-white mb-3">What you'll get:</h4>
              <ul className="text-sm text-gray-300 space-y-2 text-left mb-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Professional performance assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Risk analysis and drawdown evaluation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Specific improvement recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Market condition suitability analysis
                </li>
              </ul>
              <Button
                onClick={() => setUseSampleData(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Try with Sample Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                AI Backtest Analyst
              </CardTitle>
              <CardDescription className="text-gray-300 mt-1">
                Get AI-powered insights and recommendations based on your backtest results.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-600 text-white border-purple-500">
            <Zap className="h-3 w-3 mr-1" />
            Powered by Gemini AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasResults && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <h4 className="font-semibold text-white">Backtest Summary</h4>
              </div>
              {useSampleData && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-600 text-white border-amber-500">
                    Sample Data
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUseSampleData(false);
                      setShowAnalysis(false);
                      reset();
                    }}
                    className="text-xs border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-white"
                  >
                    Use Real Data
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentBacktestData.totalTrades && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-blue-400 mb-1">Total Trades</div>
                  <div className="font-bold text-white text-lg">{currentBacktestData.totalTrades}</div>
                </div>
              )}
              {currentBacktestData.winRate !== undefined && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-blue-400 mb-1">Win Rate</div>
                  <div className="font-bold text-white text-lg">{(currentBacktestData.winRate * 100).toFixed(1)}%</div>
                </div>
              )}
              {currentBacktestData.totalReturn !== undefined && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-blue-400 mb-1">Total Return</div>
                  <div className={`font-bold text-lg ${currentBacktestData.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(currentBacktestData.totalReturn * 100).toFixed(2)}%
                  </div>
                </div>
              )}
              {currentBacktestData.maxDrawdown !== undefined && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-blue-400 mb-1">Max Drawdown</div>
                  <div className="font-bold text-red-400 text-lg">
                    {(currentBacktestData.maxDrawdown * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
            
            {/* Advanced Risk Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {currentBacktestData.profitFactor && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-blue-400 mb-1">Profit Factor</div>
                  <div className="font-bold text-white text-lg">{currentBacktestData.profitFactor}</div>
                </div>
              )}
              {currentBacktestData.sharpeRatio && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-blue-400 mb-1">Sharpe Ratio</div>
                  <div className="font-bold text-white text-lg">{currentBacktestData.sharpeRatio}</div>
                </div>
              )}
              {currentBacktestData.sortinoRatio && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-purple-400 mb-1">Sortino Ratio</div>
                  <div className="font-bold text-white text-lg">{currentBacktestData.sortinoRatio}</div>
                </div>
              )}
              {currentBacktestData.calmarRatio && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-orange-400 mb-1">Calmar Ratio</div>
                  <div className="font-bold text-white text-lg">{currentBacktestData.calmarRatio}</div>
                </div>
              )}
            </div>

            {/* Trade Quality Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {currentBacktestData.avgWin && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-green-400 mb-1">Avg Win</div>
                  <div className="font-bold text-green-400 text-lg">{(currentBacktestData.avgWin * 100).toFixed(2)}%</div>
                </div>
              )}
              {currentBacktestData.avgLoss && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-red-400 mb-1">Avg Loss</div>
                  <div className="font-bold text-red-400 text-lg">{(currentBacktestData.avgLoss * 100).toFixed(2)}%</div>
                </div>
              )}
              {currentBacktestData.avgWinLossRatio && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-blue-400 mb-1">Win/Loss Ratio</div>
                  <div className="font-bold text-white text-lg">{currentBacktestData.avgWinLossRatio}</div>
                </div>
              )}
              {currentBacktestData.expectancy && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-yellow-400 mb-1">Expectancy</div>
                  <div className="font-bold text-white text-lg">{(currentBacktestData.expectancy * 100).toFixed(3)}%</div>
                </div>
              )}
            </div>

            {/* Risk Assessment Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {currentBacktestData.var95 && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-red-400 mb-1">VaR (95%)</div>
                  <div className="font-bold text-red-400 text-lg">{(currentBacktestData.var95 * 100).toFixed(2)}%</div>
                </div>
              )}
              {currentBacktestData.expectedShortfall && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-red-400 mb-1">Expected Shortfall</div>
                  <div className="font-bold text-red-400 text-lg">{(currentBacktestData.expectedShortfall * 100).toFixed(2)}%</div>
                </div>
              )}
              {currentBacktestData.riskOfRuin && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-orange-400 mb-1">Risk of Ruin</div>
                  <div className="font-bold text-orange-400 text-lg">{(currentBacktestData.riskOfRuin * 100).toFixed(1)}%</div>
                </div>
              )}
              {currentBacktestData.kellyPercentage && (
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="text-xs text-green-400 mb-1">Kelly %</div>
                  <div className="font-bold text-green-400 text-lg">{(currentBacktestData.kellyPercentage * 100).toFixed(1)}%</div>
                </div>
              )}
            </div>

            {/* Market Regime Performance */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h4 className="text-white mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Market Regime Performance
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-400 font-medium">Bull Market:</span>
                  <div className="text-green-400 font-semibold">{(currentBacktestData.bullMarketReturn * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-red-400 font-medium">Bear Market:</span>
                  <div className="text-red-400 font-semibold">{(currentBacktestData.bearMarketReturn * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-yellow-400 font-medium">Sideways:</span>
                  <div className="text-yellow-400 font-semibold">{(currentBacktestData.sidewaysMarketReturn * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-blue-400 font-medium">High Vol:</span>
                  <div className="text-blue-400 font-semibold">{(currentBacktestData.highVolatilityReturn * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h4 className="text-white mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-400" />
                Benchmark Comparison
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-400 font-medium">Strategy Return:</span>
                  <div className="text-white font-semibold">{(currentBacktestData.totalReturn * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Benchmark:</span>
                  <div className="text-gray-300 font-semibold">{(currentBacktestData.benchmarkReturn * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-green-400 font-medium">Alpha:</span>
                  <div className={`font-semibold ${currentBacktestData.alpha > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(currentBacktestData.alpha * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-purple-400 font-medium">Beta:</span>
                  <div className="text-purple-400 font-semibold">{currentBacktestData.beta}</div>
                </div>
              </div>
            </div>

            {/* Strategy Info */}
            {currentBacktestData.strategy && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="text-white mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-400" />
                  Strategy Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-400 font-medium">Strategy:</span>
                    <div className="text-white">{currentBacktestData.strategy}</div>
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium">Symbol:</span>
                    <div className="text-white">{currentBacktestData.symbol}</div>
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium">Period:</span>
                    <div className="text-white">{currentBacktestData.period}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!showAnalysis && !loading && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="font-medium text-white">Ready for AI Analysis</span>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!hasResults || loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Brain className="h-4 w-4" />
                Analyze with Gemini AI
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                <div>
                  <div className="font-medium text-white">AI is analyzing your backtest results...</div>
                  <div className="text-sm text-gray-300">This may take a few moments</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-800">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {data && showAnalysis && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI Analysis & Recommendations</h3>
                    <p className="text-sm text-gray-300">Professional performance analysis by Gemini AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Analysis Complete
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={loading}
                    className="border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-white"
                  >
                    New Analysis
                  </Button>
                </div>
              </div>
            </div>

            {/* Structured Analysis Display */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-4 w-4 text-blue-400" />
                <h4 className="font-semibold text-white">Performance Analysis</h4>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-white leading-relaxed">
                    {data.summary}
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Categories */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-blue-400" />
                  <h4 className="font-semibold text-white">Key Insights</h4>
                </div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Performance assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Risk evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Market suitability
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-green-400" />
                  <h4 className="font-semibold text-white">Recommendations</h4>
                </div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Improvement suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Risk management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Optimization tips
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-400 bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Analysis by {data.powered_by}
              </div>
              <div className="flex items-center gap-4">
                <span>Professional Analysis</span>
                <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                  AI-Powered
                </Badge>
              </div>
            </div>
          </div>
        )}

        {!data && !loading && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-blue-400" />
              <h4 className="font-semibold text-white">What You'll Get</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Performance assessment and key insights
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Risk analysis and drawdown evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Specific improvement recommendations
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Market condition suitability analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Actionable next steps for optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Professional trading consultant insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Charts Section */}
        {data && data.summary && (
          <div className="mt-6 space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
              <h4 className="text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Performance Visualization
              </h4>
              
              {/* Equity Curve Chart */}
              <div className="mb-6">
                <h5 className="text-white mb-3 text-sm font-medium">Equity Curve</h5>
                <div className="h-64 bg-gray-900 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleChartData.equityCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F9FAFB'
                        }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Equity']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="equity" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Returns Chart */}
              <div className="mb-6">
                <h5 className="text-white mb-3 text-sm font-medium">Monthly Returns</h5>
                <div className="h-48 bg-gray-900 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampleChartData.monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F9FAFB'
                        }}
                        formatter={(value: any) => [`${value}%`, 'Return']}
                      />
                      <Bar 
                        dataKey="return" 
                        fill="#3B82F6"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Win/Loss Distribution Pie Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-white mb-3 text-sm font-medium">Win/Loss Distribution</h5>
                  <div className="h-48 bg-gray-900 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sampleChartData.winLossDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sampleChartData.winLossDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '6px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value: any, name: any) => [`${value}%`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Drawdown Chart */}
                <div>
                  <h5 className="text-white mb-3 text-sm font-medium">Drawdown Analysis</h5>
                  <div className="h-48 bg-gray-900 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sampleChartData.drawdowns}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF" 
                          fontSize={12}
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis 
                          stroke="#9CA3AF" 
                          fontSize={12}
                          tick={{ fill: '#9CA3AF' }}
                          tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '6px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value: any) => [`${(value * 100).toFixed(2)}%`, 'Drawdown']}
                        />
                        <Bar 
                          dataKey="drawdown" 
                          fill="#EF4444"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
