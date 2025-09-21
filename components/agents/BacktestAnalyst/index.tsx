/**
 * Backtest Analyst Component
 * 
 * The main UI component for the Backtest Analyst agent that provides
 * comprehensive analysis of backtest results with institutional-grade insights.
 * 
 * Usage:
 * ```tsx
 * <BacktestAnalyst />
 * ```
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Upload,
  FileText,
  Target,
  Shield,
  BookOpen
} from 'lucide-react';

import { ProgressIndicator } from '@/components/shared/ProgressIndicator';
import { StreamingResponse } from '@/components/shared/StreamingResponse';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export interface BacktestAnalystProps {
  className?: string;
}

export interface BacktestData {
  equityCurve: number[];
  returns: number[];
  trades: any[];
  metrics: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    totalTrades: number;
  };
}

export interface AnalysisResult {
  overallAssessment: any;
  performanceAnalysis: any;
  riskAnalysis: any;
  tradeAnalysis: any;
  optimizationSuggestions: any[];
  educationalInsights: any;
  confidence: number;
}

export const BacktestAnalyst: React.FC<BacktestAnalystProps> = ({ className = '' }) => {
  const [backtestData, setBacktestData] = useState<BacktestData | null>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [streamingData, setStreamingData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setBacktestData(data);
        setError(null);
      } catch (err) {
        setError('Invalid JSON file. Please upload a valid backtest results file.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!backtestData || !strategy) {
      setError('Please upload backtest data and strategy configuration');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setStreamingData(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 800);

      // Simulate streaming response
      setStreamingData({
        content: '',
        isComplete: false,
        progress: 0,
        status: 'streaming',
        metadata: {
          agentId: 'backtest-analyst',
          timestamp: Date.now(),
        },
      });

      // Simulate API call
      const response = await fetch('/api/agents/backtest-analyst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backtestResults: backtestData,
          strategy: strategy,
          options: {
            includeRiskAnalysis: true,
            includeMarketRegimeAnalysis: true,
            includeOptimizationSuggestions: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Simulate streaming completion
      setStreamingData(prev => ({
        ...prev,
        content: data.explanation || 'Analysis completed successfully!',
        isComplete: true,
        progress: 100,
        status: 'complete',
      }));

      setResult(data.data);
      setActiveTab('analysis');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStreamingData(prev => ({
        ...prev,
        isComplete: true,
        status: 'error',
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    } finally {
      setIsAnalyzing(false);
    }
  }, [backtestData, strategy]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B+':
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C+':
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'needs_improvement':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-orange-600 bg-orange-100';
      case 'avoid':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <ErrorBoundary>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Backtest Analyst</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get institutional-grade analysis of your backtest results with comprehensive 
            insights, risk assessment, and optimization recommendations.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Optimization</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Backtest Data Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Backtest Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your backtest results JSON file
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="backtest-upload"
                    />
                    <Button asChild>
                      <label htmlFor="backtest-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                  
                  {backtestData && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Uploaded Data</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Total Return: <Badge variant="outline">{backtestData.metrics.totalReturn.toFixed(2)}%</Badge></div>
                        <div>Sharpe Ratio: <Badge variant="outline">{backtestData.metrics.sharpeRatio.toFixed(2)}</Badge></div>
                        <div>Max Drawdown: <Badge variant="outline">{backtestData.metrics.maxDrawdown.toFixed(2)}%</Badge></div>
                        <div>Win Rate: <Badge variant="outline">{backtestData.metrics.winRate.toFixed(1)}%</Badge></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Strategy Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Strategy Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your strategy configuration JSON file
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const data = JSON.parse(event.target?.result as string);
                              setStrategy(data);
                            } catch (err) {
                              setError('Invalid strategy JSON file');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                      id="strategy-upload"
                    />
                    <Button asChild>
                      <label htmlFor="strategy-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                  
                  {strategy && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Strategy Details</h4>
                      <div className="text-sm space-y-1">
                        <div>Type: <Badge variant="outline">{strategy.type}</Badge></div>
                        <div>Name: {strategy.name}</div>
                        <div>Parameters: {Object.keys(strategy.params || {}).length}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !backtestData || !strategy}
                size="lg"
                className="px-8"
              >
                {isAnalyzing ? (
                  <>
                    <BarChart3 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Analyze Backtest
                  </>
                )}
              </Button>
            </div>

            {/* Progress Indicator */}
            {isAnalyzing && (
              <ProgressIndicator
                progress={progress}
                message="Analyzing backtest results..."
                status="in_progress"
                variant="detailed"
              />
            )}

            {/* Streaming Response */}
            {streamingData && (
              <StreamingResponse
                response={streamingData}
                showProgress={true}
                showControls={true}
                maxHeight="300px"
              />
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {result ? (
              <>
                {/* Overall Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Overall Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${getGradeColor(result.overallAssessment.grade)}`}>
                          {result.overallAssessment.grade}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Grade</p>
                      </div>
                      <div className="text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${getRecommendationColor(result.overallAssessment.recommendation)}`}>
                          {result.overallAssessment.recommendation.replace('_', ' ')}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Recommendation</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {Math.round(result.overallAssessment.overallScore)}
                        </div>
                        <p className="text-sm text-muted-foreground">Score (0-100)</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.overallAssessment.summary}
                        </p>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.overallAssessment.strengths.map((strength: string, index: number) => (
                              <li key={index}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Weaknesses</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.overallAssessment.weaknesses.map((weakness: string, index: number) => (
                              <li key={index}>• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Performance Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.performanceAnalysis.totalReturn.toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Total Return</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">
                          {result.performanceAnalysis.sharpeRatio.toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {result.performanceAnalysis.maxDrawdown.toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Max Drawdown</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">
                          {result.performanceAnalysis.winRate.toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Risk Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold">
                            {result.riskAnalysis.riskScore}
                          </div>
                          <p className="text-sm text-muted-foreground">Risk Score (0-100)</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold">
                            {result.riskAnalysis.valueAtRisk.toFixed(2)}%
                          </div>
                          <p className="text-sm text-muted-foreground">Value at Risk</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold">
                            {result.riskAnalysis.expectedShortfall.toFixed(2)}%
                          </div>
                          <p className="text-sm text-muted-foreground">Expected Shortfall</p>
                        </div>
                      </div>
                      
                      {result.riskAnalysis.riskFactors.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Risk Factors</h4>
                          <div className="space-y-2">
                            {result.riskAnalysis.riskFactors.map((factor: any, index: number) => (
                              <div key={index} className="flex items-start space-x-2 p-3 border rounded-lg">
                                <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                                  factor.severity === 'high' ? 'text-red-500' :
                                  factor.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium">{factor.type}</span>
                                    <Badge variant={
                                      factor.severity === 'high' ? 'destructive' :
                                      factor.severity === 'medium' ? 'default' : 'secondary'
                                    }>
                                      {factor.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                                  <p className="text-sm text-blue-600 mt-1">
                                    <strong>Mitigation:</strong> {factor.mitigation}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground">
                    Upload your backtest data and strategy configuration to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            {result?.optimizationSuggestions ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Optimization Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.optimizationSuggestions.map((suggestion: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              suggestion.priority === 'high' ? 'destructive' :
                              suggestion.priority === 'medium' ? 'default' : 'secondary'
                            }>
                              {suggestion.priority}
                            </Badge>
                            <Badge variant="outline">{suggestion.type}</Badge>
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{suggestion.description}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Expected Impact:</strong> {suggestion.expectedImpact}
                        </p>
                        <p className="text-sm text-blue-600">
                          <strong>Implementation:</strong> {suggestion.implementation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Optimization Suggestions</h3>
                  <p className="text-muted-foreground">
                    Complete the analysis first to see optimization recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Learning Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Key Metrics Explained</h4>
                  <div className="grid gap-3">
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">Sharpe Ratio</h5>
                      <p className="text-sm text-muted-foreground">
                        Measures risk-adjusted returns. Higher values indicate better risk-adjusted performance.
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">Maximum Drawdown</h5>
                      <p className="text-sm text-muted-foreground">
                        The largest peak-to-trough decline in your strategy's value.
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">Win Rate</h5>
                      <p className="text-sm text-muted-foreground">
                        Percentage of profitable trades. Higher is generally better, but not always.
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">Profit Factor</h5>
                      <p className="text-sm text-muted-foreground">
                        Ratio of gross profit to gross loss. Values above 1.0 indicate profitability.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Best Practices</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Always consider risk-adjusted returns, not just absolute returns</li>
                    <li>• Look for consistent performance across different market conditions</li>
                    <li>• Pay attention to maximum drawdown and recovery time</li>
                    <li>• Consider transaction costs and slippage in your analysis</li>
                    <li>• Test strategies on out-of-sample data to avoid overfitting</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default BacktestAnalyst;
