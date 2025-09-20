import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
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
  const { data, loading, error, analyzeBacktest, reset } = useBacktestAnalyst();

  const handleAnalyze = async () => {
    if (!backtestResults || loading) return;

    try {
      const result = await analyzeBacktest(backtestResults);
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
    if (autoAnalyze && backtestResults && !data && !loading && !error) {
      handleAnalyze();
    }
  }, [autoAnalyze, backtestResults, data, loading, error]);

  const hasResults = backtestResults && Object.keys(backtestResults).length > 0;

  if (!hasResults && !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Backtest Analyst
            <Badge variant="secondary" className="ml-auto">
              Powered by Gemini AI
            </Badge>
          </CardTitle>
          <CardDescription>
            Run a backtest to get AI-powered analysis of your strategy's performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No backtest results available for analysis.</p>
            <p className="text-sm mt-2">Complete a backtest to unlock AI insights.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Backtest Analyst
          <Badge variant="secondary" className="ml-auto">
            Powered by Gemini AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Get AI-powered insights and recommendations based on your backtest results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasResults && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Backtest Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {backtestResults.totalTrades && (
                <div>
                  <span className="text-gray-600">Total Trades:</span>
                  <div className="font-medium">{backtestResults.totalTrades}</div>
                </div>
              )}
              {backtestResults.winRate !== undefined && (
                <div>
                  <span className="text-gray-600">Win Rate:</span>
                  <div className="font-medium">{(backtestResults.winRate * 100).toFixed(1)}%</div>
                </div>
              )}
              {backtestResults.totalReturn !== undefined && (
                <div>
                  <span className="text-gray-600">Total Return:</span>
                  <div className={`font-medium ${backtestResults.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(backtestResults.totalReturn * 100).toFixed(2)}%
                  </div>
                </div>
              )}
              {backtestResults.maxDrawdown !== undefined && (
                <div>
                  <span className="text-gray-600">Max Drawdown:</span>
                  <div className="font-medium text-red-600">
                    {(backtestResults.maxDrawdown * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!showAnalysis && !loading && (
          <Button
            onClick={handleAnalyze}
            disabled={!hasResults || loading}
            className="w-full flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Analyze with Gemini AI
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>AI is analyzing your backtest results...</span>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                AI Analysis & Recommendations
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={loading}
              >
                New Analysis
              </Button>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-800">
                  {data.summary}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Analysis by {data.powered_by}
            </div>
          </div>
        )}

        {!data && !loading && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Performance assessment and key insights</li>
              <li>• Risk analysis and drawdown evaluation</li>
              <li>• Specific improvement recommendations</li>
              <li>• Market condition suitability analysis</li>
              <li>• Actionable next steps for optimization</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
