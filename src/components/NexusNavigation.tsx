import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NexusNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-quantum rounded-lg shadow-quantum" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              FraudGuard AI
            </span>
            <Badge variant="neural" className="text-xs">
              Multi-Modal
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#demo" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Demo
            </a>
            <a href="#biometrics" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Biometrics
            </a>
            <a href="#voice" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Voice AI
            </a>
            <a href="#network" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Network
            </a>
            <a href="#credit-card" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Cards
            </a>
            <a href="#upi" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              UPI
            </a>
            <a href="#safezone" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              SafeZone
            </a>
            <Button variant="quantum" size="sm">
              Get Access
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#architecture" className="text-foreground hover:text-primary transition-colors">
                Architecture
              </a>
              <a href="#demo" className="text-foreground hover:text-primary transition-colors">
                Live Demo
              </a>
              <a href="#performance" className="text-foreground hover:text-primary transition-colors">
                Performance
              </a>
              <Button variant="quantum" size="sm" className="w-full">
                Get Access
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NexusNavigation;