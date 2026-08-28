'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const variants = [
  { id: 'lift', label: 'Lift' },
  { id: 'hinge', label: 'Hinge' },
  { id: 'drift', label: 'Drift' },
  { id: 'ripple', label: 'Ripple' },
  { id: 'stretch', label: 'Stretch' },
  { id: 'cascade', label: 'Cascade' },
  { id: 'magnet', label: 'Magnet' },
  { id: 'arc', label: 'Arc' },
  { id: 'roll', label: 'Roll' },
  { id: 'echo', label: 'Echo' },
  { id: 'shutter', label: 'Shutter' },
  { id: 'orbit', label: 'Orbit' },
  { id: 'weight', label: 'Weight' },
  { id: 'sweep', label: 'Sweep' },
  { id: 'scatter', label: 'Scatter' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'drop', label: 'Drop' },
  { id: 'fan', label: 'Fan' },
  { id: 'ticker', label: 'Ticker' },
] as const;

export type TextMotionVariant = (typeof variants)[number]['id'];

export function TextMotion({ text = 'SELECTED WORK', alternateText = 'CREATIVE CODE', variant = 'lift' }: { text?: string; alternateText?: string; variant?: TextMotionVariant }) {
  const root = useRef<HTMLSpanElement>(null);
  const activeVariant = variants.find((item) => item.id === variant) ?? variants[0];

  useLayoutEffect(() => {
    const letters = root.current?.querySelectorAll<HTMLElement>('[data-text-letter]');
    if (!letters?.length) return;
    const tickerTargets = root.current?.querySelectorAll<HTMLElement>('[data-ticker-to]') ?? [];
    const tickerCells = root.current?.querySelectorAll<HTMLElement>('[data-ticker-dynamic]') ?? [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const center = (letters.length - 1) / 2;
    const id: TextMotionVariant = activeVariant.id;
    gsap.killTweensOf(letters);
    gsap.set(letters, { clearProps: 'transform,opacity,filter,textShadow,clipPath,transformOrigin,fontWeight' });

    if (id === 'ticker') {
      const fontSize = Number.parseFloat(getComputedStyle(root.current!).fontSize) || 16;
      tickerCells.forEach((cell) => {
        const from = cell.querySelector<HTMLElement>('[data-ticker-measure-from]')?.getBoundingClientRect().width ?? fontSize * .62;
        const to = cell.querySelector<HTMLElement>('[data-ticker-measure-to]')?.getBoundingClientRect().width ?? fontSize * .62;
        cell.dataset.tickerFromWidth = String(from / fontSize);
        cell.dataset.tickerToWidth = String(to / fontSize);
      });
      gsap.set(tickerCells, { width: (_, element) => `${(element as HTMLElement).dataset.tickerFromWidth}em` });
      gsap.set(tickerTargets, { clearProps: 'transform,opacity' });
      gsap.set(letters, { rotateX: 0, yPercent: 0, visibility: 'visible', transformOrigin: '50% 50%', backfaceVisibility: 'hidden' });
      gsap.set(tickerTargets, { rotateX: 90, yPercent: 6, visibility: 'hidden', transformOrigin: '50% 50%', backfaceVisibility: 'hidden' });
    }

    if (reduced) {
      gsap.set(letters, { opacity: 1 });
      return;
    }

    const intro = gsap.timeline();
    const loop = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 1.35 });

    if (id === 'lift') {
      intro.fromTo(letters, { yPercent: 125, rotateX: -80, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: .86, stagger: .035, ease: 'power4.out' });
      loop.to(letters, { y: (index) => Math.sin(index * .86) * 11, rotateZ: (index) => Math.sin(index * .72) * 3, duration: .48, stagger: { each: .028, from: 'center' }, ease: 'power3.inOut' })
        .to(letters, { y: 0, rotateZ: 0, duration: .72, stagger: { each: .024, from: 'center' }, ease: 'elastic.out(1,.72)' });
    }

    if (id === 'hinge') {
      intro.fromTo(letters, { rotateX: -105, yPercent: 28, opacity: 0, transformOrigin: '50% 100%' }, { rotateX: 0, yPercent: 0, opacity: 1, duration: .72, stagger: .045, ease: 'back.out(1.8)' });
      loop.to(letters, { rotateX: -90, yPercent: -28, opacity: 0, duration: .32, stagger: .04, ease: 'power3.in' })
        .set(letters, { rotateX: 90, yPercent: 28 })
        .to(letters, { rotateX: 0, yPercent: 0, opacity: 1, duration: .48, stagger: .04, ease: 'power4.out' });
    }

    if (id === 'drift') {
      intro.fromTo(letters, { x: (index) => (index % 2 ? 1 : -1) * (32 + index * 3), y: (index) => ((index % 3) - 1) * 42, rotateZ: (index) => (index % 2 ? 1 : -1) * (8 + index), opacity: 0 }, { x: 0, y: 0, rotateZ: 0, opacity: 1, duration: .95, stagger: { each: .028, from: 'random' }, ease: 'expo.out' });
      loop.to(letters, { x: (index) => Math.cos(index * .9) * 8, y: (index) => Math.sin(index * 1.1) * 9, rotateZ: (index) => Math.sin(index) * 4, duration: .5, stagger: { each: .025, from: 'random' }, ease: 'power3.inOut' })
        .to(letters, { x: 0, y: 0, rotateZ: 0, duration: .78, stagger: { each: .02, from: 'random' }, ease: 'elastic.out(1,.68)' });
    }

    if (id === 'ripple') {
      intro.fromTo(letters, { y: 24, scale: .48, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .7, stagger: { each: .045, from: 'center' }, ease: 'back.out(2.2)' });
      loop.to(letters, { y: (index) => Math.sin((index - center) * .9) * 14, scale: (index) => 1 + Math.max(0, 1 - Math.abs(index - center) / 6) * .16, duration: .42, stagger: { each: .025, from: 'center' }, ease: 'sine.inOut' })
        .to(letters, { y: 0, scale: 1, duration: .68, stagger: { each: .025, from: 'center' }, ease: 'elastic.out(1,.68)' });
    }

    if (id === 'stretch') {
      intro.fromTo(letters, { scaleX: .12, scaleY: 1.65, opacity: 0, transformOrigin: '50% 100%' }, { scaleX: 1, scaleY: 1, opacity: 1, duration: .82, stagger: .04, ease: 'elastic.out(1,.72)' });
      loop.to(letters, { scaleX: .72, scaleY: 1.32, y: -6, duration: .38, stagger: { each: .025, from: 'center' }, ease: 'power3.inOut' })
        .to(letters, { scaleX: 1, scaleY: 1, y: 0, duration: .68, stagger: { each: .025, from: 'center' }, ease: 'elastic.out(1,.65)' });
    }

    if (id === 'cascade') {
      intro.fromTo(letters, { y: (index) => 28 + index * 7, skewY: 12, opacity: 0 }, { y: 0, skewY: 0, opacity: 1, duration: .72, stagger: .045, ease: 'power4.out' });
      loop.to(letters, { y: (index) => (index - center) * 3, skewY: -7, duration: .42, stagger: .03, ease: 'power3.inOut' })
        .to(letters, { y: 0, skewY: 0, duration: .58, stagger: .03, ease: 'back.out(2)' });
    }

    if (id === 'magnet') {
      intro.fromTo(letters, { x: (index) => (center - index) * 24, scaleX: .3, opacity: 0 }, { x: 0, scaleX: 1, opacity: 1, duration: .88, stagger: { each: .026, from: 'center' }, ease: 'expo.out' });
      loop.to(letters, { x: (index) => (center - index) * 5.5, scaleX: .72, duration: .38, stagger: { each: .018, from: 'edges' }, ease: 'power3.in' })
        .to(letters, { x: 0, scaleX: 1, duration: .76, stagger: { each: .018, from: 'center' }, ease: 'elastic.out(1,.62)' });
    }

    if (id === 'arc') {
      intro.fromTo(letters, { x: (index) => (index - center) * 13, y: (index) => Math.abs(index - center) * -12, rotateZ: (index) => (index - center) * 3.5, opacity: 0 }, { x: 0, y: 0, rotateZ: 0, opacity: 1, duration: .9, stagger: { each: .03, from: 'center' }, ease: 'expo.out' });
      loop.to(letters, { y: (index) => Math.abs(index - center) * -3.2, rotateZ: (index) => (index - center) * 1.1, duration: .55, stagger: { each: .02, from: 'center' }, ease: 'power3.inOut' })
        .to(letters, { y: 0, rotateZ: 0, duration: .65, stagger: { each: .02, from: 'center' }, ease: 'power3.out' });
    }

    if (id === 'roll') {
      intro.fromTo(letters, { rotateY: -110, xPercent: -35, opacity: 0, transformOrigin: '0% 50%' }, { rotateY: 0, xPercent: 0, opacity: 1, duration: .72, stagger: .05, ease: 'back.out(1.7)' });
      loop.to(letters, { rotateY: 88, xPercent: 26, opacity: 0, duration: .3, stagger: .04, ease: 'power3.in' })
        .set(letters, { rotateY: -88, xPercent: -26 })
        .to(letters, { rotateY: 0, xPercent: 0, opacity: 1, duration: .46, stagger: .04, ease: 'power4.out' });
    }

    if (id === 'echo') {
      intro.fromTo(letters, { textShadow: '18px 0 rgba(32,63,255,.45),-18px 0 rgba(255,56,96,.3)', opacity: 0 }, { textShadow: '0px 0 rgba(32,63,255,0),0px 0 rgba(255,56,96,0)', opacity: 1, duration: .85, stagger: { each: .04, from: 'center' }, ease: 'power3.out' });
      loop.to(letters, { textShadow: '7px 0 rgba(32,63,255,.42),-7px 0 rgba(255,56,96,.28)', x: (index) => index % 2 ? 2 : -2, duration: .3, stagger: { each: .025, from: 'center' }, ease: 'power2.inOut' })
        .to(letters, { textShadow: '0px 0 rgba(32,63,255,0),0px 0 rgba(255,56,96,0)', x: 0, duration: .52, stagger: { each: .025, from: 'center' }, ease: 'power3.out' });
    }

    if (id === 'shutter') {
      intro.fromTo(letters, { clipPath: 'inset(0 100% 0 0)', x: -12, opacity: 0 }, { clipPath: 'inset(0 0% 0 0)', x: 0, opacity: 1, duration: .58, stagger: .052, ease: 'power4.out' });
      loop.to(letters, { clipPath: 'inset(0 0 0 100%)', x: 10, duration: .34, stagger: .035, ease: 'power3.in' })
        .set(letters, { clipPath: 'inset(0 100% 0 0)', x: -10 })
        .to(letters, { clipPath: 'inset(0 0% 0 0)', x: 0, duration: .48, stagger: .035, ease: 'power4.out' });
    }

    if (id === 'orbit') {
      intro.fromTo(letters, { x: (index) => Math.cos(index * .86) * 74, y: (index) => Math.sin(index * .86) * 54, rotateZ: (index) => index * 24 - 90, scale: .42, opacity: 0 }, { x: 0, y: 0, rotateZ: 0, scale: 1, opacity: 1, duration: 1.05, stagger: { each: .025, from: 'center' }, ease: 'expo.out' });
      loop.to(letters, { x: (index) => Math.cos(index * .82) * 8, y: (index) => Math.sin(index * .82) * 8, rotateZ: (index) => Math.sin(index) * 5, duration: .62, stagger: { each: .018, from: 'center' }, ease: 'sine.inOut' })
        .to(letters, { x: 0, y: 0, rotateZ: 0, duration: .72, stagger: { each: .018, from: 'center' }, ease: 'power3.out' });
    }

    if (id === 'weight') {
      intro.fromTo(letters, { fontWeight: 280, y: 8, opacity: 0 }, { fontWeight: 650, y: 0, opacity: 1, duration: .76, stagger: .05, ease: 'power4.out' });
      loop.to(letters, { fontWeight: 820, y: -4, scaleX: 1.035, duration: .34, stagger: .055, ease: 'power3.inOut' })
        .to(letters, { fontWeight: 650, y: 0, scaleX: 1, duration: .52, stagger: .055, ease: 'power3.out' });
    }

    if (id === 'sweep') {
      intro.fromTo(letters, { filter: 'blur(13px)', y: 14, opacity: 0 }, { filter: 'blur(0px)', y: 0, opacity: 1, duration: .68, stagger: .055, ease: 'power3.out' });
      loop.to(letters, { filter: 'blur(8px)', opacity: .28, y: -5, duration: .28, stagger: .045, ease: 'power2.in' })
        .to(letters, { filter: 'blur(0px)', opacity: 1, y: 0, duration: .46, stagger: .045, ease: 'power3.out' });
    }

    if (id === 'scatter') {
      intro.fromTo(letters, { x: (index) => { const angle = (index / Math.max(1, letters.length - 1)) * Math.PI * 1.35 - Math.PI * .68; return Math.cos(angle) * (58 + Math.abs(index - center) * 4); }, y: (index) => { const angle = (index / Math.max(1, letters.length - 1)) * Math.PI * 1.35 - Math.PI * .68; return Math.sin(angle) * 46; }, rotateZ: (index) => (index - center) * 4.5, scale: .55, filter: 'blur(4px)', opacity: 0 }, { x: 0, y: 0, rotateZ: 0, scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.05, stagger: { each: .025, from: 'center' }, ease: 'expo.out' });
      loop.to(letters, { x: (index) => (index - center) * 4.2, y: (index) => -Math.cos((index - center) * .7) * 11, rotateZ: (index) => (index - center) * .8, scale: .9, duration: .36, stagger: { each: .018, from: 'center' }, ease: 'power3.inOut' })
        .to(letters, { x: 0, y: 0, rotateZ: 0, scale: 1, duration: .78, stagger: { each: .018, from: 'edges' }, ease: 'elastic.out(1,.68)' });
    }

    if (id === 'pulse') {
      intro.fromTo(letters, { scale: .18, y: 16, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: .72, stagger: { each: .045, from: 'center' }, ease: 'elastic.out(1,.6)' });
      loop.to(letters, { scale: 1.2, y: -7, duration: .28, stagger: .045, ease: 'power3.out' })
        .to(letters, { scale: 1, y: 0, duration: .52, stagger: .045, ease: 'elastic.out(1,.58)' });
    }

    if (id === 'drop') {
      intro.fromTo(letters, { y: (index) => -90 - index * 8, rotateZ: (index) => index % 2 ? 14 : -14, opacity: 0 }, { y: 0, rotateZ: 0, opacity: 1, duration: .86, stagger: .045, ease: 'bounce.out' });
      loop.to(letters, { y: -24, rotateZ: (index) => index % 2 ? 4 : -4, duration: .34, stagger: { each: .032, from: 'center' }, ease: 'power3.out' })
        .to(letters, { y: 0, rotateZ: 0, duration: .62, stagger: { each: .032, from: 'center' }, ease: 'bounce.out' });
    }

    if (id === 'fan') {
      intro.fromTo(letters, { x: (index) => (index - center) * -10, y: 34, rotateZ: (index) => (index - center) * 9, opacity: 0, transformOrigin: '50% 120%' }, { x: 0, y: 0, rotateZ: 0, opacity: 1, duration: .9, stagger: { each: .025, from: 'center' }, ease: 'expo.out' });
      loop.to(letters, { x: (index) => (index - center) * 2.4, y: (index) => Math.abs(index - center) * 1.7, rotateZ: (index) => (index - center) * 2.1, duration: .5, stagger: { each: .018, from: 'center' }, ease: 'power3.inOut' })
        .to(letters, { x: 0, y: 0, rotateZ: 0, duration: .68, stagger: { each: .018, from: 'edges' }, ease: 'back.out(1.5)' });
    }

    if (id === 'ticker') {
      loop.addLabel('toAlternate').to(letters, {
        rotateX: -90,
        yPercent: -6,
        duration: .24,
        ease: 'power3.in',
      }, 'toAlternate').to(tickerCells, {
        width: (_, element) => `${(element as HTMLElement).dataset.tickerToWidth}em`,
        duration: .58,
        ease: 'power3.inOut',
      }, 'toAlternate').set(letters, {
        visibility: 'hidden',
      }, 'toAlternate+=.24').set(tickerTargets, {
        visibility: 'visible',
        rotateX: 90,
        yPercent: 6,
      }, 'toAlternate+=.24').to(tickerTargets, {
        rotateX: 0,
        yPercent: 0,
        duration: .34,
        ease: 'back.out(1.35)',
      }, 'toAlternate+=.24').addLabel('toCurrent', '+=1.35').to(tickerTargets, {
        rotateX: -90,
        yPercent: -6,
        duration: .24,
        ease: 'power3.in',
      }, 'toCurrent').to(tickerCells, {
        width: (_, element) => `${(element as HTMLElement).dataset.tickerFromWidth}em`,
        duration: .58,
        ease: 'power3.inOut',
      }, 'toCurrent').set(tickerTargets, {
        visibility: 'hidden',
      }, 'toCurrent+=.24').set(letters, {
        visibility: 'visible',
        rotateX: 90,
        yPercent: 6,
      }, 'toCurrent+=.24').to(letters, {
        rotateX: 0,
        yPercent: 0,
        duration: .34,
        ease: 'back.out(1.35)',
      }, 'toCurrent+=.24');
    }

    return () => {
      intro.kill();
      loop.kill();
      gsap.killTweensOf(letters);
      gsap.killTweensOf(tickerTargets);
      gsap.killTweensOf(tickerCells);
    };
  }, [text, alternateText, activeVariant]);

  const tickerFrom = text.toUpperCase();
  const tickerTo = alternateText.toUpperCase();
  const tickerLength = Math.max(tickerFrom.length, tickerTo.length);

  return <div className="showcase-fullbleed relative flex min-h-[30rem] w-full items-center justify-center bg-transparent px-5 pb-5 pt-24">
    <span
      ref={root}
      data-variant={activeVariant.id}
      aria-label={activeVariant.id === 'ticker' ? `${tickerFrom} changes to ${tickerTo}. Ticker animation.` : `${text}. ${activeVariant.label} animation.`}
      className={`inline-flex items-center whitespace-nowrap text-[clamp(2.35rem,9cqw,6.5rem)] font-semibold leading-none text-[#111] [perspective:900px] ${activeVariant.id === 'ticker' ? 'tracking-[-.055em]' : 'tracking-[-.065em]'}`}
    >
      {activeVariant.id === 'ticker' ? Array.from({ length: tickerLength }, (_, index) => {
        const from = tickerFrom[index] ?? ' ';
        const to = tickerTo[index] ?? ' ';
        if (from === ' ' && to === ' ') return <span data-ticker-cell aria-hidden="true" key={`ticker-gap-${index}`} className="inline-block h-[1em] w-[.34em]" />;
        if (from === to) return <span data-ticker-cell aria-hidden="true" key={`ticker-static-${from}-${index}`} className="inline-flex h-[1em] items-center">{from}</span>;
        return <span
          data-ticker-cell
          data-ticker-dynamic
          aria-hidden="true"
          key={`ticker-${from}-${to}-${index}`}
          className="relative inline-block h-[1em] w-[.62em] overflow-visible align-top [perspective:700px] [transform-style:preserve-3d]"
        >
          <span data-ticker-measure-from className="invisible absolute left-0 top-0 whitespace-pre">{from === ' ' ? '\u00a0' : from}</span>
          <span data-ticker-measure-to className="invisible absolute left-0 top-0 whitespace-pre">{to === ' ' ? '\u00a0' : to}</span>
          <span data-text-letter className="absolute inset-0 flex items-center justify-center leading-none will-change-transform">{from === ' ' ? '\u00a0' : from}</span>
          <span data-ticker-to className="absolute inset-0 flex items-center justify-center leading-none will-change-transform">{to === ' ' ? '\u00a0' : to}</span>
        </span>;
      })
        : [...text].map((letter, index) => <span data-text-letter aria-hidden="true" key={`${letter}-${index}`} className={`inline-block will-change-transform ${letter === ' ' ? 'w-[.3em]' : ''}`}>{letter === ' ' ? '\u00a0' : letter}</span>)}
    </span>
  </div>;
}

export default TextMotion;
