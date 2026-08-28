import { defineSound, ensureReady } from '@web-kits/audio';
import { ArrowUpRight } from 'lucide-react';
import { useCallback, useState } from 'react';

const downSound = defineSound({
  source: { type: 'square', frequency: 155 },
  envelope: { attack: 0.002, decay: 0.055, sustain: 0 },
  gain: 0.08,
});

const upSound = defineSound({
  source: { type: 'triangle', frequency: 310 },
  envelope: { attack: 0.002, decay: 0.045, sustain: 0 },
  gain: 0.06,
});

export type ClickKeyProps = {
  onAction?: () => void | Promise<void>;
  disabled?: boolean;
};

export default function ClickKey({ onAction, disabled = false }: ClickKeyProps) {
  const [pressed, setPressed] = useState(false);

  const play = useCallback(async (sound: typeof downSound) => {
    await ensureReady();
    sound();
  }, []);

  const press = () => {
    if (disabled) return;
    setPressed(true);
    void play(downSound);
  };

  const release = () => {
    if (!pressed || disabled) return;
    setPressed(false);
    void play(upSound);
  };

  return (
    <span className="relative inline-flex h-14 w-[190px]">
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-[12px] bg-[#c7c7cc]"
      />
      <button
        type="button"
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) press();
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter' || event.key === ' ') release();
        }}
        onClick={() => void onAction?.()}
        disabled={disabled}
        className={`relative flex h-14 w-[190px] touch-none items-center justify-between rounded-[12px] border border-white/80 bg-[#101011] px-5 text-sm font-semibold text-white transition-transform duration-75 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50 ${pressed ? 'translate-x-[6px] translate-y-[6px]' : ''}`}
        style={{ color: '#ffffff' }}
      >
        <span>Open project</span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    </span>
  );
}
