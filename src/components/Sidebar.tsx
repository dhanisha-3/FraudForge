import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Activity,
  Brain,
  Eye,
  BarChart3,
  Settings,
  Shield,
  CheckCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onOpenChange: (open: boolean) => void;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: null,
    description: 'Overview and real-time monitoring'
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: Activity,
    badge: 'Live',
    description: 'Real-time transaction monitoring'
  },
  {
    title: 'AI Models',
    href: '/ai-models',
    icon: Brain,
    badge: 'New',
    description: 'Machine learning models showcase'
  },
  {
    title: 'Computer Vision',
    href: '/computer-vision',
    icon: Eye,
    badge: null,
    description: 'Face detection and QR scanning'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    badge: null,
    description: 'Advanced fraud analytics'
  },
  {
    title: 'Security',
    href: '/security',
    icon: Shield,
    badge: null,
    description: 'Account & session protection'
  },
  {
    title: 'Education',
    href: '/education',
    icon: CheckCircle,
    badge: 'New',
    description: 'Fraud education center'
  },
  {
    title: 'Geospatial',
    href: '/geospatial',
    icon: Activity,
    badge: null,
    description: 'Zonal & heatmap risk'
  },
  {
    title: 'Threat Intel',
    href: '/threat-intelligence',
    icon: Brain,
    badge: null,
    description: 'Threat feeds & correlation'
  },
  {
    title: 'URL Scanner',
    href: '/url-scanner',
    icon: BarChart3,
    badge: null,
    description: 'URL phishing & malware'
  },
  {
    title: 'AI Spam',
    href: '/spam-detection',
    icon: Brain,
    badge: null,
    description: 'AI-driven spam detection'
  },
  {
    title: 'OTP Fraud',
    href: '/otp-fraud',
    icon: Shield,
    badge: null,
    description: 'Interception & social engineering'
  },
  {
    title: 'Credit Card',
    href: '/credit-card',
    icon: BarChart3,
    badge: null,
    description: 'Card risk & validation'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    badge: null,
    description: 'System configuration'
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  collapsed,
  onOpenChange,
  onCollapsedChange
}) => {
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-card/95 backdrop-blur-md border-r border-border/50 transition-all duration-300 ease-in-out hidden lg:block",
          collapsed ? "w-16" : "w-64"
        )}
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-3"
                >
                  <div className="relative">
                    <Shield className="h-8 w-8 text-primary" />
                    <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse opacity-50" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                      FraudGuard AI
                    </span>
                    <span className="text-xs text-muted-foreground -mt-1">
                      Financial Security
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {collapsed && (
              <div className="mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start relative group transition-all duration-200",
                        collapsed ? "px-2" : "px-3",
                        isActive && "bg-primary/10 text-primary border border-primary/20"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                      
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex items-center justify-between flex-1"
                          >
                            <span className="font-medium">{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.title}
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Status Indicators */}
          <div className="p-4 border-t border-border/50 space-y-3">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">System Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-500 text-xs">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AI Models</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-green-500 text-xs">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Threats Blocked</span>
                    <span className="text-primary font-medium">1,247</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 z-50 h-full w-64 bg-card/95 backdrop-blur-md border-r border-border/50 lg:hidden"
        variants={sidebarVariants}
        initial="closed"
        animate={open ? "open" : "closed"}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  FraudGuard AI
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Financial Security
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <motion.div
                  key={item.href}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={item.href} onClick={() => onOpenChange(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-primary/10 text-primary border border-primary/20"
                      )}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div className="flex items-center justify-between flex-1">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
