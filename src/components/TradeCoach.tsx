// AI-powered Trade Coach component for personalized trading guidance
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
// Tabbed interface for different coaching aspects
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, GraduationCap, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useTradeCoach } from '../hooks/useAgents';

// Interface for individual trade records with P&L tracking and strategy attribution
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

// Props interface for Trade Coach component with trade history and callback
interface TradeCoachProps {
  trades?: Trade[];
  onAdviceReceived?: (advice: string) => void;
}

// Main Trade Coach component with AI-powered personalized trading guidance
export default function TradeCoach({ trades = [], onAdviceReceived }: TradeCoachProps) {
  // State management for timeframe selection and coaching data
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
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <CardTitle className="flex items-center gap-2 text-white">
          <GraduationCap className="h-5 w-5 text-green-400" />
          AI Trade Coach
          <Badge variant="secondary" className="ml-auto bg-green-600 text-white border-green-500">
            Powered by Gemini AI
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-300">
          Get personalized coaching feedback on your trading performance and habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 bg-gray-900">
        <Tabs value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-700 border border-gray-600">
            <TabsTrigger value="week" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Last Week</TabsTrigger>
            <TabsTrigger value="month" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Last Month</TabsTrigger>
            <TabsTrigger value="all" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTimeframe} className="space-y-4">
            {/* Trading Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-blue-400">Total Trades</div>
                <div className="text-2xl font-bold text-white">{tradeStats.total}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-green-400">Win Rate</div>
                <div className="text-2xl font-bold text-white">{tradeStats.winRate.toFixed(1)}%</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-purple-400">Profitable</div>
                <div className="text-2xl font-bold text-white">{tradeStats.profitable}</div>
              </div>
              <div className={`p-4 rounded-lg border border-gray-700 ${tradeStats.totalPnL >= 0 ? 'bg-gray-800' : 'bg-gray-800'}`}>
                <div className={`text-sm ${tradeStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  Total P&L
                </div>
                <div className={`text-2xl font-bold ${tradeStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${tradeStats.totalPnL.toFixed(0)}
                </div>
              </div>
            </div>

            {/* Recent Trades Table */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="font-medium mb-3 text-white">Recent Trades</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 text-gray-300">Symbol</th>
                      <th className="text-left py-2 text-gray-300">Side</th>
                      <th className="text-left py-2 text-gray-300">Quantity</th>
                      <th className="text-left py-2 text-gray-300">Price</th>
                      <th className="text-left py-2 text-gray-300">P&L</th>
                      <th className="text-left py-2 text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTrades.slice(0, 5).map((trade, index) => (
                      <tr key={trade.id || index} className="border-b border-gray-700">
                        <td className="py-2 font-medium text-white">{trade.symbol}</td>
                        <td className="py-2">
                          <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'} className={trade.side === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                            {trade.side.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-2 text-white">{trade.quantity}</td>
                        <td className="py-2 text-white">${trade.price}</td>
                        <td className={`py-2 font-medium ${(trade.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.pnl ? `$${trade.pnl.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-2 text-gray-400">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {displayTrades.length > 5 && (
                <div className="text-center mt-2 text-sm text-gray-400">
                  Showing 5 of {displayTrades.length} trades
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {!hasTrades && (
          <Alert className="bg-yellow-900/20 border-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              No trade history found. The analysis below uses sample data for demonstration.
            </AlertDescription>
          </Alert>
        )}

        {/* Get Coaching Button */}
        {!data && (
          <Button
            onClick={handleGetAdvice}
            disabled={displayTrades.length === 0 || loading}
            className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
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
          <Alert variant="destructive" className="bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Coaching Results */}
        {data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-green-400" />
                Your Personal Trading Coach
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={loading}
                className="border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-white"
              >
                Get New Advice
              </Button>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <GraduationCap className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap text-white leading-relaxed">
                    {data.advice}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
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
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h4 className="font-medium text-white mb-2">What your AI coach will analyze:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
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
