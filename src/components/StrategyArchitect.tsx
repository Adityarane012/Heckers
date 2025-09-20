import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, Sparkles, Copy, CheckCircle, Download, Eye, Settings, Target, TrendingUp, Shield } from 'lucide-react';
import { useStrategyArchitect } from '../hooks/useAgents';

export default function StrategyArchitect() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { data, loading, error, buildStrategy, reset } = useStrategyArchitect();

  // Parse strategy configuration for better display
  const parseStrategyConfig = (strategyText: string) => {
    try {
      // Extract JSON from the response
      const jsonMatch = strategyText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       strategyText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const strategyConfig = data?.strategy ? parseStrategyConfig(data.strategy) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    try {
      await buildStrategy(input.trim());
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const handleCopy = async () => {
    if (!data?.strategy) return;
    
    try {
      await navigator.clipboard.writeText(data.strategy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = () => {
    if (!strategyConfig) return;
    
    const blob = new Blob([JSON.stringify(strategyConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategy-${strategyConfig.type || 'config'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    reset();
    setInput('');
    setCopied(false);
  };

  const examplePrompts = [
    "Buy when RSI drops below 30 and sell when it goes above 70",
    "Use moving average crossover with 10-day and 20-day periods",
    "Buy on breakout above 20-day high with 2x volume confirmation",
    "Momentum strategy that buys when price increases 5% in 3 days",
    "MACD strategy that buys when MACD line crosses above signal line",
    "Bollinger Bands strategy that buys when price touches lower band and RSI is oversold",
    "Support and resistance strategy that buys at support and sells at resistance",
    "Volume breakout strategy that buys when volume is 3x average and price breaks resistance"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Strategy Architect
          <Badge variant="secondary" className="ml-auto">
            Powered by Gemini AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Describe your trading idea in plain English, and our AI will convert it into a structured strategy configuration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="strategy-input" className="text-sm font-medium">
              Describe your trading strategy:
            </label>
            <Textarea
              id="strategy-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: Buy when RSI is oversold below 30 and the 50-day moving average is above the 200-day moving average..."
              rows={4}
              className="min-h-[100px]"
              disabled={loading}
            />
            <div className="text-sm text-gray-500">
              {input.length}/1000 characters
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-base font-medium text-gray-700">Quick Examples:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setInput(prompt)}
                  disabled={loading}
                  className="text-sm h-auto p-4 text-left justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors min-h-[60px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    <span className="leading-relaxed">{prompt}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!input.trim() || loading || input.length > 1000}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Building Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Build with Gemini AI
                </>
              )}
            </Button>
            {(data || error) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            )}
          </div>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Generated Strategy Configuration</h3>
                  <p className="text-sm text-gray-600">Ready to deploy in your trading system</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {strategyConfig && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Valid JSON
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                {strategyConfig && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                )}
              </div>
            </div>

            {strategyConfig ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Strategy Overview */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Strategy Overview</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {strategyConfig.type}
                        </Badge>
                      </div>
                      {strategyConfig.rationale && (
                        <div>
                          <span className="text-sm text-gray-600 block mb-1">Rationale:</span>
                          <p className="text-sm text-gray-800">{strategyConfig.rationale}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parameters */}
                  {strategyConfig.params && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold text-green-900">Parameters</h4>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(strategyConfig.params).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <Badge variant="outline" className="bg-white">
                              {value as string}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* JSON Configuration */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">JSON Configuration</h4>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border">
                        <code className="text-green-400">
{JSON.stringify(strategyConfig, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback for non-JSON responses */
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Strategy Response</h4>
                </div>
                <div className="relative">
                  <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm border">
                    <code>{data.strategy}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Notes and Additional Info */}
            {data.note && (
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="font-medium mb-1">Important Note:</div>
                  {data.note}
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Generated by {data.powered_by}
              </div>
              <div className="flex items-center gap-4">
                <span>Ready to deploy</span>
                <Badge variant="outline" className="text-xs">
                  Production Ready
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Tips for better results:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about entry and exit conditions</li>
            <li>• Mention specific indicators (RSI, moving averages, MACD, etc.)</li>
            <li>• Include time periods and threshold values when possible</li>
            <li>• Describe risk management rules if applicable</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
