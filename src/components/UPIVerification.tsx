import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Search,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react';

interface TransactionRisk {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: string[];
}

interface UPIValidation {
  isValid: boolean;
  registered: boolean;
  bank: string;
  accountType: string;
  lastVerified: string;
  transactionHistory: {
    date: string;
    amount: number;
    type: string;
    risk: TransactionRisk;
  }[];
}

export function UPIVerification() {
  const [upiId, setUpiId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [validation, setValidation] = React.useState<UPIValidation | null>(null);

  const verifyUPI = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockValidation: UPIValidation = {
        isValid: true,
        registered: true,
        bank: 'State Bank of India',
        accountType: 'Savings Account',
        lastVerified: new Date().toISOString(),
        transactionHistory: [
          {
            date: '2025-08-08T10:30:00Z',
            amount: 5000,
            type: 'credit',
            risk: {
              score: 15,
              level: 'low',
              factors: ['Regular transaction pattern', 'Known recipient'],
            },
          },
          {
            date: '2025-08-07T15:45:00Z',
            amount: 25000,
            type: 'debit',
            risk: {
              score: 65,
              level: 'medium',
              factors: [
                'Unusual amount',
                'New recipient',
                'Different location',
              ],
            },
          },
        ],
      };

      setValidation(mockValidation);
      setLoading(false);
    }, 1500);
  };

  const getRiskBadge = (level: TransactionRisk['level']) => {
    const styles = {
      low: 'bg-green-500/10 text-green-500 border-green-500/20',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      high: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const icons = {
      low: <ShieldCheck className="h-4 w-4" />,
      medium: <AlertTriangle className="h-4 w-4" />,
      high: <AlertOctagon className="h-4 w-4" />,
    };

    return (
      <Badge variant="outline" className={styles[level]}>
        <div className="flex items-center space-x-1">
          {icons[level]}
          <span>{level.toUpperCase()}</span>
        </div>
      </Badge>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>UPI ID Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter UPI ID (e.g., user@bank)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <Button onClick={verifyUPI} disabled={!upiId || loading}>
                {loading ? (
                  <Activity className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Verify</span>
              </Button>
            </div>

            {validation && (
              <Alert variant={validation.isValid ? 'default' : 'destructive'}>
                <AlertTitle className="flex items-center space-x-2">
                  {validation.isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>
                    {validation.isValid ? 'Valid UPI ID' : 'Invalid UPI ID'}
                  </span>
                </AlertTitle>
                <AlertDescription>
                  {validation.isValid
                    ? 'This UPI ID is registered and active.'
                    : 'This UPI ID is not registered or has been deactivated.'}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {validation && validation.isValid && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Bank</div>
                  <div className="font-medium">{validation.bank}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Account Type</div>
                  <div className="font-medium">{validation.accountType}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Recent Transactions</div>
                <ScrollArea className="h-[200px] rounded-md border p-2">
                  <div className="space-y-4">
                    {validation.transactionHistory.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg border bg-card"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            ₹{transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          {getRiskBadge(transaction.risk.level)}
                          <div className="text-xs text-muted-foreground">
                            Risk Score: {transaction.risk.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Last Verification</div>
                <div className="text-sm text-muted-foreground flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(validation.lastVerified).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
