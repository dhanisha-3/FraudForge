import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin,
  AlertTriangle,
  Clock,
  CreditCard,
  Building,
  Phone,
  Mail,
  ExternalLink,
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  userId: string;
  type: 'card' | 'online' | 'mobile' | 'atm' | 'wire';
  amount: number;
  location: {
    city: string;
    country: string;
    coordinates: [number, number];
  };
  timestamp: Date;
  deviceInfo: {
    id: string;
    type: string;
    browser?: string;
    os?: string;
  };
  riskScore: number;
  status: 'approved' | 'pending' | 'blocked';
  flags?: string[];
}

interface GeoCluster {
  center: [number, number];
  transactions: Transaction[];
  totalAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const TransactionMonitoring = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [geoClusters, setGeoClusters] = useState<GeoCluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetching
    const fetchData = async () => {
      // In a real application, this would be an API call
      const mockTransactions: Transaction[] = [
        {
          id: "tx1",
          userId: "user123",
          type: "card",
          amount: 1500,
          location: {
            city: "New York",
            country: "USA",
            coordinates: [40.7128, -74.0060]
          },
          timestamp: new Date(),
          deviceInfo: {
            id: "device456",
            type: "desktop",
            browser: "Chrome",
            os: "Windows"
          },
          riskScore: 15,
          status: "approved"
        },
        // Add more mock transactions
      ];

      setTransactions(mockTransactions);
      analyzeGeoClusters(mockTransactions);
      setLoading(false);
    };

    fetchData();
  }, []);

  const analyzeGeoClusters = (txs: Transaction[]) => {
    // In a real application, this would use a proper clustering algorithm
    const clusters: GeoCluster[] = [];
    // Simple grouping by city for demonstration
    const cityGroups = txs.reduce((acc, tx) => {
      const key = `${tx.location.coordinates[0]},${tx.location.coordinates[1]}`;
      if (!acc[key]) {
        acc[key] = {
          center: tx.location.coordinates,
          transactions: [],
          totalAmount: 0,
          riskLevel: 'low' as const
        };
      }
      acc[key].transactions.push(tx);
      acc[key].totalAmount += tx.amount;
      return acc;
    }, {} as Record<string, GeoCluster>);

    // Convert to array and calculate risk levels
    Object.values(cityGroups).forEach(cluster => {
      const avgRisk = cluster.transactions.reduce((sum, tx) => sum + tx.riskScore, 0) / cluster.transactions.length;
      cluster.riskLevel = avgRisk > 70 ? 'high' : avgRisk > 30 ? 'medium' : 'low';
      clusters.push(cluster);
    });

    setGeoClusters(clusters);
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'card': return CreditCard;
      case 'online': return ExternalLink;
      case 'mobile': return Phone;
      case 'atm': return Building;
      case 'wire': return Mail;
      default: return CreditCard;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {React.createElement(getTypeIcon(tx.type), {
                        className: "w-5 h-5 text-primary"
                      })}
                      <div>
                        <p className="font-medium">${tx.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.type.toUpperCase()} • {tx.location.city}, {tx.location.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {tx.timestamp.toLocaleTimeString()}
                      </div>
                      
                      <Badge 
                        variant={
                          tx.status === 'approved' ? "success" :
                          tx.status === 'pending' ? "warning" :
                          "destructive"
                        }
                      >
                        {tx.status}
                      </Badge>

                      {tx.riskScore > 70 && (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </div>

                  {tx.flags && tx.flags.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {tx.flags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Geo Analysis */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Geographic Analysis</h3>
              <div className="space-y-6">
                {geoClusters.map((cluster, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium">
                          {cluster.transactions[0].location.city}
                        </span>
                      </div>
                      <Badge 
                        variant={
                          cluster.riskLevel === 'high' ? "destructive" :
                          cluster.riskLevel === 'medium' ? "warning" :
                          "success"
                        }
                      >
                        {cluster.riskLevel} risk
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {cluster.transactions.length} transactions
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Total: ${cluster.totalAmount.toLocaleString()}
                    </div>

                    <Progress 
                      value={
                        cluster.riskLevel === 'high' ? 100 :
                        cluster.riskLevel === 'medium' ? 50 :
                        25
                      }
                      className={cn(
                        cluster.riskLevel === 'high' ? "bg-destructive" :
                        cluster.riskLevel === 'medium' ? "bg-yellow-500" :
                        "bg-green-500"
                      )}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionMonitoring;
