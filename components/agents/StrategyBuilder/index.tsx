/**
 * Strategy Builder Component
 * 
 * The main UI component for the Strategy Builder agent that allows users
 * to input natural language trading ideas and receive structured strategy configurations.
 * 
 * Usage:
 * ```tsx
 * <StrategyBuilder />
 * ```
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Lightbulb, 
  Copy, 
  Download, 
  RefreshCw,
  BookOpen,
  Code,
  BarChart3
} from 'lucide-react';

import { ProgressIndicator } from '@/components/shared/ProgressIndicator';
import { StreamingResponse } from '@/components/shared/StreamingResponse';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export interface StrategyBuilderProps {
  className?: string;
}

export interface StrategyResult {
  strategy: any;
  explanation: string;
  educationalSummary: string;
  confidence: number;
  alternatives?: any[];
}

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ className = '' }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [streamingData, setStreamingData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleGenerateStrategy = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a trading strategy description');
      return;
    }

    setIsGenerating(true);
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
          return prev + Math.random() * 20;
        });
      }, 500);

      // Simulate streaming response
      setStreamingData({
        content: '',
        isComplete: false,
        progress: 0,
        status: 'streaming',
        metadata: {
          agentId: 'strategy-builder',
          timestamp: Date.now(),
        },
      });

      // Simulate API call
      const response = await fetch('/api/agents/strategy-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          options: {
            includeEducationalContent: true,
            generateAlternatives: true,
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
        content: data.explanation || 'Strategy generated successfully!',
        isComplete: true,
        progress: 100,
        status: 'complete',
      }));

      setResult(data.data);
      setActiveTab('result');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStreamingData(prev => ({
        ...prev,
        isComplete: true,
        status: 'error',
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    } finally {
      setIsGenerating(false);
    }
  }, [prompt]);

  const handleCopyStrategy = useCallback(async () => {
    if (!result?.strategy) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.strategy, null, 2));
    } catch (err) {
      console.error('Failed to copy strategy:', err);
    }
  }, [result]);

  const handleDownloadStrategy = useCallback(() => {
    if (!result?.strategy) return;
    
    const blob = new Blob([JSON.stringify(result.strategy, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategy-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  const handleReset = useCallback(() => {
    setPrompt('');
    setResult(null);
    setError(null);
    setProgress(0);
    setStreamingData(null);
    setActiveTab('input');
  }, []);

  const examplePrompts = [
    "Buy when RSI drops below 30 and sell when it goes above 70",
    "Create a moving average crossover strategy with 20 and 50 day periods",
    "Build a momentum strategy that buys when price breaks above 20-day high",
    "Design a mean reversion strategy using Bollinger Bands",
    "Create a breakout strategy that trades when volume is above average",
  ];

  return (
    <ErrorBoundary>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Strategy Builder</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your trading ideas into executable strategies using natural language. 
            Describe your trading concept and get a structured strategy configuration.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Input</span>
            </TabsTrigger>
            <TabsTrigger value="result" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Describe Your Trading Strategy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="strategy-prompt" className="text-sm font-medium">
                    Trading Strategy Description
                  </label>
                  <Textarea
                    id="strategy-prompt"
                    placeholder="Describe your trading strategy in natural language..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about indicators, conditions, and entry/exit rules.
                  </p>
                </div>

                {/* Example Prompts */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Example Prompts</label>
                  <div className="grid gap-2">
                    {examplePrompts.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto p-3"
                        onClick={() => setPrompt(example)}
                        disabled={isGenerating}
                      >
                        <span className="text-sm">{example}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex space-x-2">
                  <Button
                    onClick={handleGenerateStrategy}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate Strategy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isGenerating}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Indicator */}
            {isGenerating && (
              <ProgressIndicator
                progress={progress}
                message="Generating your trading strategy..."
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

          {/* Result Tab */}
          <TabsContent value="result" className="space-y-6">
            {result ? (
              <>
                {/* Strategy Configuration */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Code className="h-5 w-5" />
                        <span>Generated Strategy</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCopyStrategy}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownloadStrategy}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Strategy Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Strategy Type</label>
                          <Badge variant="outline" className="ml-2">
                            {result.strategy.type}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Confidence</label>
                          <Badge 
                            variant={result.confidence > 0.8 ? 'default' : 'secondary'}
                            className="ml-2"
                          >
                            {Math.round(result.confidence * 100)}%
                          </Badge>
                        </div>
                      </div>

                      {/* Strategy JSON */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Strategy Configuration</label>
                        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                          {JSON.stringify(result.strategy, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Educational Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Educational Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">How This Strategy Works</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.explanation}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Learning Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.educationalSummary}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Alternatives */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Alternative Approaches</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.alternatives.map((alternative, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">{alternative.type}</Badge>
                              <Badge variant="secondary">
                                {Math.round(alternative.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <pre className="text-sm bg-muted p-2 rounded">
                              {JSON.stringify(alternative, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Strategy Generated</h3>
                  <p className="text-muted-foreground">
                    Go to the Input tab to describe your trading strategy and generate a configuration.
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
                  <h4 className="font-medium mb-3">Strategy Types</h4>
                  <div className="grid gap-3">
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">SMA Cross</h5>
                      <p className="text-sm text-muted-foreground">
                        Simple Moving Average crossover strategy that buys when fast MA crosses above slow MA.
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">RSI Reversion</h5>
                      <p className="text-sm text-muted-foreground">
                        Mean reversion strategy using RSI to identify oversold/overbought conditions.
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">MACD</h5>
                      <p className="text-sm text-muted-foreground">
                        MACD signal line crossover strategy for trend following.
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">Breakout</h5>
                      <p className="text-sm text-muted-foreground">
                        Price breakout strategy that trades when price breaks above/below key levels.
                      </p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium">Momentum</h5>
                      <p className="text-sm text-muted-foreground">
                        Momentum-based strategy that trades in the direction of price movement.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Best Practices</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Be specific about indicators and their parameters</li>
                    <li>• Include entry and exit conditions clearly</li>
                    <li>• Consider risk management in your strategy</li>
                    <li>• Test strategies with backtesting before live trading</li>
                    <li>• Start with simple strategies and gradually add complexity</li>
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

export default StrategyBuilder;
