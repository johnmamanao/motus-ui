import { Copy, RotateCcw } from 'lucide-react';
import { LottieLight } from 'lottie-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { MOTUS_DURATION, MOTUS_EASE } from '../system.js';

const easeIn = { x: [0.2], y: [1] };
const easeOut = { x: [0.8], y: [0] };
const frame = (time: number, start: number[], end: number[]) => ({ t: time, s: start, e: end, i: easeIn, o: easeOut });

const pageLayer = (index: number, start: number[], end: number[], opacity: number) => ({
  ddd: 0,
  ind: index,
  ty: 4,
  nm: `Copy sheet ${index}`,
  sr: 1,
  ks: {
    o: { a: 1, k: [frame(0, [opacity], [opacity]), frame(18, [opacity], [18]), { t: 32, s: [18] }] },
    r: { a: 0, k: 0 },
    p: { a: 1, k: [frame(0, [start[0], start[1], 0], [end[0], end[1], 0]), { t: 32, s: [end[0], end[1], 0] }] },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [
    { ty: 'rc', d: 1, s: { a: 0, k: [20, 23] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 4 }, nm: 'Sheet' },
    {
      ty: 'st',
      c: { a: 0, k: [1, 1, 1, 1] },
      o: { a: 0, k: 100 },
      w: { a: 0, k: 2.2 },
      lc: 2,
      lj: 2,
      ml: 4,
      nm: 'White stroke',
    },
    {
      ty: 'tr',
      p: { a: 0, k: [0, 0] },
      a: { a: 0, k: [0, 0] },
      s: { a: 0, k: [100, 100] },
      r: { a: 0, k: 0 },
      o: { a: 0, k: 100 },
      sk: { a: 0, k: 0 },
      sa: { a: 0, k: 0 },
      nm: 'Transform',
    },
  ],
  ip: 0,
  op: 54,
  st: 0,
  bm: 0,
});

const checkStroke = (index: number, width: number, position: number[], rotation: number, start: number) => ({
  ddd: 0,
  ind: index,
  ty: 4,
  nm: `Copied stroke ${index}`,
  sr: 1,
  ks: {
    o: { a: 1, k: [frame(start, [0], [100]), { t: 54, s: [100] }] },
    r: { a: 0, k: rotation },
    p: { a: 0, k: [position[0], position[1], 0] },
    a: { a: 0, k: [0, 0, 0] },
    s: {
      a: 1,
      k: [
        frame(start, [0, 100, 100], [112, 100, 100]),
        frame(start + 10, [112, 100, 100], [100, 100, 100]),
        { t: 54, s: [100, 100, 100] },
      ],
    },
  },
  ao: 0,
  shapes: [
    { ty: 'rc', d: 1, s: { a: 0, k: [width, 5] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 2.5 }, nm: 'Stroke' },
    { ty: 'fl', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'White fill' },
    {
      ty: 'tr',
      p: { a: 0, k: [0, 0] },
      a: { a: 0, k: [0, 0] },
      s: { a: 0, k: [100, 100] },
      r: { a: 0, k: 0 },
      o: { a: 0, k: 100 },
      sk: { a: 0, k: 0 },
      sa: { a: 0, k: 0 },
      nm: 'Transform',
    },
  ],
  ip: 0,
  op: 54,
  st: 0,
  bm: 0,
});

const copiedAnimation = {
  v: '5.12.2',
  fr: 60,
  ip: 0,
  op: 54,
  w: 48,
  h: 48,
  nm: 'Copy sheets resolve into confirmation',
  ddd: 0,
  assets: [],
  layers: [
    pageLayer(1, [18, 18], [24, 24], 52),
    pageLayer(2, [30, 30], [24, 24], 100),
    checkStroke(3, 11, [19, 27], 42, 21),
    checkStroke(4, 21, [30, 22], -43, 27),
  ],
};

export type CopyLinkButtonProps = {
  value?: string;
  onCopy?: (value: string) => void | Promise<void>;
  disabled?: boolean;
};

export default function CopyLinkButton({
  value = 'https://example.com/work',
  onCopy,
  disabled = false,
}: CopyLinkButtonProps) {
  const resetTimer = useRef<number | null>(null);
  const mounted = useRef(true);
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const reduceMotion = useReducedMotion();

  const copyLink = async () => {
    if (disabled || status === 'copying' || status === 'copied') return;
    setStatus('copying');
    try {
      if (onCopy) await onCopy(value);
      else if (navigator.clipboard) await navigator.clipboard.writeText(value);
      else throw new Error('Clipboard is unavailable');
      if (!mounted.current) return;
      setStatus('copied');
      resetTimer.current = window.setTimeout(() => setStatus('idle'), 1700);
    } catch {
      if (!mounted.current) return;
      setStatus('error');
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const copying = status === 'copying';
  const copied = status === 'copied';
  const failed = status === 'error';

  return (
    <motion.button
      type="button"
      onClick={() => void copyLink()}
      disabled={disabled || copying || copied}
      aria-busy={copying}
      initial={false}
      animate={{
        backgroundColor: copied ? '#eaf7ee' : failed ? '#fff0ef' : '#f5f5f7',
        color: copied ? '#175f35' : failed ? '#9c2f28' : '#1d1d1f',
      }}
      whileHover={status === 'idle' || failed ? { scale: 1.012 } : undefined}
      whileTap={status === 'idle' || failed ? { scale: 0.982 } : undefined}
      transition={reduceMotion ? { duration: 0 } : { duration: MOTUS_DURATION.standard, ease: MOTUS_EASE }}
      className={`flex h-14 w-[202px] items-center justify-between rounded-[16px] p-1.5 pl-5 text-[13px] font-semibold tracking-[-0.01em] shadow-[0_18px_42px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-4 disabled:opacity-75 ${copying ? 'cursor-wait' : disabled ? 'cursor-not-allowed' : copied ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ duration: reduceMotion ? 0 : MOTUS_DURATION.quick, ease: MOTUS_EASE }}
          className="whitespace-nowrap"
        >
          {copying ? 'Copying' : copied ? 'Copied' : failed ? 'Try again' : 'Copy link'}
        </motion.span>
      </AnimatePresence>

      <motion.span
        aria-hidden="true"
        animate={{ backgroundColor: copied ? '#176b3a' : failed ? '#a72f27' : '#111114' }}
        className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[12px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
      >
        {copied ? (
          <span className="size-8">
            <LottieLight src={copiedAnimation} autoplay={!reduceMotion} loop={false} />
          </span>
        ) : failed ? (
          <RotateCcw size={16} />
        ) : (
          <Copy size={16} strokeWidth={1.9} />
        )}
      </motion.span>

      <span className="sr-only" aria-live="polite">
        {copying ? 'Copying link.' : copied ? 'Link copied.' : failed ? 'Copy failed. Try again.' : ''}
      </span>
    </motion.button>
  );
}
