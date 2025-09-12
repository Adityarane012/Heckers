import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">OpenAlgo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/#strategies" className="text-foreground hover:text-primary transition-colors">
              Strategies
            </Link>
            <Link to="/#backtesting" className="text-foreground hover:text-primary transition-colors">
              Backtesting
            </Link>
            <Link to="/#community" className="text-foreground hover:text-primary transition-colors">
              Community
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Link to="/#strategies" className="inline-flex">
              <Button variant="trading">Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/#features" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Features
              </Link>
              <Link to="/#strategies" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Strategies
              </Link>
              <Link to="/#backtesting" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Backtesting
              </Link>
              <Link to="/#community" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Community
              </Link>
              <Link to="/pricing" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Pricing
              </Link>
              <div className="pt-4 border-t border-border flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start">Sign In</Button>
                <Link to="/#strategies" onClick={() => setIsOpen(false)} className="inline-flex">
                  <Button variant="trading" className="justify-start">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}