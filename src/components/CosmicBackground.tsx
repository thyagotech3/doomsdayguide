import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = Math.min(Math.floor((width * height) / 12000), 75);
    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      alphaSpeed: number;
    }

    const particles: Particle[] = [];
    const colors = [
      'rgba(16, 185, 129, ', // emerald
      'rgba(52, 211, 153, ', // light emerald
      'rgba(226, 232, 240, ', // silver slate
      'rgba(148, 163, 184, ', // titanium
      'rgba(5, 150, 105, ',  // deep emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep space base
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#06130d');
      bgGrad.addColorStop(0.4, '#040b08');
      bgGrad.addColorStop(1, '#020403');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Emerald Nebula pulse
      const nebulaX = width / 2 + Math.sin(tick * 0.005) * 40;
      const nebulaY = height * 0.35 + Math.cos(tick * 0.004) * 30;
      const nebulaGrad = ctx.createRadialGradient(
        nebulaX,
        nebulaY,
        10,
        nebulaX,
        nebulaY,
        width * 0.6
      );
      nebulaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.09)');
      nebulaGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.03)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Secondary Silver Nebula pulse
      const silverX = width * 0.8 + Math.cos(tick * 0.006) * 30;
      const silverY = height * 0.75 + Math.sin(tick * 0.005) * 20;
      const silverGrad = ctx.createRadialGradient(
        silverX,
        silverY,
        10,
        silverX,
        silverY,
        width * 0.45
      );
      silverGrad.addColorStop(0, 'rgba(203, 213, 225, 0.05)');
      silverGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = silverGrad;
      ctx.fillRect(0, 0, width, height);

      // Render cosmic particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha > 0.9 || p.alpha < 0.2) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.1, Math.min(1, p.alpha))})`;
        ctx.shadowBlur = p.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = '#10b981';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.95 }}
      />
      {/* Sleek Interface Dot Grid Matrix */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 sleek-dot-grid" />
      {/* Sleek Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.07) 0%, transparent 65%)',
        }}
      />
      {/* Subtle Background Sleek Watermark */}
      <div className="fixed top-12 right-6 sm:right-16 text-right opacity-[0.035] pointer-events-none select-none z-0 hidden lg:block">
        <div className="text-[140px] font-black leading-none text-slate-100 tracking-tighter">DOOM</div>
        <div className="text-3xl font-bold text-emerald-400 tracking-[0.8em] -mt-8 mr-2">PROTOCOL</div>
      </div>
    </>
  );
};
