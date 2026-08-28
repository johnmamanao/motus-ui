import { useEffect, useRef, type PointerEvent } from 'react';
import { gsap } from 'gsap';

export default function SpectralVeil() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: .5, y: .5, energy: 0 });

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
      width = Math.max(1, box.width); height = Math.max(1, box.height);
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      surface.style.width = `${width}px`; surface.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(host);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(host);

    const draw = () => {
      if (!visible) return;
      const time = reduced ? 1.7 : gsap.ticker.time * .18;
      const ground = context.createLinearGradient(0, 0, width, height);
      ground.addColorStop(0, '#eef8ff'); ground.addColorStop(.45, '#b5d8ff'); ground.addColorStop(1, '#8c75ff');
      context.fillStyle = ground; context.fillRect(0, 0, width, height);
      context.save(); context.globalCompositeOperation = 'screen'; context.filter = 'blur(18px)';
      for (let index = 0; index < 9; index += 1) {
        const progress = index / 8;
        const x = width * (.1 + progress * .9) + Math.sin(time + index * 1.8) * width * .08 + (pointer.current.x - .5) * width * .09 * pointer.current.energy;
        const y = height * (.25 + .48 * Math.sin(index * .77 + time * .8)) + (pointer.current.y - .5) * height * .1 * pointer.current.energy;
        const radius = Math.min(width, height) * (.16 + (index % 3) * .035);
        const glow = context.createRadialGradient(x, y, 0, x, y, radius);
        const colors = index % 3 === 0 ? ['rgba(255,255,255,.9)', 'rgba(126,255,219,.1)'] : index % 3 === 1 ? ['rgba(255,188,236,.7)', 'rgba(255,188,236,0)'] : ['rgba(113,232,255,.72)', 'rgba(113,232,255,0)'];
        glow.addColorStop(0, colors[0]); glow.addColorStop(1, colors[1]);
        context.fillStyle = glow; context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
      }
      context.restore();
      context.save(); context.globalCompositeOperation = 'overlay';
      for (let line = 0; line < 11; line += 1) {
        context.beginPath();
        for (let step = 0; step <= 80; step += 1) {
          const x = (step / 80) * width;
          const y = height * (.16 + line * .073) + Math.sin(step * .13 + line * .8 + time) * 13 + (pointer.current.x - .5) * 18 * pointer.current.energy;
          if (!step) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(255,255,255,${.16 + line * .006})`; context.lineWidth = 1; context.stroke();
      }
      context.restore();
      const shade = context.createLinearGradient(0, 0, 0, height);
      shade.addColorStop(0, 'rgba(20,20,40,.12)'); shade.addColorStop(.5, 'rgba(20,20,40,0)'); shade.addColorStop(1, 'rgba(35,22,83,.35)');
      context.fillStyle = shade; context.fillRect(0, 0, width, height);
    };
    gsap.ticker.add(draw); draw();
    return () => { gsap.ticker.remove(draw); observer.disconnect(); visibility.disconnect(); };
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    gsap.to(pointer.current, { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height, energy: 1, duration: .9, ease: 'power3.out', overwrite: true });
  };

  return <div ref={root} onPointerMove={move} onPointerLeave={() => gsap.to(pointer.current, { energy: 0, duration: 1.4 })} className="showcase-fullbleed relative h-[clamp(34rem,68cqw,46rem)] min-h-[34rem] w-full overflow-hidden bg-[#b5d8ff]" aria-label="Animated polar caustic background">
    <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center text-[#15132a]"><div><span className="font-mono text-[9px] uppercase tracking-[.2em] text-[#15132a]/45">Portfolio</span><h3 className="mt-5 text-[clamp(4rem,10vw,9rem)] font-semibold leading-[.78] tracking-[-.095em]">Selected work.</h3><p className="mx-auto mt-7 max-w-[24rem] text-[12px] leading-5 text-[#15132a]/52">A collection of web projects.</p></div></div>
  </div>;
}
