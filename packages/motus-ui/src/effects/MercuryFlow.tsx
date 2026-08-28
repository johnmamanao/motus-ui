import { useEffect, useRef, type PointerEvent } from 'react';
import { gsap } from 'gsap';

export default function OpticalSilk() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.58, y: 0.46, energy: 0 });

  useEffect(() => {
    const host = root.current;
    const surface = canvas.current;
    const context = surface?.getContext('2d');
    if (!host || !surface || !context) return;
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
      const time = reduced ? 1.8 : gsap.ticker.time * 0.16;
      const base = context.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, '#f7f7f9');
      base.addColorStop(0.46, '#dfe1e8');
      base.addColorStop(1, '#b9becb');
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);
      const px = pointer.current.x * width;
      const py = pointer.current.y * height;
      for (let layer = 0; layer < 7; layer += 1) {
        const path = new Path2D();
        const offset = height * (-0.08 + layer * 0.16);
        for (let step = 0; step <= 80; step += 1) {
          const progress = step / 80;
          const x = progress * width;
          const proximity = Math.exp(-Math.pow((x - px) / (width * 0.2), 2));
          const wave =
            Math.sin(progress * Math.PI * 1.6 + time + layer * 0.72) * height * 0.13 +
            Math.cos(progress * Math.PI * 3.2 - time * 0.7 + layer) * height * 0.035;
          const bend = proximity * (py - height * 0.5) * 0.18 * pointer.current.energy * (layer % 2 ? -1 : 1);
          const y = offset + wave + bend;
          if (!step) path.moveTo(x, y);
          else path.lineTo(x, y);
        }
        const gradient = context.createLinearGradient(0, offset, width, offset + height * 0.2);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.28, layer % 2 ? 'rgba(255,255,255,.7)' : 'rgba(202,208,224,.34)');
        gradient.addColorStop(0.55, layer % 3 === 0 ? 'rgba(190,180,255,.26)' : 'rgba(255,255,255,.42)');
        gradient.addColorStop(0.78, 'rgba(143,151,170,.22)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.save();
        context.strokeStyle = gradient;
        context.lineWidth = height * (0.21 - layer * 0.012);
        context.lineCap = 'round';
        context.filter = `blur(${layer * 1.5}px)`;
        context.globalCompositeOperation = layer % 2 ? 'screen' : 'source-over';
        context.globalAlpha = 0.82;
        context.stroke(path);
        context.restore();
        context.save();
        context.strokeStyle = `rgba(255,255,255,${0.38 - layer * 0.03})`;
        context.lineWidth = 0.8;
        context.stroke(path);
        context.restore();
      }
      const lens = context.createRadialGradient(px, py, 0, px, py, width * 0.24);
      lens.addColorStop(0, `rgba(255,255,255,${0.12 + pointer.current.energy * 0.18})`);
      lens.addColorStop(0.45, 'rgba(209,217,255,.08)');
      lens.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = lens;
      context.fillRect(0, 0, width, height);
      const vignette = context.createRadialGradient(
        width * 0.5,
        height * 0.45,
        width * 0.1,
        width * 0.5,
        height * 0.5,
        width * 0.8,
      );
      vignette.addColorStop(0, 'rgba(255,255,255,0)');
      vignette.addColorStop(1, 'rgba(44,48,61,.18)');
      context.fillStyle = vignette;
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
      x: (event.clientX - box.left) / box.width,
      y: (event.clientY - box.top) / box.height,
      energy: 1,
      duration: 0.85,
      ease: 'power3.out',
      overwrite: true,
    });
  };
  return (
    <div
      ref={root}
      onPointerMove={move}
      onPointerLeave={() => gsap.to(pointer.current, { energy: 0, duration: 1.4 })}
      className="showcase-fullbleed relative h-[clamp(34rem,68cqw,46rem)] min-h-[34rem] w-full overflow-hidden bg-[#dfe1e8]"
      aria-label="Interactive optical silk background"
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  );
}
