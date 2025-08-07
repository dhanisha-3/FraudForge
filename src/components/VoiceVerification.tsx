import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Phone, 
  Video, 
  VideoOff,
  Volume2,
  VolumeX,
  Shield,
  CheckCircle,
  AlertTriangle,
  Activity,
  Brain,
  Waves,
  User,
  Clock,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceMetrics {
  pitch: number;
  tempo: number;
  clarity: number;
  authenticity: number;
  match: number;
}

interface VerificationStep {
  id: number;
  question: string;
  expectedAnswer: string;
  status: "pending" | "speaking" | "analyzing" | "verified" | "failed";
  voiceMatch: number;
}

const VoiceVerification = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics>({
    pitch: 0,
    tempo: 0,
    clarity: 0,
    authenticity: 0,
    match: 0
  });
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: 1,
      question: "Please state your full name",
      expectedAnswer: "Sarah Johnson",
      status: "pending",
      voiceMatch: 0
    },
    {
      id: 2,
      question: "What was the name of your first pet?",
      expectedAnswer: "Fluffy",
      status: "pending",
      voiceMatch: 0
    },
    {
      id: 3,
      question: "Please say the following phrase: 'The quick brown fox jumps over the lazy dog'",
      expectedAnswer: "Voice pattern analysis",
      status: "pending",
      voiceMatch: 0
    }
  ]);
  const [overallVerification, setOverallVerification] = useState(0);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const audioVisualizerRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Simulate audio visualization
  useEffect(() => {
    if (isRecording && audioVisualizerRef.current) {
      const canvas = audioVisualizerRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'hsl(var(--primary))';
        
        // Simulate audio waveform
        for (let i = 0; i < 50; i++) {
          const height = Math.random() * 40 + 5;
          const x = i * (canvas.width / 50);
          ctx.fillRect(x, (canvas.height - height) / 2, 3, height);
        }
        
        animationRef.current = requestAnimationFrame(draw);
      };
      
      draw();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  // Simulate voice analysis
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setVoiceMetrics(prev => ({
          pitch: Math.min(100, prev.pitch + Math.random() * 10),
          tempo: Math.min(100, prev.tempo + Math.random() * 8),
          clarity: Math.min(100, prev.clarity + Math.random() * 12),
          authenticity: Math.min(100, prev.authenticity + Math.random() * 6),
          match: Math.min(100, prev.match + Math.random() * 5)
        }));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const startVerification = () => {
    setCurrentStep(0);
    setIsAIResponding(true);
    setAiMessage("Hello! I'm SentinelVoice, your AI verification assistant. I'll guide you through a quick voice verification process. Are you ready to begin?");
    
    setTimeout(() => {
      setIsAIResponding(false);
      setVerificationSteps(prev => prev.map((step, index) => 
        index === 0 ? { ...step, status: "speaking" } : step
      ));
    }, 3000);
  };

  const startRecording = () => {
    setIsRecording(true);
    setVoiceMetrics({ pitch: 0, tempo: 0, clarity: 0, authenticity: 0, match: 0 });
    
    // Simulate recording duration
    setTimeout(() => {
      setIsRecording(false);
      analyzeVoice();
    }, 4000);
  };

  const analyzeVoice = () => {
    const currentStepData = verificationSteps[currentStep];
    setVerificationSteps(prev => prev.map((step, index) => 
      index === currentStep ? { ...step, status: "analyzing" } : step
    ));

    setTimeout(() => {
      const voiceMatch = Math.random() * 30 + 70; // 70-100% match
      setVerificationSteps(prev => prev.map((step, index) => 
        index === currentStep ? { 
          ...step, 
          status: voiceMatch > 80 ? "verified" : "failed",
          voiceMatch 
        } : step
      ));

      if (currentStep < verificationSteps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setVerificationSteps(prev => prev.map((step, index) => 
            index === currentStep + 1 ? { ...step, status: "speaking" } : step
          ));
        }, 2000);
      } else {
        // Calculate overall verification
        const avgMatch = verificationSteps.reduce((sum, step) => sum + step.voiceMatch, 0) / verificationSteps.length;
        setOverallVerification(avgMatch);
      }
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "text-green-500";
      case "analyzing": return "text-yellow-500";
      case "speaking": return "text-blue-500";
      case "failed": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return CheckCircle;
      case "analyzing": return Activity;
      case "speaking": return Volume2;
      case "failed": return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <section id="voice" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Mic className="w-4 h-4 mr-2" />
            SentinelVoice™ AI Agent
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Voice & Video Verification
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced AI voice agent with real-time biometric verification and natural language interaction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* AI Agent Interface */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                AI Voice Agent
              </h3>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={isVideoEnabled ? "default" : "outline"}
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={isRecording ? () => setIsRecording(false) : startRecording}
                  disabled={verificationSteps[currentStep]?.status !== "speaking"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* AI Avatar/Video Area */}
            <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-6 flex items-center justify-center">
              {isVideoEnabled ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Video verification active</p>
                </div>
              ) : (
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3 mx-auto"
                    animate={isAIResponding ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: isAIResponding ? Infinity : 0, duration: 1 }}
                  >
                    <Brain className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">SentinelVoice AI Agent</p>
                </div>
              )}
              
              {/* Audio Visualizer */}
              {isRecording && (
                <div className="absolute bottom-4 left-4 right-4">
                  <canvas 
                    ref={audioVisualizerRef} 
                    width="300" 
                    height="40" 
                    className="w-full h-10 bg-background/50 rounded"
                  />
                </div>
              )}
            </div>

            {/* AI Message */}
            <div className="mb-6">
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">SentinelVoice</span>
                  {isAIResponding && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-xs text-blue-500"
                    >
                      Speaking...
                    </motion.div>
                  )}
                </div>
                <p className="text-sm">
                  {aiMessage || verificationSteps[currentStep]?.question || "Click 'Start Verification' to begin the voice authentication process."}
                </p>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={startVerification} 
                disabled={currentStep > 0}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Start Verification
              </Button>
              <Button 
                onClick={() => {
                  setCurrentStep(0);
                  setVerificationSteps(prev => prev.map(step => ({ ...step, status: "pending", voiceMatch: 0 })));
                  setOverallVerification(0);
                }}
                variant="outline"
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* Voice Analysis */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Waves className="w-5 h-5 mr-2 text-green-500" />
              Voice Biometric Analysis
            </h3>

            {/* Real-time Voice Metrics */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pitch Analysis</span>
                  <span className="text-sm font-bold">{voiceMetrics.pitch.toFixed(1)}%</span>
                </div>
                <Progress value={voiceMetrics.pitch} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Speech Tempo</span>
                  <span className="text-sm font-bold">{voiceMetrics.tempo.toFixed(1)}%</span>
                </div>
                <Progress value={voiceMetrics.tempo} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Voice Clarity</span>
                  <span className="text-sm font-bold">{voiceMetrics.clarity.toFixed(1)}%</span>
                </div>
                <Progress value={voiceMetrics.clarity} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Authenticity Score</span>
                  <span className="text-sm font-bold">{voiceMetrics.authenticity.toFixed(1)}%</span>
                </div>
                <Progress value={voiceMetrics.authenticity} className="h-2" />
              </div>
            </div>

            {/* Verification Steps */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">Verification Progress</h4>
              {verificationSteps.map((step, index) => (
                <div key={step.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {React.createElement(getStatusIcon(step.status), { 
                      className: cn("w-4 h-4", getStatusColor(step.status)) 
                    })}
                    <span className="text-sm">Step {step.id}</span>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-sm font-medium", getStatusColor(step.status))}>
                      {step.status.toUpperCase()}
                    </div>
                    {step.voiceMatch > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {step.voiceMatch.toFixed(1)}% match
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Verification Result */}
            {overallVerification > 0 && (
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-medium">Overall Verification</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{overallVerification.toFixed(1)}%</span>
                </div>
                <Progress value={overallVerification} className="h-3 mb-3" />
                
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-sm">
                    {overallVerification > 85 && (
                      <span className="text-green-500">✅ Voice verification successful. User identity confirmed.</span>
                    )}
                    {overallVerification > 70 && overallVerification <= 85 && (
                      <span className="text-yellow-500">⚠️ Partial verification. Additional authentication recommended.</span>
                    )}
                    {overallVerification <= 70 && (
                      <span className="text-red-500">🚫 Voice verification failed. Identity could not be confirmed.</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Technical Features */}
        <Card className="mt-8 p-6 bg-card/50 backdrop-blur-sm border-primary/20 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-accent" />
            SentinelVoice™ Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h4 className="font-medium mb-2">AI Voice Agent</h4>
              <p className="text-sm text-muted-foreground">
                Natural language processing with dynamic security questions and conversational AI.
              </p>
            </div>
            <div className="text-center">
              <Waves className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h4 className="font-medium mb-2">Voice Biometrics</h4>
              <p className="text-sm text-muted-foreground">
                Real-time analysis of pitch, tempo, clarity, and unique vocal characteristics.
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h4 className="font-medium mb-2">Anti-Spoofing</h4>
              <p className="text-sm text-muted-foreground">
                Advanced detection of synthetic voices, recordings, and deepfake audio attacks.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default VoiceVerification;
