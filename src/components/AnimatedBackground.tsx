import React, { useEffect, useState, useRef, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'sphere' | 'cube' | 'triangle' | 'star';
  trail: { x: number; y: number }[];
}

interface Connection {
  particle1: Particle;
  particle2: Particle;
  distance: number;
  opacity: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const colors = [
    '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
    '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#84cc16'
  ];

  const createParticle = useCallback((index: number): Particle => {
    return {
      id: index,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      z: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      vz: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 1000 + 500,
      type: ['sphere', 'cube', 'triangle', 'star'][Math.floor(Math.random() * 4)] as Particle['type'],
      trail: []
    };
  }, [colors, dimensions]);

  // Initialize canvas and particles
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const particleCount = Math.min(150, Math.floor((dimensions.width * dimensions.height) / 8000));
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => createParticle(i));
    }
  }, [createParticle, dimensions]);

  // Mouse interaction handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsInteracting(false);
  }, []);

  // Update particles with physics and interactions
  const updateParticles = useCallback(() => {
    if (!dimensions.width || !dimensions.height) return;

    particlesRef.current.forEach(particle => {
      // Add current position to trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 10) {
        particle.trail.shift();
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
      particle.life += 1;

      // Mouse interaction with attractive/repulsive force
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150 && isInteracting) {
        const force = (150 - distance) / 150;
        const attraction = distance < 50 ? -1 : 1; // Repel when very close, attract otherwise

        particle.vx += (dx / distance) * force * 0.05 * attraction;
        particle.vy += (dy / distance) * force * 0.05 * attraction;
        particle.size = Math.min(particle.size * 1.01, 8);
        particle.opacity = Math.min(particle.opacity * 1.05, 1);
      } else {
        particle.size = Math.max(particle.size * 0.995, 1);
        particle.opacity = Math.max(particle.opacity * 0.998, 0.3);
      }

      // Add some turbulence
      particle.vx += (Math.random() - 0.5) * 0.02;
      particle.vy += (Math.random() - 0.5) * 0.02;

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      particle.vz *= 0.99;

      // Boundary wrapping with smooth transition
      if (particle.x < -50) particle.x = dimensions.width + 50;
      if (particle.x > dimensions.width + 50) particle.x = -50;
      if (particle.y < -50) particle.y = dimensions.height + 50;
      if (particle.y > dimensions.height + 50) particle.y = -50;
      if (particle.z < 0) particle.z = 1000;
      if (particle.z > 1000) particle.z = 0;

      // Respawn particle if life exceeded
      if (particle.life > particle.maxLife) {
        Object.assign(particle, createParticle(particle.id));
      }
    });
  }, [createParticle, isInteracting, dimensions]);

  // Update connections between nearby particles
  const updateConnections = useCallback(() => {
    connectionsRef.current = [];
    const maxDistance = 120;
    const maxConnections = 200; // Limit for performance

    for (let i = 0; i < particlesRef.current.length && connectionsRef.current.length < maxConnections; i++) {
      for (let j = i + 1; j < particlesRef.current.length && connectionsRef.current.length < maxConnections; j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.4;
          connectionsRef.current.push({
            particle1: p1,
            particle2: p2,
            distance,
            opacity
          });
        }
      }
    }
  }, []);

  // Draw particle with 3D effects and trails
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, z, size, opacity, color, type, trail } = particle;

    // 3D perspective calculation
    const perspective = 1000;
    const scale = perspective / (perspective + z);
    const projectedSize = size * scale;
    const alpha = opacity * scale;

    // Draw trail
    if (trail.length > 1) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < trail.length; i++) {
        const trailAlpha = (i / trail.length) * alpha * 0.3;
        ctx.globalAlpha = trailAlpha;

        if (i === 0) {
          ctx.moveTo(trail[i].x, trail[i].y);
        } else {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw particle
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Add glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = projectedSize * 3;

    switch (type) {
      case 'sphere':
        ctx.beginPath();
        ctx.arc(x, y, projectedSize, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'cube':
        const halfSize = projectedSize / 2;
        ctx.fillRect(x - halfSize, y - halfSize, projectedSize, projectedSize);
        ctx.strokeRect(x - halfSize, y - halfSize, projectedSize, projectedSize);
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - projectedSize);
        ctx.lineTo(x - projectedSize, y + projectedSize);
        ctx.lineTo(x + projectedSize, y + projectedSize);
        ctx.closePath();
        ctx.fill();
        break;

      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const outerRadius = projectedSize;
          const innerRadius = projectedSize * 0.4;

          if (i === 0) {
            ctx.moveTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
          } else {
            ctx.lineTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
          }

          const innerAngle = angle + Math.PI / 5;
          ctx.lineTo(x + Math.cos(innerAngle) * innerRadius, y + Math.sin(innerAngle) * innerRadius);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  }, []);

  // Draw connections with animated gradients
  const drawConnections = useCallback((ctx: CanvasRenderingContext2D) => {
    connectionsRef.current.forEach(connection => {
      const { particle1, particle2, opacity } = connection;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1;

      // Create animated gradient
      const gradient = ctx.createLinearGradient(
        particle1.x, particle1.y,
        particle2.x, particle2.y
      );
      gradient.addColorStop(0, particle1.color);
      gradient.addColorStop(0.5, '#ffffff');
      gradient.addColorStop(1, particle2.color);
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(particle1.x, particle1.y);
      ctx.lineTo(particle2.x, particle2.y);
      ctx.stroke();
      ctx.restore();
    });
  }, []);

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas with fade effect for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update physics
    updateParticles();
    updateConnections();

    // Draw connections first (behind particles)
    drawConnections(ctx);

    // Draw particles with effects
    particlesRef.current.forEach(particle => {
      drawParticle(ctx, particle);
    });

    // Draw mouse interaction effect
    if (isInteracting) {
      ctx.save();
      ctx.globalAlpha = 0.1;

      // Create radial gradient for mouse effect
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 150
      );
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, updateConnections, drawConnections, drawParticle, isInteracting]);

  // Setup canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, animate, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Interactive 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Additional Static Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'grid-move 20s linear infinite'
            }}
          />
        </div>

        {/* Floating Geometric Shapes */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            <div
              className={`w-${4 + Math.floor(Math.random() * 8)} h-${4 + Math.floor(Math.random() * 8)}
                         bg-gradient-to-br from-blue-400/20 to-purple-400/20
                         border border-blue-400/30 transform rotate-45`}
              style={{
                animation: `spin ${10 + Math.random() * 20}s linear infinite`
              }}
            />
          </div>
        ))}

        {/* Scanning Lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={`scan-${i}`}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
              style={{
                top: `${20 + i * 30}%`,
                animation: `scan ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 1}s`
              }}
            />
          ))}
        </div>

        {/* Holographic Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"
          style={{
            animation: 'pulse 8s ease-in-out infinite',
            mixBlendMode: 'overlay'
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;
