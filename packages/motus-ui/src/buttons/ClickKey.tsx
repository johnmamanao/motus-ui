import { defineSound, ensureReady } from '@web-kits/audio';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

const signalSound = defineSound({
  source: { type: 'sine', frequency: 520 },
  envelope: { attack: 0.004, decay: 0.09, sustain: 0 },
  gain: 0.055,
});

export type ClickKeyProps = {
  onAction?: () => void | Promise<void>;
  disabled?: boolean;
};

export default function ClickKey({ onAction, disabled = false }: ClickKeyProps) {
  const [activation, setActivation] = useState(0);
  const reduceMotion = useReducedMotion();

  const activate = async () => {
    if (disabled) return;
    setActivation((value) => value + 1);
    await ensureReady();
    signalSound();
    await onAction?.();
  };

  return (
    <button
      type="button"
      onClick={() => void activate()}
      disabled={disabled}
      className="group relative flex h-[58px] w-[218px] items-center overflow-hidden rounded-full border border-zinc-700/80 bg-zinc-950 px-2 text-left text-white shadow-[0_16px_34px_rgba(0,0,0,0.20)] outline-none transition-[border-color,box-shadow] duration-150 hover:border-zinc-500 hover:shadow-[0_18px_38px_rgba(0,0,0,0.25)] focus-visible:ring-2 focus-visible:ring-[#9dff5b] focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-45"
      style={{ color: '#ffffff' }}
    >
      <span className="relative mr-3 grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#c9ff6a] text-zinc-950">
        <motion.span
          key={activation}
          className="absolute inset-0 rounded-full bg-white/70"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: reduceMotion ? 1 : 1.5, opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.34, ease: [0.2, 0.8, 0.2, 1] }}
          aria-hidden="true"
        />
        <ArrowRight
          className="relative size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-semibold tracking-[-0.015em]">Open project</strong>
        <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.13em] text-zinc-500">
          View the work
        </span>
      </span>
      <span className="mr-3 size-1.5 shrink-0 rounded-full bg-[#c9ff6a] shadow-[0_0_12px_#c9ff6a]" aria-hidden="true" />
    </button>
  );
}
