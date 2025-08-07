import NexusNavigation from "@/components/NexusNavigation";
import NexusHero from "@/components/NexusHero";
import DefenseMatrix from "@/components/DefenseMatrix";
import LiveDemo from "@/components/LiveDemo";
import BehavioralBiometrics from "@/components/BehavioralBiometrics";
import VoiceVerification from "@/components/VoiceVerification";
import FraudNetworkVisualization from "@/components/FraudNetworkVisualization";
import CreditCardScamDetection from "@/components/CreditCardScamDetection";
import UPIFraudDetection from "@/components/UPIFraudDetection";
import SafeZonePortal from "@/components/SafeZonePortal";
import AIExplanationEngine from "@/components/AIExplanationEngine";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import { TechStack } from "@/components/TechStack";
import NexusFooter from "@/components/NexusFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <NexusHero />
      <DefenseMatrix />
      <LiveDemo />
      <BehavioralBiometrics />
      <VoiceVerification />
      <FraudNetworkVisualization />
      <CreditCardScamDetection />
      <UPIFraudDetection />
      <SafeZonePortal />
      <AIExplanationEngine />
      <InteractiveDashboard />
      <PerformanceMetrics />
      <TechStack />
      <NexusFooter />
    </div>
  );
};

export default Index;
