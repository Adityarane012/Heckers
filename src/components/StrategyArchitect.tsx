import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, Sparkles, Copy, CheckCircle, Download, Eye, Settings, Target, TrendingUp, Shield, Zap, Lightbulb, FileText, Database } from 'lucide-react';
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
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900">
                AI Strategy Architect
              </CardTitle>
              <CardDescription className="text-blue-700 mt-1">
                Describe your trading idea in plain English, and our AI will convert it into a structured strategy configuration.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Zap className="h-3 w-3 mr-1" />
            Powered by Gemini AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Strategy Input Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Strategy Description</h3>
            </div>
            <div className="space-y-3">
              <label htmlFor="strategy-input" className="text-sm font-medium text-purple-800">
                Describe your trading strategy:
              </label>
              <Textarea
                id="strategy-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Example: Buy when RSI is oversold below 30 and the 50-day moving average is above the 200-day moving average..."
                rows={4}
                className="min-h-[100px] bg-white border-purple-200 focus:border-purple-400"
                disabled={loading}
              />
              <div className="flex justify-between items-center text-sm text-purple-600">
                <span>{input.length}/1000 characters</span>
                <Badge variant="outline" className="text-xs border-purple-200">
                  Natural Language Input
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Examples Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Quick Examples</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setInput(prompt)}
                  disabled={loading}
                  className="text-xs h-auto p-3 text-left justify-start bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="leading-relaxed">{prompt}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Ready to Build Strategy</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!input.trim() || loading || input.length > 1000}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
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
                    className="border-green-200 hover:border-green-400 hover:bg-green-50"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
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
            {/* Results Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Generated Strategy Configuration</h3>
                    <p className="text-sm text-green-700">Ready to deploy in your trading system</p>
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
                    className="flex items-center gap-1 border-green-200 hover:border-green-400 hover:bg-green-50"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  {strategyConfig && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="flex items-center gap-1 border-green-200 hover:border-green-400 hover:bg-green-50"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  )}
                </div>
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Type:</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                          {strategyConfig.type}
                        </Badge>
                      </div>
                      {strategyConfig.rationale && (
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <span className="text-sm font-medium text-blue-800 block mb-2">Rationale:</span>
                          <p className="text-sm text-blue-700 leading-relaxed">{strategyConfig.rationale}</p>
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
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <div className="space-y-2">
                          {Object.entries(strategyConfig.params).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-1">
                              <span className="text-sm font-medium text-green-800 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                {value as string}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* JSON Configuration */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">JSON Configuration</h4>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
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
              </div>
            ) : (
              /* Fallback for non-JSON responses */
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Strategy Response</h4>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                    {data.strategy}
                  </pre>
                </div>
              </div>
            )}

            {/* Notes and Additional Info */}
            {data.note && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Important Note</h4>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 leading-relaxed">{data.note}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
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

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Tips for Better Results</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Be specific about entry and exit conditions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Mention specific indicators (RSI, moving averages, MACD, etc.)
                </li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Include time periods and threshold values when possible
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Describe risk management rules if applicable
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
