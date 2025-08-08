import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Map,
  BarChart3,
  Calendar,
  Download,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface HeatmapData {
  latitude: number;
  longitude: number;
  intensity: number;
  location: string;
  fraudType: string;
  timestamp: string;
}

export function FraudHeatmap() {
  const [timeRange, setTimeRange] = React.useState('24h');
  const [fraudType, setFraudType] = React.useState('all');
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  // Simulated heatmap data
  const generateMockData = (): HeatmapData[] => {
    return [
      {
        latitude: 19.0760,
        longitude: 72.8777,
        intensity: 0.8,
        location: 'Mumbai',
        fraudType: 'card_present',
        timestamp: '2025-08-08T10:30:00Z',
      },
      {
        latitude: 28.6139,
        longitude: 77.2090,
        intensity: 0.6,
        location: 'Delhi',
        fraudType: 'upi_fraud',
        timestamp: '2025-08-08T09:15:00Z',
      },
      // Add more mock data points as needed
    ];
  };

  React.useEffect(() => {
    // Initialize map and heatmap here using a library like Leaflet or Google Maps
    // This is a placeholder for the actual implementation
    console.log('Initialize map with:', {
      timeRange,
      fraudType,
      data: generateMockData(),
    });
  }, [timeRange, fraudType]);

  const exportReport = () => {
    // Implement PDF export using jsPDF
    console.log('Exporting PDF report...');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/2">
                  <Select value={fraudType} onValueChange={setFraudType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fraud type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="card_present">Card Present</SelectItem>
                      <SelectItem value="card_not_present">Card Not Present</SelectItem>
                      <SelectItem value="upi_fraud">UPI Fraud</SelectItem>
                      <SelectItem value="phishing">Phishing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div
                ref={mapContainerRef}
                className="w-full h-[400px] rounded-lg border bg-muted"
              >
                {/* Map will be rendered here */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Map className="h-8 w-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis & Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="statistics">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="statistics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Total Cases</div>
                    <div className="text-2xl font-bold">1,234</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">High Risk Areas</div>
                    <div className="text-2xl font-bold">15</div>
                  </div>
                </div>

                <div className="h-[200px] rounded-lg border bg-muted flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Emerging Patterns</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Increase in UPI fraud attempts</li>
                    <li>• New phishing campaign detected</li>
                    <li>• Suspicious device patterns identified</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Active Alerts</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• High volume of transactions in Mumbai</li>
                    <li>• Unusual activity pattern in Delhi</li>
                    <li>• Multiple failed authentication attempts</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <Button onClick={exportReport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Temporal Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] rounded-lg border bg-muted flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
