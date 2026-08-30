import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { MOTUS_DURATION, MOTUS_EASE } from '../system.js';
import { atlasCountries, type AtlasCountryId } from './atlasData.js';

export type { AtlasCountryId } from './atlasData.js';

export type AtlasRevealProps = {
  country?: AtlasCountryId;
  defaultCountry?: AtlasCountryId;
  onCountryChange?: (country: AtlasCountryId) => void;
  showSelector?: boolean;
  className?: string;
};

export const atlasCountryOptions = atlasCountries.map(({ id, label, capital }) => ({ id, label, capital }));

function formatCoordinate(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;
}

function CountryPicker({
  activeId,
  controlId,
  reduceMotion,
  onSelect,
}: {
  activeId: AtlasCountryId;
  controlId: string;
  reduceMotion: boolean | null;
  onSelect: (country: AtlasCountryId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = atlasCountries.findIndex((item) => item.id === activeId);
  const active = atlasCountries[activeIndex] ?? atlasCountries[0];

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.focus();
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
  }, [activeIndex, open]);

  const moveFocus = (index: number) => {
    const wrapped = (index + atlasCountries.length) % atlasCountries.length;
    optionRefs.current[wrapped]?.focus();
  };

  const handleOptionKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(atlasCountries[index].id);
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? atlasCountries.length - 1
          : ['ArrowDown', 'ArrowRight'].includes(event.key)
            ? index + 1
            : ['ArrowUp', 'ArrowLeft'].includes(event.key)
              ? index - 1
              : null;
    if (nextIndex === null) return;
    event.preventDefault();
    moveFocus(nextIndex);
  };

  return (
    <div ref={rootRef} className="relative z-40 shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={controlId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
          event.preventDefault();
          setOpen(true);
        }}
        className="group grid min-w-[148px] grid-cols-[28px_1fr_18px] items-center gap-2 border-l border-white/12 py-1 pl-3 text-left text-[#f4efe3] outline-none focus-visible:ring-2 focus-visible:ring-[#e5a84b]"
      >
        <span className="grid size-7 place-items-center border border-[#e5a84b]/45 bg-[#e5a84b]/10 font-mono text-[8px] text-[#efbd6c]">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-white/35">Country</span>
          <strong className="mt-0.5 block truncate text-[11px] font-semibold">{active.label}</strong>
        </span>
        <svg
          viewBox="0 0 18 18"
          className={`size-[18px] transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          <path d="M4 9h10M9 4v10" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={controlId}
            role="listbox"
            aria-label="Choose a country"
            className="absolute right-0 top-[calc(100%+14px)] z-50 w-[min(316px,calc(100vw-52px))] overflow-hidden rounded-[18px] border border-white/12 bg-[#211f1a] p-2 shadow-[0_22px_60px_rgba(0,0,0,0.42)]"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -5, scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0 : MOTUS_DURATION.standard, ease: MOTUS_EASE }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-2 pb-2 pt-1">
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/42">Choose a country</span>
              <span className="font-mono text-[8px] text-[#efbd6c]">8 countries</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {atlasCountries.map((item, index) => {
                const selected = item.id === active.id;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onKeyDown={(event) => handleOptionKey(event, index)}
                    onClick={() => {
                      onSelect(item.id);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={`grid min-h-12 grid-cols-[22px_1fr] items-center gap-2 rounded-[11px] px-2.5 text-left outline-none transition-colors duration-100 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#efbd6c] ${
                      selected ? 'bg-[#e5a84b] text-[#21180f]' : 'text-[#f4efe3] hover:bg-white/[0.07]'
                    }`}
                  >
                    <span className={`font-mono text-[8px] ${selected ? 'text-[#5b3518]' : 'text-white/28'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <strong className="block truncate text-[10px] font-semibold">{item.label}</strong>
                      <span
                        className={`mt-0.5 block truncate font-mono text-[7px] ${selected ? 'text-[#5b3518]' : 'text-white/30'}`}
                      >
                        {item.capital}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AtlasReveal({
  country,
  defaultCountry = 'japan',
  onCountryChange,
  showSelector = true,
  className = '',
}: AtlasRevealProps) {
  const [internalCountry, setInternalCountry] = useState<AtlasCountryId>(defaultCountry);
  const reduceMotion = useReducedMotion();
  const rawId = useId().replace(/:/g, '');
  const activeId = country ?? internalCountry;
  const active = atlasCountries.find((item) => item.id === activeId) ?? atlasCountries[0];
  const gradientId = `atlas-wash-${rawId}`;
  const paperId = `atlas-paper-${rawId}`;
  const gridId = `atlas-grid-${rawId}`;
  const mapShadowId = `atlas-shadow-${rawId}`;
  const pickerId = `atlas-picker-${rawId}`;
  const titleId = `atlas-title-${rawId}`;
  const descriptionId = `atlas-description-${rawId}`;
  const labelX = Math.min(Math.max(active.capitalPoint[0] + 8, 46), 220);
  const labelY = Math.min(Math.max(active.capitalPoint[1] - 7, 72), 292);
  const [longitude, latitude] = active.coordinates;

  const selectCountry = (next: AtlasCountryId) => {
    if (country === undefined) setInternalCountry(next);
    onCountryChange?.(next);
  };

  return (
    <section
      className={`relative w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[#3b3026]/20 bg-[#181713] p-2.5 text-[#33271d] shadow-[0_28px_80px_rgba(30,23,15,0.28)] ${className}`}
    >
      <header className="flex min-h-16 items-center justify-between gap-4 px-3 py-2 text-[#f4efe3]">
        <div className="min-w-0">
          <span className="block font-mono text-[8px] font-medium uppercase tracking-[0.22em] text-[#f4efe3]/45">
            Country map
          </span>
          <h2 className="mt-1 text-sm font-semibold tracking-[-0.02em]">{active.label}</h2>
        </div>
        {showSelector && (
          <CountryPicker
            activeId={active.id}
            controlId={pickerId}
            reduceMotion={reduceMotion}
            onSelect={selectCountry}
          />
        )}
      </header>

      <div className="relative aspect-[3/4] overflow-hidden rounded-[23px] bg-[#ece5d5]">
        <svg
          viewBox="0 0 300 400"
          className="absolute inset-0 size-full"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>{active.label} animated map</title>
          <desc id={descriptionId}>
            A north-up artistic map of {active.label} with its capital, {active.capital}, marked and an orientation
            compass.
          </desc>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f8c56f" />
              <stop offset="0.48" stopColor="#e69a3f" />
              <stop offset="1" stopColor="#bd6629" />
            </linearGradient>
            <pattern id={gridId} width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#665d4f" strokeOpacity="0.18" strokeWidth="0.55" />
            </pattern>
            <filter id={paperId} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015 0.11" numOctaves="3" seed="8" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
              <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
            </filter>
            <filter id={mapShadowId} x="-15%" y="-15%" width="130%" height="135%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#4a2d17" floodOpacity="0.2" />
            </filter>
          </defs>

          <rect width="300" height="400" fill="#eee8da" />
          <rect width="300" height="400" fill="#d7cebb" opacity="0.18" filter={`url(#${paperId})`} />
          <rect x="8" y="8" width="284" height="384" fill={`url(#${gridId})`} />
          <path
            d="M-8 77C30 55 59 87 97 63s64-7 99-27 78 3 119-15M-15 321c39-25 73 5 108-17s69-5 101-27 77 0 120-31"
            fill="none"
            stroke="#776b59"
            strokeOpacity="0.16"
            strokeWidth="0.7"
          />
          <path
            d="M18 16v368M282 16v368M16 41h268M16 359h268"
            fill="none"
            stroke="#42392e"
            strokeOpacity="0.28"
            strokeWidth="0.65"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.g key={active.id}>
              <motion.path
                d={active.d}
                fill={`url(#${gradientId})`}
                fillOpacity="0.82"
                stroke="#3a2415"
                strokeWidth="0.95"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                filter={`url(#${mapShadowId})`}
                initial={reduceMotion ? false : { pathLength: 0, fillOpacity: 0, opacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.82, opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
                transition={{
                  pathLength: { duration: reduceMotion ? 0 : 1.05, ease: [0.22, 1, 0.36, 1] },
                  fillOpacity: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.18 },
                  opacity: { duration: reduceMotion ? 0 : 0.22 },
                }}
              />
              <motion.path
                d={active.d}
                fill="none"
                stroke="#fff0bd"
                strokeWidth="0.48"
                strokeOpacity="0.58"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.72, 0] }}
                transition={{ duration: reduceMotion ? 0 : 1.35, ease: [0.22, 1, 0.36, 1] }}
              />

              <motion.g
                initial={reduceMotion ? false : { opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : 0.72 }}
                style={{ transformOrigin: `${active.capitalPoint[0]}px ${active.capitalPoint[1]}px` }}
              >
                <circle
                  cx={active.capitalPoint[0]}
                  cy={active.capitalPoint[1]}
                  r="6.5"
                  fill="#fff7df"
                  fillOpacity="0.64"
                />
                <circle cx={active.capitalPoint[0]} cy={active.capitalPoint[1]} r="2.5" fill="#332116" />
                <path
                  d={`M${active.capitalPoint[0] + 4},${active.capitalPoint[1] - 4} L${labelX - 2},${labelY + 2}`}
                  stroke="#3a2a20"
                  strokeOpacity="0.6"
                  strokeWidth="0.6"
                />
                <text
                  x={labelX}
                  y={labelY}
                  fill="#33271d"
                  fontFamily="ui-monospace, monospace"
                  fontSize="7.5"
                  fontWeight="600"
                >
                  {active.capital}
                </text>
              </motion.g>
            </motion.g>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.g
              key={`${active.id}-legend`}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : 0.46 }}
            >
              <text
                x="24"
                y="341"
                fill="#39271b"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize={active.label.length > 10 ? 17 : 22}
                fontWeight="700"
                letterSpacing={active.label.length > 10 ? 2.1 : 3.7}
              >
                {active.label.toUpperCase()}
              </text>
              <text
                x="25"
                y="357"
                fill="#6d5b49"
                fontFamily="ui-monospace, monospace"
                fontSize="6.5"
                letterSpacing="0.75"
              >
                {formatCoordinate(latitude, 'N', 'S')} · {formatCoordinate(longitude, 'E', 'W')}
              </text>
            </motion.g>
          </AnimatePresence>

          <motion.g
            initial={reduceMotion ? false : { opacity: 0, rotate: -16, scale: 0.86 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '253px 350px' }}
            aria-hidden="true"
          >
            <circle cx="253" cy="350" r="25" fill="#eee8da" fillOpacity="0.72" stroke="#3a2a20" strokeWidth="0.65" />
            {Array.from({ length: 16 }, (_, index) => (
              <line
                key={index}
                x1="253"
                y1={index % 4 === 0 ? 326 : 329}
                x2="253"
                y2="332"
                stroke="#3a2a20"
                strokeOpacity={index % 4 === 0 ? 0.8 : 0.42}
                strokeWidth={index % 4 === 0 ? 0.8 : 0.5}
                transform={`rotate(${index * 22.5} 253 350)`}
              />
            ))}
            <circle cx="253" cy="350" r="17.5" fill="none" stroke="#3a2a20" strokeOpacity="0.32" strokeWidth="0.45" />
            <path d="m253 326 4.2 19.8-4.2 4.2-4.2-4.2Z" fill="#312219" />
            <path d="m253 374-4.2-19.8 4.2-4.2 4.2 4.2Z" fill="#f6eedc" stroke="#312219" strokeWidth="0.55" />
            <path d="m229 350 19.8-4.2 4.2 4.2-4.2 4.2Z" fill="#f6eedc" stroke="#312219" strokeWidth="0.55" />
            <path d="m277 350-19.8 4.2-4.2-4.2 4.2-4.2Z" fill="#8d4c25" />
            <circle cx="253" cy="350" r="2" fill="#b86b2f" stroke="#312219" strokeWidth="0.45" />
            <text
              x="253"
              y="320"
              textAnchor="middle"
              fill="#312219"
              fontFamily="ui-monospace, monospace"
              fontSize="6.5"
              fontWeight="700"
            >
              N
            </text>
            <text x="283" y="352" textAnchor="middle" fill="#6d5b49" fontFamily="ui-monospace, monospace" fontSize="5">
              E
            </text>
            <text x="253" y="382" textAnchor="middle" fill="#6d5b49" fontFamily="ui-monospace, monospace" fontSize="5">
              S
            </text>
            <text x="223" y="352" textAnchor="middle" fill="#6d5b49" fontFamily="ui-monospace, monospace" fontSize="5">
              W
            </text>
          </motion.g>

          <text x="20" y="27" fill="#6d5b49" fontFamily="ui-monospace, monospace" fontSize="5.5" letterSpacing="0.8">
            NATURAL EARTH / 1:50M
          </text>
          <text
            x="280"
            y="27"
            textAnchor="end"
            fill="#6d5b49"
            fontFamily="ui-monospace, monospace"
            fontSize="5.5"
            letterSpacing="0.8"
          >
            TRUE NORTH / ORIENTED
          </text>
        </svg>
        <p className="sr-only" aria-live="polite">
          Showing {active.label}. Capital: {active.capital}.
        </p>
      </div>
    </section>
  );
}

export default AtlasReveal;
