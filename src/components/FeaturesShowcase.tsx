import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Target, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  BookOpen, 
  LineChart,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturesShowcaseProps {
  isVisible: boolean;
  onClose: () => void;
}

export function FeaturesShowcase({ isVisible, onClose }: FeaturesShowcaseProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Strategy Builder",
      description: "Drag-and-drop interface to create sophisticated trading algorithms with visual components",
      badge: "Core Feature",
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    {
      icon: BarChart3,
      title: "Advanced Backtesting Engine",
      description: "Test your strategies against historical data with comprehensive performance metrics",
      badge: "Analytics",
      color: "bg-green-500/10 text-green-600 border-green-200"
    },
    {
      icon: Shield,
      title: "Risk Management Tools",
      description: "Built-in risk assessment, drawdown analysis, and portfolio protection",
      badge: "Safety",
      color: "bg-red-500/10 text-red-600 border-red-200"
    },
    {
      icon: Zap,
      title: "Paper Trading Simulator",
      description: "Practice trading strategies risk-free with virtual money and real market data",
      badge: "Learning",
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200"
    },
    {
      icon: Globe,
      title: "Live Market Data",
      description: "Real-time data from multiple sources including Yahoo Finance, Alpha Vantage, and Polygon.io",
      badge: "Real-Time",
      color: "bg-cyan-500/10 text-cyan-600 border-cyan-200"
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Share strategies, learn from experts, and collaborate with other traders",
      badge: "Social",
      color: "bg-pink-500/10 text-pink-600 border-pink-200"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Comprehensive guides, tutorials, and best practices for algorithmic trading",
      badge: "Education",
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200"
    },
    {
      icon: DollarSign,
      title: "Portfolio Management",
      description: "Advanced portfolio tracking, performance analytics, and risk assessment tools",
      badge: "Portfolio",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    },
  ];

  const stats = [
    { label: "Supported Exchanges", value: "3", icon: Globe },
    { label: "AI Models", value: "5+", icon: Brain },
    { label: "Data Sources", value: "4", icon: LineChart },
    { label: "Strategy Types", value: "10+", icon: Target }
  ];

  return (
    <div 
      className="fixed inset-0 z-[110] bg-background backdrop-blur-sm overflow-y-auto"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full h-full min-h-screen px-6 py-20 pt-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Platform Features
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto mb-12">
            Everything you need to build, test, and deploy sophisticated trading algorithms
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-6 rounded-xl bg-card border transition-all duration-300 ${
                  isAnimating ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 max-w-8xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm ${
                isAnimating ? 'animate-fade-in-up' : ''
              } hover:scale-105 hover:bg-card/80`}
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className={feature.color}>
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center max-w-5xl mx-auto ${isAnimating ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '1200ms' }}>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-12 border border-border/50">
            <h3 className="text-4xl font-bold mb-6">Ready to Start Trading Smarter?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of traders who are already using AI-powered algorithms to maximize their returns
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
                onClick={() => {
                  onClose();
                  document.getElementById('strategies')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Building Strategies
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 h-auto"
                onClick={() => {
                  onClose();
                  document.getElementById('backtesting')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Try Backtesting
              </Button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="fixed top-6 right-6 z-[120]">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
