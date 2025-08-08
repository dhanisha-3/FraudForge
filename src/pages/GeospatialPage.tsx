import React from "react";
import NexusNavigation from "@/components/NexusNavigation";
import GeospatialFraudDetection from "@/components/GeospatialFraudDetection";
import NexusFooter from "@/components/NexusFooter";

const GeospatialPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <GeospatialFraudDetection />
      <NexusFooter />
    </div>
  );
};

export default GeospatialPage;
