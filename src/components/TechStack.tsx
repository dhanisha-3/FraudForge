import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Cpu, 
  Database, 
  Shield,
  LucideIcon
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./animations/techstack.module.css";

interface TechCategory {
  icon: LucideIcon;
  title: string;
  technologies: string[];
}

const techCategories: TechCategory[] = [
  {
    icon: Shield,
    title: "Quantum Security",
    technologies: ["Quantum Encryption", "Post-Quantum Cryptography", "Quantum Key Distribution"]
  },
  {
    icon: Brain,
    title: "AI & ML",
    technologies: ["Neural Networks", "Deep Learning", "Pattern Recognition", "Anomaly Detection"]
  },
  {
    icon: Cpu,
    title: "Processing",
    technologies: ["Real-time Analysis", "Distributed Computing", "Edge Processing"]
  },
  {
    icon: Database,
    title: "Data Systems",
    technologies: ["Quantum Database", "Blockchain", "Secure Storage", "Data Lakes"]
  }
];

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const TechStack: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className={styles.techSection} ref={ref}>
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
      >
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <Badge variant="outline" className="mb-4">
            Advanced Technology Stack
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Powered by Cutting-Edge Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our system combines quantum computing, advanced AI, and real-time processing
            to deliver unparalleled fraud detection capabilities.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={stagger}
        >
          {techCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={styles.techCard}
            >
              <Card className="h-full">
                <div className="p-6">
                  <div className={styles.iconWrapper}>
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                  <div className="space-y-2">
                    {category.technologies.map((tech, idx) => (
                      <motion.div
                        key={idx}
                        className={styles.techItem}
                        variants={fadeInUp}
                        custom={idx}
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 mt-16"
          variants={stagger}
        >
          <motion.div variants={fadeInUp}>
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">System Architecture</h3>
                <div className="space-y-4">
                  {[
                    { name: "Quantum Processing", value: 99.94 },
                    { name: "Neural Networks", value: 98.5 },
                    { name: "Real-time Analysis", value: 99.1 },
                    { name: "Behavioral Patterns", value: 97.8 }
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{stat.name}</span>
                        <span className="text-sm text-primary">{stat.value}%</span>
                      </div>
                      <motion.div 
                        className="h-2 bg-secondary/10 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: idx * 0.2 }}
                      >
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${stat.value}%` }}
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Development Timeline</h3>
                <div className="space-y-6">
                  {[
                    { phase: "Research", duration: "2 weeks", status: "Completed" },
                    { phase: "Development", duration: "6 weeks", status: "Completed" },
                    { phase: "Testing", duration: "4 weeks", status: "In Progress" },
                    { phase: "Deployment", duration: "2 weeks", status: "Upcoming" }
                  ].map((phase, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{phase.phase}</span>
                          <Badge variant="outline" className="text-xs">
                            {phase.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {phase.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className={styles.backgroundGlow} style={{ left: '10%', top: '20%' }} />
      <div className={styles.backgroundGlow} style={{ right: '10%', bottom: '20%' }} />
    </section>
  );
};
