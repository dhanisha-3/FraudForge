import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Atom, 
  Brain, 
  Cpu, 
  Database, 
  Lock, 
  Cloud,
  Zap,
  Network
} from "lucide-react";
import aiBrain from "@/assets/ai-brain.jpg";

const TechStack = () => {
  const techCategories = [
    {
      title: "Quantum Computing",
      icon: Atom,
      color: "quantum",
      technologies: [
        "IBM Quantum (1,000+ qubit access)",
        "Qiskit, PennyLane, Cirq",
        "Amazon Braket integration",
        "Quantum-Classical Hybrid Models"
      ]
    },
    {
      title: "Classical AI/ML",
      icon: Brain,
      color: "neural",
      technologies: [
        "PyTorch, TensorFlow, JAX",
        "XGBoost, LightGBM, CatBoost",
        "PyTorch Geometric (GNNs)",
        "Hugging Face Transformers"
      ]
    },
    {
      title: "Real-time Processing",
      icon: Zap,
      color: "warning",
      technologies: [
        "Apache Kafka + Flink",
        "Redis Enterprise",
        "NVIDIA Triton Inference Server",
        "Apache Pulsar"
      ]
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      color: "success",
      technologies: [
        "Microsoft SEAL (homomorphic encryption)",
        "Intel SGX (secure enclaves)",
        "Hyperledger Fabric",
        "Zero-knowledge proofs (ZK-SNARKs)"
      ]
    },
    {
      title: "Edge Computing",
      icon: Cpu,
      color: "accent",
      technologies: [
        "NVIDIA Jetson (edge deployment)",
        "TensorRT optimization",
        "ONNX cross-platform",
        "WebAssembly (browser)"
      ]
    },
    {
      title: "Cloud Infrastructure",
      icon: Cloud,
      color: "secondary",
      technologies: [
        "Kubernetes orchestration",
        "Istio service mesh",
        "Prometheus monitoring",
        "Multi-cloud deployment"
      ]
    }
  ];

  const architectureFeatures = [
    {
      title: "Quantum Advantage",
      description: "15% accuracy boost over classical-only systems",
      percentage: 115
    },
    {
      title: "Neural Networks",
      description: "800+ behavioral features analyzed",
      percentage: 100
    },
    {
      title: "Graph Intelligence",
      description: "4D temporal hypergraph updates every 100ms",
      percentage: 95
    },
    {
      title: "Privacy Preservation",
      description: "Zero-knowledge proofs with ε=0.1 differential privacy",
      percentage: 100
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="neural" className="mb-4">
            Technical Excellence
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">Multi-Modal AI</span> Technology Stack
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced behavioral biometrics and contextual intelligence powered by ensemble learning architecture
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Technology Categories */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Core Technologies</h3>
            {techCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow group">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-${category.color} flex items-center justify-center shadow-neural group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                        {category.title}
                      </h4>
                      <div className="space-y-2">
                        {category.technologies.map((tech, techIndex) => (
                          <div key={techIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="text-sm text-muted-foreground">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Architecture Visualization */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Architecture Features</h3>
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 overflow-hidden">
              <div 
                className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
                style={{ backgroundImage: `url(${aiBrain})` }}
              >
                <div className="w-full h-full bg-gradient-quantum/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Network className="w-16 h-16 mx-auto mb-4 text-white drop-shadow-lg" />
                    <h4 className="text-xl font-bold text-white drop-shadow-lg">
                      Multi-Modal AI Brain
                    </h4>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {architectureFeatures.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{feature.title}</span>
                      <span className="text-sm text-accent">{feature.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-quantum h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${feature.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Development Timeline */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
              <h4 className="text-lg font-semibold mb-4">48-Hour Sprint Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm">Hour 0-4: Architecture setup + data pipeline</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Hour 4-12: Quantum-classical model training</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-sm">Hour 12-20: Graph neural network + behavioral biometrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-sm">Hour 20-28: Dashboard development + XAI integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-sm">Hour 28-36: System integration + optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-sm">Hour 36-48: Demo preparation + final polish</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Innovation Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-quantum/10 backdrop-blur-sm border-primary/30 text-center">
            <Atom className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h4 className="text-lg font-semibold mb-2">Quantum Supremacy</h4>
            <p className="text-sm text-muted-foreground">
              First production deployment of quantum fraud detection with provable quantum advantage
            </p>
          </Card>
          
          <Card className="p-6 bg-gradient-neural/10 backdrop-blur-sm border-secondary/30 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h4 className="text-lg font-semibold mb-2">Neural Excellence</h4>
            <p className="text-sm text-muted-foreground">
              Advanced graph neural networks with temporal dynamics and behavioral biometrics
            </p>
          </Card>
          
          <Card className="p-6 bg-gradient-success/10 backdrop-blur-sm border-success/30 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-success" />
            <h4 className="text-lg font-semibold mb-2">Privacy First</h4>
            <p className="text-sm text-muted-foreground">
              Zero-knowledge proofs and homomorphic encryption ensure complete data privacy
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechStack;