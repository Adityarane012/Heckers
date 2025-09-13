import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Play, TrendingUp, Shield, Calculator } from "lucide-react";

export function EducationalHelp() {
  const educationalContent = [
    {
      title: "Algorithmic Trading Fundamentals",
      description: "Master the core concepts of automated trading systems",
      icon: <TrendingUp className="w-5 h-5" />,
      topics: [
        "What is Algorithmic Trading?",
        "NSE/BSE Market Microstructure & Order Types",
        "Risk Management in Indian Markets",
        "Backtesting vs Live Trading Differences"
      ],
      videos: [
        {
          title: "Algorithmic Trading Explained",
          url: "https://www.youtube.com/watch?v=9Xy15TZUSzM",
          description: "Comprehensive overview of algorithmic trading fundamentals"
        },
        {
          title: "Python for Algorithmic Trading",
          url: "https://www.youtube.com/watch?v=xfzGZB4HhEE",
          description: "Step-by-step guide to building trading algorithms with Python"
        }
      ]
    },
    {
      title: "Financial Technology & Markets",
      description: "Understand modern fintech and market dynamics",
      icon: <Calculator className="w-5 h-5" />,
      topics: [
        "Fintech Revolution in Indian Trading",
        "High-Frequency Trading (HFT) in NSE/BSE",
        "Indian Market Data & APIs",
        "SEBI Regulatory Environment"
      ],
      videos: [
        {
          title: "Fintech Revolution in Trading",
          url: "https://www.youtube.com/watch?v=0xqP3g8V3Y4",
          description: "Exploring how technology is transforming financial markets"
        },
        {
          title: "Market Data & APIs for Trading",
          url: "https://www.youtube.com/watch?v=5j8a3w7Y7xI",
          description: "Understanding real-time market data feeds and APIs"
        }
      ]
    },
    {
      title: "Risk Management & Psychology",
      description: "Essential risk control and trading psychology",
      icon: <Shield className="w-5 h-5" />,
      topics: [
        "Position Sizing & Kelly Criterion",
        "Drawdown Management",
        "Trading Psychology & Discipline",
        "Portfolio Diversification"
      ],
      videos: [
        {
          title: "Risk Management in Trading",
          url: "https://www.youtube.com/watch?v=5j8a3w7Y7xI",
          description: "Essential risk management techniques for algorithmic trading"
        },
        {
          title: "Trading Psychology & Discipline",
          url: "https://www.youtube.com/watch?v=5j8a3w7Y7xI",
          description: "Mastering the psychological aspects of systematic trading"
        }
      ]
    }
  ];

  const financialTerms = [
    { term: "Sharpe Ratio", definition: "Risk-adjusted return measure: (Return - Risk-free rate) / Volatility" },
    { term: "Maximum Drawdown", definition: "Largest peak-to-trough decline in portfolio value" },
    { term: "Alpha", definition: "Excess return above what would be expected from market risk" },
    { term: "Beta", definition: "Measure of systematic risk relative to market movements" },
    { term: "Volatility", definition: "Statistical measure of price dispersion over time" },
    { term: "Liquidity", definition: "Ease of buying/selling without significantly affecting price" },
    { term: "Slippage", definition: "Difference between expected and actual execution price" },
    { term: "Market Impact", definition: "Price movement caused by large order execution" },
    { term: "NSE", definition: "National Stock Exchange - India's leading stock exchange" },
    { term: "BSE", definition: "Bombay Stock Exchange - Asia's oldest stock exchange" },
    { term: "NIFTY 50", definition: "Benchmark index of 50 largest companies on NSE" },
    { term: "SENSEX", definition: "Benchmark index of 30 largest companies on BSE" },
    { term: "SEBI", definition: "Securities and Exchange Board of India - market regulator" }
  ];

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Educational Resources</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master algorithmic trading with comprehensive guides, video tutorials, and essential financial concepts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {educationalContent.map((section, index) => (
            <Card key={index} className="card-trading">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {section.icon}
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Key Topics:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {section.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Recommended Videos:</h4>
                  <div className="space-y-2">
                    {section.videos.map((video, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-start gap-2">
                          <Play className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm mb-1">{video.title}</h5>
                            <p className="text-xs text-muted-foreground mb-2">{video.description}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => window.open(video.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Watch Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Financial Terms Glossary */}
        <Card className="card-trading">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <CardTitle>Financial Terms Glossary</CardTitle>
            </div>
            <CardDescription>
              Essential terminology for algorithmic trading and financial markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {financialTerms.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold text-sm mb-1">{item.term}</h4>
                  <p className="text-sm text-muted-foreground">{item.definition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card className="card-trading mt-8">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get started with algorithmic trading in 5 steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Learn the Basics</h4>
                  <p className="text-sm text-muted-foreground">Watch the recommended videos and understand core concepts</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Start with Paper Trading</h4>
                  <p className="text-sm text-muted-foreground">Test your strategies risk-free before using real money</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Build Your Strategy</h4>
                  <p className="text-sm text-muted-foreground">Use our drag-and-drop interface to create trading algorithms</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Backtest Thoroughly</h4>
                  <p className="text-sm text-muted-foreground">Validate your strategy against historical data</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-semibold">Start Small & Scale</h4>
                  <p className="text-sm text-muted-foreground">Begin with small positions and gradually increase as you gain confidence</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


