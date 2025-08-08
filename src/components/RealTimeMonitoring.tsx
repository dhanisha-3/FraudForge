import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  Clock,
  Shield,
  UserCheck,
  Zap,
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: 'approved' | 'pending' | 'flagged';
  riskScore: number;
  timestamp: string;
  location: string;
  device: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

export function RealTimeMonitoring() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isMonitoring, setIsMonitoring] = React.useState(false);

  const metrics: MetricCard[] = [
    {
      title: 'Risk Score',
      value: '82.5%',
      trend: -5.2,
      icon: <Shield className="h-4 w-4" />,
      color: 'text-blue-500',
    },
    {
      title: 'Active Users',
      value: '2,847',
      trend: 12.5,
      icon: <UserCheck className="h-4 w-4" />,
      color: 'text-green-500',
    },
    {
      title: 'Alerts',
      value: '37',
      trend: 8.1,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'text-yellow-500',
    },
    {
      title: 'Response Time',
      value: '235ms',
      trend: -15.8,
      icon: <Zap className="h-4 w-4" />,
      color: 'text-purple-500',
    },
  ];

  React.useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          amount: Math.floor(Math.random() * 10000),
          type: Math.random() > 0.5 ? 'credit' : 'debit',
          status: Math.random() > 0.8 ? 'flagged' : 'approved',
          riskScore: Math.random() * 100,
          timestamp: new Date().toISOString(),
          location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][Math.floor(Math.random() * 4)],
          device: ['Mobile', 'Desktop', 'Tablet'][Math.floor(Math.random() * 3)],
        };

        setTransactions(prev => [newTransaction, ...prev].slice(0, 10));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      approved: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      flagged: 'bg-red-500/10 text-red-500',
    };

    return <Badge className={styles[status]} variant="outline">{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {metric.value}
                    </h3>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${
                  metric.trend > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.trend > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Real-time Transactions</CardTitle>
          <Button
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "destructive" : "default"}
          >
            {isMonitoring ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-pulse" />
                Stop Monitoring
              </>
            ) : (
              <>
                <BarChart2 className="mr-2 h-4 w-4" />
                Start Monitoring
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      ₹{transaction.amount.toLocaleString()}
                    </span>
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(transaction.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <div className="text-sm font-medium">{transaction.location}</div>
                  <div className="text-xs text-muted-foreground">{transaction.device}</div>
                  <Progress
                    value={transaction.riskScore}
                    className="w-24"
                    indicatorClassName={
                      transaction.riskScore > 70
                        ? 'bg-red-500'
                        : transaction.riskScore > 30
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }
                  />
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Start monitoring to see real-time transactions
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
