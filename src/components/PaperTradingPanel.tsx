import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Play, 
  Pause, 
  RefreshCw,
  Search,
  Plus,
  Minus,
  Eye,
  Settings,
  Target,
  Shield,
  Clock,
  Activity
} from "lucide-react";
import { paperCreate, paperOrder, paperAccount } from "@/lib/api";

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  type: 'market' | 'limit';
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
  stopLoss?: number;
  takeProfit?: number;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  pnl?: number;
}

export function PaperTradingPanel() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [virtualCash, setVirtualCash] = useState<number>(100000); // Default ₹1,00,000
  const [portfolioValue, setPortfolioValue] = useState<number>(100000);
  const [realizedPnL, setRealizedPnL] = useState<number>(0);
  const [unrealizedPnL, setUnrealizedPnL] = useState<number>(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  
  // Order form state
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  
  // Strategy integration
  const [strategyEnabled, setStrategyEnabled] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  
  // Market data simulation
  const [marketData, setMarketData] = useState<Record<string, number>>({});
  
  // Auto-refresh interval
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate market data updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate price changes (±2% random walk)
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const change = (Math.random() - 0.5) * 0.04; // ±2%
          updated[symbol] = Math.max(0.01, updated[symbol] * (1 + change));
        });
        return updated;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Update portfolio value when positions change
  useEffect(() => {
    const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalUnrealized = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
    setPortfolioValue(virtualCash + totalValue);
    setUnrealizedPnL(totalUnrealized);
  }, [positions, virtualCash]);

  const refreshAccount = async (id: string) => {
    try {
      const acct = await paperAccount(id);
      setVirtualCash(acct.cash);
      // Convert positions to our format
      const formattedPositions: Position[] = Object.entries(acct.positions || {}).map(([sym, pos]: [string, any]) => {
        const currentPrice = marketData[sym] || pos.avg;
        const marketValue = pos.qty * currentPrice;
        const unrealizedPnL = (currentPrice - pos.avg) * pos.qty;
        return {
          symbol: sym,
          quantity: pos.qty,
          avgPrice: pos.avg,
          currentPrice,
          marketValue,
          unrealizedPnL,
          unrealizedPnLPercent: ((currentPrice - pos.avg) / pos.avg) * 100
        };
      });
      setPositions(formattedPositions);
    } catch (error) {
      console.error('Failed to refresh account:', error);
    }
  };

  const placeOrder = async () => {
    if (!accountId || !symbol || quantity <= 0) return;
    
    const currentPrice = marketData[symbol] || 100; // Default price if not available
    const orderPrice = orderType === 'market' ? currentPrice : limitPrice;
    
    // Check if user has sufficient funds/positions
    if (orderSide === 'buy' && orderPrice * quantity > virtualCash) {
      alert('Insufficient funds');
      return;
    }
    
    if (orderSide === 'sell') {
      const position = positions.find(p => p.symbol === symbol);
      if (!position || position.quantity < quantity) {
        alert('Insufficient position');
        return;
      }
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      symbol,
      side: orderSide,
      quantity,
      price: orderPrice,
      type: orderType,
      status: 'pending',
      timestamp: new Date(),
      stopLoss: stopLoss || undefined,
      takeProfit: takeProfit || undefined
    };

    setOrders(prev => [newOrder, ...prev]);

    try {
      await paperOrder({
        accountId,
        symbol,
        side: orderSide,
        qty: quantity
      });
      
      // Simulate order execution
      setTimeout(() => {
        setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'filled' } : o));
        
        // Update cash and positions
        if (orderSide === 'buy') {
          setVirtualCash(prev => prev - (orderPrice * quantity));
        } else {
          setVirtualCash(prev => prev + (orderPrice * quantity));
        }
        
        // Add to trades
        const newTrade: Trade = {
          id: Date.now().toString(),
          symbol,
          side: orderSide,
          quantity,
          price: orderPrice,
          timestamp: new Date()
        };
        setTrades(prev => [newTrade, ...prev]);
        
        // Refresh account
        refreshAccount(accountId);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to place order:', error);
      setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'cancelled' } : o));
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
  };

  const createAccount = async () => {
    try {
      const { id } = await paperCreate();
      setAccountId(id);
      setVirtualCash(100000); // Reset to default
      setPortfolioValue(100000);
      setPositions([]);
      setOrders([]);
      setTrades([]);
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const resetAccount = () => {
    setVirtualCash(100000);
    setPortfolioValue(100000);
    setPositions([]);
    setOrders([]);
    setTrades([]);
    setRealizedPnL(0);
    setUnrealizedPnL(0);
  };

  if (!accountId) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="card-trading max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Paper Trading Simulator</CardTitle>
              <CardDescription className="text-lg">
                Practice trading with virtual money using real market data. Perfect your strategies risk-free!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-card border">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold">₹1,00,000 Virtual Capital</h3>
                  <p className="text-sm text-muted-foreground">Start with virtual money</p>
                </div>
                <div className="p-4 rounded-lg bg-card border">
                  <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Live Market Data</h3>
                  <p className="text-sm text-muted-foreground">Real-time prices</p>
                </div>
                <div className="p-4 rounded-lg bg-card border">
                  <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Strategy Integration</h3>
                  <p className="text-sm text-muted-foreground">Test your algorithms</p>
                </div>
              </div>
              <Button onClick={createAccount} size="lg" className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Start Paper Trading
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-center mb-4">Paper Trading Dashboard</h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            Practice trading with virtual money using real market data. Perfect your strategies before going live.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Cash</p>
                      <p className="text-2xl font-bold">₹{virtualCash.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Portfolio Value</p>
                      <p className="text-2xl font-bold">₹{portfolioValue.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Realized P&L</p>
                      <p className={`text-2xl font-bold ${realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ₹{realizedPnL.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className={`w-8 h-8 ${realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                      <p className={`text-2xl font-bold ${unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ₹{unrealizedPnL.toLocaleString()}
                      </p>
                    </div>
                    <Activity className={`w-8 h-8 ${unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
                <CardDescription>Buy or sell stocks with virtual money</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="symbol"
                        placeholder="e.g., AAPL, MSFT, TSLA"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Order Type</Label>
                    <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Side</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={orderSide === 'buy' ? 'default' : 'outline'}
                        onClick={() => setOrderSide('buy')}
                        className="flex-1"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Buy
                      </Button>
                      <Button
                        variant={orderSide === 'sell' ? 'destructive' : 'outline'}
                        onClick={() => setOrderSide('sell')}
                        className="flex-1"
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Sell
                      </Button>
                    </div>
                  </div>
                  
                  {orderType === 'limit' && (
                    <div className="space-y-2">
                      <Label htmlFor="limitPrice">Limit Price</Label>
                      <Input
                        id="limitPrice"
                        type="number"
                        step="0.01"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Button onClick={placeOrder} className="flex-1">
                    Place Order
                  </Button>
                  <Button variant="outline" onClick={() => setSymbol('')}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Integration */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Integration</CardTitle>
                <CardDescription>Run your strategies automatically in paper trading</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Strategy Trading</Label>
                    <p className="text-sm text-muted-foreground">Automatically execute trades based on your strategies</p>
                  </div>
                  <Switch
                    checked={strategyEnabled}
                    onCheckedChange={setStrategyEnabled}
                  />
                </div>
                
                {strategyEnabled && (
                  <div className="space-y-2">
                    <Label>Select Strategy</Label>
                    <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsi">RSI Strategy</SelectItem>
                        <SelectItem value="moving-average">Moving Average Crossover</SelectItem>
                        <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Positions</CardTitle>
                <CardDescription>Your current stock holdings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {positions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No positions yet. Start trading to see your portfolio here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <div key={position.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{position.symbol}</h3>
                            <Badge variant="outline">{position.quantity} shares</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Avg: ₹{position.avgPrice.toFixed(2)} | Current: ₹{position.currentPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{position.marketValue.toLocaleString()}</div>
                          <div className={`text-sm ${position.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {position.unrealizedPnL >= 0 ? '+' : ''}₹{position.unrealizedPnL.toFixed(2)} 
                            ({position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Book</CardTitle>
                <CardDescription>Your pending and recent orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders yet. Place your first order to get started.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                              {order.side.toUpperCase()}
                            </Badge>
                            <span className="font-semibold">{order.symbol}</span>
                            <span className="text-muted-foreground">{order.quantity} shares</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.type === 'market' ? 'Market Order' : `Limit: ₹${order.price.toFixed(2)}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              order.status === 'filled' ? 'default' : 
                              order.status === 'cancelled' ? 'destructive' : 'secondary'
                            }
                          >
                            {order.status}
                          </Badge>
                          {order.status === 'pending' && (
                            <Button size="sm" variant="outline" onClick={() => cancelOrder(order.id)}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>All your completed trades</CardDescription>
              </CardHeader>
              <CardContent>
                {trades.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No trades yet. Your completed trades will appear here.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {trades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={trade.side === 'buy' ? 'default' : 'destructive'}>
                              {trade.side.toUpperCase()}
                            </Badge>
                            <span className="font-semibold">{trade.symbol}</span>
                            <span className="text-muted-foreground">{trade.quantity} shares</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {trade.timestamp.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{trade.price.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">
                            Total: ₹{(trade.price * trade.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => refreshAccount(accountId)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" onClick={resetAccount}>
            <Settings className="w-4 h-4 mr-2" />
            Reset Account
          </Button>
          <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {autoRefresh ? 'Pause' : 'Resume'} Auto-Refresh
          </Button>
        </div>
      </div>
    </section>
  );
}