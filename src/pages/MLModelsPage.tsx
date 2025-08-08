import React from 'react';
import NexusNavigation from '@/components/NexusNavigation';
import MLModelShowcase from '@/components/MLModelShowcase';
import ContinuousLearningSystem from '@/components/ContinuousLearningSystem';
import AIExplanationEngine from '@/components/AIExplanationEngine';
import AlgorithmShowcase from '@/components/AlgorithmShowcase';

const MLModelsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Machine Learning Models</h1>
          <div className="space-y-12">
            <MLModelShowcase />
            <ContinuousLearningSystem />
            <AIExplanationEngine />
            <AlgorithmShowcase />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MLModelsPage;
