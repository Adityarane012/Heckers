import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Play, 
  Save, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Zap,
  Target,
  Shield
} from "lucide-react";

interface StrategyBlock {
  id: string;
  type: "indicator" | "condition" | "action";
  title: string;
  description: string;
  icon: any;
  color: string;
}

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
    id: "price-cross",
    type: "condition",
    title: "Price Crossover", 
    description: "When price crosses indicator",
    icon: Target,
    color: "bg-info"
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
  const [activeBlocks, setActiveBlocks] = useState<StrategyBlock[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<StrategyBlock | null>(null);

  const handleDragStart = (block: StrategyBlock) => {
    setDraggedBlock(block);
  };

  const handleDrop = () => {
    if (draggedBlock && !activeBlocks.find(b => b.id === draggedBlock.id)) {
      setActiveBlocks([...activeBlocks, draggedBlock]);
    }
    setDraggedBlock(null);
  };

  const removeBlock = (blockId: string) => {
    setActiveBlocks(activeBlocks.filter(b => b.id !== blockId));
  };

  return (
    <section id="strategies" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Build Your Strategy</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drag and drop components to create sophisticated trading algorithms without any coding
          </p>
        </div>

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
                    className="p-3 rounded-lg border border-border bg-card hover:bg-accent cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-primary"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${block.color} rounded-lg flex items-center justify-center`}>
                        <block.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{block.title}</div>
                        <div className="text-xs text-muted-foreground">{block.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {block.type}
                      </Badge>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Strategy Canvas
                    </CardTitle>
                    <CardDescription>
                      Your trading strategy blueprint
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="trading" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Test Strategy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-96 border-2 border-dashed border-border rounded-lg p-6 bg-background/50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {activeBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Start Building Your Strategy</h3>
                      <p className="text-muted-foreground">
                        Drag components from the left panel to create your trading algorithm
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBlocks.map((block, index) => (
                        <div
                          key={`${block.id}-${index}`}
                          className="p-4 rounded-lg border border-border bg-card shadow-card hover:shadow-primary transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${block.color} rounded-lg flex items-center justify-center`}>
                                <block.icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">{block.title}</div>
                                <div className="text-sm text-muted-foreground">{block.description}</div>
                              </div>
                              <Badge variant="outline">
                                {block.type}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBlock(block.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}