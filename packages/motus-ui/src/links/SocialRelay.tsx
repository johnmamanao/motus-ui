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

  return (
    <nav className={`relative isolate w-fit p-5 ${className}`} aria-label="Social destinations">
      <span
        className="pointer-events-none absolute inset-[18%] -z-10 rounded-full bg-black/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="grid grid-cols-2 gap-x-8 gap-y-9 sm:gap-x-10 sm:gap-y-10">
        {visibleItems.map((item, index) => {
          const active = item.id === activeId;
          const accent = item.accent ?? '#f4f4f5';
          return (
            <div key={item.id} className="flex w-20 flex-col items-center sm:w-[88px]">
              <motion.a
                href={item.href}
                target={item.target ?? '_blank'}
                rel={item.target === '_self' ? undefined : 'noreferrer'}
                aria-label={`Open ${item.label}${item.meta ? ` — ${item.meta}` : ''}`}
                onMouseEnter={() => setActiveId(item.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(item.id)}
                onBlur={() => setActiveId(null)}
                className="relative grid size-20 place-items-center overflow-hidden rounded-full border outline-none backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:size-[88px]"
                style={{
                  color: accent,
                  borderColor: active ? `${accent}8a` : `${accent}38`,
                  background:
                    'linear-gradient(145deg, rgba(24,26,25,.9), rgba(7,8,8,.82)), radial-gradient(circle at 30% 20%, rgba(255,255,255,.14), transparent 48%)',
                  boxShadow: active
                    ? `0 18px 34px rgba(0,0,0,.38), 0 0 30px ${accent}35, inset 0 1px rgba(255,255,255,.13)`
                    : '0 12px 24px rgba(0,0,0,.25), inset 0 1px rgba(255,255,255,.08)',
                }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.72, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={reduceMotion ? undefined : { scale: 1.1, y: -4, rotate: index % 2 ? 3 : -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.94, y: 0, rotate: 0 }}
                transition={{
                  delay: reduceMotion ? 0 : index * 0.045,
                  duration: reduceMotion ? 0 : 0.26,
                  ease: [0.2, 0, 0, 1],
                }}
              >
                <motion.span
                  className="absolute inset-[9px] rounded-full border"
                  style={{ borderColor: `${accent}22` }}
                  animate={active && !reduceMotion ? { rotate: 24, scale: 1.03 } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
                  aria-hidden="true"
                />
                <motion.span
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={
                    active && !reduceMotion ? { x: ['0%', '360%'], opacity: [0, 0.55, 0] } : { x: '0%', opacity: 0 }
                  }
                  transition={{ duration: 0.54, ease: [0.2, 0, 0, 1] }}
                  aria-hidden="true"
                />
                <motion.span
                  className="relative z-10 size-7 [&>svg]:size-full"
                  animate={
                    active && !reduceMotion ? { scale: 1.08, rotate: index % 2 ? -4 : 4 } : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                >
                  {item.icon}
                </motion.span>
                <motion.span
                  className="absolute bottom-2.5 right-3 size-1.5 rounded-full"
                  style={{ backgroundColor: accent }}
                  animate={
                    active && !reduceMotion
                      ? { scale: [1, 1.7, 1], opacity: [0.55, 1, 0.72] }
                      : { scale: 1, opacity: 0.55 }
                  }
                  transition={{ duration: 0.32 }}
                  aria-hidden="true"
                />
              </motion.a>

              <motion.span
                className="mt-2.5 max-w-full truncate text-center text-[10px] font-semibold tracking-[-0.01em] text-zinc-700"
                animate={active && !reduceMotion ? { y: 1, color: '#111111' } : { y: 0, color: '#71717a' }}
                transition={{ duration: reduceMotion ? 0 : 0.16 }}
                aria-hidden="true"
              >
                {item.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default SocialRelay;
