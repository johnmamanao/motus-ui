import { startTransition, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Clipboard,
  Code2,
  Download,
  Github,
  Maximize2,
  Menu,
  RotateCcw,
  X,
} from 'lucide-react';
import { gsap } from 'gsap';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import { PortfolioPiece, LiquidGlassDefs, type PieceId, type TextMotionVariant } from 'motus-ui';
import piecesSource from '../../../packages/motus-ui/src/PortfolioPieces.tsx?raw';
import mercuryFlowSource from '../../../packages/motus-ui/src/effects/MercuryFlow.tsx?raw';
import magneticHalftoneSource from '../../../packages/motus-ui/src/effects/MagneticHalftone.tsx?raw';
import spectralVeilSource from '../../../packages/motus-ui/src/effects/SpectralVeil.tsx?raw';
import expandableTabSource from '../../../packages/motus-ui/src/ExpandableTab.tsx?raw';
import clickKeySource from '../../../packages/motus-ui/src/buttons/ClickKey.tsx?raw';
import resumeDownloadSource from '../../../packages/motus-ui/src/buttons/ResumeDownloadButton.tsx?raw';
import copyLinkButtonSource from '../../../packages/motus-ui/src/buttons/CopyLinkButton.tsx?raw';
import textMotionSource from '../../../packages/motus-ui/src/motion/TextMotion.tsx?raw';
import {
  MotusMotionMark,
  HeroMotionIcon,
  LandingMotionIcon,
  MotionCheck,
  MotionReset,
  type LandingMotionIconKind,
} from './LottieMotion';

const TEXT_MOTION_VARIANTS: { id: TextMotionVariant; label: string }[] = [
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
];

