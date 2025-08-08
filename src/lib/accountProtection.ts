// Types and interfaces for account protection
export interface Transaction {
  id: string;
  type: 'atm' | 'online' | 'card' | 'call' | 'email';
  amount: number;
  location: string;
  deviceId?: string;
  ipAddress?: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'blocked';
}

export interface SecurityRule {
  id: string;
  type: string;
  condition: (transaction: Transaction, history: Transaction[]) => boolean;
  riskScore: number;
}

export interface RiskFactors {
  location: number;
  amount: number;
  frequency: number;
  deviceTrust: number;
  timePattern: number;
}

export interface AccountStatus {
  isActive: boolean;
  frozenChannels: string[];
  lastUpdated: Date;
  currentRiskLevel: number;
}

// Security rules and risk analysis functions
export const securityRules: SecurityRule[] = [
  {
    id: 'unusual-location',
    type: 'location',
    condition: (tx, history) => {
      const userLocations = new Set(history.map(h => h.location));
      return !userLocations.has(tx.location);
    },
    riskScore: 25
  },
  {
    id: 'high-amount',
    type: 'amount',
    condition: (tx, history) => {
      const avgAmount = history.reduce((sum, h) => sum + h.amount, 0) / history.length;
      return tx.amount > avgAmount * 3;
    },
    riskScore: 30
  },
  {
    id: 'rapid-transactions',
    type: 'frequency',
    condition: (tx, history) => {
      const last5Min = history.filter(h => 
        new Date(tx.timestamp).getTime() - new Date(h.timestamp).getTime() < 300000
      );
      return last5Min.length >= 3;
    },
    riskScore: 35
  },
  {
    id: 'new-device',
    type: 'device',
    condition: (tx, history) => {
      if (!tx.deviceId) return false;
      const knownDevices = new Set(history.filter(h => h.deviceId).map(h => h.deviceId));
      return !knownDevices.has(tx.deviceId);
    },
    riskScore: 20
  },
  {
    id: 'unusual-time',
    type: 'time',
    condition: (tx, history) => {
      const hour = new Date(tx.timestamp).getHours();
      const userHours = new Set(history.map(h => new Date(h.timestamp).getHours()));
      return !userHours.has(hour);
    },
    riskScore: 15
  }
];

// Risk analysis functions
export const calculateRiskFactors = (
  transaction: Transaction,
  history: Transaction[]
): RiskFactors => {
  const locationRisk = evaluateLocationRisk(transaction, history);
  const amountRisk = evaluateAmountRisk(transaction, history);
  const frequencyRisk = evaluateFrequencyRisk(transaction, history);
  const deviceTrustRisk = evaluateDeviceTrustRisk(transaction, history);
  const timePatternRisk = evaluateTimePatternRisk(transaction, history);

  return {
    location: locationRisk,
    amount: amountRisk,
    frequency: frequencyRisk,
    deviceTrust: deviceTrustRisk,
    timePattern: timePatternRisk
  };
};

const evaluateLocationRisk = (tx: Transaction, history: Transaction[]): number => {
  const knownLocations = new Set(history.map(h => h.location));
  if (!knownLocations.has(tx.location)) {
    return 75; // High risk for new location
  }
  
  const locationFrequency = history.filter(h => h.location === tx.location).length;
  return Math.max(0, 100 - (locationFrequency * 10));
};

const evaluateAmountRisk = (tx: Transaction, history: Transaction[]): number => {
  if (history.length === 0) return 50;
  
  const avgAmount = history.reduce((sum, h) => sum + h.amount, 0) / history.length;
  const stdDev = Math.sqrt(
    history.reduce((sum, h) => sum + Math.pow(h.amount - avgAmount, 2), 0) / history.length
  );
  
  const zScore = (tx.amount - avgAmount) / (stdDev || 1);
  return Math.min(100, Math.max(0, zScore * 25));
};

const evaluateFrequencyRisk = (tx: Transaction, history: Transaction[]): number => {
  const last5Min = history.filter(h => 
    new Date(tx.timestamp).getTime() - new Date(h.timestamp).getTime() < 300000
  );
  
  if (last5Min.length >= 5) return 100;
  if (last5Min.length >= 3) return 75;
  if (last5Min.length >= 2) return 50;
  return 25;
};

const evaluateDeviceTrustRisk = (tx: Transaction, history: Transaction[]): number => {
  if (!tx.deviceId) return 50;
  
  const deviceHistory = history.filter(h => h.deviceId === tx.deviceId);
  const trustScore = Math.min(100, deviceHistory.length * 10);
  return 100 - trustScore;
};

const evaluateTimePatternRisk = (tx: Transaction, history: Transaction[]): number => {
  const hour = new Date(tx.timestamp).getHours();
  const hourFrequency = history.filter(h => new Date(h.timestamp).getHours() === hour).length;
  
  if (hourFrequency === 0) return 75;
  return Math.max(0, 100 - (hourFrequency * 15));
};

export const shouldFreezeAccount = (riskFactors: RiskFactors): boolean => {
  const totalRisk = (
    riskFactors.location * 0.25 +
    riskFactors.amount * 0.3 +
    riskFactors.frequency * 0.2 +
    riskFactors.deviceTrust * 0.15 +
    riskFactors.timePattern * 0.1
  );
  
  return totalRisk > 70;
};

export const generateSecurityAlert = (
  transaction: Transaction,
  riskFactors: RiskFactors
): string => {
  const highRiskFactors = Object.entries(riskFactors)
    .filter(([_, value]) => value > 70)
    .map(([key, _]) => key);
    
  if (highRiskFactors.length === 0) return "";
  
  const factors = highRiskFactors.join(", ");
  return `High risk detected: Unusual ${factors}. Please verify this transaction.`;
};

export const validateTransaction = (
  transaction: Transaction,
  history: Transaction[],
  securityRules: SecurityRule[]
): number => {
  let totalRisk = 0;
  let applicableRules = 0;
  
  for (const rule of securityRules) {
    if (rule.condition(transaction, history)) {
      totalRisk += rule.riskScore;
      applicableRules++;
    }
  }
  
  return applicableRules > 0 ? totalRisk / applicableRules : 0;
};
