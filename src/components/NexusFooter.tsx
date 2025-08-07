import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Atom, Github, Linkedin, Twitter, Mail } from "lucide-react";

const NexusFooter = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-quantum rounded-lg shadow-quantum" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                FraudGuard AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Next-Generation Fraud Detection - Where Innovation Meets Security, and Users Come First
            </p>
            <Badge variant="quantum" className="inline-flex">
              Multi-Modal AI
            </Badge>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#architecture" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Architecture
              </a>
              <a href="#demo" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Live Demo
              </a>
              <a href="#performance" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Performance
              </a>
            </div>
          </div>

          {/* Technology */}
          <div className="space-y-4">
            <h4 className="font-semibold">Technology</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Quantum Computing
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Graph Neural Networks
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Behavioral Biometrics
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Preservation
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Get Started</h4>
            <div className="space-y-3">
              <Button variant="quantum" size="sm" className="w-full">
                Request Demo
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Technical Docs
              </Button>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 FraudGuard AI. All rights reserved. Multi-Modal Fraud Detection System.
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Security</a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              "While others chase fraud, we predict it. While others block transactions, we build trust."
            </p>
            <Badge variant="neural" className="text-xs">
              The Future of Financial Security
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NexusFooter;