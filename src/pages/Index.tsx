import NexusNavigation from "@/components/NexusNavigation";
import NexusHero from "@/components/NexusHero";
import ExecutiveSummaryDashboard from "@/components/ExecutiveSummaryDashboard";
import UnifiedAccountProtection from "@/components/UnifiedAccountProtection";
import DecentralizedIdentityKYC from "@/components/DecentralizedIdentityKYC";
import RealTimeTransactionMonitor from "@/components/RealTimeTransactionMonitor";
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard";
import AdvancedInteractiveDashboard from "@/components/AdvancedInteractiveDashboard";
import RealTimeAnalyticsDashboard from "@/components/RealTimeAnalyticsDashboard";
import MLModelShowcase from "@/components/MLModelShowcase";
import ContinuousLearningSystem from "@/components/ContinuousLearningSystem";
import MultiChannelSupport from "@/components/MultiChannelSupport";
import AdvancedUPIFraudDetection from "@/components/AdvancedUPIFraudDetection";
import AdvancedCreditCardDetection from "@/components/AdvancedCreditCardDetection";
import AdvancedPhishingDetection from "@/components/AdvancedPhishingDetection";
import GeospatialFraudDetection from "@/components/GeospatialFraudDetection";
import URLFraudDetection from "@/components/URLFraudDetection";
import AISpamDetection from "@/components/AISpamDetection";
import OTPFraudDetection from "@/components/OTPFraudDetection";
import TransactionFraudDetection from "@/components/TransactionFraudDetection";
import DigitalIDManagement from "@/components/DigitalIDManagement";
import TransactionMonitoring from "@/components/TransactionMonitoring";
import FraudEducationCenter from "@/components/FraudEducationCenter";
import AdvancedGNNFraudDetection from "@/components/AdvancedGNNFraudDetection";
import ThreatIntelligenceFusion from "@/components/ThreatIntelligenceFusion";
import AdvancedComputerVision from "@/components/AdvancedComputerVision";
import RealComputerVision from "@/components/RealComputerVision";
import DeepfakeDetectionLab from "@/components/DeepfakeDetectionLab";
import QRCodeSecurityAnalyzer from "@/components/QRCodeSecurityAnalyzer";
import DefenseMatrix from "@/components/DefenseMatrix";
import LiveDemo from "@/components/LiveDemo";
import BehavioralBiometrics from "@/components/BehavioralBiometrics";
import VoiceVerification from "@/components/VoiceVerification";
import FraudNetworkVisualization from "@/components/FraudNetworkVisualization";
import CreditCardScamDetection from "@/components/CreditCardScamDetection";
import UPIFraudDetection from "@/components/UPIFraudDetection";
import SafeZonePortal from "@/components/SafeZonePortal";
import AIExplanationEngine from "@/components/AIExplanationEngine";
import AlgorithmShowcase from "@/components/AlgorithmShowcase";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import { TechStack } from "@/components/TechStack";
import NexusFooter from "@/components/NexusFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />

      {/* Hero Section */}
      <section id="hero">
        <NexusHero />
      </section>

      {/* Real-Time Monitor Section */}
      <section id="real-time-monitor" className="py-8">
        <ExecutiveSummaryDashboard />
        <RealTimeTransactionMonitor />
        <AdvancedInteractiveDashboard />
      </section>

      {/* Computer Vision Section */}
      <section id="computer-vision" className="py-8">
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Advanced Computer Vision
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time face detection, QR code security analysis, and location-aware fraud prevention
            </p>
          </div>
        </div>
        <RealComputerVision />
        <AdvancedComputerVision />
        <DeepfakeDetectionLab />
        <QRCodeSecurityAnalyzer />
        <GeospatialFraudDetection />
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-8">
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Advanced Analytics
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fraud analytics and behavioral insights
            </p>
          </div>
        </div>
        <RealTimeAnalyticsDashboard />
        <AdvancedAnalyticsDashboard />
        <InteractiveDashboard />
        <PerformanceMetrics />
      </section>

      {/* ML Models Section */}
      <section id="ml-models" className="py-8">
        <MLModelShowcase />
        <ContinuousLearningSystem />
        <AdvancedGNNFraudDetection />
        <ThreatIntelligenceFusion />
        <AIExplanationEngine />
        <AlgorithmShowcase />
      </section>

      {/* Multi-Channel Section */}
      <section id="multi-channel" className="py-8">
        <MultiChannelSupport />
        <AdvancedUPIFraudDetection />
        <AdvancedCreditCardDetection />
        <AdvancedPhishingDetection />
        <URLFraudDetection />
        <AISpamDetection />
        <OTPFraudDetection />
        <TransactionFraudDetection />
        <CreditCardScamDetection />
        <UPIFraudDetection />
      </section>

      {/* Biometrics Section */}
      <section id="biometrics" className="py-8">
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-red-500 to-yellow-600 bg-clip-text text-transparent">
              Biometric Security
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced biometric authentication and behavioral analysis
            </p>
          </div>
        </div>
        <BehavioralBiometrics />
        <VoiceVerification />
        <UnifiedAccountProtection />
        <div className="bg-slate-50/50 dark:bg-slate-950/50">
          <DigitalIDManagement />
        </div>
        <div className="bg-background">
          <TransactionMonitoring />
        </div>
        <DecentralizedIdentityKYC />
      </section>

      {/* Defense Matrix Section */}
      <section id="defense-matrix" className="py-8">
        <DefenseMatrix />
        <LiveDemo />
        <FraudNetworkVisualization />
        <SafeZonePortal />
        <FraudEducationCenter />
      </section>

      {/* Tech Stack & Footer */}
      <TechStack />
      <NexusFooter />
    </div>
  );
};

export default Index;
