import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface AnimatedLineGraphProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  gradient?: boolean;
}

interface AnimatedBarGraphProps {
  data: { label: string; value: number; color?: string }[];
  width?: number;
  height?: number;
  animate?: boolean;
  showValues?: boolean;
}

interface AnimatedPieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  animate?: boolean;
  showLabels?: boolean;
}

interface AnimatedHeatmapProps {
  data: number[][];
  width?: number;
  height?: number;
  colorScale?: [string, string];
  animate?: boolean;
}

// Animated Line Graph Component
export const AnimatedLineGraph: React.FC<AnimatedLineGraphProps> = ({
  data,
  width = 400,
  height = 200,
  color = "hsl(var(--primary))",
  strokeWidth = 3,
  showDots = true,
  showGrid = true,
  animate = true,
  gradient = false
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimationProgress(1), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate]);

  if (data.length === 0) return null;

  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  const minX = Math.min(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));

  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * (width - 40) + 20;
  const scaleY = (y: number) => height - 20 - ((y - minY) / (maxY - minY)) * (height - 40);

  const pathData = data.map((point, index) => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
        )}

        {/* Grid */}
        {showGrid && (
          <g opacity="0.3">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <motion.line
                key={`h-${i}`}
                x1={20}
                y1={20 + ratio * (height - 40)}
                x2={width - 20}
                y2={20 + ratio * (height - 40)}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animationProgress }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <motion.line
                key={`v-${i}`}
                x1={20 + ratio * (width - 40)}
                y1={20}
                x2={20 + ratio * (width - 40)}
                y2={height - 20}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animationProgress }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </g>
        )}

        {/* Gradient fill */}
        {gradient && (
          <motion.path
            d={`${pathData} L ${scaleX(data[data.length - 1].x)} ${height - 20} L ${scaleX(data[0].x)} ${height - 20} Z`}
            fill={`url(#${gradientId})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animationProgress }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}

        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animationProgress }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />

        {/* Data points */}
        {showDots && data.map((point, index) => (
          <motion.circle
            key={index}
            cx={scaleX(point.x)}
            cy={scaleY(point.y)}
            r="4"
            fill={point.color || color}
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: animationProgress, 
              opacity: animationProgress 
            }}
            transition={{ 
              duration: 0.3, 
              delay: (index / data.length) * 2 
            }}
            whileHover={{ scale: 1.5 }}
            style={{
              filter: `drop-shadow(0 0 4px ${point.color || color})`
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Animated Bar Graph Component
export const AnimatedBarGraph: React.FC<AnimatedBarGraphProps> = ({
  data,
  width = 400,
  height = 200,
  animate = true,
  showValues = true
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimationProgress(1), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate]);

  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - 40) / data.length - 10;
  const chartHeight = height - 60;

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = 20 + index * (barWidth + 10);
          const y = height - 40 - barHeight;

          return (
            <g key={index}>
              {/* Bar */}
              <motion.rect
                x={x}
                y={height - 40}
                width={barWidth}
                height={0}
                fill={item.color || "hsl(var(--primary))"}
                rx="4"
                initial={{ height: 0 }}
                animate={{ 
                  height: barHeight * animationProgress,
                  y: y + (1 - animationProgress) * barHeight
                }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                style={{
                  filter: `drop-shadow(0 4px 8px ${item.color || "hsl(var(--primary))"}40)`
                }}
              />

              {/* Value label */}
              {showValues && (
                <motion.text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-current"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationProgress }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                >
                  {item.value}
                </motion.text>
              )}

              {/* Label */}
              <motion.text
                x={x + barWidth / 2}
                y={height - 20}
                textAnchor="middle"
                className="text-xs fill-current text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: animationProgress }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                {item.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Animated Pie Chart Component
export const AnimatedPieChart: React.FC<AnimatedPieChartProps> = ({
  data,
  size = 200,
  animate = true,
  showLabels = true
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimationProgress(1), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate]);

  if (data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const center = size / 2;

  let currentAngle = -90; // Start from top

  return (
    <div className="relative">
      <svg width={size} height={size} className="overflow-visible">
        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          currentAngle += angle;

          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;

          const x1 = center + radius * Math.cos(startAngleRad);
          const y1 = center + radius * Math.sin(startAngleRad);
          const x2 = center + radius * Math.cos(endAngleRad);
          const y2 = center + radius * Math.sin(endAngleRad);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          // Label position
          const labelAngle = (startAngle + endAngle) / 2;
          const labelAngleRad = (labelAngle * Math.PI) / 180;
          const labelRadius = radius + 30;
          const labelX = center + labelRadius * Math.cos(labelAngleRad);
          const labelY = center + labelRadius * Math.sin(labelAngleRad);

          return (
            <g key={index}>
              <motion.path
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animationProgress }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  filter: `brightness(1.1) drop-shadow(0 0 10px ${item.color})`
                }}
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  filter: `drop-shadow(0 2px 4px ${item.color}40)`
                }}
              />

              {showLabels && percentage > 0.05 && (
                <motion.text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-current"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: animationProgress, 
                    scale: animationProgress 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.2 + 0.5 
                  }}
                >
                  {item.label}
                </motion.text>
              )}

              {/* Percentage in center for single slice or small chart */}
              {data.length === 1 && (
                <motion.text
                  x={center}
                  y={center}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-bold fill-current"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: animationProgress, 
                    scale: animationProgress 
                  }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {(percentage * 100).toFixed(1)}%
                </motion.text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Animated Heatmap Component
export const AnimatedHeatmap: React.FC<AnimatedHeatmapProps> = ({
  data,
  width = 400,
  height = 200,
  colorScale = ["hsl(var(--muted))", "hsl(var(--primary))"],
  animate = true
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimationProgress(1), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate]);

  if (data.length === 0) return null;

  const rows = data.length;
  const cols = data[0].length;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  const flatData = data.flat();
  const maxValue = Math.max(...flatData);
  const minValue = Math.min(...flatData);

  const getColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    // Simple linear interpolation between colors
    return normalized > 0.5 ? colorScale[1] : colorScale[0];
  };

  const getOpacity = (value: number) => {
    return (value - minValue) / (maxValue - minValue);
  };

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {data.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <motion.rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * cellWidth}
              y={rowIndex * cellHeight}
              width={cellWidth}
              height={cellHeight}
              fill={getColor(value)}
              opacity={getOpacity(value) * animationProgress}
              stroke="white"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: getOpacity(value) * animationProgress,
                scale: animationProgress
              }}
              transition={{ 
                duration: 0.5, 
                delay: (rowIndex * cols + colIndex) * 0.02 
              }}
              whileHover={{ 
                scale: 1.1,
                opacity: 1,
                transition: { duration: 0.1 }
              }}
            />
          ))
        )}
      </svg>
    </div>
  );
};

// Animated Gauge Component
interface AnimatedGaugeProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
  label?: string;
  animate?: boolean;
}

export const AnimatedGauge: React.FC<AnimatedGaugeProps> = ({
  value,
  max,
  size = 150,
  color = "hsl(var(--primary))",
  label,
  animate = true
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimationProgress(1), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animate]);

  const radius = size / 2 - 20;
  const center = size / 2;
  const circumference = Math.PI * radius; // Half circle
  const percentage = (value / max) * animationProgress;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage * circumference);

  return (
    <div className="relative">
      <svg width={size} height={size / 2 + 40} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M 20 ${center} A ${radius} ${radius} 0 0 1 ${size - 20} ${center}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <motion.path
          d={`M 20 ${center} A ${radius} ${radius} 0 0 1 ${size - 20} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${color})`
          }}
        />

        {/* Center value */}
        <motion.text
          x={center}
          y={center + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-current"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: animationProgress, scale: animationProgress }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {(value * animationProgress).toFixed(0)}
        </motion.text>

        {label && (
          <motion.text
            x={center}
            y={center + 30}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-current text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationProgress }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {label}
          </motion.text>
        )}
      </svg>
    </div>
  );
};
