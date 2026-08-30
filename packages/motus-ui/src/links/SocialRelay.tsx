import { Facebook, Github, Instagram } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { MOTUS_DURATION, MOTUS_EASE } from '../system.js';

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
    id: 'facebook',
    label: 'Facebook',
    meta: 'Profile',
    href: 'https://www.facebook.com/',
    accent: '#4c8dff',
    icon: <Facebook aria-hidden="true" />,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    meta: 'Profile',
    href: 'https://www.instagram.com/',
    accent: '#f15b82',
    icon: <Instagram aria-hidden="true" />,
  },
  {
    id: 'x',
    label: 'X',
    meta: 'Profile',
    href: 'https://x.com/',
    accent: '#f4f4f5',
    icon: <XMark />,
  },
] as const;

function XMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4.5 18.6 19.5M19 4.5 5.4 19.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SocialRelay({ items = defaultItems, className = '' }: SocialRelayProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibleItems = items.slice(0, 4);
  const [primaryItem, ...secondaryItems] = visibleItems;

  const interactionProps = (item: SocialRelayItem) => ({
    onMouseEnter: () => setActiveId(item.id),
    onMouseLeave: () => setActiveId(null),
    onFocus: () => setActiveId(item.id),
    onBlur: () => setActiveId(null),
  });

  return (
    <nav className={`relative isolate w-fit p-4 sm:p-5 ${className}`} aria-label="Social links">
      <span
        className="pointer-events-none absolute inset-[15%] -z-10 rounded-full bg-black/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="flex items-center gap-5 sm:gap-7">
        {primaryItem ? (
          <div className="flex w-[116px] shrink-0 flex-col items-center sm:w-32">
            <motion.a
              href={primaryItem.href}
              target={primaryItem.target ?? '_blank'}
              rel={primaryItem.target === '_self' ? undefined : 'noreferrer'}
              aria-label={`Open ${primaryItem.label}${primaryItem.meta ? ` — ${primaryItem.meta}` : ''}`}
              {...interactionProps(primaryItem)}
              className="relative grid size-[116px] place-items-center overflow-hidden rounded-full border outline-none backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:size-32"
              style={{
                color: primaryItem.accent ?? '#f4f4f5',
                borderColor:
                  activeId === primaryItem.id
                    ? `${primaryItem.accent ?? '#f4f4f5'}8a`
                    : `${primaryItem.accent ?? '#f4f4f5'}38`,
                background:
                  'linear-gradient(145deg, rgba(24,26,25,.94), rgba(7,8,8,.88)), radial-gradient(circle at 30% 20%, rgba(255,255,255,.14), transparent 48%)',
                boxShadow:
                  activeId === primaryItem.id
                    ? `0 20px 40px rgba(0,0,0,.4), 0 0 34px ${primaryItem.accent ?? '#f4f4f5'}32, inset 0 1px rgba(255,255,255,.14)`
                    : '0 14px 30px rgba(0,0,0,.28), inset 0 1px rgba(255,255,255,.09)',
              }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.82, x: -14 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              whileHover={reduceMotion ? undefined : { scale: 1.045, x: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : MOTUS_DURATION.standard, ease: MOTUS_EASE }}
            >
              <span
                className="absolute inset-3 rounded-full border"
                style={{ borderColor: `${primaryItem.accent ?? '#f4f4f5'}20` }}
                aria-hidden="true"
              />
              <motion.span
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={
                  activeId === primaryItem.id && !reduceMotion
                    ? { x: ['0%', '360%'], opacity: [0, 0.5, 0] }
                    : { x: '0%', opacity: 0 }
                }
                transition={{ duration: MOTUS_DURATION.slow, ease: MOTUS_EASE }}
                aria-hidden="true"
              />
              <motion.span
                className="relative z-10 size-10 [&>svg]:size-full"
                animate={
                  activeId === primaryItem.id && !reduceMotion ? { scale: 1.08, rotate: -3 } : { scale: 1, rotate: 0 }
                }
                transition={{ duration: MOTUS_DURATION.quick, ease: MOTUS_EASE }}
              >
                {primaryItem.icon ?? primaryItem.label.charAt(0)}
              </motion.span>
            </motion.a>
            <span className="mt-3 text-[11px] font-semibold tracking-[-0.01em] text-zinc-700">{primaryItem.label}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:gap-3.5">
          {secondaryItems.map((item, index) => {
            const active = item.id === activeId;
            const accent = item.accent ?? '#f4f4f5';

            return (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.target ?? '_blank'}
                rel={item.target === '_self' ? undefined : 'noreferrer'}
                aria-label={`Open ${item.label}${item.meta ? ` — ${item.meta}` : ''}`}
                {...interactionProps(item)}
                className="group flex items-center gap-3 rounded-full pr-2 outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-3 focus-visible:ring-offset-transparent"
                initial={reduceMotion ? false : { opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={reduceMotion ? undefined : { x: 4 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{
                  delay: reduceMotion ? 0 : (index + 1) * 0.045,
                  duration: reduceMotion ? 0 : MOTUS_DURATION.standard,
                  ease: MOTUS_EASE,
                }}
              >
                <motion.span
                  className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border backdrop-blur-xl sm:size-16"
                  style={{
                    color: accent,
                    borderColor: active ? `${accent}78` : `${accent}34`,
                    background:
                      'linear-gradient(145deg, rgba(24,26,25,.92), rgba(7,8,8,.84)), radial-gradient(circle at 30% 20%, rgba(255,255,255,.12), transparent 48%)',
                    boxShadow: active
                      ? `0 12px 26px rgba(0,0,0,.34), 0 0 24px ${accent}2d, inset 0 1px rgba(255,255,255,.12)`
                      : '0 9px 20px rgba(0,0,0,.24), inset 0 1px rgba(255,255,255,.07)',
                  }}
                  animate={active && !reduceMotion ? { scale: 1.055 } : { scale: 1 }}
                  transition={{ duration: MOTUS_DURATION.quick, ease: MOTUS_EASE }}
                >
                  <span
                    className="absolute inset-2 rounded-full border"
                    style={{ borderColor: `${accent}1f` }}
                    aria-hidden="true"
                  />
                  <motion.span
                    className="relative z-10 size-5 [&>svg]:size-full sm:size-6"
                    animate={active && !reduceMotion ? { scale: 1.1, rotate: index % 2 ? 3 : -3 } : { scale: 1 }}
                    transition={{ duration: MOTUS_DURATION.quick, ease: MOTUS_EASE }}
                  >
                    {item.icon ?? item.label.charAt(0)}
                  </motion.span>
                </motion.span>

                <span className="min-w-0 text-[11px] font-semibold tracking-[-0.01em] text-zinc-700 transition-colors group-hover:text-zinc-950">
                  {item.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default SocialRelay;
