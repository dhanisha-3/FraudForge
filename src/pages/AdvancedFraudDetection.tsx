import React from 'react';
import { BehavioralBiometrics } from '@/components/BehavioralBiometrics';
import { ContinuousLearningSystem } from '@/components/ContinuousLearningSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdvancedFraudDetection() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Advanced Fraud Detection</h2>
        <p className="text-muted-foreground">
          Next-generation AI-powered fraud detection and prevention system
        </p>
      </div>

      <Tabs defaultValue="biometrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="biometrics">Behavioral Biometrics</TabsTrigger>
          <TabsTrigger value="learning">Continuous Learning</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="biometrics" className="space-y-4">
          <BehavioralBiometrics />
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <ContinuousLearningSystem />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Analytics</CardTitle>
              <CardDescription>
                Comprehensive analysis of fraud patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add RealTimeAnalyticsDashboard component here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
