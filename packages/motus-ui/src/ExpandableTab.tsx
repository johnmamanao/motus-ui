import { ArrowUpRight, CircleDot, Layers3, ScanLine, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type KeyboardEvent, useId, useState } from 'react';

const views = [
  {
    id: 'signal',
    label: 'Signal',
    eyebrow: 'Live direction',
    title: 'Make the change legible.',
    description: 'A focused motion study for interfaces that explain where attention should move next.',
    accent: '#c7ff64',
    icon: CircleDot,
    metric: '120 ms',
    metricLabel: 'response',
  },
  {
    id: 'layers',
    label: 'Layers',
    eyebrow: 'Spatial rhythm',
    title: 'Depth without distraction.',
    description: 'A restrained composition that separates context, action, and feedback into readable layers.',
    accent: '#9ac8ff',
    icon: Layers3,
    metric: '03',
    metricLabel: 'planes',
  },
  {
    id: 'tempo',
    label: 'Tempo',
    eyebrow: 'Timing study',
    title: 'Fast enough to feel direct.',
    description: 'Short transitions keep the interface responsive while preserving continuity between states.',
    accent: '#ffb88c',
    icon: ScanLine,
    metric: '0.24 s',
    metricLabel: 'transition',
  },
  {
    id: 'finish',
    label: 'Finish',
    eyebrow: 'Interaction polish',
    title: 'Quiet details, clear result.',
    description: 'Each state earns its place through contrast, hierarchy, and a single purposeful movement.',
    accent: '#d8b4ff',
    icon: Sparkles,
    metric: 'AA',
    metricLabel: 'contrast',
  },
] as const;

export function ExpandableTab() {
  const [activeId, setActiveId] = useState<(typeof views)[number]['id']>('signal');
  const reduceMotion = useReducedMotion();
  const tabsetId = useId();
  const activeIndex = views.findIndex((view) => view.id === activeId);
  const active = views[activeIndex];

  const selectByKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? views.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + views.length) % views.length;
    const next = views[nextIndex];
    setActiveId(next.id);
    document.getElementById(`${tabsetId}-${next.id}-tab`)?.focus();
  };

  return (
    <div className="flex min-h-[430px] w-full items-center justify-center px-4 py-8 text-zinc-950">
      <section className="grid w-full max-w-[720px] overflow-hidden rounded-[30px] border border-zinc-200 bg-[#f5f5f2] shadow-[0_28px_80px_rgba(24,24,27,0.10)] md:grid-cols-[168px_1fr]">
        <div className="flex flex-col border-b border-zinc-200 bg-white p-3 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-2 py-2 md:block">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-zinc-950 text-[10px] font-semibold text-white">
                M
              </span>
              <span className="text-xs font-semibold tracking-[-0.01em]">Motion index</span>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 md:mt-5 md:block">
              Studies / 04
            </span>
          </div>

          <div
            className="mt-2 grid grid-cols-4 gap-1 md:mt-6 md:grid-cols-1"
            role="tablist"
            aria-label="Motion studies"
          >
            {views.map((view, index) => {
              const selected = view.id === activeId;
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  id={`${tabsetId}-${view.id}-tab`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${tabsetId}-${view.id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(view.id)}
                  onKeyDown={(event) => selectByKey(event, index)}
                  className={`group relative flex min-h-12 items-center gap-2 overflow-hidden rounded-xl px-2.5 text-left text-xs font-semibold outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 md:px-3 ${selected ? 'text-zinc-950' : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700'}`}
                  style={{ color: selected ? '#18181b' : '#71717a', fontSize: '0.75rem' }}
                >
                  {selected && (
                    <motion.span
                      layoutId={`${tabsetId}-selection`}
                      className="absolute inset-0 rounded-xl bg-[#eeeeea]"
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  )}
                  <span className="relative grid size-6 shrink-0 place-items-center rounded-lg border border-current/10 bg-white/60">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="relative hidden md:block">{view.label}</span>
                  <span className="relative ml-auto hidden text-[9px] font-medium tabular-nums text-zinc-400 md:block">
                    0{index + 1}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-auto hidden px-2 pb-1 pt-8 text-[10px] leading-4 text-zinc-400 md:block">
            Select a study to inspect its rhythm and intent.
          </p>
        </div>

        <div className="relative min-h-[350px] overflow-hidden p-5 sm:p-7 md:min-h-[430px] md:p-9">
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                <motion.i
                  className="block size-2 rounded-full"
                  animate={{ backgroundColor: active.accent }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                />
                {active.eyebrow}
              </span>
              <span className="text-[10px] font-medium tabular-nums text-zinc-400">0{activeIndex + 1} / 04</span>
            </div>

            <div className="my-auto py-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  id={`${tabsetId}-${active.id}-panel`}
                  role="tabpanel"
                  aria-labelledby={`${tabsetId}-${active.id}-tab`}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <h2 className="max-w-[430px] text-[clamp(2.15rem,7vw,4.1rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                    {active.title}
                  </h2>
                  <p className="mt-5 max-w-[390px] text-sm leading-6 text-zinc-500">{active.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-end justify-between border-t border-zinc-300/70 pt-5">
              <div>
                <motion.strong
                  key={`${active.id}-metric`}
                  className="block text-2xl font-semibold tracking-[-0.04em]"
                  initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {active.metric}
                </motion.strong>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                  {active.metricLabel}
                </span>
              </div>
              <button
                className="group flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white outline-none transition-colors duration-150 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                style={{ color: '#ffffff', fontSize: '0.75rem' }}
              >
                Inspect study
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
