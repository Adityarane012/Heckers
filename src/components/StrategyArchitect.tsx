import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { useStrategyArchitect } from '../hooks/useAgents';

export default function StrategyArchitect() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { data, loading, error, buildStrategy, reset } = useStrategyArchitect();

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

  const handleReset = () => {
    reset();
    setInput('');
    setCopied(false);
  };

  const examplePrompts = [
    "Buy when RSI drops below 30 and sell when it goes above 70",
    "Use moving average crossover with 10-day and 20-day periods",
    "Buy on breakout above 20-day high with 2x volume confirmation",
    "Momentum strategy that buys when price increases 5% in 3 days"
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

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Quick examples:</span>
            {examplePrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setInput(prompt)}
                disabled={loading}
                className="text-xs"
              >
                {prompt.substring(0, 30)}...
              </Button>
            ))}
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Strategy Configuration</h3>
              <div className="flex items-center gap-2">
                {data.parsed && (
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
              </div>
            </div>

            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm border">
                <code>{data.strategy}</code>
              </pre>
            </div>

            {data.note && (
              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> {data.note}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Generated by {data.powered_by}
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
