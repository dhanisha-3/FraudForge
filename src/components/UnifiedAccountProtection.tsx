import React, { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Shield, 
  AlertTriangle, 
  Check, 
  X,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  Landmark,
  Building,
  Clock,
  MapPin,
  AlertCircle,
  Lock,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Bell,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAccountProtection } from "@/lib/useAccountProtection";
import { Transaction } from "@/lib/accountProtection";
import { 
  ChannelInfo,
  TransactionSummary,
  AccountSummary,
  RiskMetrics
} from "@/lib/types";



interface ChannelStatus {
  channel: string;
  status: 'active' | 'frozen';
  lastAccess: Date;
  riskScore: number;
}

interface Alert {
  id: string;
  type: string;
  timestamp: Date;
  location: string;
  amount: number;
  risk: number;
  status: 'pending' | 'approved' | 'blocked';
  description: string;
}

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChannelInfo | null;
  onVerify: () => Promise<void>;
  isVerifying: boolean;
}

const CHANNEL_ICONS = {
  atm: Building,
  online: ExternalLink,
  card: CreditCard,
  call: Phone,
  email: Mail
} as const;

const DEFAULT_CHANNELS: ChannelInfo[] = [
  {
    id: 'atm',
    name: 'ATM',
    type: 'atm',
    status: 'active',
    lastAccess: new Date(),
    riskScore: 15,
    icon: Building
  },
  {
    id: 'online',
    name: 'Online Banking',
    type: 'online',
    status: 'active',
    lastAccess: new Date(),
    riskScore: 25,
    icon: ExternalLink
  },
  {
    id: 'card',
    name: 'Credit Card',
    type: 'card',
    status: 'active',
    lastAccess: new Date(),
    riskScore: 20,
    icon: CreditCard
  },
  {
    id: 'call',
    name: 'Call Center',
    type: 'call',
    status: 'active',
    lastAccess: new Date(),
    riskScore: 10,
    icon: Phone
  },
  {
    id: 'email',
    name: 'Email',
    type: 'email',
    status: 'active',
    lastAccess: new Date(),
    riskScore: 30,
    icon: Mail
  }
];

