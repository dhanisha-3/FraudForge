import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Target,
  Activity,
  Clock,
  Globe,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Zap,
  Lock,
  Navigation,
  Radar,
  Crosshair,
  Map as MapIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { locationService, LocationData, LocationRiskAssessment } from "@/services/LocationService";

// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GeospatialTransaction {
  id: string;
  latitude: number;
  longitude: number;
  amount: number;
  timestamp: Date;
  riskScore: number;
  status: "safe" | "suspicious" | "blocked";
  location: string;
  userFrequency: number;
  distanceFromHome: number;
  velocityRisk: number;
  zoneType: "home" | "work" | "frequent" | "new" | "restricted";
}

interface GeofenceZone {
  id: string;
  name: string;
  type: "safe" | "restricted" | "high-risk" | "monitoring";
  coordinates: [number, number][];
  radius?: number;
  center?: [number, number];
  alertLevel: "low" | "medium" | "high" | "critical";
  transactionCount: number;
  fraudRate: number;
}

interface UserZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  frequency: number;
  lastVisit: Date;
  riskLevel: "low" | "medium" | "high";
  transactionCount: number;
  avgAmount: number;
}

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface LocationAlert {
  id: string;
  type: "geofence_breach" | "velocity_anomaly" | "new_location" | "high_risk_zone";
  message: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  coordinates: [number, number];
  action: "monitor" | "alert" | "block";
}

interface RiskAssessment {
  overallRisk: number;
  factors: {
    locationRisk: number;
    velocityRisk: number;
    frequencyRisk: number;
    timeRisk: number;
    amountRisk: number;
  };
  recommendation: "approve" | "review" | "block";
  confidence: number;
}

// Lightweight heatmap layer using leaflet.heat
const HeatmapLayer: React.FC<{ points: HeatmapPoint[] }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    // @ts-ignore - plugin augments L
    const layer = (L as any).heatLayer(
      points.map(p => [p.lat, p.lng, Math.max(0.1, p.intensity)]),
      { radius: 25, blur: 15, maxZoom: 17 }
    );
    layer.addTo(map);
    return () => { map.removeLayer(layer); };
  }, [map, points]);
  return null;
};


