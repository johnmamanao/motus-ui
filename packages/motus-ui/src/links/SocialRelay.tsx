import { CircleHelp, Github, Globe2, PackageOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useState } from 'react';

export type SocialRelayItem = {
  id: string;
  label: string;
  meta?: string;
  href: string;
  accent?: string;
  icon?: ReactNode;
  target?: '_blank' | '_self';
};

export type SocialRelayProps = {
  items?: readonly SocialRelayItem[];
  className?: string;
};

const defaultItems: readonly SocialRelayItem[] = [
  {
    id: 'github',
    label: 'GitHub',
    meta: 'Source',
    href: 'https://github.com/johnmamanao/motus-ui',
    accent: '#f4f4f5',
    icon: <Github aria-hidden="true" />,
  },
  {
    id: 'npm',
    label: 'npm',
    meta: 'Package',
    href: 'https://www.npmjs.com/package/motus-ui',
    accent: '#fb7185',
    icon: <PackageOpen aria-hidden="true" />,
  },
  {
    id: 'showcase',
    label: 'Showcase',
    meta: 'Live site',
    href: 'https://motus-ui.johnmamanao.com',
    accent: '#a3e635',
    icon: <Globe2 aria-hidden="true" />,
  },
  {
    id: 'issues',
    label: 'Issues',
    meta: 'Feedback',
    href: 'https://github.com/johnmamanao/motus-ui/issues',
    accent: '#67e8f9',
    icon: <CircleHelp aria-hidden="true" />,
  },
] as const;

export function SocialRelay({ items = defaultItems, className = '' }: SocialRelayProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibleItems = items.slice(0, 4);
  const activeItem = visibleItems.find((item) => item.id === activeId);

  return (
    <section
      className={`relative w-full max-w-[390px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0f0e] p-3 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] ${className}`}
      aria-label="Social destinations"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 14% 10%, rgba(255,255,255,.09), transparent 29%), radial-gradient(circle at 86% 92%, rgba(163,230,53,.08), transparent 30%)',
        }}
        aria-hidden="true"
      />

      <header className="relative flex h-14 items-center justify-between px-3">
        <div>
          <span className="block font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">Connection matrix</span>
          <h2 className="mt-1 text-sm font-semibold tracking-[-0.025em]">Social Relay</h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">
          <span className="size-1.5 rounded-full bg-[#a3e635] shadow-[0_0_12px_#a3e635]" />
          {String(visibleItems.length).padStart(2, '0')} links
        </div>
      </header>

      <div className="relative mt-1 rounded-[25px] border border-white/[0.08] bg-white/[0.025] p-3 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-3" aria-hidden="true">
          <span className="absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/12 to-transparent" />
          <span className="absolute left-[12%] top-1/2 h-px w-[76%] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white/20 bg-[#121412]" />
        </div>

        <div className="relative grid grid-cols-2 gap-2.5">
          {visibleItems.map((item, index) => {
            const active = item.id === activeId;
            const accent = item.accent ?? '#f4f4f5';
            return (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.target ?? '_blank'}
                rel={item.target === '_self' ? undefined : 'noreferrer'}
                aria-label={`Open ${item.label}`}
                onMouseEnter={() => setActiveId(item.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(item.id)}
                onBlur={() => setActiveId(null)}
                className="relative flex aspect-square min-h-[132px] flex-col overflow-hidden rounded-[22px] border bg-[linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.018))] p-3.5 outline-none backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0f0e]"
                style={{
                  borderColor: active ? `${accent}70` : 'rgba(255,255,255,.09)',
                  boxShadow: active
                    ? `0 16px 38px rgba(0,0,0,.34), 0 0 30px ${accent}24, inset 0 1px rgba(255,255,255,.1)`
                    : '0 12px 26px rgba(0,0,0,.2), inset 0 1px rgba(255,255,255,.06)',
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={reduceMotion ? undefined : { y: -5, rotate: index % 2 ? 1.2 : -1.2, scale: 1.018 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97, y: -1 }}
                transition={{
                  delay: reduceMotion ? 0 : index * 0.045,
                  duration: reduceMotion ? 0 : 0.28,
                  ease: [0.2, 0, 0, 1],
                }}
              >
                <motion.span
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={
                    active && !reduceMotion ? { x: ['0%', '470%'], opacity: [0, 0.55, 0] } : { x: '0%', opacity: 0 }
                  }
                  transition={{ duration: 0.58, ease: [0.2, 0, 0, 1] }}
                  aria-hidden="true"
                />

                <div className="relative flex items-start justify-between">
                  <motion.span
                    className="grid size-11 place-items-center rounded-full border"
                    style={{
                      color: accent,
                      borderColor: `${accent}42`,
                      background: `radial-gradient(circle at 35% 25%, ${accent}24, rgba(255,255,255,.025) 68%)`,
                    }}
                    animate={
                      active && !reduceMotion ? { rotate: index % 2 ? 5 : -5, scale: 1.08 } : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                  >
                    <span className="size-[19px] [&>svg]:size-full">{item.icon}</span>
                  </motion.span>
                  <span className="font-mono text-[8px] text-white/28">0{index + 1}</span>
                </div>

                <div className="relative mt-auto flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <strong className="block truncate text-[12px] font-semibold tracking-[-0.02em]">
                      {item.label}
                    </strong>
                    <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.14em] text-white/32">
                      {item.meta ?? 'Open link'}
                    </span>
                  </div>
                  <motion.span
                    className="font-mono text-[11px]"
                    style={{ color: active ? accent : 'rgba(255,255,255,.28)' }}
                    animate={active && !reduceMotion ? { x: 2, y: -2 } : { x: 0, y: 0 }}
                    aria-hidden="true"
                  >
                    ↗
                  </motion.span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <div className="relative flex h-11 items-center justify-between px-3 font-mono text-[8px] uppercase tracking-[0.14em]">
        <span className="whitespace-nowrap text-white/28">Hover or focus a node</span>
        <motion.span
          key={activeItem?.id ?? 'idle'}
          className="whitespace-nowrap text-right"
          style={{ color: activeItem?.accent ?? 'rgba(255,255,255,.28)' }}
          initial={reduceMotion ? false : { opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
          aria-live="polite"
        >
          {activeItem ? `${activeItem.label} ready` : 'Relay idle'}
        </motion.span>
      </div>
    </section>
  );
}

export default SocialRelay;
