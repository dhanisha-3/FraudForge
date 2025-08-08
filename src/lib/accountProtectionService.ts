import { Transaction, RiskFactors, AccountStatus } from './accountProtection';

// Mock API service for account protection
export class AccountProtectionService {
  private static instance: AccountProtectionService;
  private transactionHistory: Transaction[] = [];
  private accountStatus: AccountStatus = {
    isActive: true,
    frozenChannels: [],
    lastUpdated: new Date(),
    currentRiskLevel: 0
  };

  private constructor() {
    // Initialize with some sample data
    this.transactionHistory = this.generateSampleHistory();
  }

  public static getInstance(): AccountProtectionService {
    if (!AccountProtectionService.instance) {
      AccountProtectionService.instance = new AccountProtectionService();
    }
    return AccountProtectionService.instance;
  }

  private generateSampleHistory(): Transaction[] {
    const now = new Date();
    return Array.from({ length: 10 }, (_, i) => ({
      id: `hist-${i}`,
      type: ['atm', 'online', 'card', 'call', 'email'][Math.floor(Math.random() * 5)] as Transaction['type'],
      amount: Math.random() * 1000,
      location: ['New York', 'London', 'Tokyo', 'Mumbai', 'Sydney'][Math.floor(Math.random() * 5)],
      deviceId: `device-${Math.floor(Math.random() * 3)}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date(now.getTime() - Math.random() * 86400000 * 30), // Last 30 days
      status: 'approved'
    }));
  }

  public async getTransactionHistory(): Promise<Transaction[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.transactionHistory;
  }

  public async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.transactionHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public async addTransaction(transaction: Omit<Transaction, 'id' | 'status'>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };
    
    this.transactionHistory.push(newTransaction);
    return newTransaction;
  }

  public async updateTransactionStatus(
    transactionId: string,
    status: 'approved' | 'blocked'
  ): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const transaction = this.transactionHistory.find(tx => tx.id === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    transaction.status = status;
    return transaction;
  }

  public async getAccountStatus(): Promise<AccountStatus> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.accountStatus;
  }

  public async freezeChannel(channel: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!this.accountStatus.frozenChannels.includes(channel)) {
      this.accountStatus.frozenChannels.push(channel);
    }
    
    this.accountStatus.lastUpdated = new Date();
  }

  public async unfreezeChannel(channel: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.accountStatus.frozenChannels = this.accountStatus.frozenChannels
      .filter(ch => ch !== channel);
    
    this.accountStatus.lastUpdated = new Date();
  }

  public async updateRiskLevel(riskLevel: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.accountStatus.currentRiskLevel = riskLevel;
    this.accountStatus.lastUpdated = new Date();
  }

  public async sendVerificationCode(channel: 'sms' | 'email'): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would send an actual verification code
    return Math.random().toString().substr(2, 6);
  }

  public async verifyCustomerIdentity(
    verificationCode: string,
    actualCode: string
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return verificationCode === actualCode;
  }

  public async getDeviceTrustScore(deviceId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deviceTransactions = this.transactionHistory
      .filter(tx => tx.deviceId === deviceId);
    
    if (deviceTransactions.length === 0) return 0;
    
    const successfulTransactions = deviceTransactions
      .filter(tx => tx.status === 'approved').length;
    
    return (successfulTransactions / deviceTransactions.length) * 100;
  }

  public async getLocationRiskScore(location: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const locationTransactions = this.transactionHistory
      .filter(tx => tx.location === location);
    
    if (locationTransactions.length === 0) return 75; // High risk for new locations
    
    const successfulTransactions = locationTransactions
      .filter(tx => tx.status === 'approved').length;
    
    return 100 - ((successfulTransactions / locationTransactions.length) * 100);
  }
}
