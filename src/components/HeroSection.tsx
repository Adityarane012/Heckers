import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-trading.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(29, 39, 54, 0.8), rgba(29, 39, 54, 0.9)), url(${heroImage})`,
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
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8 animate-fade-in">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Democratizing Algorithmic Trading</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            Trade Smarter with
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Algorithms
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Build, test, and deploy sophisticated trading strategies without coding. 
            Join thousands of retail investors leveling the playing field with institutional-grade tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button variant="trading" size="lg" className="text-lg px-8 py-4">
              Start Trading
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="trading-outline" size="lg" className="text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in">
            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No-Code Strategy Builder</h3>
              <p className="text-muted-foreground">Create complex trading algorithms with our intuitive drag-and-drop interface</p>
            </div>

            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
              <p className="text-muted-foreground">Built-in safeguards and transparent risk metrics to protect your investments</p>
            </div>

            <div className="card-trading p-6 text-center">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Marketplace</h3>
              <p className="text-muted-foreground">Share and discover proven strategies from our community of traders</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}