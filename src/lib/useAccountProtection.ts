import { useState, useEffect, useCallback } from 'react';
import { AccountProtectionService } from './accountProtectionService';
import { 
  Transaction, 
  RiskFactors,
  AccountStatus,
  calculateRiskFactors,
  shouldFreezeAccount,
  validateTransaction,
  generateSecurityAlert,
  securityRules
} from './accountProtection';

interface UseAccountProtectionReturn {
  transactions: Transaction[];
  recentAlerts: Transaction[];
  accountStatus: AccountStatus;
  isLoading: boolean;
  error: string | null;
  approveTransaction: (transactionId: string) => Promise<void>;
  blockTransaction: (transactionId: string) => Promise<void>;
  unfreezeChannel: (channel: string) => Promise<void>;
  verifyIdentity: (channel: 'sms' | 'email') => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'status'>) => Promise<void>;
}

export const useAccountProtection = (): UseAccountProtectionReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Transaction[]>([]);
  const [accountStatus, setAccountStatus] = useState<AccountStatus>({
    isActive: true,
    frozenChannels: [],
    lastUpdated: new Date(),
    currentRiskLevel: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const service = AccountProtectionService.getInstance();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [txHistory, status, recent] = await Promise.all([
          service.getTransactionHistory(),
          service.getAccountStatus(),
          service.getRecentTransactions(5)
        ]);

        setTransactions(txHistory);
        setAccountStatus(status);
        setRecentAlerts(recent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle new transaction
  const addTransaction = useCallback(async (
    transaction: Omit<Transaction, 'id' | 'status'>
  ) => {
    try {
      setIsLoading(true);
      
      // Add transaction
      const newTx = await service.addTransaction(transaction);
      
      // Calculate risk
      const riskFactors = calculateRiskFactors(newTx, transactions);
      const riskScore = validateTransaction(newTx, transactions, securityRules);
      
      // Update risk level
      await service.updateRiskLevel(riskScore);
      
      // Check if account should be frozen
      if (shouldFreezeAccount(riskFactors)) {
        await service.freezeChannel(transaction.type);
        setAccountStatus(prev => ({
          ...prev,
          frozenChannels: [...prev.frozenChannels, transaction.type],
          lastUpdated: new Date()
        }));
      }
      
      // Generate alert if needed
      const alert = generateSecurityAlert(newTx, riskFactors);
      if (alert) {
        setRecentAlerts(prev => [newTx, ...prev].slice(0, 5));
      }
      
      // Update transactions
      setTransactions(prev => [...prev, newTx]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  // Approve transaction
  const approveTransaction = useCallback(async (transactionId: string) => {
    try {
      setIsLoading(true);
      const updatedTx = await service.updateTransactionStatus(transactionId, 'approved');
      
      setTransactions(prev => 
        prev.map(tx => tx.id === transactionId ? updatedTx : tx)
      );
      
      setRecentAlerts(prev => 
        prev.map(tx => tx.id === transactionId ? updatedTx : tx)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Block transaction
  const blockTransaction = useCallback(async (transactionId: string) => {
    try {
      setIsLoading(true);
      const updatedTx = await service.updateTransactionStatus(transactionId, 'blocked');
      
      setTransactions(prev => 
        prev.map(tx => tx.id === transactionId ? updatedTx : tx)
      );
      
      setRecentAlerts(prev => 
        prev.map(tx => tx.id === transactionId ? updatedTx : tx)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Unfreeze channel after verification
  const unfreezeChannel = useCallback(async (channel: string) => {
    try {
      setIsLoading(true);
      await service.unfreezeChannel(channel);
      
      setAccountStatus(prev => ({
        ...prev,
        frozenChannels: prev.frozenChannels.filter(ch => ch !== channel),
        lastUpdated: new Date()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify identity for unfreezing
  const verifyIdentity = useCallback(async (channel: 'sms' | 'email') => {
    try {
      setIsLoading(true);
      const code = await service.sendVerificationCode(channel);
      setVerificationCode(code);
      
      // In a real app, this would be sent to the user's device
      console.log('Verification code:', code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transactions,
    recentAlerts,
    accountStatus,
    isLoading,
    error,
    approveTransaction,
    blockTransaction,
    unfreezeChannel,
    verifyIdentity,
    addTransaction
  };
};