const VerificationDialog: React.FC<VerificationDialogProps> = ({
  isOpen,
  onClose,
  channel,
  onVerify
}) => {
  const [code, setCode] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            Enter the verification code sent to your {channel}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onVerify}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UnifiedAccountProtection = () => {
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelInfo | null>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [channels, setChannels] = useState<ChannelInfo[]>(DEFAULT_CHANNELS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [accountStatus, setAccountStatus] = useState<'active' | 'frozen'>('active');
  const [channelStatus, setChannelStatus] = useState<ChannelStatus[]>([
    { channel: 'ATM', status: 'active', lastAccess: new Date(), riskScore: 15 },
    { channel: 'Online Banking', status: 'active', lastAccess: new Date(), riskScore: 25 },
    { channel: 'Credit Card', status: 'active', lastAccess: new Date(), riskScore: 20 },
    { channel: 'Call Center', status: 'active', lastAccess: new Date(), riskScore: 10 },
    { channel: 'Email', status: 'active', lastAccess: new Date(), riskScore: 30 }
  ]);
  
  const handleVerificationRequest = useCallback(async (channel: ChannelInfo) => {
    setSelectedChannel(channel);
    setVerificationDialogOpen(true);
    // Simulating verification code sending
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const handleVerification = useCallback(async () => {
    if (!selectedChannel) return;
    
    setVerificationInProgress(true);
    try {
      // Simulating verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setChannels(prev => 
        prev.map(ch => 
          ch.id === selectedChannel.id 
            ? { ...ch, status: 'active' } 
            : ch
        )
      );
      setVerificationDialogOpen(false);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setVerificationInProgress(false);
    }
  }, [selectedChannel]);

  const getChannelIcon = useCallback((type: string) => {
    return CHANNEL_ICONS[type as keyof typeof CHANNEL_ICONS] || AlertCircle;
  }, []);

  const getMaxRiskScore = useCallback(() => {
    return Math.max(...channels.map(c => c.riskScore));
  }, [channels]);

  const maxRiskScore = getMaxRiskScore();
  const isSystemActive = accountStatus === 'active';

  // Simulate real-time alerts
  useEffect(() => {
    const generateAndProcessAlert = () => {
      const randomAlert = generateRandomAlert();
      setAlerts(prev => [randomAlert, ...prev].slice(0, 5));
      
      // Check for high-risk transactions
      if (randomAlert.risk > 80) {
        handleHighRiskTransaction(randomAlert);
      }
    };

    const interval = setInterval(generateAndProcessAlert, 15000);
    return () => clearInterval(interval);
  }, []);

  const generateRandomAlert = (): Alert => {
    const types = ['atm', 'online', 'card', 'call', 'email'];
    const locations = ['New York', 'London', 'Tokyo', 'Mumbai', 'Sydney'];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: types[Math.floor(Math.random() * types.length)],
      timestamp: new Date(),
      location: locations[Math.floor(Math.random() * locations.length)],
      amount: Math.floor(Math.random() * 1000) + 100,
      risk: Math.floor(Math.random() * 100),
      status: 'pending',
      description: 'Transaction attempt detected'
    };
  };

  const handleHighRiskTransaction = (alert: Alert) => {
    // Freeze account
    setAccountStatus('frozen');
    
    // Update channel status
    setChannelStatus(prev => 
      prev.map(channel => 
        channel.channel.toLowerCase().includes(alert.type) 
          ? { ...channel, status: 'frozen', riskScore: alert.risk }
          : channel
      )
    );
  };

  const handleTransactionResponse = (alertId: string, approved: boolean) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: approved ? 'approved' : 'blocked' }
          : alert
      )
    );

    if (approved) {
      // Unfreeze account if approved
      setAccountStatus('active');
      // Reset channel statuses
      setChannelStatus(prev => 
        prev.map(channel => ({ ...channel, status: 'active' }))
      );
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'atm': return Building;
      case 'online': return ExternalLink;
      case 'card': return CreditCard;
      case 'call': return Phone;
      case 'email': return Mail;
      default: return AlertCircle;
    }
  };

  return (
    <section id="account-protection" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Unified Account Protection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Multi-Channel Fraud Prevention
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring and instant account protection across all channels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Account Status Card */}
          <Card className="p-6 col-span-1 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Account Status</h3>
              <Badge 
                variant={accountStatus === 'active' ? "success" : "destructive"}
                className="uppercase"
              >
                {accountStatus}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Risk Level</span>
                <span className="font-medium">
                  {Math.max(...channelStatus.map(c => c.riskScore))}%
                </span>
              </div>

              <Progress 
                value={Math.max(...channelStatus.map(c => c.riskScore))}
                className={cn(
                  "h-2",
                  accountStatus === 'active' ? "bg-primary" : "bg-destructive"
                )}
              />

              {accountStatus === 'frozen' && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Account Frozen</AlertTitle>
                  <AlertDescription>
                    Suspicious activity detected. Please verify recent transactions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>

          {/* Real-time Alerts */}
          <Card className="p-6 col-span-2 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6">Real-time Security Alerts</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {alerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="border border-border/50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {React.createElement(getAlertIcon(alert.type), { 
                          className: "w-5 h-5 text-primary" 
                        })}
                        <div>
                          <p className="font-medium">
                            {alert.type.toUpperCase()} Transaction
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {alert.location} • ${alert.amount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={
                            alert.status === 'approved' ? "success" : 
                            alert.status === 'blocked' ? "destructive" : 
                            "outline"
                          }
                        >
                          {alert.status.toUpperCase()}
                        </Badge>
                        
                        {alert.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleTransactionResponse(alert.id, false)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500"
                              onClick={() => handleTransactionResponse(alert.id, true)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {alert.risk > 70 && (
                      <div className="mt-2 text-sm text-destructive flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        High-risk transaction detected!
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Channel Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {channelStatus.map((channel) => (
            <Card 
              key={channel.channel}
              className={cn(
                "p-4 bg-card/50 backdrop-blur-sm border-primary/20",
                channel.status === 'frozen' && "border-destructive"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{channel.channel}</h4>
                <Badge 
                  variant={
                    channel.status === 'active' ? "success" : 
                    channel.status === 'frozen' ? "destructive" : 
                    "warning"
                  }
                >
                  {channel.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span>{channel.riskScore}%</span>
                </div>
                <Progress value={channel.riskScore} className="h-1" />
                <p className="text-xs text-muted-foreground">
                  Last activity: {channel.lastAccess.toLocaleTimeString()}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Protection Features */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-6">Protection Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Instant Freeze</span>
                </div>
                <Switch checked={accountStatus !== 'frozen'} />
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically freeze account on suspicious activity
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="font-medium">Alert Notifications</span>
                </div>
                <Switch defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time notifications for all activities
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">Geo-Fencing</span>
                </div>
                <Switch defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Location-based transaction verification
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">Biometric Auth</span>
                </div>
                <Switch defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Enhanced security with biometric verification
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default UnifiedAccountProtection;
