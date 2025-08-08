import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Brain,
  Shield,
  Eye,
  MessageSquare,
  AlertTriangle,
  Zap,
  Fingerprint,
} from 'lucide-react';

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ElementType;
  impactLevel: 'low' | 'medium' | 'high';
}

export function AIFeatureToggles() {
  const [features, setFeatures] = React.useState<FeatureToggle[]>([
    {
      id: 'deep-learning',
      name: 'Deep Learning Analysis',
      description: 'Advanced pattern recognition for fraud detection',
      enabled: true,
      icon: Brain,
      impactLevel: 'high',
    },
    {
      id: 'real-time-protection',
      name: 'Real-time Protection',
      description: 'Instant threat detection and response',
      enabled: true,
      icon: Shield,
      impactLevel: 'high',
    },
    {
      id: 'computer-vision',
      name: 'Computer Vision',
      description: 'Image and video-based fraud detection',
      enabled: true,
      icon: Eye,
      impactLevel: 'medium',
    },
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      description: 'Text analysis for fraud patterns',
      enabled: true,
      icon: MessageSquare,
      impactLevel: 'medium',
    },
    {
      id: 'anomaly-detection',
      name: 'Anomaly Detection',
      description: 'Identify unusual patterns and behaviors',
      enabled: true,
      icon: AlertTriangle,
      impactLevel: 'high',
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics',
      description: 'Future fraud risk assessment',
      enabled: true,
      icon: Zap,
      impactLevel: 'medium',
    },
    {
      id: 'biometric-auth',
      name: 'Biometric Authentication',
      description: 'AI-powered biometric verification',
      enabled: true,
      icon: Fingerprint,
      impactLevel: 'high',
    },
  ]);

  const handleToggle = (id: string) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const getImpactColor = (level: FeatureToggle['impactLevel']) => {
    switch (level) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Feature Controls</CardTitle>
          <CardDescription>
            Enable or disable AI-powered security features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <Label htmlFor={feature.id} className="font-medium">
                        {feature.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-medium ${getImpactColor(
                        feature.impactLevel
                      )}`}
                    >
                      {feature.impactLevel.toUpperCase()}
                    </span>
                    <Switch
                      id={feature.id}
                      checked={feature.enabled}
                      onCheckedChange={() => handleToggle(feature.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
