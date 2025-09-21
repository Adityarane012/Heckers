// Main strategy builder component with integrated AI agents
import { useEffect, useState } from "react";
import { saveStrategy, listStrategies, runBacktestApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// Tabbed interface for organizing multiple AI agent features
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Comprehensive icon set for strategy building and AI agent features
import { 
  Plus, 
  Play, 
  Save, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Zap,
  Target,
  Shield,
  Sparkles,
  Brain,
  GraduationCap,
  BarChart3,
  Bot
} from "lucide-react";
import StrategyArchitect from './StrategyArchitect';
import BacktestAnalyst from './BacktestAnalyst';
import TradeCoach from './TradeCoach';
import OHLCVAnalyst from './OHLCVAnalyst';

// Interface for strategy building blocks with drag-and-drop functionality
interface StrategyBlock {
  id: string;
  type: "indicator" | "condition" | "action";
  title: string;
  description: string;
  icon: any;
  color: string;
}

// Predefined strategy building blocks for visual strategy creation
const availableBlocks: StrategyBlock[] = [
  {
    id: "sma",
    type: "indicator",
    title: "Simple Moving Average",
    description: "Track price trends over time",
    icon: TrendingUp,
    color: "bg-primary"
  },
  {
    id: "rsi",
    type: "indicator", 
    title: "RSI Indicator",
    description: "Relative Strength Index",
    icon: BarChart,
    color: "bg-accent"
  },
  {
    id: "macd",
    type: "indicator",      
    title: "MACD",
    description: "Trend + momentum",
    icon: Zap,
    color: "bg-success"
  },
  {
    id: "volume",
    type: "indicator",
    title: "Volume",
    description: "Trading volume analysis",
    icon: BarChart3,
    color: "bg-warning"
  },
  {
    id: "breakout",
    type: "condition",
    title: "Breakout",
    description: "Price breakout detection",
    icon: TrendingUp,
    color: "bg-primary"
  },
  {
    id: "momentum",
    type: "condition",
    title: "Momentum",
    description: "Price momentum signals",
    icon: Zap,
    color: "bg-accent"
  },
  {
    id: "buy-signal",
    type: "action",
    title: "Buy Signal",
    description: "Execute buy order",
    icon: TrendingUp,
    color: "bg-success"
  },
  {
    id: "sell-signal",
    type: "action",
    title: "Sell Signal",
    description: "Execute sell order", 
    icon: TrendingDown,
    color: "bg-destructive"
  },
  {
    id: "stop-loss",
    type: "action",
    title: "Stop Loss",
    description: "Risk management",
    icon: Shield,
    color: "bg-warning"
  }
];

export function StrategyBuilder() {
  const [activeTab, setActiveTab] = useState("visual-builder");

  return (
    <section id="strategies" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <Bot className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Google Gemini AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Strategy Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build, analyze, and optimize trading strategies using advanced AI agents. 
            From natural language descriptions to comprehensive market analysis.
          </p>
        </div>

        {/* AI Agents Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-trading p-6 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Strategy Architect</h3>
            <p className="text-muted-foreground">Convert natural language trading ideas into executable strategy configurations</p>
          </div>

          <div className="card-trading p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">OHLCV Analyst</h3>
            <p className="text-muted-foreground">AI-powered analysis of market data with price action and volume insights</p>
          </div>

          <div className="card-trading p-6 text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Backtest Analyst</h3>
            <p className="text-muted-foreground">AI-powered analysis of backtest results with actionable insights</p>
          </div>

          <div className="card-trading p-6 text-center">
            <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trade Coach</h3>
            <p className="text-muted-foreground">Personalized coaching based on your trading patterns and behavior</p>
          </div>
        </div>

        {/* Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="visual-builder" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Visual Builder
            </TabsTrigger>
            <TabsTrigger value="strategy-architect" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Strategy Architect
            </TabsTrigger>
            <TabsTrigger value="ohlcv-analyst" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              OHLCV Analyst
            </TabsTrigger>
            <TabsTrigger value="backtest-analyst" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Backtest Analyst
            </TabsTrigger>
            <TabsTrigger value="trade-coach" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Trade Coach
            </TabsTrigger>
          </TabsList>

          {/* Visual Builder Tab */}
          <TabsContent value="visual-builder">
            <VisualStrategyBuilder />
          </TabsContent>

          {/* Strategy Architect Tab */}
          <TabsContent value="strategy-architect">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Natural Language to Trading Strategy</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Describe your trading idea in plain English and watch our AI transform it into a structured, 
                  executable strategy configuration with parameters and rationale.
                </p>
              </div>
              <StrategyArchitect />
            </div>
          </TabsContent>

          {/* OHLCV Analyst Tab */}
          <TabsContent value="ohlcv-analyst">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">AI-Powered Market Data Analysis</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Upload your OHLCV market data for comprehensive AI analysis including price action, 
                  volume patterns, technical indicators, and trading opportunities.
                </p>
              </div>
              <OHLCVAnalyst />
            </div>
          </TabsContent>

          {/* Backtest Analyst Tab */}
          <TabsContent value="backtest-analyst">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">AI-Powered Performance Analysis</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Upload your backtest results and get comprehensive AI analysis with risk assessment, 
                  performance insights, and specific recommendations for improvement.
                </p>
              </div>
              <BacktestAnalyst />
            </div>
          </TabsContent>

          {/* Trade Coach Tab */}
          <TabsContent value="trade-coach">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Your Personal Trading Coach</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Receive personalized coaching based on your actual trading history. 
                  Identify patterns, improve discipline, and accelerate your trading growth with AI-powered insights.
                </p>
              </div>
              <TradeCoach />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

// Visual Strategy Builder Component (original functionality)
function VisualStrategyBuilder() {
  const [activeBlocks, setActiveBlocks] = useState<StrategyBlock[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<StrategyBlock | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [kind, setKind] = useState<'smaCross' | 'rsiReversion' | 'macd' | 'breakout' | 'momentum' | null>(null);
  const [params, setParams] = useState<Record<string, number>>({ fast: 10, slow: 30, period: 14, buyLevel: 30, sellLevel: 70, signal: 9, lookback: 20 });
  const [testMetrics, setTestMetrics] = useState<{ totalReturnPct?: number; sharpe?: number; maxDrawdownPct?: number; winRatePct?: number; profitFactor?: number } | null>(null);

  useEffect(() => {
    listStrategies().then(() => {}).catch(() => {});
  }, []);

  const handleDragStart = (block: StrategyBlock) => {
    setDraggedBlock(block);
  };

  const handleDrop = () => {
    if (draggedBlock && !activeBlocks.find(b => b.id === draggedBlock.id)) {
      const updated = [...activeBlocks, draggedBlock];
      setActiveBlocks(updated);
      inferStrategyFrom(updated);
    }
    setDraggedBlock(null);
  };

  const removeBlock = (blockId: string) => {
    const updated = activeBlocks.filter(b => b.id !== blockId);
    setActiveBlocks(updated);
    inferStrategyFrom(updated);
  };

  const inferStrategyFrom = (blocks: StrategyBlock[]) => {
    const ids = new Set(blocks.map(b => b.id));
    if (ids.has('sma') && ids.has('price-cross') && ids.has('buy-signal') && ids.has('sell-signal')) {
      setKind('smaCross');
      return;
    }
    if (ids.has('rsi') && ids.has('buy-signal') && ids.has('sell-signal')) {
      setKind('rsiReversion');
      return;
    }
    if (ids.has('macd') && ids.has('buy-signal') && ids.has('sell-signal')) {
      setKind('macd');
      return;
    }
    if (ids.has('breakout') && ids.has('buy-signal') && ids.has('sell-signal')) {
      setKind('breakout');
      return;
    }
    if (ids.has('momentum') && ids.has('buy-signal') && ids.has('sell-signal')) {
      setKind('momentum');
      return;
    }
    setKind(null);
  };

  const runTest = async () => {
    if (!kind) return;
    
    try {
      const result = await runBacktestApi({
        strategy: { kind, params },
        symbol: 'AAPL',
        start: '2023-01-01',
        end: '2024-01-01'
      });
      
      setTestMetrics({
        totalReturnPct: result.totalReturnPct,
        sharpe: result.sharpe,
        maxDrawdownPct: result.maxDrawdownPct,
        winRatePct: result.winRatePct,
        profitFactor: result.profitFactor
      });
    } catch (e) {
      // optionally console.error(e)
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Component Library */}
      <div className="lg:col-span-1">
        <Card className="card-trading">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Strategy Components
            </CardTitle>
            <CardDescription>
              Drag components to build your strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableBlocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(block)}
                className={`p-3 rounded-lg border-2 border-dashed cursor-move hover:border-primary/50 transition-colors ${block.color}/10`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${block.color}`}>
                    <block.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{block.title}</h4>
                    <p className="text-sm text-muted-foreground">{block.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Strategy Canvas */}
      <div className="lg:col-span-2">
        <Card className="card-trading">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Strategy Canvas
            </CardTitle>
            <CardDescription>
              Drop components here to build your strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="min-h-[400px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-6"
            >
              {activeBlocks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Drag components here to start building</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBlocks.map((block, index) => (
                    <div
                      key={`${block.id}-${index}`}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${block.color}`}>
                          <block.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{block.title}</h4>
                          <p className="text-sm text-muted-foreground">{block.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlock(block.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strategy Configuration */}
            {kind && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-3">Strategy Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Strategy Type</label>
                    <Input value={kind} disabled className="mt-1 text-black" />
                  </div>
                  {Object.entries(params).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm font-medium capitalize">{key}</label>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setParams(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                        className="mt-1 text-black"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Results */}
            {testMetrics && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-3">Backtest Results</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {testMetrics.totalReturnPct?.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Total Return</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {testMetrics.sharpe?.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <div className="text-2xl font-bold text-destructive">
                      {testMetrics.maxDrawdownPct?.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {testMetrics.winRatePct?.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={runTest}
                disabled={!kind}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Test Strategy
              </Button>
              <Button
                variant="outline"
                disabled={!kind}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}