import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  Bell,
  BriefcaseBusiness,
  Check,
  Clipboard,
  Code2,
  Home,
  Mail,
  Search,
  Send,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import { gsap } from 'gsap';
import type { TextMotionVariant } from './motion/TextMotion.js';

const glass =
  'relative isolate overflow-hidden border border-white/[.18] bg-white/[.075] shadow-[inset_0_1px_0_rgba(255,255,255,.34),inset_0_-1px_0_rgba(255,255,255,.04),0_22px_70px_rgba(0,0,0,.35)] backdrop-blur-[28px] backdrop-saturate-[165%] before:pointer-events-none before:absolute before:inset-px before:rounded-[inherit] before:bg-[linear-gradient(130deg,rgba(255,255,255,.22),transparent_28%_72%,rgba(255,255,255,.1))] before:content-[\"\"]';
const glassButton = `${glass} cursor-pointer text-white transition-[border-color,background-color,transform] duration-300 hover:border-white/[.34] hover:bg-white/[.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff]/70 active:scale-[.96]`;
const panel =
  'border border-white/[.1] bg-[#090909]/95 shadow-[inset_0_1px_0_rgba(255,255,255,.055),0_28px_90px_rgba(0,0,0,.42)]';
const eyebrow = 'font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-white/45';

/**
 * Small decorative filters only. The glass surfaces themselves use native blur,
 * keeping every edge stable while the colour fields receive subtle distortion.
 */
export function LiquidGlassDefs() {
  return (
    <svg aria-hidden="true" className="pointer-events-none fixed h-0 w-0 overflow-hidden">
      <defs>
        {['motus-glass', 'motus-pill', 'motus-panel'].map((id) => (
          <filter id={id} key={id} colorInterpolationFilters="sRGB">
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        ))}
        <filter id="motus-orb" x="-35%" y="-35%" width="170%" height="170%">
          <feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="1" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="B" />
        </filter>
        <filter id="motus-prism" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="1" seed="17" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="6" result="bent" />
          <feOffset in="bent" dx="-1" result="redShift" />
          <feOffset in="bent" dx="1" result="blueShift" />
          <feBlend in="redShift" in2="blueShift" mode="screen" />
        </filter>
        <filter id="motus-goo" x="-45%" y="-20%" width="190%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" mode="normal" />
        </filter>
      </defs>
    </svg>
  );
}

type LiquidGlassCardProps = {
  children: ReactNode;
  className?: string;
  draggable?: boolean;
  borderRadius?: string;
  blurIntensity?: 'sm' | 'md' | 'lg';
  glowIntensity?: 'none' | 'sm' | 'md';
  shadowIntensity?: 'sm' | 'md' | 'lg';
};

/**
 * A layered glass primitive: the background is blurred by the lowest layer,
 * the middle layer carries the tint, and the top layers draw the optical rim
 * and pointer-tracked specular light. No separate component CSS is required.
 */
export function LiquidGlassCard({
  children,
  className = '',
  draggable = false,
  borderRadius = '16px',
  blurIntensity = 'md',
  glowIntensity = 'sm',
  shadowIntensity = 'md',
}: LiquidGlassCardProps) {
  const card = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, pointerId: -1, startX: 0, startY: 0 });
  const blur = { sm: 'backdrop-blur-[12px]', md: 'backdrop-blur-[20px]', lg: 'backdrop-blur-[30px]' }[blurIntensity];
  const glow = {
    none: '',
    sm: 'drop-shadow-[0_18px_32px_rgba(0,0,0,.26)]',
    md: 'drop-shadow-[0_24px_48px_rgba(0,0,0,.34)]',
  }[glowIntensity];
  const shadow = {
    sm: 'shadow-[inset_0_1px_0_rgba(255,255,255,.48),inset_0_-1px_0_rgba(255,255,255,.10)]',
    md: 'shadow-[inset_0_1px_0_rgba(255,255,255,.58),inset_0_-1px_0_rgba(255,255,255,.08),inset_1px_0_0_rgba(255,255,255,.18)]',
    lg: 'shadow-[inset_0_1px_0_rgba(255,255,255,.68),inset_0_-2px_1px_rgba(0,0,0,.18),inset_1px_0_0_rgba(255,255,255,.22)]',
  }[shadowIntensity];

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = card.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--glass-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty('--glass-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    if (!drag.current.active || event.pointerId !== drag.current.pointerId) return;
    const x = (event.clientX - drag.current.startX) * 0.82;
    const y = (event.clientY - drag.current.startY) * 0.82;
    gsap.set(node, { x, y, rotate: x * 0.012, force3D: true });
  };
  const down = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || (event.target as HTMLElement).closest('button,a,input')) return;
    drag.current = { active: true, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    gsap.to(card.current, { scale: 1.015, duration: 0.25, ease: 'power3.out' });
  };
  const release = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || event.pointerId !== drag.current.pointerId) return;
    drag.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    gsap.to(card.current, {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 0.95,
      ease: 'elastic.out(1,.54)',
      overwrite: true,
    });
  };

  return (
    <div
      ref={card}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={release}
      onPointerCancel={release}
      className={`relative isolate overflow-hidden border border-white/[.34] bg-white/[.055] ${glow} ${shadow} ${draggable ? 'touch-none select-none cursor-grab active:cursor-grabbing' : ''} ${className}`}
      style={{ borderRadius, '--glass-x': '22%', '--glass-y': '12%' } as CSSProperties}
    >
      <span
        className={`pointer-events-none absolute inset-0 -z-30 bg-black/[.3] ${blur} backdrop-saturate-[185%] backdrop-contrast-[108%]`}
      />
      <span className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.035)_42%,rgba(255,255,255,.08)_72%,rgba(255,255,255,.12))]" />
      <span
        className="pointer-events-none absolute inset-0 -z-10 opacity-90 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at var(--glass-x) var(--glass-y), rgba(255,255,255,.42), rgba(255,255,255,.11) 18%, transparent 45%)',
        }}
      />
      <span className="pointer-events-none absolute inset-px -z-10 rounded-[inherit] ring-1 ring-inset ring-white/[.13]" />
      {children}
    </div>
  );
}

