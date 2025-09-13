import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StrategyBuilder } from "@/components/StrategyBuilder";
import { BacktestingSection } from "@/components/BacktestingSection";
import HybridPricePredictor from "@/components/HybridPricePredictor";
import { CommunitySection } from "@/components/CommunitySection";
import { EducationalHelp } from "@/components/EducationalHelp";
import { PaperTradingPanel } from "@/components/PaperTradingPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StrategyBuilder />
      <BacktestingSection />
      <HybridPricePredictor />
      <EducationalHelp />
      <PaperTradingPanel />
      <CommunitySection />
    </div>
  );
};

export default Index;
