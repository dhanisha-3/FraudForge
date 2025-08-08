import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import AnimatedBackground from "./components/AnimatedBackground";
import Layout from "./components/Layout";
import { GlobalLoader } from "./components/GlobalLoader";
import { StatusBar } from "./components/StatusBar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MaintenanceMode } from "./components/MaintenanceMode";
import { Suspense, useState } from "react";

// Pages
import Dashboard from "./pages/Dashboard";
import TransactionMonitorPage from "./pages/TransactionMonitorPage";
import AIModels from "./pages/AIModels";
import ComputerVision from "./pages/ComputerVision";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AccountProtection from "./pages/AccountProtection";
import DigitalID from "./pages/DigitalID";
import Security from "./pages/Security";
import FraudEducation from "./pages/FraudEducation";
import GeospatialFraud from "./pages/GeospatialFraud";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import URLFraudDetection from "./pages/URLFraudDetection";
import AISpamDetection from "./pages/AISpamDetection";
import OTPFraud from "./pages/OTPFraud";
import CreditCardFraud from "./pages/CreditCardFraud";
import PhishingDetection from "./pages/PhishingDetection";
import DefenseMatrixPage from "./pages/DefenseMatrix";
import DeepfakeDetectionPage from "./pages/DeepfakeDetection";
import AdvancedFraudDetection from "./pages/AdvancedFraudDetection";
import QRCodeSecurity from "./pages/QRCodeSecurity";
import NetworkAnalysis from "./pages/NetworkAnalysis";
import VoiceVerificationPage from "./pages/VoiceVerificationPage";
import UnifiedFraudDetection from "./pages/UnifiedFraudDetection";
import FIRWizard from "./pages/FIRWizard";

const queryClient = new QueryClient();

const App = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="fraudguard-theme">
      <TooltipProvider>
        <AnimatedBackground />
        <Toaster />
        <Sonner />
        {isMaintenanceMode && (
          <MaintenanceMode
            startTime={new Date()}
            endTime={new Date(Date.now() + 3600000)}
            reason="System upgrade in progress"
            onDismiss={() => setIsMaintenanceMode(false)}
          />
        )}
        <BrowserRouter>
          <Suspense fallback={<GlobalLoader fullScreen />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Main App Routes */}
            <Route path="/" element={<Layout />}>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />

              {/* Core Security Features */}
              <Route path="account-protection" element={<AccountProtection />} />
              <Route path="digital-id" element={<DigitalID />} />
              <Route path="security" element={<Security />} />

              {/* Transaction Monitoring */}
              <Route path="transactions" element={<TransactionMonitorPage />} />
              <Route path="analytics" element={<Analytics />} />

              {/* AI & ML Features */}
              <Route path="ai-models" element={<AIModels />} />
              <Route path="computer-vision" element={<ComputerVision />} />

              {/* Fraud Detection */}
              <Route path="url-scanner" element={<URLFraudDetection />} />
              <Route path="spam-detection" element={<AISpamDetection />} />
              <Route path="otp-fraud" element={<OTPFraud />} />
              <Route path="credit-card" element={<CreditCardFraud />} />
              <Route path="phishing" element={<PhishingDetection />} />

              {/* Advanced Features */}
              <Route path="geospatial" element={<GeospatialFraud />} />
              <Route path="threat-intelligence" element={<ThreatIntelligence />} />
              <Route path="defense-matrix" element={<DefenseMatrixPage />} />
              <Route path="deepfake-detection" element={<DeepfakeDetectionPage />} />
              <Route path="advanced-fraud-detection" element={<AdvancedFraudDetection />} />
              <Route path="qr-security" element={<QRCodeSecurity />} />
              <Route path="network-analysis" element={<NetworkAnalysis />} />
              <Route path="voice-verification" element={<VoiceVerificationPage />} />
                  <Route path="fir" element={<FIRWizard />} />
              <Route path="unified-fraud-detection" element={<UnifiedFraudDetection />} />

              {/* Support & Education */}
              <Route path="education" element={<FraudEducation />} />

              {/* Settings & Configuration */}
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <StatusBar />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
