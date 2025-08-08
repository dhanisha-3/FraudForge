import React from 'react';
import { VoiceVerification } from '@/components/VoiceVerification';

export default function VoiceVerificationPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Voice Verification</h2>
        <p className="text-muted-foreground">
          AI-powered voice biometrics and fraud detection
        </p>
      </div>
      <VoiceVerification />
    </div>
  );
}
