import NexusNavigation from "@/components/NexusNavigation";
import NexusHero from "@/components/NexusHero";
import DefenseMatrix from "@/components/DefenseMatrix";
import LiveDemo from "@/components/LiveDemo";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import TechStack from "@/components/TechStack";
import NexusFooter from "@/components/NexusFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <NexusHero />
      <DefenseMatrix />
      <LiveDemo />
      <PerformanceMetrics />
      <TechStack />
      <NexusFooter />
    </div>
  );
};

export default Index;
