'use client';

import { Check, Download, RotateCcw } from 'lucide-react';
import { LottieLight } from 'lottie-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const easeIn = { x: [0.2], y: [1] };
const easeOut = { x: [0.8], y: [0] };
const frame = (time: number, start: number[], end: number[]) => ({ t: time, s: start, e: end, i: easeIn, o: easeOut });

const TRANSFER_DURATION_MS = 740;

const transferAnimation = {
  v: '5.12.2', fr: 90, ip: 0, op: 66, w: 52, h: 52, nm: 'Document enters download tray', ddd: 0, assets: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: 'Document', sr: 1,
      ks: {
        o: { a: 1, k: [frame(0, [100], [100]), frame(45, [100], [20]), { t: 66, s: [20] }] },
        r: { a: 1, k: [frame(0, [-4], [2]), frame(26, [2], [0]), { t: 66, s: [0] }] },
        p: { a: 1, k: [frame(0, [26, 15, 0], [26, 30, 0]), frame(38, [26, 30, 0], [26, 34, 0]), { t: 66, s: [26, 34, 0] }] },
        a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: [frame(0, [100, 100, 100], [94, 94, 100]), { t: 66, s: [94, 94, 100] }] },
      },
      ao: 0,
      shapes: [
        { ty: 'rc', d: 1, s: { a: 0, k: [20, 25] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 3 }, nm: 'Page' },
        { ty: 'fl', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'Page fill' },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
      ], ip: 0, op: 66, st: 0, bm: 0,
    },
    {
      ddd: 0, ind: 2, ty: 4, nm: 'Tray', sr: 1,
      ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [26, 36, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: [frame(18, [88, 100, 100], [105, 100, 100]), frame(33, [105, 100, 100], [100, 100, 100]), { t: 66, s: [100, 100, 100] }] } },
      ao: 0,
      shapes: [
        { ty: 'rc', d: 1, s: { a: 0, k: [28, 4] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 2 }, nm: 'Slot' },
        { ty: 'fl', c: { a: 0, k: [0.64, 0.98, 0.72, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'Slot fill' },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
      ], ip: 0, op: 66, st: 0, bm: 0,
    },
  ],
};

type ResumeDownloadButtonProps = {
  href?: string;
  filename?: string;
  fileLabel?: string;
  onDownload?: () => void | Promise<void>;
  disabled?: boolean;
};

export default function ResumeDownloadButton({
  href = '/resume.pdf',
  filename = 'resume.pdf',
  fileLabel = 'PDF · résumé',
  onDownload,
  disabled = false,
}: ResumeDownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'preparing' | 'started' | 'error'>('idle');
  const resetTimer = useRef<number | null>(null);
  const mounted = useRef(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const downloadResume = async () => {
    if (disabled || status === 'preparing' || status === 'started') return;
    setStatus('preparing');

    try {
      if (!reduceMotion) await new Promise((resolve) => window.setTimeout(resolve, TRANSFER_DURATION_MS));
      if (!mounted.current) return;

      if (onDownload) await onDownload();
      else {
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.download = filename;
        anchor.rel = 'noopener';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }

      if (!mounted.current) return;
      setStatus('started');
      resetTimer.current = window.setTimeout(() => setStatus('idle'), 1800);
    } catch {
      if (mounted.current) setStatus('error');
    }
  };

  const preparing = status === 'preparing';
  const started = status === 'started';
  const failed = status === 'error';

  return (
    <motion.button
      type="button"
      onClick={() => void downloadResume()}
      disabled={disabled || preparing || started}
      aria-busy={preparing}
      initial={false}
      animate={{
        backgroundColor: started ? '#113523' : failed ? '#431f1d' : '#111114',
        color: started ? '#e1f7e8' : failed ? '#ffe8e6' : '#ffffff',
      }}
      whileHover={!disabled && !preparing && !started ? { y: -1, scale: 1.008 } : undefined}
      whileTap={!disabled && !preparing && !started ? { y: 1, scale: 0.985 } : undefined}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={`flex h-16 w-[244px] items-center gap-3 rounded-[16px] p-1.5 pr-4 text-left shadow-[0_20px_46px_rgba(15,23,42,0.24),inset_0_1px_0_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-4 ${disabled ? 'cursor-not-allowed opacity-60' : preparing ? 'cursor-wait' : started ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <motion.span
        aria-hidden="true"
        animate={{ backgroundColor: started ? '#235c3d' : failed ? '#6d2b27' : '#28282c' }}
        className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        {preparing ? (
          <span className="size-10"><LottieLight src={transferAnimation} autoplay={!reduceMotion} loop={false} /></span>
        ) : started ? <Check size={18} strokeWidth={2.2} /> : failed ? <RotateCcw size={17} /> : (
          <motion.span whileHover={reduceMotion ? undefined : { y: -2 }} className="relative block h-8 w-9">
            <span className="absolute left-[9px] top-0 h-[25px] w-[20px] rounded-[3px] bg-white shadow-[0_3px_8px_rgba(0,0,0,.22)]">
              <i className="absolute left-1.5 right-1.5 top-2 h-px bg-black/25" />
              <i className="absolute left-1.5 right-2 top-3 h-px bg-black/20" />
            </span>
            <span className="absolute bottom-[2px] left-1 h-[5px] w-7 rounded-full bg-[#8ee0a9] shadow-[0_0_0_3px_rgba(142,224,169,.08)]" />
          </motion.span>
        )}
      </motion.span>

      <span className="min-w-0 flex-1">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.strong
            key={status}
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="block whitespace-nowrap text-[13px] font-semibold tracking-[-0.01em]"
          >
            {preparing ? 'Downloading' : started ? 'Downloaded' : failed ? 'Try again' : 'Download résumé'}
          </motion.strong>
        </AnimatePresence>
        <span className={`mt-1.5 block text-[10px] font-medium ${started ? 'text-[#b9dfc6]' : failed ? 'text-[#ffd0cc]' : 'text-white/60'}`}>{fileLabel}</span>
      </span>

      <Download aria-hidden="true" size={15} className={`${preparing || started ? 'opacity-0' : 'opacity-55'} transition-opacity`} />
      <span className="sr-only" aria-live="polite">
        {preparing ? 'Downloading résumé.' : started ? 'Résumé downloaded.' : failed ? 'Download failed. Try again.' : ''}
      </span>
    </motion.button>
  );
}
