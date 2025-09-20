import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChart3, ChevronDown, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FeaturesShowcase } from "./FeaturesShowcase";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();


  // Update active tab based on current location
  useEffect(() => {
    const path = location.pathname;
    const hash = location.hash;
    
    let newTab = "home";
    if (path === "/pricing") {
      newTab = "pricing";
    } else if (path === "/agents") {
      newTab = "agents";
    } else if (hash === "#strategies") {
      newTab = "strategies";
    } else if (hash === "#backtesting") {
      newTab = "backtesting";
    } else if (hash === "#community") {
      newTab = "community";
    }
    
    setActiveTab(newTab);
  }, [location]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

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
            <button 
              onClick={() => {
                setShowFeatures(true);
                handleTabClick("features");
              }}
              className={`flex items-center gap-1 transition-colors group relative py-2 px-1 ${
                activeTab === "features" 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Features
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <Link 
              to="/#strategies" 
              onClick={() => handleTabClick("strategies")}
              className={`transition-colors relative py-2 px-1 ${
                activeTab === "strategies" 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Strategies
            </Link>
            <Link 
              to="/#backtesting" 
              onClick={() => handleTabClick("backtesting")}
              className={`transition-colors relative py-2 px-1 ${
                activeTab === "backtesting" 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Backtesting
            </Link>
            <Link 
              to="/#community" 
              onClick={() => handleTabClick("community")}
              className={`transition-colors relative py-2 px-1 ${
                activeTab === "community" 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Community
            </Link>
            <Link 
              to="/agents" 
              onClick={() => handleTabClick("agents")}
              className={`transition-colors relative py-2 px-1 flex items-center gap-1 ${
                activeTab === "agents" 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Agents
            </Link>
            <Link 
              to="/pricing" 
              onClick={() => handleTabClick("pricing")}
              className={`transition-colors relative py-2 px-1 ${
                activeTab === "pricing" 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
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
              <button 
                onClick={() => {
                  setShowFeatures(true);
                  setIsOpen(false);
                  handleTabClick("features");
                }}
                className={`flex items-center gap-1 transition-colors text-left py-2 px-2 rounded-md ${
                  activeTab === "features" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
                Features
                <ChevronDown className="w-4 h-4" />
              </button>
              <Link 
                to="/#strategies" 
                onClick={() => {
                  setIsOpen(false);
                  handleTabClick("strategies");
                }}
                className={`transition-colors py-2 px-2 rounded-md ${
                  activeTab === "strategies" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
                Strategies
              </Link>
              <Link 
                to="/#backtesting" 
                onClick={() => {
                  setIsOpen(false);
                  handleTabClick("backtesting");
                }}
                className={`transition-colors py-2 px-2 rounded-md ${
                  activeTab === "backtesting" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
                Backtesting
              </Link>
              <Link 
                to="/#community" 
                onClick={() => {
                  setIsOpen(false);
                  handleTabClick("community");
                }}
                className={`transition-colors py-2 px-2 rounded-md ${
                  activeTab === "community" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
                Community
              </Link>
              <Link 
                to="/agents" 
                onClick={() => {
                  setIsOpen(false);
                  handleTabClick("agents");
                }}
                className={`transition-colors py-2 px-2 rounded-md flex items-center gap-1 ${
                  activeTab === "agents" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Agents
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => {
                  setIsOpen(false);
                  handleTabClick("pricing");
                }}
                className={`transition-colors py-2 px-2 rounded-md ${
                  activeTab === "pricing" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
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
      
      {/* Features Showcase */}
      <FeaturesShowcase 
        isVisible={showFeatures} 
        onClose={() => setShowFeatures(false)} 
      />
    </nav>
  );
}