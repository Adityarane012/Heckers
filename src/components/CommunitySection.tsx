import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  TrendingUp, 
  Users, 
  Download,
  Eye,
  Heart,
  MessageCircle
} from "lucide-react";

interface Strategy {
  id: string;
  name: string;
  author: string;
  avatar: string;
  rating: number;
  returns: number;
  downloads: number;
  likes: number;
  description: string;
  tags: string[];
  risk: "Low" | "Medium" | "High";
}

const featuredStrategies: Strategy[] = [
  {
    id: "1",
    name: "Mean Reversion Pro",
    author: "AlgoTrader_X",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    returns: 32.4,
    downloads: 1250,
    likes: 89,
    description: "A sophisticated mean reversion strategy using RSI and Bollinger Bands for high-probability entries.",
    tags: ["RSI", "Bollinger Bands", "Mean Reversion"],
    risk: "Medium"
  },
  {
    id: "2", 
    name: "Momentum Breakout",
    author: "QuanTrader",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    returns: 28.7,
    downloads: 890,
    likes: 67,
    description: "Captures strong momentum moves with volume confirmation and dynamic stop losses.",
    tags: ["Momentum", "Volume", "Breakout"],
    risk: "High"
  },
  {
    id: "3",
    name: "Conservative Growth",
    author: "SafeInvestor",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    returns: 18.2,
    downloads: 2100,
    likes: 156,
    description: "Low-risk strategy focusing on dividend stocks with gradual capital appreciation.",
    tags: ["Dividends", "Blue Chip", "Conservative"],
    risk: "Low"
  }
];

export function CommunitySection() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-success";
      case "Medium": return "bg-warning";
      case "High": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <section id="community" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Community Marketplace</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, share, and collaborate on proven trading strategies with our community of traders
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
            <div className="text-muted-foreground">Active Strategies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">15,000+</div>
            <div className="text-muted-foreground">Community Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">89%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-info mb-2">$50M+</div>
            <div className="text-muted-foreground">Total Volume</div>
          </div>
        </div>

        {/* Featured Strategies */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Featured Strategies</h3>
            <Button variant="trading-outline">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredStrategies.map((strategy) => (
              <Card key={strategy.id} className="card-trading hover:scale-105 transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={strategy.avatar} alt={strategy.author} />
                        <AvatarFallback>{strategy.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <CardDescription>by {strategy.author}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      className={`${getRiskColor(strategy.risk)} text-white`}
                    >
                      {strategy.risk} Risk
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {strategy.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {strategy.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{strategy.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 trading-profit">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">+{strategy.returns}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{strategy.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{strategy.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>24</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="trading" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Use Strategy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="card-trading max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Join Our Trading Community</h3>
              <p className="text-muted-foreground mb-6">
                Share your strategies, learn from experts, and grow your trading success together
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="trading">
                  Share Your Strategy
                </Button>
                <Button variant="trading-outline">
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}