const GeospatialFraudDetection = () => {
  const [transactions, setTransactions] = useState<GeospatialTransaction[]>([]);
  const [geofenceZones, setGeofenceZones] = useState<GeofenceZone[]>([]);
  const [userZones, setUserZones] = useState<UserZone[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [locationAlerts, setLocationAlerts] = useState<LocationAlert[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<GeospatialTransaction | null>(null);
  const [currentRiskAssessment, setCurrentRiskAssessment] = useState<RiskAssessment | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai
  const [mapZoom, setMapZoom] = useState(11);
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [isLocationBlocking, setIsLocationBlocking] = useState(true);
  const [viewMode, setViewMode] = useState<"transactions" | "zones" | "heatmap" | "geofence">("transactions");
  const [riskFilter, setRiskFilter] = useState<"all" | "safe" | "suspicious" | "blocked">("all");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<GeospatialTransaction[]>([]);

  // Generate realistic transaction data with advanced risk assessment
  const generateTransaction = (): GeospatialTransaction => {
    const mumbaiBounds = {
      north: 19.2,
      south: 18.9,
      east: 72.95,
      west: 72.8
    };

    const lat = mumbaiBounds.south + Math.random() * (mumbaiBounds.north - mumbaiBounds.south);
    const lng = mumbaiBounds.west + Math.random() * (mumbaiBounds.east - mumbaiBounds.west);

    const amount = Math.floor(Math.random() * 50000) + 100;
    const timestamp = new Date();

    const locations = [
      "Bandra West", "Andheri East", "Powai", "Worli", "Lower Parel",
      "Juhu", "Malad", "Thane", "Navi Mumbai", "Borivali"
    ];

    // Create preliminary transaction for assessment
    const preliminaryTransaction: GeospatialTransaction = {
      id: `geo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      latitude: lat,
      longitude: lng,
      amount,
      timestamp,
      riskScore: 0,
      status: "safe",
      location: locations[Math.floor(Math.random() * locations.length)],
      userFrequency: Math.floor(Math.random() * 50),
      distanceFromHome: Math.random() * 50,
      velocityRisk: Math.random() * 100,
      zoneType: Math.random() > 0.7 ? "new" : Math.random() > 0.5 ? "frequent" : "home"
    };

    // Perform risk assessment
    const assessment = assessLocationRisk(preliminaryTransaction);

    // Determine status based on assessment
    let status: "safe" | "suspicious" | "blocked";
    if (shouldBlockTransaction(assessment)) {
      status = "blocked";
    } else if (assessment.recommendation === "review") {
      status = "suspicious";
    } else {
      status = "safe";
    }

    // Generate alert if necessary
    const alert = generateLocationAlert(preliminaryTransaction, assessment);
    if (alert) {
      setLocationAlerts(prev => [alert, ...prev.slice(0, 19)]);
    }

    // Update tracking history
    setTrackingHistory(prev => [preliminaryTransaction, ...prev.slice(0, 9)]);

    return {
      ...preliminaryTransaction,
      riskScore: Math.round(assessment.overallRisk),
      status
    };
  };

  // Generate geofence zones
  const generateGeofenceZones = (): GeofenceZone[] => [
    {
      id: "zone_1",
      name: "Financial District - BKC",
      type: "safe",
      coordinates: [
        [19.0544, 72.8691],
        [19.0644, 72.8791],
        [19.0744, 72.8691],
        [19.0644, 72.8591]
      ],
      alertLevel: "low",
      transactionCount: 15420,
      fraudRate: 0.8
    },
    {
      id: "zone_2",
      name: "High Risk Area - Dharavi",
      type: "high-risk",
      coordinates: [
        [19.0423, 72.8570],
        [19.0523, 72.8670],
        [19.0623, 72.8570],
        [19.0523, 72.8470]
      ],
      alertLevel: "critical",
      transactionCount: 3240,
      fraudRate: 15.2
    },
    {
      id: "zone_3",
      name: "Shopping District - Linking Road",
      type: "monitoring",
      coordinates: [
        [19.0544, 72.8291],
        [19.0644, 72.8391],
        [19.0744, 72.8291],
        [19.0644, 72.8191]
      ],
      alertLevel: "medium",
      transactionCount: 8760,
      fraudRate: 3.5
    }
  ];

  // Generate user frequent zones
  const generateUserZones = (): UserZone[] => [
    {
      id: "user_zone_1",
      name: "Home Zone",
      center: [19.0760, 72.8777],
      radius: 500,
      frequency: 85,
      lastVisit: new Date(Date.now() - 3600000),
      riskLevel: "low",
      transactionCount: 342,
      avgAmount: 1250
    },
    {
      id: "user_zone_2",
      name: "Work Zone",
      center: [19.0544, 72.8691],
      radius: 300,
      frequency: 65,
      lastVisit: new Date(Date.now() - 7200000),
      riskLevel: "low",
      transactionCount: 156,
      avgAmount: 850
    },
    {
      id: "user_zone_3",
      name: "Shopping Zone",
      center: [19.0644, 72.8291],
      radius: 400,
      frequency: 25,
      lastVisit: new Date(Date.now() - 86400000),
      riskLevel: "medium",
      transactionCount: 89,
      avgAmount: 2150
    }
  ];

  // Generate heatmap data
  const generateHeatmapData = (): HeatmapPoint[] => {
    const points: HeatmapPoint[] = [];
    for (let i = 0; i < 100; i++) {
      const lat = 18.9 + Math.random() * 0.3;
      const lng = 72.8 + Math.random() * 0.15;
      const intensity = Math.random();

      let riskLevel: "low" | "medium" | "high" | "critical";
      if (intensity > 0.8) riskLevel = "critical";
      else if (intensity > 0.6) riskLevel = "high";
      else if (intensity > 0.4) riskLevel = "medium";
      else riskLevel = "low";

      points.push({ lat, lng, intensity, riskLevel });
    }
    return points;
  };

  // Real-time transaction updates
  useEffect(() => {
    if (!isLiveTracking) return;

    const interval = setInterval(() => {
      const newTransaction = generateTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTracking]);

  // Initialize data
  useEffect(() => {
    setGeofenceZones(generateGeofenceZones());
    setUserZones(generateUserZones());
    setHeatmapData(generateHeatmapData());

    // Generate initial transactions
    const initialTransactions = Array.from({ length: 20 }, () => generateTransaction());
    setTransactions(initialTransactions);
  }, []);

  // Custom marker icons
  const createCustomIcon = (status: string, size: number = 25) => {
    const color = status === "safe" ? "#22c55e" :
                 status === "suspicious" ? "#f59e0b" : "#ef4444";

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  // Zone color mapping
  const getZoneColor = (type: string) => {
    switch (type) {
      case "safe": return "#22c55e";
      case "restricted": return "#ef4444";
      case "high-risk": return "#dc2626";
      case "monitoring": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  // Advanced risk assessment algorithm
  const assessLocationRisk = (transaction: GeospatialTransaction): RiskAssessment => {
    const { latitude: lat, longitude: lng, amount, timestamp } = transaction;

    // 1. Location Risk Assessment
    let locationRisk = 0;
    geofenceZones.forEach(zone => {
      if (zone.type === "high-risk") {
        const distance = calculateDistance(lat, lng, zone.coordinates[0][0], zone.coordinates[0][1]);
        if (distance < 1) locationRisk += 40;
        else if (distance < 2) locationRisk += 20;
      } else if (zone.type === "restricted") {
        const distance = calculateDistance(lat, lng, zone.coordinates[0][0], zone.coordinates[0][1]);
        if (distance < 0.5) locationRisk += 60;
      }
    });

    // 2. Frequency Risk Assessment
    let frequencyRisk = 0;
    const nearestUserZone = userZones.find(zone => {
      const distance = calculateDistance(lat, lng, zone.center[0], zone.center[1]);
      return distance < (zone.radius / 1000);
    });

    if (!nearestUserZone) {
      frequencyRisk += 30; // Completely new location
    } else if (nearestUserZone.frequency < 10) {
      frequencyRisk += 20; // Infrequent location
    } else if (nearestUserZone.frequency < 30) {
      frequencyRisk += 10; // Somewhat familiar
    }

    // 3. Velocity Risk Assessment
    let velocityRisk = 0;
    if (trackingHistory.length > 0) {
      const lastTransaction = trackingHistory[0];
      const timeDiff = (timestamp.getTime() - lastTransaction.timestamp.getTime()) / (1000 * 60); // minutes
      const distance = calculateDistance(lat, lng, lastTransaction.latitude, lastTransaction.longitude);
      const speed = distance / (timeDiff / 60); // km/h

      if (speed > 100) velocityRisk += 40; // Impossible travel speed
      else if (speed > 60) velocityRisk += 25; // Very fast travel
      else if (speed > 30) velocityRisk += 10; // Fast travel
    }

    // 4. Time Risk Assessment
    let timeRisk = 0;
    const hour = timestamp.getHours();
    if (hour >= 23 || hour <= 5) timeRisk += 15; // Night transactions
    if (timestamp.getDay() === 0 || timestamp.getDay() === 6) timeRisk += 5; // Weekend

    // 5. Amount Risk Assessment
    let amountRisk = 0;
    if (amount > 100000) amountRisk += 30;
    else if (amount > 50000) amountRisk += 20;
    else if (amount > 25000) amountRisk += 10;

    if (nearestUserZone && amount > nearestUserZone.avgAmount * 3) {
      amountRisk += 20; // Unusual amount for this location
    }

    // Calculate overall risk
    const overallRisk = Math.min(100, locationRisk + frequencyRisk + velocityRisk + timeRisk + amountRisk);

    // Determine recommendation
    let recommendation: "approve" | "review" | "block";
    if (overallRisk >= 80) recommendation = "block";
    else if (overallRisk >= 50) recommendation = "review";
    else recommendation = "approve";

    // Calculate confidence
    const confidence = Math.min(95, 60 + (overallRisk * 0.4));

    return {
      overallRisk,
      factors: {
        locationRisk,
        velocityRisk,
        frequencyRisk,
        timeRisk,
        amountRisk
      },
      recommendation,
      confidence
    };
  };

  // Generate location alerts
  const generateLocationAlert = (transaction: GeospatialTransaction, assessment: RiskAssessment): LocationAlert | null => {
    const { latitude: lat, longitude: lng, location } = transaction;

    // Check for geofence breaches
    for (const zone of geofenceZones) {
      if (zone.type === "restricted") {
        const distance = calculateDistance(lat, lng, zone.coordinates[0][0], zone.coordinates[0][1]);
        if (distance < 0.5) {
          return {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "geofence_breach",
            message: `Transaction attempted in restricted zone: ${zone.name}`,
            timestamp: new Date(),
            severity: "critical",
            location,
            coordinates: [lat, lng],
            action: "block"
          };
        }
      }
    }

    // Check for velocity anomalies
    if (assessment.factors.velocityRisk > 30) {
      return {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "velocity_anomaly",
        message: `Suspicious travel velocity detected`,
        timestamp: new Date(),
        severity: "high",
        location,
        coordinates: [lat, lng],
        action: "alert"
      };
    }

    // Check for new locations
    if (assessment.factors.frequencyRisk >= 30) {
      return {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "new_location",
        message: `Transaction from new location: ${location}`,
        timestamp: new Date(),
        severity: "medium",
        location,
        coordinates: [lat, lng],
        action: "monitor"
      };
    }

    return null;
  };

  // Location blocking mechanism
  const shouldBlockTransaction = (assessment: RiskAssessment): boolean => {
    if (!isLocationBlocking) return false;

    return assessment.recommendation === "block" ||
           assessment.factors.locationRisk >= 60 ||
           assessment.overallRisk >= 85;
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter transactions based on risk
  const filteredTransactions = transactions.filter(transaction => {
    if (riskFilter === "all") return true;
    return transaction.status === riskFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "blocked": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return CheckCircle;
      case "suspicious": return AlertTriangle;
      case "blocked": return XCircle;
      default: return Shield;
    }
  };

  return (
    <section id="geospatial" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            Geospatial Fraud Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced Location-Based Fraud Prevention
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time geospatial analysis with zonal detection, geofencing, heatmaps, and location-based risk assessment
          </p>
        </div>

        {/* Enhanced Control Panel */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={isLiveTracking ? "default" : "outline"}
              onClick={() => setIsLiveTracking(!isLiveTracking)}
              className="flex items-center space-x-2"
            >
              {isLiveTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLiveTracking ? "Live" : "Paused"}</span>
              {isLiveTracking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />}
            </Button>

            <Button
              variant={isLocationBlocking ? "destructive" : "outline"}
              onClick={() => setIsLocationBlocking(!isLocationBlocking)}
              className="flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLocationBlocking ? "Blocking ON" : "Blocking OFF"}</span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <select
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <option value="transactions">Transactions</option>
                <option value="zones">User Zones</option>
                <option value="heatmap">Risk Heatmap</option>
                <option value="geofence">Geofence Zones</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <select
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
              >
                <option value="all">All Transactions</option>
                <option value="safe">Safe</option>
                <option value="suspicious">Suspicious</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <Badge variant="outline" className="flex items-center space-x-2">
              <AlertTriangle className="w-3 h-3" />
              <span>{locationAlerts.length} Alerts</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4 mr-2" />
              Track Location
            </Button>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search Location
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map Container */}
          <Card className="lg:col-span-3 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapIcon className="w-5 h-5 mr-2 text-accent" />
                Real-Time Geospatial Analysis
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {filteredTransactions.length} Transactions
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                </Badge>
              </div>
            </div>

                {viewMode === 'heatmap' && (
                  <HeatmapLayer points={heatmapData} />
                )}


            <div className="h-96 rounded-lg overflow-hidden border border-border/50 bg-card/30">
              <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {viewMode === 'transactions' && filteredTransactions.map((t) => (
                  <Marker key={t.id} position={[t.latitude, t.longitude]} icon={createCustomIcon(t.status, 14)}>
                    <Popup>
                      <div className="text-sm">
                        <div className="font-semibold">₹{t.amount.toLocaleString()}</div>
                        <div>{t.location}</div>
                        <div>Risk: {t.riskScore}%</div>
                        <div>Status: {t.status}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {viewMode === 'geofence' && geofenceZones.map((z) => (
                  <Polygon key={z.id} positions={z.coordinates} pathOptions={{ color: z.type === 'restricted' ? 'red' : z.type === 'high-risk' ? 'orange' : 'green' }} />
                ))}

                {viewMode === 'heatmap' && heatmapData.map((p, idx) => (
                  <Circle key={idx} center={[p.lat, p.lng]} radius={400 * p.intensity} pathOptions={{ color: 'transparent' }} fillOpacity={0.2 + p.intensity * 0.5} fillColor={p.riskLevel === 'critical' ? 'red' : p.riskLevel === 'high' ? 'orange' : p.riskLevel === 'medium' ? 'yellow' : 'green'} />
                ))}

              </MapContainer>
            </div>
          </Card>

          {/* Enhanced Side Panel */}
          <div className="space-y-6">
            {/* Transaction Details with Risk Assessment */}
            {selectedTransaction && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Crosshair className="w-5 h-5 mr-2 text-accent" />
                  Transaction Analysis
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getStatusIcon(selectedTransaction.status), {
                        className: cn("w-4 h-4", getStatusColor(selectedTransaction.status))
                      })}
                      <span className={cn("font-medium", getStatusColor(selectedTransaction.status))}>
                        {selectedTransaction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="font-medium">{selectedTransaction.location}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coordinates:</span>
                    <span className="font-medium text-xs">{selectedTransaction.latitude.toFixed(4)}, {selectedTransaction.longitude.toFixed(4)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Zone Type:</span>
                    <Badge variant="outline">{selectedTransaction.zoneType}</Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Distance from Home:</span>
                    <span className="font-medium">{selectedTransaction.distanceFromHome.toFixed(1)} km</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">User Frequency:</span>
                    <span className="font-medium">{selectedTransaction.userFrequency}%</span>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Overall Risk Score</div>
                    <Progress value={selectedTransaction.riskScore} className="h-3 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      {selectedTransaction.riskScore < 30 ? "Low Risk" :
                       selectedTransaction.riskScore < 60 ? "Medium Risk" :
                       selectedTransaction.riskScore < 80 ? "High Risk" : "Critical Risk"}
                    </div>
                  </div>

                  {/* Detailed Risk Breakdown */}
                  {currentRiskAssessment && (
                    <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50">
                      <div className="text-sm font-medium mb-3">Risk Factor Breakdown</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Location Risk:</span>
                          <span className="font-medium">{currentRiskAssessment.factors.locationRisk}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Velocity Risk:</span>
                          <span className="font-medium">{currentRiskAssessment.factors.velocityRisk}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Frequency Risk:</span>
                          <span className="font-medium">{currentRiskAssessment.factors.frequencyRisk}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Time Risk:</span>
                          <span className="font-medium">{currentRiskAssessment.factors.timeRisk}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Amount Risk:</span>
                          <span className="font-medium">{currentRiskAssessment.factors.amountRisk}</span>
                        </div>
                        <div className="border-t border-border/50 pt-2 mt-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Recommendation:</span>
                            <Badge variant={
                              currentRiskAssessment.recommendation === "approve" ? "secondary" :
                              currentRiskAssessment.recommendation === "review" ? "default" : "destructive"
                            }>
                              {currentRiskAssessment.recommendation.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Confidence:</span>
                            <span>{currentRiskAssessment.confidence.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Location Alerts */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
                Location Alerts
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {locationAlerts.slice(0, 8).map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={cn("w-4 h-4",
                            alert.severity === "critical" ? "text-red-500" :
                            alert.severity === "high" ? "text-orange-500" :
                            alert.severity === "medium" ? "text-yellow-500" : "text-blue-500"
                          )} />
                          <span className="text-sm font-medium">{alert.type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <Badge variant={
                          alert.action === "block" ? "destructive" :
                          alert.action === "alert" ? "default" : "secondary"
                        } className="text-xs">
                          {alert.action}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {alert.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {alert.location} • {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {locationAlerts.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No recent alerts
                  </div>
                )}
              </div>
            </Card>

            {/* Zone Statistics */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Radar className="w-5 h-5 mr-2 text-accent" />
                Zone Statistics
              </h3>

              <div className="space-y-4">
                {userZones.map((zone) => (
                  <motion.div
                    key={zone.id}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{zone.name}</span>
                      <Badge variant={
                        zone.riskLevel === "low" ? "secondary" :
                        zone.riskLevel === "medium" ? "default" : "destructive"
                      }>
                        {zone.riskLevel}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Frequency: {zone.frequency}%</div>
                      <div>Transactions: {zone.transactionCount}</div>
                      <div>Avg Amount: ₹{zone.avgAmount}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recent Alerts */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
                Recent Alerts
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {filteredTransactions.filter(t => t.status !== "safe").slice(0, 5).map((transaction) => {
                    const StatusIcon = getStatusIcon(transaction.status);
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={cn("w-4 h-4", getStatusColor(transaction.status))} />
                            <span className="text-sm font-medium">₹{transaction.amount.toLocaleString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Risk: {transaction.riskScore}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.location} • {transaction.timestamp.toLocaleTimeString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeospatialFraudDetection;
