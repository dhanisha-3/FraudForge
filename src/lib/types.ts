// Types for the unified account protection system
export interface ChannelInfo {
  id: string;
  name: string;
  type: 'atm' | 'online' | 'card' | 'call' | 'email';
  status: 'active' | 'frozen' | 'limited';
  lastAccess: Date;
  riskScore: number;
  icon: React.ComponentType<any>;
}

export interface TransactionSummary {
  id: string;
  type: 'atm' | 'online' | 'card' | 'call' | 'email';
  amount: number;
  location: string;
  timestamp: Date;
  riskScore: number;
  status: 'pending' | 'approved' | 'blocked';
}

export interface AccountSummary {
  overallStatus: 'active' | 'frozen' | 'limited';
  frozenChannels: string[];
  riskLevel: number;
  lastUpdated: Date;
}

export interface RiskMetrics {
  locationRisk: number;
  amountRisk: number;
  frequencyRisk: number;
  timePatternRisk: number;
  overallRisk: number;
}
