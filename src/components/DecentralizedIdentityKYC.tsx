import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  KeyRound, 
  Users, 
  FileKey, 
  Lock, 
  CheckCircle, 
  Database,
  Network,
  RefreshCw,
  Eye,
  UserCheck,
  Key
} from "lucide-react";
import { motion } from "framer-motion";

const DecentralizedIdentityKYC = () => {
  return (
    <section id="identity" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <KeyRound className="w-4 h-4 mr-2" />
            Decentralized Identity & KYC
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Self-Sovereign Identity Protection
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced decentralized identity verification and KYC protection powered by blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Identity Verification */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Identity Verification</h3>
                <p className="text-sm text-muted-foreground">Zero-knowledge proofs for privacy</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Biometric verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Document authenticity check</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Liveness detection</span>
              </li>
            </ul>
          </Card>

          {/* Blockchain KYC */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Blockchain KYC</h3>
                <p className="text-sm text-muted-foreground">Immutable verification records</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Decentralized storage</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Smart contract automation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cross-chain compatibility</span>
              </li>
            </ul>
          </Card>

          {/* Privacy Controls */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Privacy Controls</h3>
                <p className="text-sm text-muted-foreground">User-controlled data sharing</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Granular permissions</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Data encryption</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Revocation controls</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Interactive Demo Section */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Decentralized Identity Flow</h3>
              <p className="text-muted-foreground mb-6">
                Experience our advanced identity verification process that puts privacy and security first
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Key Generation</h4>
                    <p className="text-sm text-muted-foreground">Secure cryptographic keys creation</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileKey className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Document Verification</h4>
                    <p className="text-sm text-muted-foreground">AI-powered document authenticity check</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Network className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Blockchain Storage</h4>
                    <p className="text-sm text-muted-foreground">Immutable identity attestations</p>
                  </div>
                </div>
              </div>

              <Button variant="quantum" className="mt-8">
                Try Demo
              </Button>
            </div>

            <div className="relative">
              <motion.div 
                className="w-full h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Add interactive visualization here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="w-16 h-16 text-primary/40 animate-spin-slow mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Identity Verification in Progress</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-semibold mb-2">Enhanced Security</h4>
            <p className="text-sm text-muted-foreground">
              Military-grade encryption and blockchain security
            </p>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <Eye className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-semibold mb-2">Privacy-First</h4>
            <p className="text-sm text-muted-foreground">
              Zero-knowledge proofs protect sensitive data
            </p>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <Users className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-semibold mb-2">Self-Sovereign</h4>
            <p className="text-sm text-muted-foreground">
              Users maintain complete control over their identity
            </p>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <Database className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-semibold mb-2">Immutable Records</h4>
            <p className="text-sm text-muted-foreground">
              Blockchain-based verification history
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DecentralizedIdentityKYC;
