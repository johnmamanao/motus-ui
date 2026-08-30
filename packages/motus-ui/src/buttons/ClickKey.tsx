import { defineSound, ensureReady } from '@web-kits/audio';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { MOTUS_DURATION, MOTUS_EASE } from '../system.js';

const accessSound = defineSound({
  source: { type: 'triangle', frequency: 460 },
  envelope: { attack: 0.004, decay: 0.11, sustain: 0 },
  gain: 0.05,
});

export type ClickKeyProps = {
  onAction?: () => void | Promise<void>;
  disabled?: boolean;
};

export default function ClickKey({ onAction, disabled = false }: ClickKeyProps) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const activate = async () => {
    if (disabled || opening) return;
    setOpening(true);
    await ensureReady();
    accessSound();
    await onAction?.();
    timer.current = window.setTimeout(() => setOpening(false), 900);
  };

  return (
    <motion.button
      type="button"
      onClick={() => void activate()}
      disabled={disabled || opening}
      whileTap={reduceMotion ? undefined : { scale: 0.975 }}
      transition={{ duration: MOTUS_DURATION.feedback, ease: MOTUS_EASE }}
      className="group relative grid h-[94px] w-[278px] grid-cols-[1fr_70px] gap-1.5 overflow-hidden rounded-[24px] border border-black/10 bg-[#11110f] p-1.5 text-left shadow-[0_22px_50px_rgba(0,0,0,0.24)] outline-none transition-shadow duration-150 hover:shadow-[0_26px_58px_rgba(0,0,0,0.3)] focus-visible:ring-2 focus-visible:ring-[#baff55] focus-visible:ring-offset-4 disabled:cursor-wait disabled:opacity-70"
      style={{ color: '#151513' }}
      aria-label={opening ? 'Opening project' : 'View project'}
    >
      <span className="relative min-w-0 overflow-hidden rounded-[18px] bg-[#f4f3ed]">
        <span
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
          aria-hidden="true"
        />
        <motion.span
          key={opening ? 'scan-active' : 'scan-idle'}
          className="absolute inset-y-0 left-0 z-0 bg-[#171715]"
          initial={{ width: opening ? '0%' : '0%' }}
          animate={{ width: opening ? '100%' : '0%' }}
          transition={{
            duration: reduceMotion ? 0.01 : opening ? MOTUS_DURATION.slow : MOTUS_DURATION.quick,
            ease: MOTUS_EASE,
          }}
          aria-hidden="true"
        />

        <span className="relative z-10 flex h-full flex-col justify-between p-3.5">
          <span className="flex items-center justify-between">
            <span
              className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: opening ? '#8d8d87' : '#777770' }}
            >
              Case study
            </span>
            <span
              className="font-mono text-[8px] font-semibold tabular-nums"
              style={{ color: opening ? '#8d8d87' : '#777770' }}
            >
              View
            </span>
          </span>

          <span className="relative block h-8 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={opening ? 'opening' : 'open'}
                className="absolute inset-x-0 bottom-0 flex items-end justify-between"
                initial={reduceMotion ? { opacity: 0 } : { y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { y: -18, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : MOTUS_DURATION.quick, ease: MOTUS_EASE }}
              >
                <strong
                  className="text-[19px] font-semibold leading-none tracking-[-0.045em]"
                  style={{ color: opening ? '#ffffff' : '#11110f' }}
                >
                  {opening ? 'Opening' : 'View project'}
                </strong>
                <i
                  className="mb-0.5 size-1.5 rounded-full not-italic"
                  style={{
                    backgroundColor: '#baff55',
                    boxShadow: opening ? '0 0 14px #baff55' : 'none',
                  }}
                  aria-hidden="true"
                />
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </span>

      <motion.span
        className="relative grid overflow-hidden rounded-[18px] bg-[#baff55] text-[#11110f]"
        animate={{ rotate: opening && !reduceMotion ? 4 : 0 }}
        transition={{ duration: MOTUS_DURATION.standard, ease: MOTUS_EASE }}
      >
        <span className="pointer-events-none absolute inset-2 rounded-full border border-black/10" aria-hidden="true" />
        <span
          className="pointer-events-none absolute inset-[17px] rounded-full border border-black/10"
          aria-hidden="true"
        />
        <motion.span
          className="relative z-10 grid place-items-center"
          animate={{ rotate: opening && !reduceMotion ? 45 : 0 }}
          transition={{ duration: reduceMotion ? 0 : MOTUS_DURATION.standard, ease: MOTUS_EASE }}
        >
          <ArrowUpRight
            className="size-5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </motion.span>
      </motion.span>
    </motion.button>
  );
}
