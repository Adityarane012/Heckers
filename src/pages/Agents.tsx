import { Navbar } from "@/components/Navbar";
import StrategyArchitect from '@/components/StrategyArchitect';
import BacktestAnalyst from '@/components/BacktestAnalyst';
import TradeCoach from '@/components/TradeCoach';
import OHLCVAnalyst from '@/components/OHLCVAnalyst';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, GraduationCap, Zap, Shield, Clock, ArrowRight, Bot, Target, Users, BarChart3 } from 'lucide-react';

export default function Agents() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 px-4">
        {/* Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(29, 39, 54, 0.7), rgba(29, 39, 54, 0.85)), url(https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-32 right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow animation-delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8 animate-fade-in">
              <Bot className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Google Gemini AI</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-12 leading-normal animate-fade-in">
              <div className="mb-4">Trade Smarter with</div>
              <div className="bg-gradient-primary bg-clip-text text-transparent">
                <div className="text-5xl md:text-10xl">AI TRADING AGENTS</div>
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Four specialized AI agents that transform natural language into trading strategies, 
              analyze market data, evaluate your performance, and provide personalized coaching to accelerate your success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
              <Button asChild variant="trading" size="lg" className="text-lg px-8 py-4">
                <a href="#strategy-architect">
                  Try AI Agents
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button variant="trading-outline" size="lg" className="text-lg px-8 py-4">
                Learn How It Works
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-fade-in">
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
          </div>
        </div>
      </section>

      {/* Strategy Architect Section */}
      <section id="strategy-architect" className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Strategy Architect Agent</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Natural Language to Trading Strategy</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Describe your trading idea in plain English and watch our AI transform it into a structured, 
              executable strategy configuration with parameters and rationale.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Describe Your Strategy</h3>
                    <p className="text-muted-foreground">
                      Simply explain your trading idea: "Buy when RSI drops below 30 and sell when it goes above 70"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-accent-foreground font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                    <p className="text-muted-foreground">
                      Our Gemini AI analyzes your description and identifies the best strategy type and parameters
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Get Your Config</h3>
                    <p className="text-muted-foreground">
                      Receive a complete JSON configuration ready to use in AlgoCode's backtesting engine
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-trading p-6">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-600">// Input: Natural Language</div>
                <div className="mb-4">"Buy when RSI drops below 30..."</div>
                
                <div className="text-green-600">// Output: Strategy Config</div>
                <div className="text-blue-600">{"{"}</div>
                <div className="ml-4">
                  <div><span className="text-purple-600">"type"</span>: <span className="text-orange-600">"rsiReversion"</span>,</div>
                  <div><span className="text-purple-600">"params"</span>: {"{"}</div>
                  <div className="ml-4">
                    <div><span className="text-purple-600">"period"</span>: <span className="text-blue-600">14</span>,</div>
                    <div><span className="text-purple-600">"oversold"</span>: <span className="text-blue-600">30</span>,</div>
                    <div><span className="text-purple-600">"overbought"</span>: <span className="text-blue-600">70</span></div>
                  </div>
                  <div>{"}"}</div>
                </div>
                <div className="text-blue-600">{"}"}</div>
              </div>
            </div>
          </div>

          <StrategyArchitect />
        </div>
      </section>

      {/* Backtest Analyst Section */}
      <section id="backtest-analyst" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Brain className="w-4 h-4 mr-2 text-accent" />
              <span className="text-sm font-medium text-accent">Backtest Analyst Agent</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">AI-Powered Performance Analysis</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload your backtest results and get comprehensive AI analysis with risk assessment, 
              performance insights, and specific recommendations for improvement.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
              <p className="text-muted-foreground text-sm">
                Detailed interpretation of win rates, profit factors, and return metrics
              </p>
            </div>
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
              <p className="text-muted-foreground text-sm">
                Drawdown analysis and risk management evaluation
              </p>
            </div>
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Optimization Tips</h3>
              <p className="text-muted-foreground text-sm">
                Specific recommendations for parameter tuning and improvements
              </p>
            </div>
          </div>

          <BacktestAnalyst />
        </div>
      </section>

      {/* Trade Coach Section */}
      <section id="trade-coach" className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-4">
              <GraduationCap className="w-4 h-4 mr-2 text-success" />
              <span className="text-sm font-medium text-success">Trade Coach Agent</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Your Personal Trading Coach</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Receive personalized coaching based on your actual trading history. 
              Identify patterns, improve discipline, and accelerate your trading growth with AI-powered insights.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="card-trading p-8">
              <h3 className="text-2xl font-bold mb-6">What Your AI Coach Analyzes</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Trading patterns and frequency</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Risk management habits</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Win/loss ratios and consistency</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Emotional discipline indicators</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span>Position sizing patterns</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-6 h-6 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Sample Coaching Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      "I notice you have excellent discipline with stop-losses, maintaining them 95% of the time. 
                      However, consider reducing position sizes during high volatility periods to improve risk-adjusted returns..."
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-success">95%</div>
                  <div className="text-sm text-muted-foreground">Discipline Score</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">A+</div>
                  <div className="text-sm text-muted-foreground">Risk Management</div>
                </div>
              </div>
            </div>
          </div>

          <TradeCoach />
        </div>
      </section>

      {/* OHLCV Analyst Section */}
      <section id="ohlcv-analyst" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-4">
              <BarChart3 className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm font-medium text-green-600">OHLCV Analyst Agent</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">AI-Powered Market Data Analysis</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload your OHLCV market data for comprehensive AI analysis including price action, 
              volume patterns, technical indicators, and trading opportunities.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Price Action Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Trend identification, support/resistance levels, and volatility assessment
              </p>
            </div>
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Volume Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Volume patterns, price-volume relationships, and unusual activity detection
              </p>
            </div>
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trading Opportunities</h3>
              <p className="text-muted-foreground text-sm">
                Entry/exit signals, position sizing, and risk management recommendations
              </p>
            </div>
          </div>

          <OHLCVAnalyst />
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powered by Google Gemini AI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI agents leverage Google's most advanced language model to provide 
              sophisticated analysis and recommendations tailored specifically to your trading needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Reasoning</h3>
              <p className="text-muted-foreground">Complex market analysis with deep understanding of trading concepts</p>
            </div>

            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Context Awareness</h3>
              <p className="text-muted-foreground">Understands trading nuances and market dynamics</p>
            </div>

            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Output</h3>
              <p className="text-muted-foreground">Tailored recommendations based on your specific data</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
