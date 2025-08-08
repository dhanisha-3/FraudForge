import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  gradient?: string;
  className?: string;
  centered?: boolean;
  icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  badge,
  gradient = 'from-blue-400 via-purple-500 to-cyan-400',
  className,
  centered = true,
  icon
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        'space-y-4',
        centered && 'text-center',
        className
      )}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cn('flex', centered && 'justify-center')}
        >
          <Badge variant="secondary" className="text-xs font-medium">
            {badge}
          </Badge>
        </motion.div>
      )}

      <div className={cn('space-y-2', centered && 'mx-auto max-w-4xl')}>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm font-medium text-primary uppercase tracking-wider"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={cn('flex items-center gap-3', centered && 'justify-center')}
        >
          {icon && (
            <div className="text-primary">
              {icon}
            </div>
          )}
          <h2 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
            gradient
          )}>
            {title}
          </h2>
        </motion.div>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={cn(
              'text-lg text-muted-foreground leading-relaxed',
              centered && 'max-w-2xl mx-auto'
            )}
          >
            {description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export { SectionHeader };
