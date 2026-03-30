import { useEffect, useRef } from 'react';

export function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Track theme and smooth interpolation
    let isDark = document.documentElement.classList.contains('dark');
    let themeProgress = isDark ? 1 : 0; // 0 = Light (Black particles), 1 = Dark (White particles)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          isDark = document.documentElement.classList.contains('dark');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Particle system
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseOpacity: number;
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1; // 1.0 to 3.0 radius
        this.baseOpacity = Math.random() * 0.5 + 0.5; // 0.5 to 1.0 opacity
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += 0.015; // Slow pulsing

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw(themeColor: { r: number, g: number, b: number }, mouseX: number, mouseY: number) {
        if (!ctx) return;

        // Interaction
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        let interactionOpacity = 0;
        let interactionScale = 1;

        if (distToMouse < 250) {
          const factor = 1 - distToMouse / 250;
          interactionOpacity = 0.6 * factor;
          interactionScale = 1 + factor * 0.8; // Noticeable grow
        }

        // Pulse logic
        const pulse = (Math.sin(this.pulsePhase) + 1) * 0.25; // 0 to 0.5
        
        // Final calculations
        const finalOpacity = Math.min(1, this.baseOpacity + pulse + interactionOpacity);
        const finalRadius = this.radius * interactionScale;

        ctx.beginPath();
        ctx.arc(this.x, this.y, finalRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${finalOpacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 8), 180); // Increased density
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    // Animation loop
    const animate = () => {
      // Smooth color interpolation
      const targetProgress = isDark ? 1 : 0;
      themeProgress += (targetProgress - themeProgress) * 0.05; // Ease transition
      
      const rgbValue = Math.round(themeProgress * 255);
      const themeColor = { r: rgbValue, g: rgbValue, b: rgbValue };

      // Clear the canvas cleanly instead of filling with transparent color for strict monochrome look
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.update();
        particle.draw(themeColor, mouseX, mouseY);

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            // Pulse propagation
            const combinedPulse = (Math.sin(particle.pulsePhase + otherParticle.pulsePhase) + 1) * 0.15;
            
            // Mouse connection logic
            const midX = (particle.x + otherParticle.x) / 2;
            const midY = (particle.y + otherParticle.y) / 2;
            const midDx = midX - mouseX;
            const midDy = midY - mouseY;
            const distToMouse = Math.sqrt(midDx * midDx + midDy * midDy);
            
            let interactionOpacity = 0;
            if (distToMouse < 250) {
              interactionOpacity = 0.5 * (1 - distToMouse / 250);
            }

            const baseEdgeOpacity = 0.3 * (1 - distance / 180);
            const finalEdgeOpacity = Math.min(1, baseEdgeOpacity + combinedPulse + interactionOpacity);

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${finalEdgeOpacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-80 transition-opacity duration-500"
      style={{ zIndex: 0 }}
    />
  );
}
