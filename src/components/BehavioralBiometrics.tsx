import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Fingerprint, 
  Mouse, 
  Keyboard, 
  Smartphone,
  Eye,
  Brain,
  Shield,
  CheckCircle,
  AlertTriangle,
  Activity,
  Timer,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MouseData {
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
  acceleration: number;
}

interface KeystrokeData {
  key: string;
  timestamp: number;
  dwellTime: number;
  flightTime: number;
}

interface BiometricProfile {
  mousePattern: number;
  keystrokeRhythm: number;
  deviceFingerprint: number;
  behavioralConsistency: number;
  overallMatch: number;
}

const BehavioralBiometrics = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [mouseData, setMouseData] = useState<MouseData[]>([]);
  const [keystrokeData, setKeystrokeData] = useState<KeystrokeData[]>([]);
  const [testInput, setTestInput] = useState("");
  const [biometricProfile, setBiometricProfile] = useState<BiometricProfile>({
    mousePattern: 0,
    keystrokeRhythm: 0,
    deviceFingerprint: 85,
    behavioralConsistency: 0,
    overallMatch: 0
  });
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "analyzing" | "verified" | "suspicious">("idle");
  
  const trackingAreaRef = useRef<HTMLDivElement>(null);
  const lastMouseTime = useRef<number>(0);
  const lastKeyTime = useRef<number>(0);
  const keyDownTimes = useRef<Map<string, number>>(new Map());

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isTracking || !trackingAreaRef.current) return;

    const rect = trackingAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const timestamp = Date.now();
    
    if (lastMouseTime.current > 0) {
      const timeDiff = timestamp - lastMouseTime.current;
      const lastPoint = mouseData[mouseData.length - 1];
      
      if (lastPoint && timeDiff > 0) {
        const distance = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
        const velocity = distance / timeDiff;
        const acceleration = Math.abs(velocity - (lastPoint.velocity || 0));
        
        const newPoint: MouseData = { x, y, timestamp, velocity, acceleration };
        
        setMouseData(prev => [...prev.slice(-50), newPoint]);
      }
    }
    
    lastMouseTime.current = timestamp;
  }, [isTracking, mouseData]);

  // Keystroke tracking
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isTracking) return;
    keyDownTimes.current.set(e.key, Date.now());
  }, [isTracking]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!isTracking) return;
    
    const keyDownTime = keyDownTimes.current.get(e.key);
    if (keyDownTime) {
      const timestamp = Date.now();
      const dwellTime = timestamp - keyDownTime;
      const flightTime = timestamp - lastKeyTime.current;
      
      const keystroke: KeystrokeData = {
        key: e.key,
        timestamp,
        dwellTime,
        flightTime
      };
      
      setKeystrokeData(prev => [...prev.slice(-20), keystroke]);
      lastKeyTime.current = timestamp;
      keyDownTimes.current.delete(e.key);
    }
  }, [isTracking]);

  // Add event listeners
  useEffect(() => {
    if (isTracking && trackingAreaRef.current) {
      const element = trackingAreaRef.current;
      element.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      
      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isTracking, handleMouseMove, handleKeyDown, handleKeyUp]);

  // Advanced biometric analysis algorithm
  useEffect(() => {
    if (mouseData.length > 10 && keystrokeData.length > 5) {
      // Advanced mouse pattern analysis
      const mousePattern = analyzeMousePattern(mouseData);
      const keystrokeRhythm = analyzeKeystrokePattern(keystrokeData);
      const behavioralConsistency = analyzeBehavioralConsistency(mouseData, keystrokeData);
      const overallMatch = calculateOverallMatch(mousePattern, keystrokeRhythm, biometricProfile.deviceFingerprint, behavioralConsistency);

      setBiometricProfile(prev => ({
        ...prev,
        mousePattern,
        keystrokeRhythm,
        behavioralConsistency,
        overallMatch
      }));

      // Determine verification status based on sophisticated thresholds
      if (overallMatch > 85 && mousePattern > 80 && keystrokeRhythm > 80) {
        setVerificationStatus("verified");
      } else if (overallMatch > 60 && (mousePattern > 60 || keystrokeRhythm > 60)) {
        setVerificationStatus("analyzing");
      } else {
        setVerificationStatus("suspicious");
      }
    }
  }, [mouseData, keystrokeData, biometricProfile.deviceFingerprint]);

  // Advanced mouse pattern analysis
  const analyzeMousePattern = (data: MouseData[]): number => {
    if (data.length < 5) return 0;

    let score = 0;

    // 1. Velocity consistency analysis
    const velocities = data.map(d => d.velocity).filter(v => v > 0);
    const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const velocityVariance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length;
    const velocityStdDev = Math.sqrt(velocityVariance);

    // Human-like velocity patterns have moderate variance
    if (velocityStdDev > 0.1 && velocityStdDev < 2.0) {
      score += 25;
    }

    // 2. Acceleration pattern analysis
    const accelerations = data.map(d => d.acceleration).filter(a => a > 0);
    const avgAcceleration = accelerations.reduce((sum, a) => sum + a, 0) / accelerations.length;

    // Human movements have natural acceleration patterns
    if (avgAcceleration > 0.05 && avgAcceleration < 1.5) {
      score += 20;
    }

    // 3. Movement smoothness (Jerk analysis)
    let totalJerk = 0;
    for (let i = 2; i < data.length; i++) {
      const jerk = Math.abs(data[i].acceleration - 2 * data[i-1].acceleration + data[i-2].acceleration);
      totalJerk += jerk;
    }
    const avgJerk = totalJerk / (data.length - 2);

    // Human movements have controlled jerk
    if (avgJerk < 0.5) {
      score += 20;
    }

    // 4. Trajectory analysis
    const distances = [];
    for (let i = 1; i < data.length; i++) {
      const distance = Math.sqrt(
        Math.pow(data[i].x - data[i-1].x, 2) +
        Math.pow(data[i].y - data[i-1].y, 2)
      );
      distances.push(distance);
    }

    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    if (avgDistance > 5 && avgDistance < 50) {
      score += 15;
    }

    // 5. Temporal consistency
    const timeDiffs = [];
    for (let i = 1; i < data.length; i++) {
      timeDiffs.push(data[i].timestamp - data[i-1].timestamp);
    }
    const avgTimeDiff = timeDiffs.reduce((sum, t) => sum + t, 0) / timeDiffs.length;

    // Human movements have consistent timing
    if (avgTimeDiff > 10 && avgTimeDiff < 100) {
      score += 20;
    }

    return Math.min(100, score);
  };

  // Advanced keystroke pattern analysis
  const analyzeKeystrokePattern = (data: KeystrokeData[]): number => {
    if (data.length < 3) return 0;

    let score = 0;

    // 1. Dwell time analysis
    const dwellTimes = data.map(k => k.dwellTime).filter(d => d > 0);
    const avgDwellTime = dwellTimes.reduce((sum, d) => sum + d, 0) / dwellTimes.length;
    const dwellVariance = dwellTimes.reduce((sum, d) => sum + Math.pow(d - avgDwellTime, 2), 0) / dwellTimes.length;

    // Human typing has characteristic dwell time patterns
    if (avgDwellTime > 50 && avgDwellTime < 300) {
      score += 25;
    }

    if (dwellVariance > 100 && dwellVariance < 10000) {
      score += 20;
    }

    // 2. Flight time analysis
    const flightTimes = data.map(k => k.flightTime).filter(f => f > 0);
    const avgFlightTime = flightTimes.reduce((sum, f) => sum + f, 0) / flightTimes.length;

    // Human inter-key intervals
    if (avgFlightTime > 100 && avgFlightTime < 500) {
      score += 25;
    }

    // 3. Typing rhythm consistency
    const rhythmScores = [];
    for (let i = 1; i < data.length; i++) {
      const rhythm = data[i].dwellTime + data[i].flightTime;
      rhythmScores.push(rhythm);
    }

    const rhythmVariance = rhythmScores.reduce((sum, r, _, arr) => {
      const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
      return sum + Math.pow(r - avg, 2);
    }, 0) / rhythmScores.length;

    // Consistent rhythm indicates human typing
    if (rhythmVariance > 1000 && rhythmVariance < 50000) {
      score += 30;
    }

    return Math.min(100, score);
  };

  // Behavioral consistency analysis
  const analyzeBehavioralConsistency = (mouseData: MouseData[], keystrokeData: KeystrokeData[]): number => {
    let score = 0;

    // 1. Cross-modal timing correlation
    if (mouseData.length > 0 && keystrokeData.length > 0) {
      const mouseTimestamps = mouseData.map(m => m.timestamp);
      const keystrokeTimestamps = keystrokeData.map(k => k.timestamp);

      // Check for realistic interaction patterns
      const hasRealisticInteraction = mouseTimestamps.some(mt =>
        keystrokeTimestamps.some(kt => Math.abs(mt - kt) < 5000)
      );

      if (hasRealisticInteraction) {
        score += 30;
      }
    }

    // 2. Activity level consistency
    const mouseActivity = mouseData.length / (isTracking ? 1 : 0.1);
    const keystrokeActivity = keystrokeData.length / (testInput.length || 1);

    // Balanced activity indicates human behavior
    if (mouseActivity > 5 && keystrokeActivity > 0.5) {
      score += 35;
    }

    // 3. Temporal distribution
    const allTimestamps = [
      ...mouseData.map(m => m.timestamp),
      ...keystrokeData.map(k => k.timestamp)
    ].sort();

    if (allTimestamps.length > 5) {
      const timeSpan = allTimestamps[allTimestamps.length - 1] - allTimestamps[0];
      const avgInterval = timeSpan / allTimestamps.length;

      // Human interaction has natural temporal distribution
      if (avgInterval > 100 && avgInterval < 2000) {
        score += 35;
      }
    }

    return Math.min(100, score);
  };

  // Calculate overall biometric match
  const calculateOverallMatch = (mouse: number, keystroke: number, device: number, consistency: number): number => {
    // Weighted scoring based on reliability of each metric
    const weights = {
      mouse: 0.3,
      keystroke: 0.35,
      device: 0.15,
      consistency: 0.2
    };

    const weightedScore =
      mouse * weights.mouse +
      keystroke * weights.keystroke +
      device * weights.device +
      consistency * weights.consistency;

    return Math.min(100, weightedScore);
  };

  const startTracking = () => {
    setIsTracking(true);
    setVerificationStatus("analyzing");
    setMouseData([]);
    setKeystrokeData([]);
    setBiometricProfile(prev => ({ ...prev, mousePattern: 0, keystrokeRhythm: 0, behavioralConsistency: 0, overallMatch: 0 }));
  };

  const stopTracking = () => {
    setIsTracking(false);
    setVerificationStatus("idle");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "text-green-500";
      case "analyzing": return "text-yellow-500";
      case "suspicious": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return CheckCircle;
      case "analyzing": return Activity;
      case "suspicious": return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <section id="biometrics" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Fingerprint className="w-4 h-4 mr-2" />
            Behavioral Biometrics Engine
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Unforgeable Digital DNA
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience how FraudGuard AI creates unique behavioral fingerprints that are impossible to replicate
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Interactive Demo Area */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Live Biometric Capture</h3>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(verificationStatus), { 
                  className: cn("w-5 h-5", getStatusColor(verificationStatus)) 
                })}
                <span className={cn("text-sm font-medium", getStatusColor(verificationStatus))}>
                  {verificationStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Mouse Tracking Area */}
            <div 
              ref={trackingAreaRef}
              className={cn(
                "relative h-64 border-2 border-dashed rounded-lg mb-6 cursor-crosshair transition-all duration-300",
                isTracking ? "border-primary bg-primary/5" : "border-border bg-muted/20"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Mouse className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isTracking ? "Move your mouse around this area" : "Click 'Start Analysis' to begin"}
                  </p>
                </div>
              </div>
              
              {/* Mouse trail visualization */}
              {isTracking && mouseData.length > 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d={`M ${mouseData.map(point => `${point.x},${point.y}`).join(' L ')}`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                  />
                  {mouseData.slice(-5).map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r={3 - index * 0.5}
                      fill="hsl(var(--primary))"
                      opacity={1 - index * 0.2}
                    />
                  ))}
                </svg>
              )}
            </div>

            {/* Keystroke Analysis */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Keyboard className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Keystroke Dynamics</span>
              </div>
              <Input
                placeholder="Type here to analyze your keystroke patterns..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                disabled={!isTracking}
                className="bg-background/50"
              />
              {keystrokeData.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Captured {keystrokeData.length} keystrokes • Avg dwell: {
                    Math.round(keystrokeData.reduce((sum, k) => sum + k.dwellTime, 0) / keystrokeData.length)
                  }ms
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={startTracking} 
                disabled={isTracking}
                className="flex-1"
              >
                <Activity className="w-4 h-4 mr-2" />
                Start Analysis
              </Button>
              <Button 
                onClick={stopTracking} 
                disabled={!isTracking}
                variant="outline"
                className="flex-1"
              >
                <Timer className="w-4 h-4 mr-2" />
                Stop Analysis
              </Button>
            </div>
          </Card>

          {/* Biometric Profile */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Behavioral Profile Analysis
            </h3>

            <div className="space-y-6">
              {/* Mouse Pattern Analysis */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Mouse className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Mouse Movement Pattern</span>
                  </div>
                  <span className="text-sm font-bold">{biometricProfile.mousePattern.toFixed(1)}%</span>
                </div>
                <Progress value={biometricProfile.mousePattern} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Analyzing velocity, acceleration, and trajectory patterns
                </p>
              </div>

              {/* Keystroke Rhythm */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Keyboard className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Keystroke Rhythm</span>
                  </div>
                  <span className="text-sm font-bold">{biometricProfile.keystrokeRhythm.toFixed(1)}%</span>
                </div>
                <Progress value={biometricProfile.keystrokeRhythm} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Dwell time, flight time, and typing cadence analysis
                </p>
              </div>

              {/* Device Fingerprint */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Device Fingerprint</span>
                  </div>
                  <span className="text-sm font-bold">{biometricProfile.deviceFingerprint.toFixed(1)}%</span>
                </div>
                <Progress value={biometricProfile.deviceFingerprint} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Hardware characteristics and browser environment
                </p>
              </div>

              {/* Behavioral Consistency */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Behavioral Consistency</span>
                  </div>
                  <span className="text-sm font-bold">{biometricProfile.behavioralConsistency.toFixed(1)}%</span>
                </div>
                <Progress value={biometricProfile.behavioralConsistency} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Cross-modal pattern correlation and stability
                </p>
              </div>

              {/* Overall Match */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-medium">Overall Biometric Match</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{biometricProfile.overallMatch.toFixed(1)}%</span>
                </div>
                <Progress value={biometricProfile.overallMatch} className="h-3" />
                
                <div className="mt-4 p-3 bg-background/50 rounded-lg">
                  <p className="text-sm">
                    {verificationStatus === "verified" && (
                      <span className="text-green-500">✅ Behavioral biometrics verified. User identity confirmed with high confidence.</span>
                    )}
                    {verificationStatus === "analyzing" && (
                      <span className="text-yellow-500">⚠️ Analyzing behavioral patterns. Continue interacting for better accuracy.</span>
                    )}
                    {verificationStatus === "suspicious" && (
                      <span className="text-red-500">🚫 Behavioral anomaly detected. Patterns don't match expected user profile.</span>
                    )}
                    {verificationStatus === "idle" && (
                      <span className="text-muted-foreground">Start the analysis to see real-time behavioral biometric verification.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8 p-6 bg-card/50 backdrop-blur-sm border-primary/20 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-accent" />
            How Behavioral Biometrics Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mouse className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h4 className="font-medium mb-2">Mouse Dynamics</h4>
              <p className="text-sm text-muted-foreground">
                Analyzes movement velocity, acceleration, click patterns, and scroll behavior to create unique signatures.
              </p>
            </div>
            <div className="text-center">
              <Keyboard className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h4 className="font-medium mb-2">Keystroke Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Measures dwell time, flight time, and typing rhythm to identify individual typing patterns.
              </p>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h4 className="font-medium mb-2">AI Fusion</h4>
              <p className="text-sm text-muted-foreground">
                Combines multiple biometric signals using advanced ML to create unforgeable digital DNA.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default BehavioralBiometrics;
