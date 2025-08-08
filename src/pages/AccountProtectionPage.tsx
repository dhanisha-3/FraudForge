import React from "react";
import NexusNavigation from "@/components/NexusNavigation";
import UnifiedAccountProtection from "@/components/UnifiedAccountProtection";
import NexusFooter from "@/components/NexusFooter";

const AccountProtectionPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <UnifiedAccountProtection />
      </div>
      <NexusFooter />
    </div>
  );
};

export default AccountProtectionPage;
