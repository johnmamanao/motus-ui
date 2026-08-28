import { useEffect, useRef, type PointerEvent } from 'react';
import { gsap } from 'gsap';

export default function MagneticHalftone() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -999, y: -999, force: 0 });

  useEffect(() => {
    const host = root.current;
    const surface = canvas.current;
    if (!host || !surface) return;
    const context = surface.getContext('2d');
    if (!context) return;

    let width = 1;
    let height = 1;
    let visible = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize = () => {
      const box = host.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio, 1.5);
      width = Math.max(1, box.width);
      height = Math.max(1, box.height);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      surface.style.width = `${width}px`;
      surface.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(host);

    const draw = () => {
      if (!visible) return;
      const time = reduced ? 2.8 : gsap.ticker.time;
      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, '#ffe59a');
      background.addColorStop(0.48, '#ff9f7c');
      background.addColorStop(1, '#65e5ce');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const spacing = Math.max(15, Math.min(23, width / 42));
      const radius = Math.min(width, height) * 0.17;
      for (let y = -spacing; y < height + spacing; y += spacing) {
        for (let x = -spacing; x < width + spacing; x += spacing) {
          const dx = x - pointer.current.x;
          const dy = y - pointer.current.y;
          const distance = Math.hypot(dx, dy) || 1;
          const magnetic = Math.max(0, 1 - distance / radius) * pointer.current.force;
          const wave = Math.sin(x * 0.014 + time * 0.72) * Math.cos(y * 0.011 - time * 0.48);
          const driftX = Math.sin(y * 0.017 + time * 0.32) * 4 + (dx / distance) * magnetic * 30;
          const driftY = wave * 8 + (dy / distance) * magnetic * 30;
          const size = Math.max(0.7, 1.4 + wave * 0.55 + magnetic * 3.2);
          const energy = Math.max(0, magnetic + (wave + 1) * 0.08);
          context.beginPath();
          context.arc(x + driftX, y + driftY, size, 0, Math.PI * 2);
          context.fillStyle =
            energy > 0.52 ? `rgba(76,29,149,${0.48 + energy * 0.34})` : `rgba(22,25,65,${0.24 + size * 0.1})`;
          context.fill();
        }
      }

      const glow = context.createRadialGradient(
        pointer.current.x,
        pointer.current.y,
        0,
        pointer.current.x,
        pointer.current.y,
        radius * 1.3,
      );
      glow.addColorStop(0, `rgba(76,245,216,${pointer.current.force * 0.32})`);
      glow.addColorStop(0.45, `rgba(255,81,145,${pointer.current.force * 0.12})`);
      glow.addColorStop(1, 'rgba(76,245,216,0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    };
    gsap.ticker.add(draw);
    draw();
    return () => {
      gsap.ticker.remove(draw);
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    gsap.to(pointer.current, {
      x: event.clientX - box.left,
      y: event.clientY - box.top,
      force: 1,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: true,
    });
  };

  return (
    <div
      ref={root}
      onPointerMove={move}
      onPointerLeave={() => gsap.to(pointer.current, { force: 0, duration: 1.1, ease: 'power2.out' })}
      className="showcase-fullbleed relative h-[clamp(34rem,68cqw,46rem)] min-h-[34rem] w-full overflow-hidden bg-[#ffbf8f]"
      aria-label="Animated magnetic halftone background"
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,.32),transparent_38%,rgba(20,20,20,.06))]"
      />
    </div>
  );
}
