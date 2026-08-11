import React, { useEffect, useRef } from 'react';

export type GlobalWeatherMode = 'clear' | 'rain' | 'snow' | 'storm';

interface GlobalWeatherOverlayProps {
  mode: GlobalWeatherMode;
}

export const GlobalWeatherOverlay: React.FC<GlobalWeatherOverlayProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool setup
    const particleCount = mode === 'storm' ? 320 : mode === 'rain' ? 220 : mode === 'snow' ? 180 : 120;
    
    interface Particle {
      x: number;
      y: number;
      length: number;
      speedY: number;
      speedX: number;
      size: number;
      opacity: number;
      swing: number;
      swingSpeed: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speedY: mode === 'storm' ? Math.random() * 15 + 18 : mode === 'rain' ? Math.random() * 10 + 10 : mode === 'snow' ? Math.random() * 1.5 + 0.8 : Math.random() * 0.6 + 0.3,
        speedX: mode === 'storm' ? Math.random() * 3 - 4 : mode === 'rain' ? Math.random() * 1 - 1.5 : mode === 'snow' ? Math.random() * 0.8 - 0.4 : Math.random() * 0.4 - 0.2,
        size: mode === 'snow' ? Math.random() * 3.5 + 1.5 : mode === 'clear' ? Math.random() * 3 + 1.5 : Math.random() * 1.5 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // Splash ripple pool for rain/storm
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }
    const ripples: Ripple[] = [];

    let lightningTimer = 0;
    let lightningFlashOpacity = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Weather Atmospheric Ambient Lighting Tint over whole app page
      if (mode === 'rain') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.25)');
        bgGrad.addColorStop(1, 'rgba(30, 58, 138, 0.15)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (mode === 'storm') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, 'rgba(8, 12, 24, 0.45)');
        bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0.35)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Lightning flash effect
        lightningTimer++;
        if (lightningTimer > 280 && Math.random() < 0.04) {
          lightningFlashOpacity = 0.35 + Math.random() * 0.25;
          lightningTimer = 0;
        }
        if (lightningFlashOpacity > 0) {
          ctx.fillStyle = `rgba(224, 231, 255, ${lightningFlashOpacity})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlashOpacity -= 0.03;
        }
      } else if (mode === 'snow') {
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, width);
        bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
        bgGrad.addColorStop(1, 'rgba(186, 230, 253, 0.12)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (mode === 'clear') {
        const bgGrad = ctx.createRadialGradient(width / 2, 0, 50, width / 2, height / 2, width);
        bgGrad.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
        bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render & Update Weather Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mode === 'rain' || mode === 'storm') {
          // Rain streak
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 3, p.y + p.length);
          ctx.strokeStyle = mode === 'storm' ? `rgba(186, 230, 253, ${p.opacity})` : `rgba(147, 197, 253, ${p.opacity * 0.85})`;
          ctx.lineWidth = mode === 'storm' ? 1.8 : 1.2;
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;

          // Splash ripple on ground/footer boundary
          if (p.y >= height - 20) {
            if (Math.random() < 0.3) {
              ripples.push({
                x: p.x,
                y: height - Math.random() * 15,
                radius: 1,
                maxRadius: Math.random() * 12 + 6,
                opacity: 0.6,
              });
            }
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else if (mode === 'snow') {
          // Snowflake
          p.swing += p.swingSpeed;
          p.x += Math.sin(p.swing) * 0.8 + p.speedX;
          p.y += p.speedY;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;

          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (mode === 'clear') {
          // Warm golden sunlight embers floating upwards/ambiently
          p.swing += p.swingSpeed;
          p.x += Math.cos(p.swing) * 0.5 + p.speedX;
          p.y -= p.speedY * 0.5;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 208, 110, ${p.opacity * 0.75})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.9)';
          ctx.fill();
          ctx.shadowBlur = 0;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
      }

      // 3. Render Splash Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${rip.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        rip.radius += 0.8;
        rip.opacity -= 0.035;

        if (rip.opacity <= 0) {
          ripples.splice(r, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      style={{ mixBlendMode: mode === 'clear' ? 'screen' : 'normal' }}
    />
  );
};
