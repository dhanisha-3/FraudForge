import React from "react";
import NexusNavigation from "@/components/NexusNavigation";
import FraudEducationCenter from "@/components/FraudEducationCenter";
import NexusFooter from "@/components/NexusFooter";

const EducationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <FraudEducationCenter />
      <NexusFooter />
    </div>
  );
};

export default EducationPage;
