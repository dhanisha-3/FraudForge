import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Brain, Network, ArrowRight } from "lucide-react";
import heroQuantum from "@/assets/hero-quantum.jpg";
import { FadeInSection } from "./animations/FadeInSection";
import styles from "./animations/hero.module.css";
import "./animations/animations.css";
import { cn } from "@/lib/utils";

const NexusHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Parallax Background */}
      <div 
        className={styles.parallaxBg}
        style={{ 
          backgroundImage: `url(${heroQuantum})`,
          transform: `translate3d(${mousePosition.x}px, ${scrollY * 0.5 + mousePosition.y}px, 0)`
        }}
      >
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <FadeInSection delay={0.2}>
          <Badge variant="secondary" className={cn("mb-6", styles.badge)}>
            🚀 Next-Generation Fraud Detection System
          </Badge>
        </FadeInSection>
        
        <FadeInSection delay={0.4}>
          <h1 className={cn("text-5xl md:text-7xl font-bold mb-6", styles.gradientText)}>
            FraudGuard AI
          </h1>
        </FadeInSection>
        
        <FadeInSection delay={0.6}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-4xl mx-auto">
            Revolutionizing Financial Security
          </p>
        </FadeInSection>
        
        <FadeInSection delay={0.8}>
          <p className="text-lg text-accent mb-8 max-w-3xl mx-auto font-medium">
            Where Innovation Meets Security, and Users Come First
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <FadeInSection direction="up" delay={1.0}>
            <div className={styles.statsCard}>
              <Shield className={cn("w-6 h-6 text-primary mb-2", styles.icon)} />
              <span className="text-sm font-medium">99.94% Accuracy</span>
            </div>
          </FadeInSection>
          
          <FadeInSection direction="up" delay={1.2}>
            <div className={styles.statsCard}>
              <Zap className={cn("w-6 h-6 text-secondary mb-2", styles.icon)} />
              <span className="text-sm font-medium">&lt;50ms Latency</span>
            </div>
          </FadeInSection>
          
          <FadeInSection direction="up" delay={1.4}>
            <div className={styles.statsCard}>
              <Brain className={cn("w-6 h-6 text-accent mb-2", styles.icon)} />
              <span className="text-sm font-medium">Multi-Modal AI</span>
            </div>
          </FadeInSection>
          
          <FadeInSection direction="up" delay={1.6}>
            <div className={styles.statsCard}>
              <Network className={cn("w-6 h-6 text-warning mb-2", styles.icon)} />
              <span className="text-sm font-medium">10M+ TPS</span>
            </div>
          </FadeInSection>
        </div>

        <FadeInSection delay={1.8}>
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </FadeInSection>
      </div>

      {/* Animated Gradient Orbs */}
      <div className={cn(styles.orb, styles.orbPrimary)} />
      <div className={cn(styles.orb, styles.orbSecondary)} />
    </section>
  );
};

export default NexusHero;