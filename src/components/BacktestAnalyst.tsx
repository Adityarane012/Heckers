import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, Brain, TrendingUp, AlertTriangle, Zap, Target, Shield, BarChart3, CheckCircle, Copy, Eye, Settings, Database } from 'lucide-react';
import { useBacktestAnalyst } from '../hooks/useAgents';

interface BacktestAnalystProps {
  backtestResults?: any;
  onAnalyze?: (analysis: string) => void;
  autoAnalyze?: boolean;
}

export default function BacktestAnalyst({ 
  backtestResults, 
  onAnalyze, 
  autoAnalyze = false 
}: BacktestAnalystProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);
  const { data, loading, error, analyzeBacktest, reset } = useBacktestAnalyst();

  // Sample backtest data for demonstration
  const sampleBacktestData = {
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
    strategy: "RSI Mean Reversion",
    timeframe: "1H",
    symbol: "EURUSD",
    period: "2024-01-01 to 2024-06-30"
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
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-purple-900">
                  AI Backtest Analyst
                </CardTitle>
                <CardDescription className="text-purple-700 mt-1">
                  Run a backtest to get AI-powered analysis of your strategy's performance.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
              <Zap className="h-3 w-3 mr-1" />
              Powered by Gemini AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Brain className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Backtest Results Available</h3>
            <p className="text-gray-600 mb-4">Complete a backtest to unlock AI-powered performance analysis.</p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-3">What you'll get:</h4>
              <ul className="text-sm text-blue-800 space-y-2 text-left mb-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Professional performance assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Risk analysis and drawdown evaluation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Specific improvement recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-purple-900">
                AI Backtest Analyst
              </CardTitle>
              <CardDescription className="text-purple-700 mt-1">
                Get AI-powered insights and recommendations based on your backtest results.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            <Zap className="h-3 w-3 mr-1" />
            Powered by Gemini AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasResults && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Backtest Summary</h4>
              </div>
              {useSampleData && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
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
                    className="text-xs border-amber-200 hover:border-amber-400 hover:bg-amber-50"
                  >
                    Use Real Data
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentBacktestData.totalTrades && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Total Trades</div>
                  <div className="font-bold text-blue-900 text-lg">{currentBacktestData.totalTrades}</div>
                </div>
              )}
              {currentBacktestData.winRate !== undefined && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Win Rate</div>
                  <div className="font-bold text-blue-900 text-lg">{(currentBacktestData.winRate * 100).toFixed(1)}%</div>
                </div>
              )}
              {currentBacktestData.totalReturn !== undefined && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Total Return</div>
                  <div className={`font-bold text-lg ${currentBacktestData.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(currentBacktestData.totalReturn * 100).toFixed(2)}%
                  </div>
                </div>
              )}
              {currentBacktestData.maxDrawdown !== undefined && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Max Drawdown</div>
                  <div className="font-bold text-red-600 text-lg">
                    {(currentBacktestData.maxDrawdown * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {currentBacktestData.profitFactor && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Profit Factor</div>
                  <div className="font-bold text-blue-900 text-lg">{currentBacktestData.profitFactor}</div>
                </div>
              )}
              {currentBacktestData.sharpeRatio && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Sharpe Ratio</div>
                  <div className="font-bold text-blue-900 text-lg">{currentBacktestData.sharpeRatio}</div>
                </div>
              )}
              {currentBacktestData.avgWin && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Avg Win</div>
                  <div className="font-bold text-green-600 text-lg">{(currentBacktestData.avgWin * 100).toFixed(2)}%</div>
                </div>
              )}
              {currentBacktestData.avgLoss && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Avg Loss</div>
                  <div className="font-bold text-red-600 text-lg">{(currentBacktestData.avgLoss * 100).toFixed(2)}%</div>
                </div>
              )}
            </div>

            {/* Strategy Info */}
            {currentBacktestData.strategy && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Strategy:</span>
                    <div className="text-blue-900">{currentBacktestData.strategy}</div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Symbol:</span>
                    <div className="text-blue-900">{currentBacktestData.symbol}</div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Period:</span>
                    <div className="text-blue-900">{currentBacktestData.period}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!showAnalysis && !loading && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Ready for AI Analysis</span>
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
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">AI is analyzing your backtest results...</div>
                  <div className="text-sm text-purple-700">This may take a few moments</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {data && showAnalysis && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">AI Analysis & Recommendations</h3>
                    <p className="text-sm text-green-700">Professional performance analysis by Gemini AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Analysis Complete
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={loading}
                    className="border-green-200 hover:border-green-400 hover:bg-green-50"
                  >
                    New Analysis
                  </Button>
                </div>
              </div>
            </div>

            {/* Structured Analysis Display */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-4 w-4 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Performance Analysis</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {data.summary}
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Categories */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Key Insights</h4>
                </div>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Performance assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Risk evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Market suitability
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-900">Recommendations</h4>
                </div>
                <ul className="text-sm text-green-800 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Improvement suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Risk management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Optimization tips
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Analysis by {data.powered_by}
              </div>
              <div className="flex items-center gap-4">
                <span>Professional Analysis</span>
                <Badge variant="outline" className="text-xs">
                  AI-Powered
                </Badge>
              </div>
            </div>
          </div>
        )}

        {!data && !loading && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">What You'll Get</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Performance assessment and key insights
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Risk analysis and drawdown evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Specific improvement recommendations
                  </li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Market condition suitability analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Actionable next steps for optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Professional trading consultant insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
