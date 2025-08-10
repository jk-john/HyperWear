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
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x?: number, y?: number): Particle => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 30 + 160, // HyperLiquid teal range (160-190)
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    };

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(30, Math.floor(canvas.width * canvas.height / 20000));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Mouse attraction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.5;
          particle.speedX += dx / distance * force * 0.1;
          particle.speedY += dy / distance * force * 0.1;
        }
        
        // Update life and opacity
        particle.life++;
        particle.opacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.6;
        
        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
          particles.push(createParticle());
        }
        
        // Limit speed
        particle.speedX = Math.max(-3, Math.min(3, particle.speedX * 0.99));
        particle.speedY = Math.max(-3, Math.min(3, particle.speedY * 0.99));
      }
    };

    const drawParticles = () => {
      const particles = particlesRef.current;
      
      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = "rgba(151, 252, 228, 0.1)";
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = (80 - distance) / 80 * 0.15;
            ctx.stroke();
          }
        }
      }
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
    };

    const animate = () => {
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
    
    // Add a delay before starting animation to improve page load performance
    setTimeout(() => {
      animate();
    }, 2500);
    
    // Event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
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
      style={{ mixBlendMode: "screen" }}
    />
  );
}