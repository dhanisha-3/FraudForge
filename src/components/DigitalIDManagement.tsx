import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Download,
  MapPin,
  User,
  Smartphone,
  Clock,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
// import jsPDF from 'jspdf'; // Temporarily disabled
import { cn } from "@/lib/utils";

interface DigitalID {
  id: string;
  userId: string;
  deviceId: string;
  timestamp: Date;
  location: string;
  riskScore: number;
  behavioralPatterns: {
    typing: number;
    mouseMovement: number;
    appUsage: number;
  };
  status: 'active' | 'suspicious' | 'blocked';
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  location: string;
  timestamp: Date;
  deviceId: string;
  riskScore: number;
  status: 'approved' | 'pending' | 'blocked';
}

const DigitalIDManagement = () => {
  const [digitalIDs, setDigitalIDs] = useState<DigitalID[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedID, setSelectedID] = useState<DigitalID | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetching
    const fetchData = async () => {
      // In a real application, this would be an API call
      const mockDigitalIDs: DigitalID[] = [
        {
          id: "did1",
          userId: "user123",
          deviceId: "device456",
          timestamp: new Date(),
          location: "New York, USA",
          riskScore: 25,
          behavioralPatterns: {
            typing: 85,
            mouseMovement: 90,
            appUsage: 88
          },
          status: 'active'
        },
        // Add more mock data as needed
      ];

      const mockTransactions: Transaction[] = [
        {
          id: "tx1",
          userId: "user123",
          amount: 1500,
          type: "online",
          location: "New York, USA",
          timestamp: new Date(),
          deviceId: "device456",
          riskScore: 15,
          status: 'approved'
        },
        // Add more mock transactions
      ];

      setDigitalIDs(mockDigitalIDs);
      setTransactions(mockTransactions);
      setLoading(false);
    };

    fetchData();
  }, []);

  const generatePDF = (id: DigitalID) => {
    // Temporarily disabled PDF generation
    alert(`PDF generation for Digital ID ${id.id} would be generated here. Feature temporarily disabled.`);

    // TODO: Re-enable when jsPDF dependency is properly configured
    /*
    const pdf = new jsPDF();

    // Add content to PDF
    pdf.setFontSize(16);
    pdf.text("Digital ID Report", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`ID: ${id.id}`, 20, 40);
    pdf.text(`User ID: ${id.userId}`, 20, 50);
    pdf.text(`Device ID: ${id.deviceId}`, 20, 60);
    pdf.text(`Location: ${id.location}`, 20, 70);
    pdf.text(`Risk Score: ${id.riskScore}%`, 20, 80);
    pdf.text(`Status: ${id.status.toUpperCase()}`, 20, 90);

    pdf.text("Behavioral Patterns", 20, 110);
    pdf.text(`Typing Pattern Match: ${id.behavioralPatterns.typing}%`, 30, 120);
    pdf.text(`Mouse Movement Match: ${id.behavioralPatterns.mouseMovement}%`, 30, 130);
    pdf.text(`App Usage Pattern Match: ${id.behavioralPatterns.appUsage}%`, 30, 140);

    // Save the PDF
    pdf.save(`digital-id-${id.id}.pdf`);
    */
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Digital Identity Management</h2>
          <Badge variant="outline" className="text-sm">
            <Shield className="w-4 h-4 mr-2" />
            {digitalIDs.filter(id => id.status === 'active').length} Active IDs
          </Badge>
        </div>

        <Tabs defaultValue="identities" className="w-full">
          <TabsList>
            <TabsTrigger value="identities">Digital IDs</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="identities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalIDs.map((id) => (
                <motion.div
                  key={id.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-primary" />
                        <span className="font-medium">{id.userId}</span>
                      </div>
                      <Badge 
                        variant={
                          id.status === 'active' ? "success" :
                          id.status === 'suspicious' ? "warning" : "destructive"
                        }
                      >
                        {id.status}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Smartphone className="w-4 h-4 mr-2" />
                        {id.deviceId}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {id.location}
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {id.timestamp.toLocaleString()}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Risk Score</span>
                          <span className={cn(
                            "text-sm",
                            id.riskScore > 70 ? "text-destructive" :
                            id.riskScore > 30 ? "text-yellow-500" :
                            "text-green-500"
                          )}>
                            {id.riskScore}%
                          </span>
                        </div>
                        <Progress 
                          value={id.riskScore} 
                          className={cn(
                            id.riskScore > 70 ? "bg-destructive" :
                            id.riskScore > 30 ? "bg-yellow-500" :
                            "bg-green-500"
                          )}
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedID(id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => generatePDF(id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="space-y-4">
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">\${tx.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {tx.type} • {tx.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
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
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DigitalIDManagement;
