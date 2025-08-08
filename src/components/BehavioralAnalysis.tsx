import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Fingerprint,
  Mouse,
  Keyboard,
  Smartphone,
  Globe,
  Clock,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface BehaviorPattern {
  type: string;
  score: number;
  confidence: number;
  anomalies: string[];
  lastUpdate: string;
}

interface UserProfile {
  deviceFingerprint: string;
  location: string;
  timezone: string;
  browserDetails: string;
  patterns: BehaviorPattern[];
}

export function BehavioralAnalysis() {
  const [profile, setProfile] = React.useState<UserProfile>({
    deviceFingerprint: "f82d7c9e5b3a",
    location: "Mumbai, India",
    timezone: "Asia/Kolkata",
    browserDetails: "Chrome 120.0.0 / Windows",
    patterns: [
      {
        type: "Mouse Movement",
        score: 92,
        confidence: 85,
        anomalies: [],
        lastUpdate: new Date().toISOString()
      },
      {
        type: "Keyboard Dynamics",
        score: 88,
        confidence: 78,
        anomalies: ["Unusual typing speed detected"],
        lastUpdate: new Date().toISOString()
      },
      {
        type: "Touch Patterns",
        score: 95,
        confidence: 82,
        anomalies: [],
        lastUpdate: new Date().toISOString()
      },
    ]
  });

  const getPatternIcon = (type: string) => {
    switch (type) {
      case "Mouse Movement":
        return <Mouse className="h-4 w-4" />;
      case "Keyboard Dynamics":
        return <Keyboard className="h-4 w-4" />;
      case "Touch Patterns":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Device Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Fingerprint className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Device ID</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.deviceFingerprint}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.location}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Timezone</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.timezone}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Browser</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.browserDetails}
                </div>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Fingerprint className="mr-2 h-4 w-4" />
              Update Device Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavioral Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patterns">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns" className="space-y-4">
              {profile.patterns.map((pattern, index) => (
                <div
                  key={index}
                  className="space-y-2 p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPatternIcon(pattern.type)}
                      <span className="font-medium">{pattern.type}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={pattern.anomalies.length === 0 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}
                    >
                      {pattern.anomalies.length === 0 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Trust Score</span>
                      <span>{pattern.score}%</span>
                    </div>
                    <Progress value={pattern.score} className="h-2" />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(pattern.lastUpdate).toLocaleString()}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="anomalies">
              <div className="space-y-4">
                {profile.patterns.map((pattern, index) => (
                  pattern.anomalies.length > 0 && (
                    <div
                      key={index}
                      className="p-4 rounded-lg border bg-card space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{pattern.type}</span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {pattern.anomalies.map((anomaly, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <span>•</span>
                            <span>{anomaly}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}

                {!profile.patterns.some(p => p.anomalies.length > 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No anomalies detected
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
