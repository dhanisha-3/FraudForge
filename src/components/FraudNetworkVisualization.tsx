import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  Users, 
  AlertTriangle, 
  Shield,
  Eye,
  Zap,
  Target,
  Globe,
  Activity,
  TrendingUp,
  Search,
  Filter,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import { cn } from "@/lib/utils";

interface NetworkNode {
  id: string;
  type: "user" | "merchant" | "device" | "ip" | "card";
  risk: number;
  label: string;
  connections: number;
  amount?: number;
  location?: string;
  status: "normal" | "suspicious" | "blocked";
}

interface NetworkLink {
  source: string;
  target: string;
  strength: number;
  type: "transaction" | "device_link" | "location_link" | "pattern_match";
  amount?: number;
  frequency: number;
}

interface FraudRing {
  id: string;
  nodes: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  totalAmount: number;
  detectedAt: Date;
}

const FraudNetworkVisualization = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [fraudRings, setFraudRings] = useState<FraudRing[]>([]);
  const [networkStats, setNetworkStats] = useState({
    totalNodes: 0,
    suspiciousNodes: 0,
    activeConnections: 0,
    blockedTransactions: 0
  });
  const [timeframe, setTimeframe] = useState("1h");

  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkLink> | null>(null);

  // Sample network data
  const [networkData, setNetworkData] = useState<{nodes: NetworkNode[], links: NetworkLink[]}>({
    nodes: [
      { id: "user1", type: "user", risk: 0.1, label: "John Doe", connections: 3, status: "normal", location: "New York" },
      { id: "user2", type: "user", risk: 0.9, label: "Suspicious User", connections: 15, status: "suspicious", location: "Unknown" },
      { id: "user3", type: "user", risk: 0.95, label: "Blocked User", connections: 8, status: "blocked", location: "Romania" },
      { id: "merchant1", type: "merchant", risk: 0.2, label: "Coffee Shop", connections: 50, status: "normal", location: "NYC" },
      { id: "merchant2", type: "merchant", risk: 0.8, label: "Electronics Store", connections: 25, status: "suspicious", location: "Online" },
      { id: "device1", type: "device", risk: 0.3, label: "iPhone 12", connections: 2, status: "normal" },
      { id: "device2", type: "device", risk: 0.9, label: "Compromised Device", connections: 12, status: "suspicious" },
      { id: "ip1", type: "ip", risk: 0.1, label: "192.168.1.1", connections: 5, status: "normal", location: "US" },
      { id: "ip2", type: "ip", risk: 0.95, label: "Tor Exit Node", connections: 20, status: "blocked", location: "Unknown" },
      { id: "card1", type: "card", risk: 0.2, label: "****1234", connections: 3, status: "normal" },
      { id: "card2", type: "card", risk: 0.85, label: "****5678", connections: 8, status: "suspicious" }
    ],
    links: [
      { source: "user1", target: "merchant1", strength: 0.3, type: "transaction", amount: 4.50, frequency: 5 },
      { source: "user2", target: "merchant2", strength: 0.9, type: "transaction", amount: 15000, frequency: 20 },
      { source: "user3", target: "merchant2", strength: 0.8, type: "transaction", amount: 25000, frequency: 15 },
      { source: "user2", target: "device2", strength: 0.7, type: "device_link", frequency: 10 },
      { source: "user3", target: "device2", strength: 0.9, type: "device_link", frequency: 8 },
      { source: "user2", target: "ip2", strength: 0.8, type: "location_link", frequency: 12 },
      { source: "user3", target: "ip2", strength: 0.9, type: "location_link", frequency: 10 },
      { source: "user2", target: "card2", strength: 0.6, type: "pattern_match", frequency: 6 },
      { source: "device2", target: "ip2", strength: 0.9, type: "device_link", frequency: 15 }
    ]
  });

  // Initialize D3 force simulation
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.selectAll("*").remove();

    // Create simulation
    const simulation = d3.forceSimulation(networkData.nodes as any)
      .force("link", d3.forceLink(networkData.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(networkData.links)
      .enter().append("line")
      .attr("stroke", (d: any) => {
        switch (d.type) {
          case "transaction": return "#3b82f6";
          case "device_link": return "#f59e0b";
          case "location_link": return "#ef4444";
          case "pattern_match": return "#8b5cf6";
          default: return "#6b7280";
        }
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.strength * 10));

    // Create nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(networkData.nodes)
      .enter().append("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add circles for nodes
    node.append("circle")
      .attr("r", (d: any) => 8 + d.connections * 0.5)
      .attr("fill", (d: any) => {
        if (d.status === "blocked") return "#ef4444";
        if (d.status === "suspicious") return "#f59e0b";
        if (d.risk > 0.7) return "#ef4444";
        if (d.risk > 0.4) return "#f59e0b";
        return "#10b981";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d: any) => setSelectedNode(d));

    // Add node type icons
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .text((d: any) => {
        switch (d.type) {
          case "user": return "👤";
          case "merchant": return "🏪";
          case "device": return "📱";
          case "ip": return "🌐";
          case "card": return "💳";
          default: return "?";
        }
      });

    // Add labels
    node.append("text")
      .attr("dx", 15)
      .attr("dy", "0.35em")
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .text((d: any) => d.label);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Update network stats
    setNetworkStats({
      totalNodes: networkData.nodes.length,
      suspiciousNodes: networkData.nodes.filter(n => n.status === "suspicious" || n.risk > 0.7).length,
      activeConnections: networkData.links.length,
      blockedTransactions: networkData.nodes.filter(n => n.status === "blocked").length
    });

    return () => {
      simulation.stop();
    };
  }, [networkData]);

  // Advanced real-time network analysis
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Advanced network analysis and updates
      setNetworkData(prev => {
        const updatedData = performNetworkAnalysis(prev);
        return updatedData;
      });

      // Intelligent fraud ring detection
      const detectedRings = detectFraudRings(networkData);
      if (detectedRings.length > 0) {
        setFraudRings(prev => [...detectedRings, ...prev.slice(0, 3)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, networkData]);

  // Advanced network analysis algorithm
  const performNetworkAnalysis = (data: {nodes: NetworkNode[], links: NetworkLink[]}): {nodes: NetworkNode[], links: NetworkLink[]} => {
    const updatedNodes = data.nodes.map(node => {
      // Calculate centrality measures
      const centrality = calculateNodeCentrality(node, data.links);
      const communityRisk = calculateCommunityRisk(node, data.nodes, data.links);
      const velocityRisk = calculateVelocityRisk(node);

      // Update risk based on network position and behavior
      let newRisk = node.risk;

      // High centrality nodes are more suspicious
      if (centrality > 0.7) {
        newRisk = Math.min(1, newRisk + 0.1);
      }

      // Community risk propagation
      newRisk = Math.min(1, newRisk + communityRisk * 0.05);

      // Velocity-based risk
      newRisk = Math.min(1, newRisk + velocityRisk * 0.08);

      // Natural risk decay for legitimate behavior
      if (newRisk < 0.3) {
        newRisk = Math.max(0, newRisk - 0.02);
      }

      // Update status based on risk
      let newStatus = node.status;
      if (newRisk > 0.8) {
        newStatus = "blocked";
      } else if (newRisk > 0.5) {
        newStatus = "suspicious";
      } else {
        newStatus = "normal";
      }

      return {
        ...node,
        risk: newRisk,
        status: newStatus
      };
    });

    // Update link strengths based on node risks
    const updatedLinks = data.links.map(link => {
      const sourceNode = updatedNodes.find(n => n.id === link.source);
      const targetNode = updatedNodes.find(n => n.id === link.target);

      if (sourceNode && targetNode) {
        // Increase link strength if both nodes are risky
        const riskFactor = (sourceNode.risk + targetNode.risk) / 2;
        const newStrength = Math.min(1, link.strength + riskFactor * 0.1);

        return {
          ...link,
          strength: newStrength
        };
      }

      return link;
    });

    return {
      nodes: updatedNodes,
      links: updatedLinks
    };
  };

  // Calculate node centrality (simplified betweenness centrality)
  const calculateNodeCentrality = (node: NetworkNode, links: NetworkLink[]): number => {
    const nodeConnections = links.filter(link =>
      link.source === node.id || link.target === node.id
    );

    // Degree centrality (normalized)
    const degreeCentrality = nodeConnections.length / Math.max(1, links.length);

    // Weight by connection strengths
    const weightedCentrality = nodeConnections.reduce((sum, link) => sum + link.strength, 0) / nodeConnections.length;

    return (degreeCentrality + (weightedCentrality || 0)) / 2;
  };

  // Calculate community risk (risk propagation from neighbors)
  const calculateCommunityRisk = (node: NetworkNode, nodes: NetworkNode[], links: NetworkLink[]): number => {
    const neighbors = getNodeNeighbors(node.id, links);
    const neighborNodes = nodes.filter(n => neighbors.includes(n.id));

    if (neighborNodes.length === 0) return 0;

    // Average risk of neighbors
    const avgNeighborRisk = neighborNodes.reduce((sum, n) => sum + n.risk, 0) / neighborNodes.length;

    // Weight by connection strength
    const connectionWeights = links
      .filter(link => (link.source === node.id && neighbors.includes(link.target as string)) ||
                     (link.target === node.id && neighbors.includes(link.source as string)))
      .reduce((sum, link) => sum + link.strength, 0);

    return avgNeighborRisk * (connectionWeights / neighbors.length);
  };

  // Calculate velocity-based risk
  const calculateVelocityRisk = (node: NetworkNode): number => {
    // Simulate transaction velocity analysis
    const baseVelocity = node.connections;
    const timeWindow = 3600000; // 1 hour

    // High connection velocity indicates potential fraud
    if (baseVelocity > 10) {
      return 0.3;
    } else if (baseVelocity > 5) {
      return 0.15;
    }

    return 0;
  };

  // Get node neighbors
  const getNodeNeighbors = (nodeId: string, links: NetworkLink[]): string[] => {
    const neighbors: string[] = [];

    links.forEach(link => {
      if (link.source === nodeId) {
        neighbors.push(link.target as string);
      } else if (link.target === nodeId) {
        neighbors.push(link.source as string);
      }
    });

    return neighbors;
  };

  // Advanced fraud ring detection algorithm
  const detectFraudRings = (data: {nodes: NetworkNode[], links: NetworkLink[]}): FraudRing[] => {
    const detectedRings: FraudRing[] = [];

    // Find connected components with high risk
    const visitedNodes = new Set<string>();

    data.nodes.forEach(node => {
      if (visitedNodes.has(node.id) || node.risk < 0.6) return;

      // Perform DFS to find connected high-risk nodes
      const component = findConnectedComponent(node.id, data.nodes, data.links, visitedNodes);

      if (component.length >= 2) {
        const avgRisk = component.reduce((sum, nodeId) => {
          const n = data.nodes.find(node => node.id === nodeId);
          return sum + (n?.risk || 0);
        }, 0) / component.length;

        if (avgRisk > 0.7) {
          // Calculate total transaction amount (simulated)
          const totalAmount = component.length * 15000 + Math.random() * 50000;

          let riskLevel: "low" | "medium" | "high" | "critical";
          if (avgRisk > 0.9) riskLevel = "critical";
          else if (avgRisk > 0.8) riskLevel = "high";
          else if (avgRisk > 0.7) riskLevel = "medium";
          else riskLevel = "low";

          detectedRings.push({
            id: `ring-${Date.now()}-${Math.random()}`,
            nodes: component,
            riskLevel,
            totalAmount,
            detectedAt: new Date()
          });
        }
      }
    });

    return detectedRings;
  };

  // Find connected component using DFS
  const findConnectedComponent = (
    startNodeId: string,
    nodes: NetworkNode[],
    links: NetworkLink[],
    visitedNodes: Set<string>
  ): string[] => {
    const component: string[] = [];
    const stack: string[] = [startNodeId];

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!;

      if (visitedNodes.has(currentNodeId)) continue;

      const currentNode = nodes.find(n => n.id === currentNodeId);
      if (!currentNode || currentNode.risk < 0.6) continue;

      visitedNodes.add(currentNodeId);
      component.push(currentNodeId);

      // Add neighbors to stack
      const neighbors = getNodeNeighbors(currentNodeId, links);
      neighbors.forEach(neighborId => {
        if (!visitedNodes.has(neighborId)) {
          stack.push(neighborId);
        }
      });
    }

    return component;
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "user": return Users;
      case "merchant": return Target;
      case "device": return Shield;
      case "ip": return Globe;
      case "card": return Activity;
      default: return Network;
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 0.8) return "text-red-500";
    if (risk > 0.6) return "text-orange-500";
    if (risk > 0.4) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <section id="network" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Network className="w-4 h-4 mr-2" />
            3D Fraud Network Intelligence
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real-Time Threat Visualization
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive 3D network analysis revealing fraud patterns, suspicious connections, and emerging threats
          </p>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-3">
              <Network className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Nodes</p>
                <p className="text-2xl font-bold">{networkStats.totalNodes}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Suspicious</p>
                <p className="text-2xl font-bold">{networkStats.suspiciousNodes}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Connections</p>
                <p className="text-2xl font-bold">{networkStats.activeConnections}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold">{networkStats.blockedTransactions}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Network Visualization */}
          <Card className="lg:col-span-3 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Network Graph</h3>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={isPlaying ? "default" : "outline"}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button size="sm" variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <svg 
                ref={svgRef} 
                width="100%" 
                height="600" 
                className="border border-border/20 rounded-lg bg-background/20"
                viewBox="0 0 800 600"
              />
              
              {/* Legend */}
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                <h4 className="text-sm font-medium mb-2">Node Types</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Low Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Selected Node Details */}
            {selectedNode && (
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
                <h4 className="font-medium mb-3 flex items-center">
                  {React.createElement(getNodeTypeIcon(selectedNode.type), { className: "w-4 h-4 mr-2" })}
                  Node Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{selectedNode.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk:</span>
                    <span className={getRiskColor(selectedNode.risk)}>
                      {(selectedNode.risk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connections:</span>
                    <span>{selectedNode.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={cn(
                      "capitalize",
                      selectedNode.status === "blocked" ? "text-red-500" :
                      selectedNode.status === "suspicious" ? "text-yellow-500" : "text-green-500"
                    )}>
                      {selectedNode.status}
                    </span>
                  </div>
                  {selectedNode.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{selectedNode.location}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Fraud Rings */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <h4 className="font-medium mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-red-500" />
                Detected Fraud Rings
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {fraudRings.map((ring) => (
                    <motion.div
                      key={ring.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-3 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={
                          ring.riskLevel === "critical" ? "destructive" :
                          ring.riskLevel === "high" ? "default" :
                          ring.riskLevel === "medium" ? "secondary" : "outline"
                        }>
                          {ring.riskLevel.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {ring.detectedAt.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Nodes: {ring.nodes.length}</div>
                        <div>Amount: ${ring.totalAmount.toLocaleString()}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>

            {/* Real-time Activity */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <h4 className="font-medium mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-500" />
                Live Activity
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Transaction verified: $1,250</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>Suspicious pattern detected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span>New device connection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Network analysis updated</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FraudNetworkVisualization;
