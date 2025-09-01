"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  quadrant?: number;
}

interface QuadrantBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

class SpatialGrid {
  private grid: Map<string, Particle[]>;
  private cellSize: number;
  private width: number;
  private height: number;

  constructor(width: number, height: number, cellSize: number = 100) {
    this.grid = new Map();
    this.cellSize = cellSize;
    this.width = width;
    this.height = height;
  }

  private getKey(x: number, y: number): string {
    const gridX = Math.floor(x / this.cellSize);
    const gridY = Math.floor(y / this.cellSize);
    return `${gridX},${gridY}`;
  }

  clear() {
    this.grid.clear();
  }

  insert(particle: Particle) {
    const key = this.getKey(particle.x, particle.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(particle);
  }

  getNearby(particle: Particle): Particle[] {
    const nearby: Particle[] = [];
    const centerKey = this.getKey(particle.x, particle.y);
    const [centerX, centerY] = centerKey.split(',').map(Number);

    // Check surrounding cells (3x3 grid)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${centerX + dx},${centerY + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          nearby.push(...cell);
        }
      }
    }

    return nearby;
  }
}

export default function ParticleCanvasOptimized() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const spatialGridRef = useRef<SpatialGrid | null>(null);
  
  // Performance tracking
  const frameTimeRef = useRef(0);
  const lastFrameTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isActive = true;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      spatialGridRef.current = new SpatialGrid(canvas.width, canvas.height, 100);
    };

    const createParticle = (x?: number, y?: number): Particle => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5, // Smaller particles for mobile performance
        speedX: (Math.random() - 0.5) * 1.5, // Reduced speed for smoother performance
        speedY: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.4 + 0.2,
        hue: Math.random() * 30 + 160, // HyperLiquid teal range
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    };

    const initParticles = () => {
      particlesRef.current = [];
      // Reduce particle count for mobile performance
      const isMobile = window.innerWidth < 768;
      const particleCount = Math.min(
        isMobile ? 15 : 25, 
        Math.floor(canvas.width * canvas.height / 25000)
      );
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const updateParticles = () => {
      if (!spatialGridRef.current) return;
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const spatialGrid = spatialGridRef.current;

      spatialGrid.clear();

      // Update positions and insert into spatial grid
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Optimized mouse attraction with distance threshold
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distanceSq = dx * dx + dy * dy; // Use squared distance to avoid sqrt
        
        if (distanceSq < 22500) { // 150^2
          const distance = Math.sqrt(distanceSq);
          const force = (150 - distance) / 150 * 0.3; // Reduced force
          particle.speedX += dx / distance * force * 0.05;
          particle.speedY += dy / distance * force * 0.05;
        }
        
        // Update life and opacity
        particle.life++;
        particle.opacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.5;
        
        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Remove dead particles and create new ones
        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
          particles.push(createParticle());
        } else {
          // Limit speed
          particle.speedX = Math.max(-2, Math.min(2, particle.speedX * 0.98));
          particle.speedY = Math.max(-2, Math.min(2, particle.speedY * 0.98));
          
          // Insert into spatial grid
          spatialGrid.insert(particle);
        }
      }
    };

    const drawParticles = () => {
      if (!spatialGridRef.current) return;
      
      const particles = particlesRef.current;
      const spatialGrid = spatialGridRef.current;
      
      // Clear canvas with subtle fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw optimized connections using spatial grid
      ctx.strokeStyle = "rgba(151, 252, 228, 0.08)";
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const nearby = spatialGrid.getNearby(particle);
        
        for (const other of nearby) {
          if (particle === other) continue;
          
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distanceSq = dx * dx + dy * dy;
          
          // Use squared distance for better performance
          if (distanceSq < 4900) { // 70^2
            const distance = Math.sqrt(distanceSq);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.globalAlpha = (70 - distance) / 70 * 0.1;
            ctx.stroke();
          }
        }
      }
      
      // Draw particles with cached gradients
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Simplified particle rendering for performance
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
    };

    const animate = (currentTime: number) => {
      if (!isActive) return;
      
      // Adaptive frame rate control
      const deltaTime = currentTime - lastFrameTime.current;
      lastFrameTime.current = currentTime;
      
      // Skip frame if running too fast (adaptive performance)
      if (deltaTime < 16) { // ~60fps max
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initialize
    resizeCanvas();
    initParticles();
    
    // Start animation after a delay for better initial load performance
    setTimeout(() => {
      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }, 2500);
    
    // Event listeners with passive options for better performance
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      isActive = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion && canvasRef.current) {
      canvasRef.current.style.display = "none";
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        mixBlendMode: "screen",
        willChange: "transform" // Optimize for animations
      }}
    />
  );
}