type Piece = {
  id: PieceId;
  name: string;
  category: string;
  gesture: string;
  description: string;
  useCase: string;
  functionName: string;
  install?: string;
  runtime?: string;
  source?: string;
};
const PIECES: Piece[] = [
  {
    id: 'text-motion',
    name: 'Text Motion',
    category: 'Motion',
    gesture: 'Choose a style',
    description: 'A transparent text line with nineteen previewable motion variants.',
    useCase: 'Animated headline',
    functionName: 'TextMotion',
    runtime: 'GSAP',
    source: textMotionSource,
  },
  {
    id: 'lens-dock',
    name: 'Portfolio Nav',
    category: 'Navigation',
    gesture: 'Select',
    description: 'A compact navigation bar with an animated active item.',
    useCase: 'Main navigation',
    functionName: 'RibbonNavigation',
  },
  {
    id: 'click-key',
    name: 'Press Button',
    category: 'Buttons',
    gesture: 'Activate',
    description: 'A signal-style action with focused motion and a short audio cue.',
    useCase: 'Primary action',
    functionName: 'ClickKey',
    runtime: 'Motion · Web Audio',
    source: clickKeySource,
  },
  {
    id: 'resume-download',
    name: 'Resume Download',
    category: 'Buttons',
    gesture: 'Download',
    description: 'Downloads a résumé after the file animation finishes.',
    useCase: 'Résumé',
    functionName: 'ResumeDownloadButton',
    runtime: 'Motion · Lottie · Native download',
    source: resumeDownloadSource,
  },
  {
    id: 'copy-link',
    name: 'Copy Link',
    category: 'Buttons',
    gesture: 'Copy',
    description: 'Copies a project link and confirms it.',
    useCase: 'Share',
    functionName: 'CopyLinkButton',
    runtime: 'Motion · Lottie · Clipboard API',
    source: copyLinkButtonSource,
  },
  {
    id: 'refraction-card',
    name: 'Project Card',
    category: 'Projects',
    gesture: 'Open',
    description: 'A project card that opens to show details.',
    useCase: 'Featured project',
    functionName: 'ProjectAperture',
  },
  {
    id: 'mercury-tabs',
    name: 'Skills List',
    category: 'Content',
    gesture: 'Focus',
    description: 'A skills list that expands the focused item.',
    useCase: 'Skills',
    functionName: 'PressureStack',
  },
  {
    id: 'viscous-reel',
    name: 'Project List',
    category: 'Projects',
    gesture: 'Preview',
    description: 'A project list with a responsive preview.',
    useCase: 'Projects',
    functionName: 'SpatialIndex',
  },
  {
    id: 'prism-contact',
    name: 'Contact Card',
    category: 'Contact',
    gesture: 'Open',
    description: 'A contact card with email and copy actions.',
    useCase: 'Contact',
    functionName: 'ContactCapsule',
  },
  {
    id: 'glass-code',
    name: 'Tech Stack',
    category: 'Code',
    gesture: 'Inspect',
    description: 'A simple list of the tools used in a project.',
    useCase: 'Project stack',
    functionName: 'BuildReceipt',
  },
  {
    id: 'expandable-tab',
    name: 'Expandable Tabs',
    category: 'Navigation',
    gesture: 'Select',
    description: 'A vertical motion index paired with an editorial content canvas.',
    useCase: 'Section navigation',
    functionName: 'ExpandableTab',
    runtime: 'Motion · Accessible tabs',
    source: expandableTabSource,
  },
  {
    id: 'liquid-mesh',
    name: 'Silk Background',
    category: 'Backgrounds',
    gesture: 'Pointer',
    description: 'A light animated background that follows the pointer.',
    useCase: 'Page background',
    functionName: 'OpticalSilk',
    runtime: 'Canvas 2D · GSAP ticker',
    source: mercuryFlowSource,
  },
  {
    id: 'chromatic-lens',
    name: 'Halftone Background',
    category: 'Backgrounds',
    gesture: 'Pointer',
    description: 'A halftone background that reacts to the pointer.',
    useCase: 'Section background',
    functionName: 'MagneticHalftone',
    runtime: 'Canvas 2D · GSAP ticker',
    source: magneticHalftoneSource,
  },
  {
    id: 'solar-fabric',
    name: 'Light Background',
    category: 'Backgrounds',
    gesture: 'Ambient motion',
    description: 'A soft animated background for hero sections.',
    useCase: 'Hero background',
    functionName: 'SpectralVeil',
    runtime: 'Canvas 2D · GSAP ticker',
    source: spectralVeilSource,
  },
];
const CODE_THEME: PrismTheme = {
  plain: { color: '#dfe7ff', backgroundColor: '#07080d' },
  styles: [
    { types: ['keyword', 'operator'], style: { color: '#f38ba8' } },
    { types: ['string', 'attr-value'], style: { color: '#a6e3a1' } },
    { types: ['function', 'class-name'], style: { color: '#89b4fa' } },
    { types: ['tag', 'property'], style: { color: '#94e2d5' } },
    { types: ['comment'], style: { color: '#6c7086', fontStyle: 'italic' } },
    { types: ['number', 'boolean'], style: { color: '#fab387' } },
    { types: ['punctuation'], style: { color: '#cba6f7' } },
  ],
};

