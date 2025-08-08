import React from 'react';
import { DeepfakeDetectionLab } from '@/components/DeepfakeDetectionLab';

export default function DeepfakeDetectionPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Deepfake Detection Lab</h2>
        <p className="text-muted-foreground">
          Advanced AI-powered analysis for detecting manipulated media
        </p>
      </div>
      <DeepfakeDetectionLab />
    </div>
  );
}
