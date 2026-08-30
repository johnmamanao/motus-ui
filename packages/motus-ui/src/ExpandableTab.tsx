import { ArrowUpRight, CircleDot, Gauge, Layers3, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { type KeyboardEvent, useId, useState } from 'react';
import { MOTUS_DURATION, MOTUS_EASE } from './system.js';

const panels = [
  {
    id: 'layout',
    label: 'Layout',
    eyebrow: 'Hierarchy',
    title: 'Set the hierarchy.',
    description: 'Use size and position to make the active section clear.',
    accent: '#c9ff67',
    wash: '#efffd1',
    icon: CircleDot,
    metric: '01',
    metricLabel: 'active tab',
  },
  {
    id: 'timing',
    label: 'Timing',
    eyebrow: 'Timing',
    title: 'Keep feedback quick.',
    description: 'Short transitions make the change visible without delaying the next action.',
    accent: '#8bc5ff',
    wash: '#dceeff',
    icon: Gauge,
    metric: '0.24 s',
    metricLabel: 'transition',
  },
  {
    id: 'state',
    label: 'State',
    eyebrow: 'Selection',
    title: 'Show what is active.',
    description: 'Contrast keeps the selected tab distinct from the remaining options.',
    accent: '#ffad7d',
    wash: '#ffe6d7',
    icon: Layers3,
    metric: '02',
    metricLabel: 'states',
  },
  {
    id: 'access',
    label: 'Access',
    eyebrow: 'Keyboard',
    title: 'Support every input.',
    description: 'Arrow keys, focus styles, and readable labels keep the tabs usable.',
    accent: '#d8b1ff',
    wash: '#efe0ff',
    icon: Sparkles,
    metric: '4 keys',
    metricLabel: 'navigation',
  },
] as const;

type PanelId = (typeof panels)[number]['id'];

export function ExpandableTab() {
  const [activeId, setActiveId] = useState<PanelId>('layout');
  const reduceMotion = useReducedMotion();
  const tabsetId = useId();
  const activeIndex = panels.findIndex((panel) => panel.id === activeId);
  const transition = reduceMotion ? { duration: 0 } : { duration: MOTUS_DURATION.standard, ease: MOTUS_EASE };

  const selectByKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    orientation: 'horizontal' | 'vertical',
    surface: 'desktop' | 'mobile',
  ) => {
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    if (![nextKey, previousKey, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? panels.length - 1
          : (index + (event.key === nextKey ? 1 : -1) + panels.length) % panels.length;
    const next = panels[nextIndex];
    setActiveId(next.id);
    document.getElementById(tabsetId + '-' + surface + '-' + next.id + '-tab')?.focus();
  };

  const content = (panel: (typeof panels)[number], surface: 'desktop' | 'mobile') => (
    <motion.div
      key={surface + '-' + panel.id + '-' + activeId}
      id={tabsetId + '-' + surface + '-' + panel.id + '-panel'}
      role="tabpanel"
      aria-labelledby={tabsetId + '-' + surface + '-' + panel.id + '-tab'}
      className="relative flex h-full flex-col overflow-hidden px-5 pb-5 pt-[72px] sm:px-6 sm:pb-6"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : MOTUS_DURATION.standard, ease: MOTUS_EASE }}
    >
      <motion.span
        className="pointer-events-none absolute -right-12 -top-8 size-44 rounded-full opacity-70 blur-2xl"
        style={{ backgroundColor: panel.wash }}
        initial={reduceMotion ? false : { scale: 0.78, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: reduceMotion ? 0 : MOTUS_DURATION.slow, ease: MOTUS_EASE }}
        aria-hidden="true"
      />
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {panel.eyebrow}
      </span>
      <h2 className="relative mt-auto max-w-[390px] text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-zinc-950">
        {panel.title}
      </h2>
      <p className="relative mt-4 max-w-[390px] text-sm leading-6 text-zinc-500">{panel.description}</p>
      <div className="relative mt-5 flex items-end justify-between border-t border-zinc-300/80 pt-4">
        <div>
          <strong className="block text-xl font-semibold tracking-[-0.04em] text-zinc-950">{panel.metric}</strong>
          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {panel.metricLabel}
          </span>
        </div>
        <span
          className="flex size-9 items-center justify-center rounded-full text-zinc-950"
          style={{ backgroundColor: panel.accent }}
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-[440px] w-full items-center justify-center px-3 py-7 text-zinc-950">
      <section className="w-full max-w-[780px] overflow-hidden rounded-[30px] bg-[#111110] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
        <header className="flex items-center justify-between px-3 pb-3 pt-1 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full border border-white/15 bg-white/5 text-[10px] font-semibold">
              M
            </span>
            <div>
              <strong className="block text-xs font-semibold tracking-[-0.01em]">Expandable tabs</strong>
              <span className="mt-0.5 block text-[8px] font-medium uppercase tracking-[0.15em] text-white/35">
                Choose a section
              </span>
            </div>
          </div>
          <span className="font-mono text-[9px] text-white/35">0{activeIndex + 1} / 04</span>
        </header>

        <div
          className="hidden h-[370px] gap-2 md:flex"
          role="tablist"
          aria-label="Expandable tabs"
          aria-orientation="horizontal"
        >
          {panels.map((panel, index) => {
            const selected = panel.id === activeId;
            const Icon = panel.icon;
            return (
              <motion.article
                key={panel.id}
                layout
                className="relative min-w-0 overflow-hidden rounded-[22px] border"
                style={{
                  backgroundColor: selected ? '#f5f4ef' : '#1c1c1a',
                  borderColor: selected ? '#f5f4ef' : '#30302d',
                  width: selected ? 'calc(100% - 210px)' : '62px',
                  flex: '0 0 auto',
                }}
                transition={transition}
              >
                <button
                  id={tabsetId + '-desktop-' + panel.id + '-tab'}
                  role="tab"
                  aria-label={panel.label}
                  aria-selected={selected}
                  aria-controls={tabsetId + '-desktop-' + panel.id + '-panel'}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(panel.id)}
                  onKeyDown={(event) => selectByKey(event, index, 'horizontal', 'desktop')}
                  className="absolute inset-x-0 top-0 z-10 flex h-14 items-center gap-2 px-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                  style={{ color: selected ? '#18181b' : '#d4d4d0', fontSize: '0.75rem' }}
                >
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: selected ? panel.accent : '#2a2a27' }}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  {selected && <span className="whitespace-nowrap font-semibold">{panel.label}</span>}
                  {selected && <span className="ml-auto font-mono text-[9px] text-zinc-400">0{index + 1}</span>}
                </button>
                {!selected && (
                  <span
                    className="pointer-events-none absolute bottom-5 left-1/2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45"
                    style={{ writingMode: 'vertical-rl', transform: 'translateX(-50%) rotate(180deg)' }}
                    aria-hidden="true"
                  >
                    {panel.label}
                  </span>
                )}
                {selected && content(panel, 'desktop')}
              </motion.article>
            );
          })}
        </div>

        <div
          className="flex flex-col gap-2 md:hidden"
          role="tablist"
          aria-label="Expandable tabs"
          aria-orientation="vertical"
        >
          {panels.map((panel, index) => {
            const selected = panel.id === activeId;
            const Icon = panel.icon;
            return (
              <motion.article
                key={panel.id}
                className="relative overflow-hidden rounded-[20px] border"
                style={{
                  backgroundColor: selected ? '#f5f4ef' : '#1c1c1a',
                  borderColor: selected ? '#f5f4ef' : '#30302d',
                }}
                animate={{ height: selected ? 300 : 54 }}
                transition={transition}
              >
                <button
                  id={tabsetId + '-mobile-' + panel.id + '-tab'}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={tabsetId + '-mobile-' + panel.id + '-panel'}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(panel.id)}
                  onKeyDown={(event) => selectByKey(event, index, 'vertical', 'mobile')}
                  className="absolute inset-x-0 top-0 z-10 flex h-[54px] items-center gap-2.5 px-3.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                  style={{ color: selected ? '#18181b' : '#d4d4d0', fontSize: '0.75rem' }}
                >
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: selected ? panel.accent : '#2a2a27' }}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold">{panel.label}</span>
                  <span className="ml-auto font-mono text-[9px]" style={{ color: selected ? '#a1a1aa' : '#666662' }}>
                    0{index + 1}
                  </span>
                </button>
                {selected && content(panel, 'mobile')}
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
