import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audio';

interface FireworksOverlayProps {
  active: boolean;
  onFinish?: () => void;
  durationMs?: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  gravity: number;
}

export const FireworksOverlay: React.FC<FireworksOverlayProps> = ({
  active,
  onFinish,
  durationMs = 6000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

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

    const sparks: Spark[] = [];
    const colors = ['#f1c40f', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#e67e22', '#ff007f', '#00f0ff'];

    const createExplosion = (x: number, y: number) => {
      soundEngine.playFireworkSound();
      const sparkCount = 80 + Math.floor(Math.random() * 40);
      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: baseColor,
          size: Math.random() * 3 + 2,
          gravity: 0.12,
        });
      }
    };

    // Auto trigger initial fireworks bursts
    createExplosion(width * 0.5, height * 0.35);
    createExplosion(width * 0.3, height * 0.25);
    createExplosion(width * 0.7, height * 0.28);

    let launchInterval = setInterval(() => {
      const rx = Math.random() * (width * 0.8) + width * 0.1;
      const ry = Math.random() * (height * 0.4) + height * 0.15;
      createExplosion(rx, ry);
    }, 600);

    let timeoutId = setTimeout(() => {
      clearInterval(launchInterval);
      if (onFinish) onFinish();
    }, durationMs);

    const render = () => {
      ctx.fillStyle = 'rgba(2, 4, 10, 0.2)';
      ctx.fillRect(0, 0, width, height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.alpha -= 0.015;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(launchInterval);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, durationMs, onFinish]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
