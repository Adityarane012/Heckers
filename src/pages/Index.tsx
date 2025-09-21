// Main landing page component with all major sections
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
// AI-powered strategy building with integrated agents
import { StrategyBuilder } from "@/components/StrategyBuilder";
import { BacktestingSection } from "@/components/BacktestingSection";
import { CommunitySection } from "@/components/CommunitySection";
import { EducationalHelp } from "@/components/EducationalHelp";
import { PaperTradingPanel } from "@/components/PaperTradingPanel";

// Main Index page component with comprehensive trading platform sections
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StrategyBuilder />
      <BacktestingSection />
      <EducationalHelp />
      <PaperTradingPanel />
      <CommunitySection />
    </div>
  );
};

export default Index;
