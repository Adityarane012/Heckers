import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, GraduationCap, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useTradeCoach } from '../hooks/useAgents';

interface Trade {
  id?: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  pnl?: number;
  strategy?: string;
}

interface TradeCoachProps {
  trades?: Trade[];
  onAdviceReceived?: (advice: string) => void;
}

export default function TradeCoach({ trades = [], onAdviceReceived }: TradeCoachProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const { data, loading, error, getCoachingAdvice, reset } = useTradeCoach();

  // Filter trades based on selected timeframe
  const getFilteredTrades = () => {
    if (selectedTimeframe === 'all') return trades;
    
    const now = new Date();
    const timeframeDays = selectedTimeframe === 'week' ? 7 : 30;
    const cutoffDate = new Date(now.getTime() - (timeframeDays * 24 * 60 * 60 * 1000));
    
    return trades.filter(trade => new Date(trade.timestamp) >= cutoffDate);
  };

  const filteredTrades = getFilteredTrades();
  const hasTrades = filteredTrades.length > 0;

  const handleGetAdvice = async () => {
    if (!hasTrades || loading) return;

    try {
      const result = await getCoachingAdvice(filteredTrades);
      onAdviceReceived?.(result.advice);
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const handleReset = () => {
    reset();
  };

  // Generate sample trades for demo purposes
  const generateSampleTrades = (): Trade[] => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
    const sampleTrades: Trade[] = [];
    const now = new Date();

    for (let i = 0; i < 10; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const price = 100 + Math.random() * 200;
      const quantity = Math.floor(Math.random() * 100) + 1;
      const timestamp = new Date(now.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000));
      const pnl = (Math.random() - 0.4) * 1000; // Slight bias toward losses for realism

      sampleTrades.push({
        id: `trade-${i}`,
        symbol,
        side,
        quantity,
        price: Number(price.toFixed(2)),
        timestamp: timestamp.toISOString(),
        pnl: Number(pnl.toFixed(2)),
        strategy: ['SMA Cross', 'RSI Reversion', 'Breakout'][Math.floor(Math.random() * 3)]
      });
    }

    return sampleTrades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const displayTrades = hasTrades ? filteredTrades : generateSampleTrades();

  const tradeStats = {
    total: displayTrades.length,
    profitable: displayTrades.filter(t => (t.pnl || 0) > 0).length,
    winRate: displayTrades.length > 0 ? (displayTrades.filter(t => (t.pnl || 0) > 0).length / displayTrades.length) * 100 : 0,
    totalPnL: displayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-green-500" />
          AI Trade Coach
          <Badge variant="secondary" className="ml-auto">
            Powered by Gemini AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Get personalized coaching feedback on your trading performance and habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Last Week</TabsTrigger>
            <TabsTrigger value="month">Last Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTimeframe} className="space-y-4">
            {/* Trading Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Total Trades</div>
                <div className="text-2xl font-bold text-blue-900">{tradeStats.total}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Win Rate</div>
                <div className="text-2xl font-bold text-green-900">{tradeStats.winRate.toFixed(1)}%</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">Profitable</div>
                <div className="text-2xl font-bold text-purple-900">{tradeStats.profitable}</div>
              </div>
              <div className={`p-4 rounded-lg ${tradeStats.totalPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-sm ${tradeStats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Total P&L
                </div>
                <div className={`text-2xl font-bold ${tradeStats.totalPnL >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  ${tradeStats.totalPnL.toFixed(0)}
                </div>
              </div>
            </div>

            {/* Recent Trades Table */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Recent Trades</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Symbol</th>
                      <th className="text-left py-2">Side</th>
                      <th className="text-left py-2">Quantity</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">P&L</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTrades.slice(0, 5).map((trade, index) => (
                      <tr key={trade.id || index} className="border-b border-gray-200">
                        <td className="py-2 font-medium">{trade.symbol}</td>
                        <td className="py-2">
                          <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                            {trade.side.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-2">{trade.quantity}</td>
                        <td className="py-2">${trade.price}</td>
                        <td className={`py-2 font-medium ${(trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.pnl ? `$${trade.pnl.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-2 text-gray-600">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {displayTrades.length > 5 && (
                <div className="text-center mt-2 text-sm text-gray-600">
                  Showing 5 of {displayTrades.length} trades
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {!hasTrades && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No trade history found. The analysis below uses sample data for demonstration.
            </AlertDescription>
          </Alert>
        )}

        {/* Get Coaching Button */}
        {!data && (
          <Button
            onClick={handleGetAdvice}
            disabled={displayTrades.length === 0 || loading}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                AI Coach is analyzing your trades...
              </>
            ) : (
              <>
                <GraduationCap className="h-5 w-5" />
                Get AI Coach Feedback ({displayTrades.length} trades)
              </>
            )}
          </Button>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Coaching Results */}
        {data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Your Personal Trading Coach
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={loading}
              >
                Get New Advice
              </Button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <GraduationCap className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {data.advice}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {data.trades_analyzed} trades analyzed
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Powered by {data.powered_by}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {!data && !loading && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">What your AI coach will analyze:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Trading patterns and frequency</li>
              <li>• Risk management and position sizing</li>
              <li>• Win/loss ratios and profit consistency</li>
              <li>• Emotional discipline indicators</li>
              <li>• Strategy effectiveness and improvements</li>
              <li>• Personalized recommendations for growth</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
