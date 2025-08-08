import React from 'react';
import NexusNavigation from '@/components/NexusNavigation';
import UnifiedAccountProtection from '@/components/UnifiedAccountProtection';
import BehavioralBiometrics from '@/components/BehavioralBiometrics';
import VoiceVerification from '@/components/VoiceVerification';
import DefenseMatrix from '@/components/DefenseMatrix';

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Security Features</h1>
          <div className="space-y-12">
            <UnifiedAccountProtection />
            <BehavioralBiometrics />
            <VoiceVerification />
            <DefenseMatrix />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityPage;