export function RibbonNavigation() {
  const [active, setActive] = useState(0);
  const highlight = useRef<HTMLSpanElement>(null);
  const nav = useRef<HTMLElement>(null);
  const items = [
    { label: 'Home', icon: Home },
    { label: 'Work', icon: BriefcaseBusiness },
    { label: 'About', icon: UserRound },
    { label: 'Contact', icon: Mail },
  ];
  const position = (index: number, immediate = false) => {
    const button = nav.current?.querySelectorAll<HTMLButtonElement>('[data-portfolio-item]')[index];
    if (!button || !nav.current || !highlight.current) return;
    const parent = nav.current.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    gsap.to(highlight.current, {
      x: box.left - parent.left,
      width: box.width,
      duration: immediate ? 0 : 0.7,
      ease: immediate ? 'none' : 'elastic.out(1,.82)',
      overwrite: true,
    });
  };
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => position(0, true));
    const resize = () => {
      const buttons = [...(nav.current?.querySelectorAll<HTMLButtonElement>('[data-portfolio-item]') ?? [])];
      position(
        Math.max(
          0,
          buttons.findIndex((button) => button.getAttribute('aria-current') === 'page'),
        ),
        true,
      );
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);
  const choose = (index: number) => {
    if (index === active) return;
    setActive(index);
    requestAnimationFrame(() => position(index));
    const content = nav.current?.querySelectorAll<HTMLElement>('[data-nav-content]')[index];
    if (content)
      gsap.fromTo(
        content,
        { y: 6, opacity: 0.35 },
        { y: 0, opacity: 1, duration: 0.38, ease: 'power4.out', overwrite: true },
      );
  };
  const drift = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const content = event.currentTarget.querySelector('[data-nav-content]');
    if (!content) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 3;
    gsap.to(content, { x, y, duration: 0.28, ease: 'power3.out', overwrite: true });
  };
  const settle = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const content = event.currentTarget.querySelector('[data-nav-content]');
    if (content) gsap.to(content, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,.7)', overwrite: true });
  };
  return (
    <div className="flex min-h-[24rem] w-full items-center justify-center p-4">
      <nav
        ref={nav}
        aria-label="Portfolio sections"
        className="relative flex items-center gap-1 rounded-[1.65rem] border border-black/[.08] bg-white/80 p-1.5 text-[#171719] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_18px_45px_rgba(40,45,62,.12)] backdrop-blur-2xl"
      >
        <span aria-hidden="true" className="relative z-10 mx-2 grid h-6 w-6 place-items-center">
          <i className="absolute h-3.5 w-3.5 -translate-x-1 rotate-45 rounded-[5px] border border-black/70" />
          <i className="absolute h-3.5 w-3.5 translate-x-1 rotate-45 rounded-[5px] border border-black/25" />
        </span>
        <span aria-hidden="true" className="mx-0.5 h-6 w-px bg-black/[.09]" />
        <span
          ref={highlight}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 left-0 top-1.5 w-20 overflow-hidden rounded-[1.2rem] bg-[#18181b] shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_10px_24px_rgba(24,24,27,.24)]"
        >
          <i className="absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(255,255,255,.22),transparent_38%),linear-gradient(115deg,transparent_40%,rgba(132,148,255,.18),transparent_76%)]" />
        </span>
        {items.map(({ label, icon: Icon }, index) => {
          const selected = active === index;
          return (
            <button
              key={label}
              type="button"
              data-portfolio-item
              aria-label={label}
              aria-current={selected ? 'page' : undefined}
              onClick={() => choose(index)}
              onFocus={() => position(index)}
              onPointerMove={drift}
              onPointerLeave={settle}
              className={`relative z-10 flex h-11 min-w-11 items-center justify-center rounded-[1.2rem] px-3 text-[12px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 sm:min-w-[5.6rem] ${selected ? '!text-white' : 'text-black/48 hover:text-black'}`}
            >
              <span data-nav-content className="flex items-center gap-2">
                <Icon size={15} strokeWidth={1.8} />
                <span className="hidden sm:inline">{label}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function ProjectAperture() {
  const [open, setOpen] = useState(false);
  const cover = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const openState = useRef(false);
  const transitioning = useRef(false);
  const transition = useRef<gsap.core.Timeline | null>(null);
  useEffect(
    () => () => {
      transition.current?.kill();
      gsap.killTweensOf([cover.current, detail.current]);
    },
    [],
  );
  const toggle = () => {
    const next = !openState.current;
    const compact = window.matchMedia('(max-width: 560px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    openState.current = next;
    setOpen(next);
    transition.current?.kill();
    gsap.killTweensOf([cover.current, detail.current]);
    transitioning.current = true;
    const duration = reduced ? 0.01 : next ? 0.68 : 0.48;
    const timeline = gsap.timeline({
      onComplete: () => {
        transitioning.current = false;
      },
      onInterrupt: () => {
        transitioning.current = false;
      },
    });
    transition.current = timeline;
    if (!next)
      timeline.to(
        detail.current,
        {
          opacity: 0,
          x: compact ? 0 : 14,
          y: compact ? 12 : 0,
          duration: reduced ? 0.01 : 0.16,
          ease: 'power2.out',
          pointerEvents: 'none',
        },
        0,
      );
    timeline.to(
      cover.current,
      {
        xPercent: compact ? 0 : next ? -47 : 0,
        yPercent: compact && next ? -47 : 0,
        rotateY: !compact && next ? -8 : 0,
        rotateX: compact && next ? 5 : 0,
        scale: next ? 0.94 : 1,
        duration,
        ease: next ? 'expo.out' : 'power4.inOut',
      },
      next ? 0 : 0.04,
    );
    if (next)
      timeline.to(
        detail.current,
        { opacity: 1, x: 0, y: 0, duration: reduced ? 0.01 : 0.3, ease: 'power3.out', pointerEvents: 'auto' },
        reduced ? 0 : 0.24,
      );
  };
  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (openState.current || transitioning.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cover.current, { rotateY: x * 4, rotateX: y * -3, duration: 0.55, ease: 'power3.out', overwrite: true });
  };
  return (
    <div className="flex min-h-[31rem] w-full items-center justify-center p-4 [perspective:1400px]">
      <article
        onPointerMove={move}
        onPointerLeave={() =>
          !openState.current &&
          !transitioning.current &&
          gsap.to(cover.current, { rotateX: 0, rotateY: 0, duration: 0.42, ease: 'power3.out', overwrite: 'auto' })
        }
        className="relative h-[27rem] w-full max-w-[43rem] overflow-hidden rounded-[2.25rem] border border-black/[.08] bg-[#f5f5f7] text-[#111] shadow-[0_35px_100px_rgba(0,0,0,.14)]"
      >
        <div
          ref={detail}
          aria-hidden={!open}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[56%] w-full flex-col justify-between p-5 opacity-0 md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[55%] md:p-7"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[.17em] text-black/38">Project</span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                tabIndex={open ? 0 : -1}
                aria-label="Close project details"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-black md:hidden"
              >
                <X size={15} />
              </button>
              <a
                href="#northstar-case-study"
                tabIndex={open ? 0 : -1}
                aria-label="Open Northstar case study"
                className="grid h-10 w-10 place-items-center rounded-full bg-black !text-white no-underline md:h-11 md:w-11"
              >
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-[2rem] font-semibold leading-[.9] tracking-[-.075em] md:text-[2.7rem]">
              Northstar
              <br />
              Workspace
            </h3>
            <p className="mt-3 max-w-[17rem] text-[11px] leading-4 text-black/48 md:mt-4 md:text-[12px] md:leading-5">
              A workspace for distributed product teams.
            </p>
          </div>
          <div className="grid grid-cols-2 border-t border-black/10 pt-3 text-[9px] md:pt-4 md:text-[10px]">
            <span>
              <i className="block not-italic text-black/35">Year</i>
              <strong className="mt-1 block">2026</strong>
            </span>
            <span>
              <i className="block not-italic text-black/35">Role</i>
              <strong className="mt-1 block">Design and build</strong>
            </span>
          </div>
        </div>
        <div
          ref={cover}
          className="absolute inset-3 z-10 overflow-hidden rounded-[1.65rem] bg-[#111] text-white shadow-[0_24px_70px_rgba(0,0,0,.34)] [transform-origin:center_top] [transform-style:preserve-3d] md:[transform-origin:left_center]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_32%,rgba(255,255,255,.18),transparent_22%),radial-gradient(circle_at_36%_68%,rgba(125,141,255,.26),transparent_26%),linear-gradient(145deg,#18191c,#050506)]" />
          <div className="absolute left-[52%] top-[16%] h-[17rem] w-[11rem] rotate-6 rounded-[3.2rem] border border-white/15 bg-white/[.06] shadow-[inset_0_1px_0_rgba(255,255,255,.24),0_30px_70px_rgba(0,0,0,.32)] backdrop-blur-2xl" />
          <header className="relative flex items-center justify-between p-5">
            <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/44">Northstar / 2026</span>
            <button
              onClick={toggle}
              aria-expanded={open}
              className="flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[.08] px-4 text-[10px] font-semibold backdrop-blur-xl hover:bg-white/[.14]"
            >
              <span>{open ? 'Close' : 'Open project'}</span>
              <ArrowRight size={14} />
            </button>
          </header>
          <div className="absolute bottom-6 left-6">
            <span className="text-[11px] text-white/40">Team workspace</span>
            <h3 className="mt-1 text-[3.6rem] font-semibold tracking-[-.085em]">Northstar</h3>
          </div>
        </div>
      </article>
    </div>
  );
}

export function PressureStack() {
  const [active, setActive] = useState(0);
  const rows = useRef<Array<HTMLButtonElement | null>>([]);
  const data = [
    { label: 'Design', copy: 'Interface design for web products.', meta: '01', tint: '#f4f4f6' },
    { label: 'Motion', copy: 'Animation and interaction design.', meta: '02', tint: '#ededf0' },
    { label: 'Development', copy: 'Responsive React development.', meta: '03', tint: '#e5e5e8' },
    { label: 'Prototyping', copy: 'Working prototypes for new ideas.', meta: '04', tint: '#dedee2' },
  ];
  const choose = (index: number) => {
    setActive(index);
    rows.current.forEach((row, rowIndex) =>
      gsap.to(row, {
        height: rowIndex === index ? 132 : 62,
        scale: rowIndex === index ? 1 : 0.985,
        duration: 0.72,
        ease: 'elastic.out(1,.72)',
        overwrite: true,
      }),
    );
  };
  return (
    <div className="flex min-h-[31rem] w-full items-center justify-center p-4">
      <section className="w-full max-w-[38rem] rounded-[2.2rem] border border-black/[.08] bg-white/72 p-3 text-[#111] shadow-[0_32px_90px_rgba(0,0,0,.12)] backdrop-blur-2xl">
        <header className="flex items-end justify-between px-3 pb-5 pt-3">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[.18em] text-black/35">Skills</span>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-.055em]">What I do</h3>
          </div>
          <span className="font-mono text-[9px] text-black/35">Choose one</span>
        </header>
        <div role="group" aria-label="Capabilities" className="space-y-1.5">
          {data.map((entry, index) => (
            <button
              key={entry.label}
              ref={(node) => {
                rows.current[index] = node;
              }}
              aria-pressed={active === index}
              onPointerEnter={() => choose(index)}
              onFocus={() => choose(index)}
              onClick={() => choose(index)}
              className="group relative flex w-full origin-center flex-col justify-between overflow-hidden rounded-[1.25rem] border border-black/[.07] px-5 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              style={{ height: index === 0 ? 132 : 62, background: entry.tint }}
            >
              <div className="flex w-full items-center justify-between">
                <strong className="text-[14px] font-semibold tracking-[-.02em]">{entry.label}</strong>
                <span className="font-mono text-[9px] text-black/35">{entry.meta}</span>
              </div>
              <div
                className={`flex items-end justify-between gap-5 transition-opacity duration-300 ${active === index ? 'opacity-100' : 'opacity-0'}`}
              >
                <p className="max-w-[23rem] text-[12px] leading-5 text-black/48">{entry.copy}</p>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black !text-white transition-transform group-hover:rotate-[-8deg]">
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function SpatialIndex() {
  const [index, setIndex] = useState(0);
  const preview = useRef<HTMLDivElement>(null);
  const cards = [
    {
      code: '01',
      title: 'Northstar',
      type: 'Team workspace',
      result: '2026',
      tone: 'linear-gradient(145deg,#dfe7ff,#8c9cff)',
    },
    {
      code: '02',
      title: 'Eidolon',
      type: 'Studio website',
      result: '2026',
      tone: 'linear-gradient(145deg,#e8e8eb,#aaaaaf)',
    },
    {
      code: '03',
      title: 'Fieldnotes',
      type: 'Writing app',
      result: '2025',
      tone: 'linear-gradient(145deg,#f1eadc,#d2b88d)',
    },
    {
      code: '04',
      title: 'Relay',
      type: 'Developer tool',
      result: '2025',
      tone: 'linear-gradient(145deg,#dff5e8,#83c7a1)',
    },
  ];
  const choose = (next: number) => {
    setIndex(next);
    gsap.fromTo(
      preview.current,
      { clipPath: 'inset(12% 12% 12% 12% round 2rem)', scale: 0.94, rotateY: -7, opacity: 0.35 },
      {
        clipPath: 'inset(0% 0% 0% 0% round 1.6rem)',
        scale: 1,
        rotateY: 0,
        opacity: 1,
        duration: 0.72,
        ease: 'power4.out',
        overwrite: true,
      },
    );
  };
  const card = cards[index];
  return (
    <div className="flex min-h-[31rem] w-full items-center justify-center p-4 [perspective:1200px]">
      <section className="grid w-full max-w-[44rem] gap-3 rounded-[2.2rem] border border-black/[.08] bg-[#f5f5f7]/88 p-3 text-[#111] shadow-[0_32px_90px_rgba(0,0,0,.12)] backdrop-blur-2xl md:grid-cols-[.82fr_1.18fr]">
        <div className="flex min-h-[22rem] flex-col justify-between p-4">
          <header>
            <span className="font-mono text-[9px] uppercase tracking-[.18em] text-black/35">Work</span>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-.055em]">Projects</h3>
          </header>
          <nav aria-label="Projects" className="my-6">
            {cards.map((item, itemIndex) => (
              <a
                key={item.title}
                href={`#${item.title.toLowerCase()}-case-study`}
                onPointerEnter={() => choose(itemIndex)}
                onFocus={() => choose(itemIndex)}
                onClick={() => choose(itemIndex)}
                aria-current={index === itemIndex ? 'page' : undefined}
                className={`group flex items-center gap-3 border-b border-black/[.08] py-3 text-[14px] no-underline transition-colors ${index === itemIndex ? 'text-black' : 'text-black/30 hover:text-black/70'}`}
              >
                <span className="w-5 font-mono text-[8px]">{item.code}</span>
                <strong className="font-medium">{item.title}</strong>
                <ArrowUpRight
                  size={14}
                  className={`ml-auto transition-transform ${index === itemIndex ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}
                />
              </a>
            ))}
          </nav>
          <span className="text-[10px] text-black/35">Hover to preview.</span>
        </div>
        <div
          ref={preview}
          onPointerMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            gsap.to(preview.current, {
              rotateY: ((event.clientX - box.left) / box.width - 0.5) * 5,
              rotateX: ((event.clientY - box.top) / box.height - 0.5) * -4,
              duration: 0.55,
              ease: 'power3.out',
            });
          }}
          onPointerLeave={() =>
            gsap.to(preview.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1,.6)' })
          }
          className="relative min-h-[22rem] overflow-hidden rounded-[1.6rem] border border-black/[.08] p-5 [transform-style:preserve-3d]"
          style={{ background: card.tone }}
        >
          <div className="absolute -right-10 top-[18%] h-64 w-48 rotate-6 rounded-[2.8rem] border border-white/55 bg-white/25 shadow-[0_26px_60px_rgba(40,40,80,.15)] backdrop-blur-xl">
            <div className="m-4 h-24 rounded-[1.5rem] bg-black/[.08]" />
          </div>
          <div className="relative flex h-full flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-black/38">Project / {card.code}</span>
            <div>
              <span className="text-[11px] text-black/42">{card.type}</span>
              <h4 className="mt-1 text-[2.8rem] font-semibold tracking-[-.075em]">{card.title}</h4>
              <strong className="mt-2 block font-mono text-[9px] uppercase tracking-[.13em] text-black/46">
                {card.result}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ContactCapsule() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const capsule = useRef<HTMLElement>(null);
  const details = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const openState = useRef(false);
  const transition = useRef<gsap.core.Timeline | null>(null);
  useEffect(
    () => () => {
      transition.current?.kill();
      gsap.killTweensOf([capsule.current, details.current]);
    },
    [],
  );
  const toggle = () => {
    const next = !openState.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    openState.current = next;
    setOpen(next);
    transition.current?.kill();
    gsap.killTweensOf([capsule.current, details.current]);
    const timeline = gsap.timeline();
    transition.current = timeline;
    if (next) {
      timeline
        .to(capsule.current, { height: 272, duration: reduced ? 0.01 : 0.42, ease: 'expo.out' }, 0)
        .to(
          details.current,
          { opacity: 1, y: 0, duration: reduced ? 0.01 : 0.24, ease: 'power3.out', pointerEvents: 'auto' },
          reduced ? 0 : 0.2,
        );
    } else {
      timeline
        .to(
          details.current,
          { opacity: 0, y: 10, duration: reduced ? 0.01 : 0.14, ease: 'power2.out', pointerEvents: 'none' },
          0,
        )
        .to(capsule.current, { height: 78, duration: reduced ? 0.01 : 0.34, ease: 'power4.inOut' }, reduced ? 0 : 0.06);
    }
  };
  const copy = async () => {
    await navigator.clipboard.writeText('hello@example.com');
    setCopied(true);
    gsap.fromTo(action.current, { scale: 0.92 }, { scale: 1, duration: 0.65, ease: 'elastic.out(1,.55)' });
    window.setTimeout(() => setCopied(false), 1300);
  };
  return (
    <div className="flex min-h-[30rem] w-full items-center justify-center p-5">
      <section
        ref={capsule}
        className="relative h-[78px] w-full max-w-[28rem] overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 text-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_28px_80px_rgba(25,25,35,.16)] backdrop-blur-[28px]"
      >
        <div className="flex h-[78px] items-center gap-3 px-3 pl-5">
          <span className="relative h-3 w-3 rounded-full bg-[#30c466] shadow-[0_0_0_6px_rgba(48,196,102,.12)]">
            <i className="absolute inset-0 animate-ping rounded-full bg-[#30c466]/40" />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-semibold">Available for work</strong>
            <span className="text-[10px] text-black/42">UTC +8</span>
          </div>
          <button
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? 'Close contact options' : 'Open contact options'}
            className="grid h-14 w-14 place-items-center rounded-full bg-black !text-white shadow-[0_10px_24px_rgba(0,0,0,.2)] transition-transform hover:scale-[1.04]"
          >
            {open ? <X size={17} /> : <ArrowUpRight size={17} />}
          </button>
        </div>
        <div ref={details} className="pointer-events-none px-5 pb-5 opacity-0">
          <div className="border-t border-black/10 pt-5">
            <span className="font-mono text-[8px] uppercase tracking-[.17em] text-black/35">Contact</span>
            <h3 className="mt-3 text-[2rem] font-semibold leading-[.92] tracking-[-.065em]">
              Let&rsquo;s work together.
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href="mailto:hello@example.com"
                className="flex h-12 items-center justify-center gap-2 rounded-[.9rem] bg-black text-[11px] font-semibold !text-white no-underline"
              >
                <Mail size={14} />
                Email me
              </a>
              <button
                ref={action}
                onClick={copy}
                className="flex h-12 items-center justify-center gap-2 rounded-[.9rem] border border-black/10 bg-white/65 text-[11px] font-semibold"
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? 'Copied' : 'Copy email'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function BuildReceipt() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const rows = [
    { label: 'Framework', value: 'React 19', detail: 'Components, routing, and state.' },
    { label: 'Animation', value: 'GSAP 3.15', detail: 'Transitions and pointer interactions.' },
    { label: 'Styles', value: 'Tailwind 4', detail: 'All component styles.' },
    { label: 'Runtime', value: 'Browser', detail: 'No server or database required.' },
  ];
  const copy = async () => {
    await navigator.clipboard.writeText('react@19 gsap@3.15 tailwindcss@4 lucide-react');
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="flex min-h-[32rem] w-full items-center justify-center p-5">
      <section className="grid w-full max-w-[42rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] text-white shadow-[0_32px_90px_rgba(0,0,0,.28)] md:grid-cols-[1.1fr_.9fr]">
        <div className="p-5 sm:p-6">
          <header className="mb-4 flex items-center justify-between sm:mb-6">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[.17em] text-white/36">Project</span>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-.05em]">Tech stack</h3>
            </div>
            <Code2 size={20} className="text-[#c7ff4d]" />
          </header>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {rows.map((row, index) => (
              <button
                key={row.label}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                className={`grid w-full grid-cols-[1fr_auto] items-center px-1 py-3 text-left transition-colors sm:py-4 ${active === index ? 'text-[#c7ff4d]' : 'text-white/48 hover:text-white'}`}
              >
                <span className="text-[12px]">{row.label}</span>
                <strong className="font-mono text-[10px] font-medium">{row.value}</strong>
              </button>
            ))}
          </div>
          <button
            onClick={copy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[.9rem] border border-white/12 bg-white/[.06] py-3 text-[11px] font-semibold hover:bg-white/[.1] sm:mt-5"
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
            {copied ? 'Copied' : 'Copy stack'}
          </button>
        </div>
        <aside className="relative flex min-h-[17rem] flex-col justify-between overflow-hidden bg-[#c7ff4d] p-5 text-[#111] sm:min-h-[24rem] sm:p-6">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[28px] border-black/[.07]" />
          <span className="relative font-mono text-[9px] uppercase tracking-[.17em] text-black/42">
            0{active + 1} / 04
          </span>
          <div className="relative">
            <strong className="block text-[2.7rem] tracking-[-.08em] sm:text-[3.2rem]">{rows[active].value}</strong>
            <h4 className="mt-2 text-[14px] font-semibold">{rows[active].label}</h4>
            <p className="mt-3 text-[12px] leading-5 text-black/58">{rows[active].detail}</p>
          </div>
          <div className="relative flex items-center justify-between border-t border-black/15 pt-4 font-mono text-[8px] uppercase tracking-[.14em]">
            <span>Ready to use</span>
            <Check size={14} />
          </div>
        </aside>
      </section>
    </div>
  );
}

function ContextRelayPrototype() {
  type RelayId = 'work' | 'pulse' | 'stack' | 'reach';
  const [active, setActive] = useState<RelayId | null>('work');
  const [direction, setDirection] = useState(1);
  const shell = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const nav = useRef<HTMLElement>(null);
  const previousIndex = useRef(0);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = [
    { id: 'work' as const, label: 'Work', icon: BriefcaseBusiness, accent: '#ff6b45' },
    { id: 'pulse' as const, label: 'Pulse', icon: BarChart2, accent: '#7468ff' },
    { id: 'stack' as const, label: 'Stack', icon: Code2, accent: '#00a982' },
    { id: 'reach' as const, label: 'Reach', icon: Mail, accent: '#e2b534' },
  ];
  const selected = tabs.find((tab) => tab.id === active);

  const choose = (id: RelayId) => {
    const nextIndex = tabs.findIndex((tab) => tab.id === id);
    if (active === id) {
      setActive(null);
      return;
    }
    setDirection(nextIndex >= previousIndex.current ? 1 : -1);
    previousIndex.current = nextIndex;
    setActive(id);
  };

  useLayoutEffect(() => {
    const card = shell.current;
    if (!card) return;
    const target = active ? (content.current?.scrollHeight ?? 224) + 78 : 72;
    gsap.to(card, {
      height: target,
      duration: reduced ? 0.01 : 0.68,
      ease: active ? 'elastic.out(1,.78)' : 'power4.inOut',
      overwrite: true,
    });
    if (active && content.current) {
      gsap.fromTo(
        content.current,
        { x: direction * 26, opacity: 0, filter: 'blur(7px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: reduced ? 0.01 : 0.46, ease: 'power4.out' },
      );
    }
    const button = active ? nav.current?.querySelector<HTMLButtonElement>(`button[data-relay="${active}"]`) : null;
    if (button && nav.current && indicator.current) {
      const parent = nav.current.getBoundingClientRect();
      const box = button.getBoundingClientRect();
      gsap.to(indicator.current, {
        x: box.left - parent.left,
        width: box.width,
        opacity: 1,
        backgroundColor: selected?.accent,
        duration: reduced ? 0.01 : 0.72,
        ease: 'elastic.out(1,.62)',
        overwrite: true,
      });
    } else {
      gsap.to(indicator.current, { opacity: 0, width: 28, duration: reduced ? 0.01 : 0.22 });
    }
  }, [active, direction, reduced, selected?.accent]);

  const panel = (() => {
    if (active === 'work')
      return (
        <div className="space-y-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <span className="font-mono text-[8px] uppercase tracking-[.18em] text-black/35">Selected work</span>
              <h3 className="mt-1 text-[1.65rem] font-semibold tracking-[-.055em]">Current orbit</h3>
            </div>
            <strong className="text-[11px] font-semibold text-[#ff6b45]">03 projects</strong>
          </div>
          {[
            ['01', 'Northstar', 'Product system', '+34% activation'],
            ['02', 'Field Notes', 'Mobile experience', '4.8 rating'],
            ['03', 'Relay', 'Developer tooling', '2.1× faster'],
          ].map(([index, name, role, result]) => (
            <button
              key={name}
              className="group grid w-full grid-cols-[28px_1fr_auto] items-center rounded-2xl border border-black/[.07] bg-black/[.025] px-3 py-3 text-left transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-white"
            >
              <span className="font-mono text-[8px] text-black/28">{index}</span>
              <span>
                <strong className="block text-[12px] font-semibold">{name}</strong>
                <small className="mt-0.5 block text-[9px] text-black/42">{role}</small>
              </span>
              <span className="text-[9px] font-semibold text-black/52 transition-transform group-hover:translate-x-0.5">
                {result}
              </span>
            </button>
          ))}
        </div>
      );
    if (active === 'pulse')
      return (
        <div>
          <div className="mb-5 flex items-start justify-between">
            <div>
              <span className="font-mono text-[8px] uppercase tracking-[.18em] text-black/35">Project pulse</span>
              <h3 className="mt-1 text-[1.65rem] font-semibold tracking-[-.055em]">Signals, not vanity.</h3>
            </div>
            <span className="rounded-full bg-[#7468ff]/10 px-2 py-1 text-[8px] font-semibold text-[#5c51df]">LIVE</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['12', 'Shipped'],
              ['98', 'Lighthouse'],
              ['4.7', 'Avg. score'],
            ].map(([value, label], index) => (
              <div key={label} className="rounded-2xl border border-black/[.07] bg-white p-3">
                <strong className="block text-[1.5rem] tracking-[-.06em]">
                  {value}
                  {index === 1 && <small className="text-[10px]">%</small>}
                </strong>
                <span className="mt-1 block text-[8px] text-black/38">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-12 items-end gap-1 rounded-2xl bg-[#7468ff]/[.07] px-3 pb-3">
            {[34, 52, 43, 72, 58, 86, 67, 94, 78, 100].map((height, index) => (
              <i
                key={index}
                className="flex-1 rounded-full bg-[#7468ff]"
                style={{ height: `${height}%`, opacity: 0.22 + index * 0.07 }}
              />
            ))}
          </div>
        </div>
      );
    if (active === 'stack')
      return (
        <div>
          <span className="font-mono text-[8px] uppercase tracking-[.18em] text-black/35">Working stack</span>
          <h3 className="mt-1 text-[1.65rem] font-semibold tracking-[-.055em]">Tools with a reason.</h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'GSAP', 'Tailwind', 'R3F', 'Figma'].map((tool, index) => (
              <span
                key={tool}
                className="rounded-full border border-black/[.08] bg-white px-3 py-2 text-[10px] font-semibold shadow-[0_5px_16px_rgba(0,0,0,.04)]"
                style={{ transform: `translateY(${index % 2 ? 5 : 0}px)` }}
              >
                {tool}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-[24rem] text-[10px] leading-4 text-black/44">
            A deliberately small stack for expressive interfaces without hiding the fundamentals.
          </p>
        </div>
      );
    if (active === 'reach')
      return (
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.18em] text-black/35">
              <i className="h-2 w-2 rounded-full bg-[#23b26d] shadow-[0_0_0_5px_rgba(35,178,109,.11)]" />
              Available September
            </span>
            <h3 className="mt-4 max-w-[18rem] text-[1.85rem] font-semibold leading-[.98] tracking-[-.06em]">
              Bring me the difficult interaction.
            </h3>
            <p className="mt-3 text-[10px] leading-4 text-black/42">UTC +08 · Replies within two days</p>
          </div>
          <a
            href="mailto:hello@example.com"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#161616] px-5 text-[10px] font-semibold !text-white no-underline shadow-[0_12px_28px_rgba(0,0,0,.18)]"
          >
            Start a project <ArrowUpRight size={14} />
          </a>
        </div>
      );
    return null;
  })();

  return (
    <div className="flex min-h-[36rem] w-full items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_22%_18%,rgba(116,104,255,.18),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(255,107,69,.2),transparent_30%),#e9edf4] p-4 sm:p-8">
      <section
        ref={shell}
        className="relative h-[18.5rem] w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-white/80 bg-[#f8f7f3]/95 text-[#171717] shadow-[inset_0_1px_0_#fff,0_30px_90px_rgba(42,48,70,.18)] backdrop-blur-xl"
      >
        <div className="absolute inset-x-0 top-0 bottom-[72px] overflow-hidden">
          <div
            ref={content}
            key={active ?? 'closed'}
            className="p-5 pb-4 sm:p-6 sm:pb-4"
            role="tabpanel"
            aria-live="polite"
          >
            {panel}
          </div>
        </div>
        <nav
          ref={nav}
          aria-label="Portfolio relay"
          className="absolute inset-x-2 bottom-2 grid h-14 grid-cols-4 rounded-[1.35rem] bg-[#171717] p-1.5 text-white shadow-[0_12px_30px_rgba(0,0,0,.2)]"
        >
          <span
            ref={indicator}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1.5 left-0 top-1.5 rounded-[.95rem]"
          />
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                data-relay={tab.id}
                onClick={() => choose(tab.id)}
                aria-selected={isActive}
                role="tab"
                className={`relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-[.95rem] px-2 text-[10px] font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/42 hover:text-white'}`}
              >
                <Icon size={14} />
                <span className={`${isActive ? 'block' : 'hidden sm:block'}`}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}

function ProjectBloomPrototype() {
  const projects = [
    {
      code: 'NS',
      title: 'Northstar',
      field: 'Fintech product system',
      role: 'Product design · Frontend',
      result: '+34%',
      resultLabel: 'activation',
      accent: '#ff6846',
      wash: '#ffdfd6',
      note: 'A calmer command center for high-stakes portfolio decisions.',
    },
    {
      code: 'FN',
      title: 'Field Notes',
      field: 'Mobile publishing',
      role: 'Design system · Motion',
      result: '4.8',
      resultLabel: 'store rating',
      accent: '#6c63ff',
      wash: '#e0ddff',
      note: 'A tactile writing space that makes publishing feel immediate.',
    },
    {
      code: 'RY',
      title: 'Relay',
      field: 'Developer workflow',
      role: 'Research · Engineering',
      result: '2.1×',
      resultLabel: 'faster',
      accent: '#009e7a',
      wash: '#cceee5',
      note: 'A deployment workflow built around readable system feedback.',
    },
    {
      code: 'FR',
      title: 'Forma',
      field: 'Spatial identity',
      role: 'Creative development',
      result: '11',
      resultLabel: 'markets',
      accent: '#d89916',
      wash: '#f5e6bd',
      note: 'An adaptable identity that behaves like material, not decoration.',
    },
  ];
  const [active, setActive] = useState<number | null>(0);
  const [direction, setDirection] = useState(1);
  const previous = useRef(0);
  const shell = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const project = active === null ? null : projects[active];

  const select = (index: number) => {
    if (active === index) {
      setActive(null);
      return;
    }
    setDirection(index >= previous.current ? 1 : -1);
    previous.current = index;
    setActive(index);
  };

  useLayoutEffect(() => {
    if (!shell.current) return;
    const targetHeight = active === null ? 72 : (panel.current?.scrollHeight ?? 300) + 72;
    gsap.to(shell.current, {
      height: targetHeight,
      duration: reduced ? 0.01 : 0.72,
      ease: active === null ? 'power4.inOut' : 'elastic.out(1,.82)',
      overwrite: true,
    });
    if (active !== null && panel.current) {
      const art = panel.current.querySelector('[data-bloom-art]');
      const copy = panel.current.querySelector('[data-bloom-copy]');
      gsap.fromTo(panel.current, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.01 : 0.24 });
      gsap.fromTo(
        art,
        { x: direction * 34, rotate: direction * 2.5, scale: 0.96 },
        { x: 0, rotate: 0, scale: 1, duration: reduced ? 0.01 : 0.76, ease: 'expo.out' },
      );
      gsap.fromTo(
        copy,
        { x: direction * 18, opacity: 0, filter: 'blur(7px)' },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: reduced ? 0.01 : 0.5,
          delay: reduced ? 0 : 0.08,
          ease: 'power4.out',
        },
      );
    }
    const button =
      active === null ? null : nav.current?.querySelector<HTMLButtonElement>(`button[data-bloom="${active}"]`);
    if (button && nav.current && indicator.current && project) {
      const parent = nav.current.getBoundingClientRect();
      const box = button.getBoundingClientRect();
      gsap.to(indicator.current, {
        x: box.left - parent.left,
        width: box.width,
        opacity: 1,
        backgroundColor: project.accent,
        duration: reduced ? 0.01 : 0.78,
        ease: 'elastic.out(1,.62)',
        overwrite: true,
      });
    } else {
      gsap.to(indicator.current, { opacity: 0, duration: reduced ? 0.01 : 0.2 });
    }
  }, [active, direction, project, reduced]);

  const artwork =
    active === 0 ? (
      <>
        <i className="absolute left-[18%] top-[18%] h-[64%] w-[64%] rounded-full border border-black/15" />
        <i className="absolute left-[30%] top-[30%] h-[40%] w-[40%] rounded-full border-[14px] border-black/[.07]" />
        <i className="absolute right-[16%] top-[18%] h-3 w-3 rounded-full bg-black" />
      </>
    ) : active === 1 ? (
      <>
        <i className="absolute inset-[14%] rounded-[1.3rem] border border-black/12 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,.08)_50%,transparent_51%),linear-gradient(transparent_49%,rgba(0,0,0,.08)_50%,transparent_51%)] bg-[size:34px_34px]" />
        <i className="absolute bottom-[18%] left-[20%] h-[32%] w-[58%] -rotate-6 rounded-xl bg-black/[.08] shadow-[12px_16px_0_rgba(0,0,0,.05)]" />
      </>
    ) : active === 2 ? (
      <>
        {[0, 1, 2, 3].map((item) => (
          <i
            key={item}
            className="absolute left-[18%] h-3 rounded-full bg-black"
            style={{ top: `${24 + item * 16}%`, width: `${62 - item * 8}%`, opacity: 1 - item * 0.18 }}
          />
        ))}
        <i className="absolute bottom-[16%] right-[17%] h-10 w-10 rounded-full border-[10px] border-black/[.08]" />
      </>
    ) : (
      <>
        <i className="absolute left-[17%] top-[18%] h-[52%] w-[34%] rotate-12 rounded-[1.5rem] bg-black/[.1]" />
        <i className="absolute right-[17%] top-[30%] h-[52%] w-[34%] -rotate-12 rounded-full border-[18px] border-black/[.09]" />
        <i className="absolute bottom-[16%] left-[34%] h-[2px] w-[34%] bg-black/30" />
      </>
    );

  return (
    <div
      className="flex min-h-[38rem] w-full items-end justify-center overflow-hidden p-4 transition-colors duration-700 sm:p-8"
      style={{
        background: `radial-gradient(circle at 20% 18%, ${project?.wash ?? '#e6e8ec'}, transparent 35%), radial-gradient(circle at 82% 78%, ${project?.accent ?? '#8b8f98'}33, transparent 32%), #e9ebef`,
      }}
    >
      <section
        ref={shell}
        className="relative h-[24rem] w-full max-w-[44rem] overflow-hidden rounded-[2rem] border border-white/85 bg-[#f8f7f2]/95 text-[#171717] shadow-[inset_0_1px_0_#fff,0_34px_100px_rgba(35,39,56,.2)] backdrop-blur-2xl"
      >
        <div className="absolute inset-x-0 top-0 bottom-[72px] overflow-hidden">
          {project && (
            <div
              ref={panel}
              key={project.code}
              className="grid min-h-[18rem] gap-4 p-4 sm:grid-cols-[.92fr_1.08fr] sm:p-5"
              role="tabpanel"
              aria-live="polite"
            >
              <div
                data-bloom-art
                className="relative min-h-[11rem] overflow-hidden rounded-[1.55rem] p-4"
                style={{ backgroundColor: project.wash }}
              >
                {artwork}
                <span className="absolute left-4 top-4 font-mono text-[8px] uppercase tracking-[.18em] text-black/38">
                  Project exposure
                </span>
                <strong className="absolute bottom-3 left-4 text-[4.2rem] font-semibold leading-none tracking-[-.1em] text-black/[.12]">
                  0{active! + 1}
                </strong>
                <span className="absolute bottom-4 right-4 rounded-full bg-black px-2.5 py-1 font-mono text-[8px] font-semibold text-white">
                  {project.code}
                </span>
              </div>
              <div data-bloom-copy className="flex min-w-0 flex-col justify-between px-1 py-1 sm:py-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[.17em] text-black/35">
                      {project.field}
                    </span>
                    <i
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: project.accent, boxShadow: `0 0 0 5px ${project.accent}1f` }}
                    />
                  </div>
                  <h3 className="mt-4 text-[2.35rem] font-semibold leading-[.9] tracking-[-.07em]">{project.title}</h3>
                  <p className="mt-3 max-w-[19rem] text-[10px] leading-4 text-black/45">{project.note}</p>
                </div>
                <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4 border-t border-black/10 pt-4">
                  <div>
                    <span className="block font-mono text-[7px] uppercase tracking-[.15em] text-black/30">Role</span>
                    <strong className="mt-1 block text-[10px] font-semibold">{project.role}</strong>
                  </div>
                  <div className="text-right">
                    <strong className="block text-[1.45rem] tracking-[-.06em]" style={{ color: project.accent }}>
                      {project.result}
                    </strong>
                    <span className="text-[8px] text-black/35">{project.resultLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <nav
          ref={nav}
          aria-label="Project bloom"
          className="absolute inset-x-2 bottom-2 grid h-14 grid-cols-4 rounded-[1.35rem] bg-[#151515] p-1.5 text-white shadow-[0_14px_32px_rgba(0,0,0,.23)]"
        >
          <span
            ref={indicator}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1.5 left-0 top-1.5 rounded-[.95rem]"
          />
          {projects.map((item, index) => {
            const selected = active === index;
            return (
              <button
                key={item.code}
                data-bloom={index}
                onClick={() => select(index)}
                role="tab"
                aria-selected={selected}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-[.95rem] px-2 transition-colors ${selected ? 'text-white' : 'text-white/42 hover:text-white'}`}
              >
                <span className="font-mono text-[8px] opacity-60">0{index + 1}</span>
                <strong className="text-[10px] font-semibold">{item.code}</strong>
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}

export function RouteLens() {
  type RouteId = 'index' | 'work' | 'profile' | 'connect';
  const routes = [
    {
      id: 'index' as const,
      label: 'Index',
      icon: Home,
      number: '01',
      accent: '#ff6b48',
      title: 'Begin with intent.',
      note: 'An editorial entrance to the work, the point of view, and what is happening now.',
      links: ['Manifesto', 'Selected work', 'Now'],
    },
    {
      id: 'work' as const,
      label: 'Work',
      icon: BriefcaseBusiness,
      number: '02',
      accent: '#776cff',
      title: 'Selected outcomes.',
      note: 'Case studies arranged by consequence rather than chronology or visual noise.',
      links: ['Northstar', 'Field Notes', 'Relay'],
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: UserRound,
      number: '03',
      accent: '#00a77f',
      title: 'The person in context.',
      note: 'A compact route through principles, capabilities, and the way the work gets made.',
      links: ['Story', 'Capabilities', 'Principles'],
    },
    {
      id: 'connect' as const,
      label: 'Connect',
      icon: Mail,
      number: '04',
      accent: '#d89b15',
      title: 'Make the next move.',
      note: 'Availability, direct contact, and the few details needed to start a useful conversation.',
      links: ['Availability', 'Email', 'GitHub'],
    },
  ];
  const [active, setActive] = useState<RouteId | null>('index');
  const [direction, setDirection] = useState(1);
  const previous = useRef(0);
  const shell = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const lens = useRef<HTMLSpanElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const route = routes.find((item) => item.id === active);

  const select = (id: RouteId) => {
    const index = routes.findIndex((item) => item.id === id);
    if (active === id) {
      setActive(null);
      return;
    }
    setDirection(index >= previous.current ? 1 : -1);
    previous.current = index;
    setActive(id);
  };

  useLayoutEffect(() => {
    if (!shell.current) return;
    const targetHeight = active === null ? 72 : (panel.current?.scrollHeight ?? 250) + 72;
    gsap.to(shell.current, {
      height: targetHeight,
      duration: reduced ? 0.01 : 0.7,
      ease: active === null ? 'power4.inOut' : 'elastic.out(1,.8)',
      overwrite: true,
    });
    const button = active ? nav.current?.querySelector<HTMLButtonElement>(`button[data-route-lens="${active}"]`) : null;
    if (button && nav.current && indicator.current && route) {
      const navBox = nav.current.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      gsap.to(indicator.current, {
        x: buttonBox.left - navBox.left,
        width: buttonBox.width,
        opacity: 1,
        backgroundColor: route.accent,
        duration: reduced ? 0.01 : 0.76,
        ease: 'elastic.out(1,.62)',
        overwrite: true,
      });
      const label = button.querySelector('[data-route-label]');
      if (label)
        gsap.fromTo(
          label,
          { width: 0, opacity: 0, x: -5 },
          {
            width: 'auto',
            opacity: 1,
            x: 0,
            duration: reduced ? 0.01 : 0.36,
            delay: reduced ? 0 : 0.08,
            ease: 'power3.out',
          },
        );
      if (lens.current && shell.current) {
        const shellBox = shell.current.getBoundingClientRect();
        const lensWidth = lens.current.getBoundingClientRect().width;
        const targetX = buttonBox.left + buttonBox.width / 2 - shellBox.left - lensWidth / 2;
        gsap.to(lens.current, {
          x: targetX,
          rotate: direction * 8,
          scale: 1,
          opacity: 0.86,
          duration: reduced ? 0.01 : 0.9,
          ease: 'elastic.out(1,.68)',
          overwrite: true,
        });
      }
    } else {
      gsap.to([indicator.current, lens.current], { opacity: 0, duration: reduced ? 0.01 : 0.2 });
    }
    if (active && panel.current) {
      const copy = panel.current.querySelector('[data-route-copy]');
      const links = panel.current.querySelectorAll('[data-route-link]');
      gsap.fromTo(
        copy,
        { x: direction * 24, opacity: 0, filter: 'blur(7px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: reduced ? 0.01 : 0.5, ease: 'power4.out' },
      );
      gsap.fromTo(
        links,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0.01 : 0.42,
          stagger: reduced ? 0 : 0.055,
          delay: reduced ? 0 : 0.1,
          ease: 'power3.out',
        },
      );
    }
  }, [active, direction, reduced, route]);

  return (
    <div className="flex min-h-[36rem] w-full items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_15%,rgba(119,108,255,.26),transparent_32%),radial-gradient(circle_at_84%_78%,rgba(255,107,72,.22),transparent_31%),#11131a] p-4 sm:p-8">
      <section
        ref={shell}
        className="relative h-[21rem] w-full max-w-[40rem] overflow-hidden rounded-[2rem] border border-white/20 bg-[#f5f4ef]/95 text-[#171717] shadow-[inset_0_1px_0_#fff,0_34px_100px_rgba(0,0,0,.32)] backdrop-blur-2xl"
      >
        <div className="absolute inset-x-0 top-0 bottom-[72px] overflow-hidden">
          <span
            ref={lens}
            aria-hidden="true"
            className="pointer-events-none absolute -left-0 top-5 h-36 w-36 rounded-full opacity-0 blur-[1px]"
            style={{
              background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.95), ${route?.accent ?? '#999'}55 44%, ${route?.accent ?? '#999'}18 68%, transparent 70%)`,
              boxShadow: `inset 0 0 0 1px ${route?.accent ?? '#999'}55, 0 22px 45px ${route?.accent ?? '#999'}1f`,
            }}
          />
          {route && (
            <div
              ref={panel}
              key={route.id}
              className="relative grid min-h-[16rem] gap-6 p-5 sm:grid-cols-[1.1fr_.9fr] sm:p-6"
              role="tabpanel"
              aria-live="polite"
            >
              <div data-route-copy className="relative z-10 flex min-w-0 flex-col justify-between">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[.18em] text-black/34">
                    Route {route.number} · Portfolio
                  </span>
                  <h3 className="mt-5 max-w-[18rem] text-[2.65rem] font-semibold leading-[.91] tracking-[-.075em]">
                    {route.title}
                  </h3>
                  <p className="mt-4 max-w-[20rem] text-[10px] leading-[1.55] text-black/46">{route.note}</p>
                </div>
                <a
                  href={`#${route.id}`}
                  className="mt-6 inline-flex w-fit items-center gap-2 text-[10px] font-semibold !text-black no-underline"
                >
                  Enter {route.label.toLowerCase()} <ArrowUpRight size={14} />
                </a>
              </div>
              <div className="relative z-10 self-end rounded-[1.45rem] border border-black/[.08] bg-white/60 p-2 shadow-[0_16px_45px_rgba(34,35,46,.08)] backdrop-blur-xl">
                <div className="flex items-center justify-between px-3 pb-3 pt-2">
                  <span className="font-mono text-[8px] uppercase tracking-[.16em] text-black/32">
                    Inside this route
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: route.accent, boxShadow: `0 0 0 5px ${route.accent}1b` }}
                  />
                </div>
                {route.links.map((link, index) => (
                  <button
                    data-route-link
                    key={link}
                    className="group grid w-full grid-cols-[24px_1fr_auto] items-center rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/[.045]"
                  >
                    <span className="font-mono text-[7px] text-black/26">0{index + 1}</span>
                    <strong className="text-[10px] font-semibold">{link}</strong>
                    <ArrowRight
                      size={12}
                      className="text-black/25 transition-transform group-hover:translate-x-1 group-hover:text-black"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <nav
          ref={nav}
          aria-label="Route Lens navigation"
          className="absolute inset-x-2 bottom-2 flex h-14 rounded-[1.35rem] bg-[#151515] p-1.5 text-white shadow-[0_14px_32px_rgba(0,0,0,.24)]"
        >
          <span
            ref={indicator}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1.5 left-0 top-1.5 rounded-[.95rem]"
          />
          {routes.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                data-route-lens={item.id}
                onClick={() => select(item.id)}
                role="tab"
                aria-label={item.label}
                aria-selected={selected}
                style={{ flexGrow: selected ? 1.75 : 1 }}
                className={`relative z-10 flex min-w-0 basis-0 items-center justify-center gap-2 overflow-hidden rounded-[.95rem] px-2 transition-[flex-grow,color] duration-500 ease-out ${selected ? 'text-white' : 'text-white/42 hover:text-white'}`}
              >
                <Icon size={14} className="shrink-0" />
                {selected && (
                  <strong data-route-label className="overflow-hidden whitespace-nowrap text-[10px] font-semibold">
                    {item.label}
                  </strong>
                )}
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}

const ExpandableTabPiece = lazy(() =>
  import('./ExpandableTab.js').then((module) => ({ default: module.ExpandableTab })),
);
const AtlasRevealPiece = lazy(() => import('./maps/AtlasReveal.js'));
const ClickKeyPiece = lazy(() => import('./buttons/ClickKey.js'));
const ResumeDownloadButtonPiece = lazy(() => import('./buttons/ResumeDownloadButton.js'));
const CopyLinkButtonPiece = lazy(() => import('./buttons/CopyLinkButton.js'));
const TextMotionPiece = lazy(() => import('./motion/TextMotion.js'));

const MercuryFlow = lazy(() => import('./effects/MercuryFlow.js'));
const MagneticHalftone = lazy(() => import('./effects/MagneticHalftone.js'));
const SpectralVeil = lazy(() => import('./effects/SpectralVeil.js'));
const fullbleedFallback = (
  <div className="showcase-fullbleed h-full min-h-[38rem] w-full bg-[#f3f3f5]" aria-label="Loading component" />
);
const inlineFallback = <div className="h-16 w-[236px] opacity-0" aria-label="Loading component" />;
const atlasFallback = <div className="aspect-[3/4] w-full max-w-[430px] opacity-0" aria-label="Loading map" />;
const previewAction = () => new Promise<void>((resolve) => window.setTimeout(resolve, 420));

function ButtonPreview({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[clamp(22rem,58vw,38rem)] w-full items-center justify-center bg-transparent p-8">
      {children}
    </div>
  );
}

export function MercuryFlowPiece() {
  return (
    <Suspense fallback={fullbleedFallback}>
      <MercuryFlow />
    </Suspense>
  );
}

export function MagneticHalftonePiece() {
  return (
    <Suspense fallback={fullbleedFallback}>
      <MagneticHalftone />
    </Suspense>
  );
}

export function SpectralVeilPiece() {
  return (
    <Suspense fallback={fullbleedFallback}>
      <SpectralVeil />
    </Suspense>
  );
}

export type PieceId =
  | 'text-motion'
  | 'lens-dock'
  | 'refraction-card'
  | 'mercury-tabs'
  | 'viscous-reel'
  | 'prism-contact'
  | 'glass-code'
  | 'expandable-tab'
  | 'atlas-reveal'
  | 'click-key'
  | 'resume-download'
  | 'copy-link'
  | 'liquid-mesh'
  | 'chromatic-lens'
  | 'solar-fabric';

export function PortfolioPiece({
  id,
  textMotionVariant = 'lift',
}: {
  id: PieceId;
  textMotionVariant?: TextMotionVariant;
}) {
  if (id === 'text-motion')
    return (
      <Suspense fallback={fullbleedFallback}>
        <TextMotionPiece variant={textMotionVariant} />
      </Suspense>
    );
  if (id === 'lens-dock') return <RibbonNavigation />;
  if (id === 'refraction-card') return <ProjectAperture />;
  if (id === 'mercury-tabs') return <PressureStack />;
  if (id === 'viscous-reel') return <SpatialIndex />;
  if (id === 'prism-contact') return <ContactCapsule />;
  if (id === 'glass-code') return <BuildReceipt />;
  if (id === 'expandable-tab')
    return (
      <Suspense fallback={inlineFallback}>
        <ExpandableTabPiece />
      </Suspense>
    );
  if (id === 'atlas-reveal')
    return (
      <div className="flex min-h-[38rem] w-full items-center justify-center p-5 sm:p-8">
        <Suspense fallback={atlasFallback}>
          <AtlasRevealPiece />
        </Suspense>
      </div>
    );
  if (id === 'click-key')
    return (
      <ButtonPreview>
        <Suspense fallback={inlineFallback}>
          <ClickKeyPiece onAction={previewAction} />
        </Suspense>
      </ButtonPreview>
    );
  if (id === 'resume-download')
    return (
      <ButtonPreview>
        <Suspense fallback={inlineFallback}>
          <ResumeDownloadButtonPiece href="/resume-demo.txt" filename="resume-demo.txt" fileLabel="Demo file · 1 KB" />
        </Suspense>
      </ButtonPreview>
    );
  if (id === 'copy-link')
    return (
      <ButtonPreview>
        <Suspense fallback={inlineFallback}>
          <CopyLinkButtonPiece />
        </Suspense>
      </ButtonPreview>
    );
  if (id === 'liquid-mesh') return <MercuryFlowPiece />;
  if (id === 'chromatic-lens') return <MagneticHalftonePiece />;
  return <SpectralVeilPiece />;
}

export default PortfolioPiece;
