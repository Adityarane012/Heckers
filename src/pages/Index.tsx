import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StrategyBuilder } from "@/components/StrategyBuilder";
import { BacktestingSection } from "@/components/BacktestingSection";
import { CommunitySection } from "@/components/CommunitySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StrategyBuilder />
      <BacktestingSection />
      <CommunitySection />
    </div>
  );
};

export default Index;
