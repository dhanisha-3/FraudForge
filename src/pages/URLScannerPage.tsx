import React from "react";
import NexusNavigation from "@/components/NexusNavigation";
import URLFraudDetection from "@/components/URLFraudDetection";
import NexusFooter from "@/components/NexusFooter";

const URLScannerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <URLFraudDetection />
      <NexusFooter />
    </div>
  );
};

export default URLScannerPage;