function sourceFor(piece: Piece) {
  if (piece.source) return piece.source;
  const imports = piecesSource.slice(0, piecesSource.indexOf('\nconst glass ='));
  const navigationImports =
    piece.functionName === 'RibbonNavigation'
      ? `import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';\nimport { BriefcaseBusiness, Home, Mail, UserRound } from 'lucide-react';\nimport { gsap } from 'gsap';`
      : null;
  const shared = navigationImports ?? imports;
  const start = piecesSource.indexOf(`export function ${piece.functionName}`);
  const next = piecesSource.indexOf('\nexport function ', start + 16);
  const type = piecesSource.indexOf('\nexport type PieceId', start + 16);
  const prototype = piecesSource.indexOf('\nfunction ContextRelayPrototype', start + 16);
  const lazyBoundary = piecesSource.indexOf('\nconst MercuryFlow = lazy', start + 16);
  const end = Math.min(...[next, type, prototype, lazyBoundary].filter((position) => position > start));
  return `${shared.trim()}\n\n${piecesSource.slice(start, end).trim()}\n`;
}
function slugFor(piece: Piece) {
  return piece.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
function usageFor(piece: Piece) {
  const path = `@/components/motus-ui/${slugFor(piece)}`;
  const examples: Partial<Record<PieceId, string>> = {
    'text-motion': `import { TextMotion } from '${path}';\n\nexport default function WorkHeading() {\n  return (\n    <TextMotion\n      text="SELECTED WORK"\n      alternateText="CREATIVE CODE"\n      variant="ticker"\n    />\n  );\n}`,
    'click-key': `import ClickKey from '${path}';\n\nexport default function PrimaryAction() {\n  return <ClickKey onAction={() => console.log('Pressed')} />;\n}`,
    'resume-download': `import ResumeDownloadButton from '${path}';\n\nexport default function ResumeLink() {\n  return <ResumeDownloadButton href="/resume.pdf" filename="resume.pdf" />;\n}`,
    'copy-link': `import CopyLinkButton from '${path}';\n\nexport default function ShareProject() {\n  return <CopyLinkButton value="https://example.com/work" />;\n}`,
    'expandable-tab': `import { ExpandableTab } from '${path}';\n\nexport default function AppNavigation() {\n  return <ExpandableTab />;\n}`,
  };
  return (
    examples[piece.id] ??
    `import { ${piece.functionName} } from '${path}';\n\nexport default function Example() {\n  return <${piece.functionName} />;\n}`
  );
}
function Mark({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  return <MotusMotionMark tone={tone} className={`mark ${className}`} />;
}
function AnimatedCheck({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return <MotionCheck tone={tone} />;
}
function navigateTo(path: string, setPath: (path: string) => void) {
  window.history.pushState({}, '', path);
  startTransition(() => setPath(path));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function SiteHeader({ path, navigate }: { path: string; navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const go = (next: string) => {
    setOpen(false);
    navigate(next);
  };
  return (
    <>
      <header className="site-header">
        <button className="brand" onClick={() => go('/')} aria-label="Motus home">
          <Mark />
          <span>Motus</span>
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
          <button className={path.startsWith('/components') ? 'active' : ''} onClick={() => go('/components')}>
            <Boxes size={16} aria-hidden="true" />
            <span>Components</span>
          </button>
          <a
            className="nav-source"
            href="https://github.com/johnmamanao/motus-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the Motus UI GitHub repository"
            title="GitHub repository"
          >
            <Github size={16} aria-hidden="true" />
            <span className="nav-source-label">GitHub</span>
            <ArrowUpRight className="nav-external-icon" size={13} aria-hidden="true" />
          </a>
        </nav>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </header>
    </>
  );
}

function HomePage({ navigate }: { navigate: (path: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const homeVariantPicker = useRef<HTMLDivElement>(null);
  const homeVariantTrigger = useRef<HTMLButtonElement>(null);
  const showcase: { piece: Piece; icon: LandingMotionIconKind }[] = [
    { piece: PIECES.find((piece) => piece.id === 'text-motion')!, icon: 'tune' },
    { piece: PIECES.find((piece) => piece.id === 'lens-dock')!, icon: 'preview' },
    { piece: PIECES.find((piece) => piece.id === 'refraction-card')!, icon: 'press' },
    { piece: PIECES.find((piece) => piece.id === 'copy-link')!, icon: 'copy' },
  ];
  const [showcaseId, setShowcaseId] = useState<PieceId>('text-motion');
  const [homeTextMotionVariant, setHomeTextMotionVariant] = useState<TextMotionVariant>('lift');
  const [homeVariantMenuOpen, setHomeVariantMenuOpen] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);
  const activeShowcase = showcase.find(({ piece }) => piece.id === showcaseId) ?? showcase[0];
  const activeHomeVariant =
    TEXT_MOTION_VARIANTS.find((item) => item.id === homeTextMotionVariant) ?? TEXT_MOTION_VARIANTS[0];

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText('npm install motus-ui');
      setInstallCopied(true);
      window.setTimeout(() => setInstallCopied(false), 1400);
    } catch {
      setInstallCopied(false);
    }
  };

  useEffect(() => {
    if (!homeVariantMenuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!homeVariantPicker.current?.contains(event.target as Node)) setHomeVariantMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setHomeVariantMenuOpen(false);
      homeVariantTrigger.current?.focus();
    };
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [homeVariantMenuOpen]);

  useEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.home-symbol', { opacity: 0, scale: 0.94, y: 12, duration: 0.65 })
        .from('.home-kicker', { opacity: 0, y: 10, duration: 0.45 }, '-=.35')
        .from('.home-hero h1 span', { yPercent: 108, duration: 0.76, stagger: 0.08 }, '-=.3')
        .from('.home-lead, .home-actions', { opacity: 0, y: 16, duration: 0.5, stagger: 0.07 }, '-=.38');

      const observers: IntersectionObserver[] = [];
      const reveal = (selector: string, targets: string, stagger: number) => {
        const section = root.current?.querySelector(selector);
        if (!section) return;
        const elements = section.querySelectorAll(targets);
        gsap.set(elements, { opacity: 0, y: 18 });
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger,
              ease: 'power3.out',
              clearProps: 'transform',
            });
            observer.disconnect();
          },
          { threshold: 0.14 },
        );
        observer.observe(section);
        observers.push(observer);
      };
      reveal(
        '.home-showcase',
        '.home-showcase-head > *, .home-showcase-window, .home-showcase-picker, .home-showcase-foot',
        0.055,
      );
      return () => observers.forEach((observer) => observer.disconnect());
    }, root);
    return () => context.revert();
  }, []);
  return (
    <div className="site home-page" ref={root}>
      <SiteHeader path="/" navigate={navigate} />
      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero-glow" aria-hidden="true" />
          <div className="home-symbol">
            <HeroMotionIcon tone="light" />
          </div>
          <p className="home-kicker">Motus · React component library</p>
          <h1 id="home-title">
            <span>Motion, without</span>
            <span>the mess.</span>
          </h1>
          <p className="home-lead">Portfolio components you can try, copy, and change.</p>
          <div className="home-actions">
            <button className="home-primary-action" onClick={() => navigate('/components')}>
              Browse components <ArrowRight size={17} />
            </button>
            <button
              className={installCopied ? 'home-install copied' : 'home-install'}
              onClick={copyInstallCommand}
              aria-label={installCopied ? 'Install command copied' : 'Copy npm install command'}
            >
              <code>{installCopied ? 'Copied to clipboard' : 'npm install motus-ui'}</code>
              {installCopied ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />}
            </button>
          </div>
        </section>
        <section className="home-showcase" id="featured" aria-labelledby="library-title">
          <header className="home-showcase-head">
            <p>Live components</p>
            <h2 id="library-title">Try one here.</h2>
            <span>These are the real components. Click, drag, type, or switch between them below.</span>
          </header>
          <div className="home-showcase-window">
            <div className="home-showcase-bar">
              <span>
                <i />
                <i />
                <i />
              </span>
              <strong>{activeShowcase.piece.name}</strong>
              {showcaseId === 'text-motion' ? (
                <div className="home-variant-picker" ref={homeVariantPicker}>
                  <button
                    ref={homeVariantTrigger}
                    className="home-variant-trigger"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={homeVariantMenuOpen}
                    aria-label={`Choose text animation. Current variant: ${activeHomeVariant.label}`}
                    onClick={() => setHomeVariantMenuOpen((open) => !open)}
                  >
                    <span>Animation</span>
                    <b>{activeHomeVariant.label}</b>
                    <ChevronDown size={13} className={homeVariantMenuOpen ? 'open' : ''} />
                  </button>
                  <div
                    className={`home-variant-menu ${homeVariantMenuOpen ? 'open' : ''}`}
                    role="listbox"
                    aria-label="Text Motion animation variants"
                  >
                    <header>
                      <strong>Choose animation</strong>
                      <span>{TEXT_MOTION_VARIANTS.length} variants</span>
                    </header>
                    <div>
                      {TEXT_MOTION_VARIANTS.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={item.id === homeTextMotionVariant}
                          onClick={() => {
                            setHomeTextMotionVariant(item.id);
                            setHomeVariantMenuOpen(false);
                            window.requestAnimationFrame(() => homeVariantTrigger.current?.focus());
                          }}
                        >
                          <small>{String(index + 1).padStart(2, '0')}</small>
                          <span>{item.label}</span>
                          {item.id === homeTextMotionVariant && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <em>Live preview</em>
              )}
            </div>
            <div className="home-showcase-stage" key={showcaseId}>
              <PortfolioPiece id={showcaseId} textMotionVariant={homeTextMotionVariant} />
            </div>
          </div>
          <div className="home-showcase-picker" role="tablist" aria-label="Choose a component preview">
            {showcase.map(({ piece, icon }, index) => (
              <button
                key={piece.id}
                role="tab"
                aria-selected={showcaseId === piece.id}
                onClick={() => {
                  setShowcaseId(piece.id);
                  setHomeVariantMenuOpen(false);
                }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <LandingMotionIcon kind={icon} tone="dark" />
                <strong>{piece.name}</strong>
              </button>
            ))}
          </div>
          <div className="home-showcase-foot">
            <div>
              <small>{activeShowcase.piece.category}</small>
              <p>{activeShowcase.piece.description}</p>
            </div>
            <button className="home-showcase-open" onClick={() => navigate(`/components/${activeShowcase.piece.id}`)}>
              Open {activeShowcase.piece.name} <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
      </main>
      <footer className="home-footer">
        <div className="home-footer-main">
          <div className="home-footer-brand">
            <button className="brand" onClick={() => navigate('/')} aria-label="Back to Motus home">
              <Mark />
              <span>Motus</span>
            </button>
            <p>Motion-focused React components for expressive portfolio interfaces.</p>
          </div>
        </div>
        <div className="home-footer-meta">
          <span>Open source · MIT</span>
          <span>React 18.2+</span>
          <a href="https://www.npmjs.com/package/motus-ui" target="_blank" rel="noreferrer">
            View package <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
    </div>
  );
}

function DetailPage({ piece, navigate }: { piece: Piece; navigate: (path: string) => void }) {
  const initialView = new URLSearchParams(window.location.search).get('view');
  const initialSourceOpen = initialView === 'source' || initialView === 'usage';
  const [sidebarOpen, setSidebarOpen] = useState(
    () => (window.innerWidth >= 900 || window.location.pathname === '/components') && !initialSourceOpen,
  );
  const [sourceOpen, setSourceOpen] = useState(initialSourceOpen);
  const [drawerView, setDrawerView] = useState<'source' | 'usage'>(initialView === 'usage' ? 'usage' : 'source');
  const [grouped, setGrouped] = useState(true);
  const [copied, setCopied] = useState<'source' | 'usage' | 'install' | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [textMotionVariant, setTextMotionVariant] = useState<TextMotionVariant>('lift');
  const [variantMenuOpen, setVariantMenuOpen] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const workspace = useRef<HTMLElement>(null);
  const variantPicker = useRef<HTMLDivElement>(null);
  const source = sourceFor(piece);
  const usage = usageFor(piece);
  const install = piece.install ?? `npx @motus-ui/cli@latest add ${slugFor(piece)}`;
  const categories = [...new Set(PIECES.map((item) => item.category))];

  useEffect(() => {
    setPreviewKey((key) => key + 1);
    setVariantMenuOpen(false);
    if (window.innerWidth < 900 && window.location.pathname !== '/components') setSidebarOpen(false);
  }, [piece.id]);

  useEffect(() => {
    if (!variantMenuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!variantPicker.current?.contains(event.target as Node)) setVariantMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [variantMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (sourceOpen) {
        setSourceOpen(false);
        const next = new URL(window.location.href);
        next.searchParams.set('view', 'preview');
        window.history.replaceState({}, '', next);
      } else setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sourceOpen]);

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async (value: string, target: 'source' | 'usage' | 'install') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(target);
      setCopyStatus(
        target === 'install' ? 'Install command copied.' : target === 'usage' ? 'Example copied.' : 'Source copied.',
      );
      window.setTimeout(() => {
        setCopied(null);
        setCopyStatus('');
      }, 1400);
    } catch {
      setCopyStatus('Copy failed. Select the text and copy it manually.');
    }
  };
  const reset = () => {
    setPreviewKey((key) => key + 1);
    if (piece.id === 'text-motion') setTextMotionVariant('lift');
    setVariantMenuOpen(false);
    setResetting(true);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setResetting(false), 850);
    gsap.fromTo(
      '.motus-lab-preview-piece',
      { opacity: 0.3, scale: 0.965 },
      { opacity: 1, scale: 1, duration: 0.55, ease: 'power4.out' },
    );
  };
  const fullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await workspace.current?.requestFullscreen();
  };
  const toggleSource = (open: boolean) => {
    setSourceOpen(open);
    if (open) setSidebarOpen(false);
    const next = new URL(window.location.href);
    next.searchParams.set('view', open ? drawerView : 'preview');
    window.history.replaceState({}, '', next);
  };
  const selectDrawerView = (view: 'source' | 'usage') => {
    setDrawerView(view);
    const next = new URL(window.location.href);
    next.searchParams.set('view', view);
    window.history.replaceState({}, '', next);
  };
  const download = () => {
    const href = URL.createObjectURL(new Blob([source], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${slugFor(piece)}.tsx`;
    anchor.click();
    URL.revokeObjectURL(href);
  };
  const choose = (item: Piece) => {
    setSourceOpen(false);
    navigate(`/components/${item.id}`);
  };
  const renderLink = (item: Piece) => {
    return (
      <button
        key={item.id}
        className={item.id === piece.id ? 'active' : ''}
        aria-current={item.id === piece.id ? 'page' : undefined}
        onClick={() => choose(item)}
      >
        <span className="rail-tick" aria-hidden="true" />
        <span className="rail-copy">
          <strong>{item.name}</strong>
        </span>
        <ArrowRight className="rail-arrow" size={13} aria-hidden="true" />
      </button>
    );
  };
  const renderSection = (category: string, items: Piece[]) => (
    <section key={category} data-category={category.toLowerCase()}>
      <header className="rail-section-head">
        <h2>{category}</h2>
        <span aria-hidden="true" />
      </header>
      {items.map(renderLink)}
    </section>
  );

  return (
    <div className="motus-lab">
      <section
        ref={workspace}
        className={['motus-lab-workspace', sidebarOpen && 'catalog-is-open', sourceOpen && 'docs-is-open']
          .filter(Boolean)
          .join(' ')}
        aria-label={piece.name + ' component workspace'}
      >
        <header className="motus-lab-header">
          <button className="motus-lab-brand" onClick={() => navigate('/')} aria-label="Back to Motus home">
            <Mark />
            <span>Motus</span>
          </button>
          <div className="motus-lab-identity">
            <span>Component studio</span>
            <i aria-hidden="true">/</i>
            <strong>{piece.name}</strong>
          </div>
          <div className="motus-lab-tools" role="toolbar" aria-label="Preview controls">
            {piece.id === 'text-motion' && (
              <div className="motus-lab-variant" ref={variantPicker}>
                <button
                  className="motus-lab-variant-trigger"
                  aria-label={
                    'Choose animation. Current: ' +
                    TEXT_MOTION_VARIANTS.find((item) => item.id === textMotionVariant)?.label
                  }
                  aria-haspopup="listbox"
                  aria-expanded={variantMenuOpen}
                  aria-controls="text-motion-variants"
                  onClick={() => setVariantMenuOpen((open) => !open)}
                >
                  <span>{TEXT_MOTION_VARIANTS.find((item) => item.id === textMotionVariant)?.label}</span>
                  <ChevronDown className={variantMenuOpen ? 'open' : ''} size={13} />
                </button>
                <div
                  id="text-motion-variants"
                  className={'motus-lab-variant-menu ' + (variantMenuOpen ? 'open' : '')}
                  role="listbox"
                  aria-label="Animation variants"
                  aria-hidden={!variantMenuOpen}
                  inert={!variantMenuOpen}
                >
                  <header>
                    <strong>Animation</strong>
                    <span>{TEXT_MOTION_VARIANTS.length} styles</span>
                  </header>
                  {TEXT_MOTION_VARIANTS.map((item, index) => (
                    <button
                      key={item.id}
                      role="option"
                      aria-selected={item.id === textMotionVariant}
                      onClick={() => {
                        setTextMotionVariant(item.id);
                        setVariantMenuOpen(false);
                      }}
                    >
                      <small>{String(index + 1).padStart(2, '0')}</small>
                      <span>{item.label}</span>
                      {item.id === textMotionVariant && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              className={'motus-lab-tool motus-lab-browse ' + (sidebarOpen ? 'active' : '')}
              aria-label={sidebarOpen ? 'Close component catalog' : 'Browse components'}
              aria-expanded={sidebarOpen}
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                setSourceOpen(false);
              }}
            >
              <Boxes size={16} />
              <span>Browse</span>
            </button>
            <span className="motus-lab-divider" aria-hidden="true" />
            <button
              className="motus-lab-tool icon-only fullscreen-tool"
              aria-label="Toggle fullscreen"
              onClick={fullscreen}
            >
              <Maximize2 size={16} />
            </button>
            <button className="motus-lab-tool icon-only" aria-label="Reset component" onClick={reset}>
              {resetting ? <MotionReset playKey={previewKey} /> : <RotateCcw size={16} />}
            </button>
            <button
              className={'motus-lab-tool motus-lab-code ' + (sourceOpen ? 'active' : '')}
              aria-label="View source code"
              aria-pressed={sourceOpen}
              onClick={() => toggleSource(!sourceOpen)}
            >
              <Code2 size={16} />
              <span>Code</span>
            </button>
          </div>
        </header>

        <main className="motus-lab-body">
          <section className="motus-lab-stage" aria-label={piece.name + ' interactive preview'}>
            <div className="motus-lab-stage-meta top-left" aria-hidden="true">
              <span>Interactive preview</span>
              <i />
            </div>
            <span className="motus-lab-stage-meta top-right" aria-hidden="true">
              M–{String(PIECES.indexOf(piece) + 1).padStart(2, '0')}
            </span>
            <div className="motus-lab-preview-piece" data-piece={piece.id}>
              <PortfolioPiece id={piece.id} textMotionVariant={textMotionVariant} key={piece.id + '-' + previewKey} />
            </div>
            <span className="motus-lab-stage-meta bottom-left" aria-hidden="true">
              {piece.category}
            </span>
          </section>

          <button
            className={'motus-lab-backdrop ' + (sidebarOpen || sourceOpen ? 'visible' : '')}
            aria-label="Close inspector"
            aria-hidden={!sidebarOpen && !sourceOpen}
            tabIndex={sidebarOpen || sourceOpen ? 0 : -1}
            onClick={() => {
              setSidebarOpen(false);
              if (sourceOpen) toggleSource(false);
            }}
          />

          <aside
            className={'motus-lab-panel motus-lab-catalog ' + (sidebarOpen ? 'open' : '')}
            aria-label="Component catalog"
            aria-hidden={!sidebarOpen}
            inert={!sidebarOpen}
          >
            <header className="motus-lab-panel-head">
              <div>
                <span>Library</span>
                <strong>Browse components</strong>
              </div>
              <button aria-label="Close component catalog" onClick={() => setSidebarOpen(false)}>
                <X size={16} />
              </button>
            </header>
            <button className="motus-lab-group-toggle" aria-pressed={grouped} onClick={() => setGrouped(!grouped)}>
              <span>View</span>
              <i>
                {grouped ? 'By category' : 'All components'}
                <ChevronsUpDown size={13} />
              </i>
            </button>
            <nav className="motus-lab-component-nav" aria-label="Choose component">
              {grouped
                ? categories.map((category) =>
                    renderSection(
                      category,
                      PIECES.filter((item) => item.category === category),
                    ),
                  )
                : renderSection('All', PIECES)}
            </nav>
            <div className="motus-lab-install">
              <span>Install {piece.name}</span>
              <button onClick={() => copy(install, 'install')}>
                <code>{install}</code>
                {copied === 'install' ? <AnimatedCheck /> : <Clipboard size={14} />}
              </button>
            </div>
          </aside>

          <aside
            className={'motus-lab-panel motus-lab-docs ' + (sourceOpen ? 'open' : '')}
            aria-label="Component code and usage"
            aria-hidden={!sourceOpen}
            inert={!sourceOpen}
          >
            <header className="motus-lab-panel-head">
              <div>
                <span>Documentation</span>
                <strong>{drawerView === 'source' ? slugFor(piece) + '.tsx' : 'Use ' + piece.name}</strong>
              </div>
              <div className="motus-lab-panel-actions">
                {drawerView === 'source' && (
                  <button aria-label="Download source file" onClick={download}>
                    <Download size={16} />
                  </button>
                )}
                <button
                  aria-label={drawerView === 'source' ? 'Copy source' : 'Copy usage example'}
                  onClick={() => copy(drawerView === 'source' ? source : usage, drawerView)}
                >
                  {copied === drawerView ? <AnimatedCheck /> : <Clipboard size={16} />}
                </button>
                <button aria-label="Close component documentation" onClick={() => toggleSource(false)}>
                  <X size={16} />
                </button>
              </div>
            </header>
            <nav className="motus-lab-doc-tabs" aria-label="Component documentation" role="tablist">
              <button role="tab" aria-selected={drawerView === 'source'} onClick={() => selectDrawerView('source')}>
                Source
              </button>
              <button role="tab" aria-selected={drawerView === 'usage'} onClick={() => selectDrawerView('usage')}>
                Usage
              </button>
            </nav>
            {drawerView === 'source' ? (
              <div className="motus-lab-source">
                {sourceOpen && (
                  <Highlight theme={CODE_THEME} code={source} language="tsx">
                    {({ tokens, getLineProps, getTokenProps }) => (
                      <pre>
                        <code>
                          {tokens.map((line, lineIndex) => (
                            <span {...getLineProps({ line })} className="source-line" key={lineIndex}>
                              <i>{String(lineIndex + 1).padStart(2, '0')}</i>
                              <span>
                                {line.map((token, tokenIndex) => (
                                  <span key={tokenIndex} {...getTokenProps({ token })} />
                                ))}
                              </span>
                            </span>
                          ))}
                        </code>
                      </pre>
                    )}
                  </Highlight>
                )}
              </div>
            ) : (
              <div className="motus-lab-usage">
                <header>
                  <span>Quick start</span>
                  <h2>Use {piece.name}</h2>
                  <p>{piece.description}</p>
                </header>
                <section>
                  <div>
                    <i>01</i>
                    <span>
                      <strong>Install</strong>
                      <small>Add the component to your project.</small>
                    </span>
                  </div>
                  <button onClick={() => copy(install, 'install')}>
                    <code>{install}</code>
                    {copied === 'install' ? <AnimatedCheck /> : <Clipboard size={15} />}
                  </button>
                </section>
                <section>
                  <div>
                    <i>02</i>
                    <span>
                      <strong>Import and render</strong>
                      <small>Paste this where you want the component.</small>
                    </span>
                  </div>
                  <Highlight theme={CODE_THEME} code={usage} language="tsx">
                    {({ tokens, getLineProps, getTokenProps }) => (
                      <pre>
                        <code>
                          {tokens.map((line, lineIndex) => (
                            <span {...getLineProps({ line })} className="source-line" key={lineIndex}>
                              <i>{String(lineIndex + 1).padStart(2, '0')}</i>
                              <span>
                                {line.map((token, tokenIndex) => (
                                  <span key={tokenIndex} {...getTokenProps({ token })} />
                                ))}
                              </span>
                            </span>
                          ))}
                        </code>
                      </pre>
                    )}
                  </Highlight>
                </section>
              </div>
            )}
          </aside>
          <span className="motus-lab-status" aria-live="polite">
            {copyStatus}
          </span>
        </main>
      </section>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPopState = () => startTransition(() => setPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => {
    if (window.location.hash)
      window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth' }), 0);
  }, [path]);
  const navigate = (next: string) => navigateTo(next, setPath);
  const id = path.split('/components/')[1] as PieceId | undefined,
    piece = PIECES.find((item) => item.id === id);
  const componentPiece = piece ?? (path === '/components' ? PIECES[0] : undefined);
  return (
    <>
      <LiquidGlassDefs />
      {componentPiece ? <DetailPage piece={componentPiece} navigate={navigate} /> : <HomePage navigate={navigate} />}
    </>
  );
}
