import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';
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
      className={`w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[#3b3026]/20 bg-[#181713] p-2.5 text-[#33271d] shadow-[0_28px_80px_rgba(30,23,15,0.28)] ${className}`}
    >
      <header className="flex min-h-16 items-center justify-between gap-4 px-3 py-2 text-[#f4efe3]">
        <div className="min-w-0">
          <span className="block font-mono text-[8px] font-medium uppercase tracking-[0.22em] text-[#f4efe3]/45">
            Motus cartography / 01
          </span>
          <h2 className="mt-1 text-sm font-semibold tracking-[-0.02em]">Atlas Reveal</h2>
        </div>
        {showSelector && (
          <label className="relative shrink-0">
            <span className="sr-only">Choose a country</span>
            <select
              value={active.id}
              onChange={(event) => selectCountry(event.target.value as AtlasCountryId)}
              className="h-9 appearance-none rounded-full border border-white/12 bg-white/[0.07] py-0 pl-3.5 pr-8 text-[11px] font-medium text-[#f4efe3] outline-none transition-colors hover:bg-white/[0.11] focus-visible:ring-2 focus-visible:ring-[#e5a84b]"
              aria-label="Choose a country"
            >
              {atlasCountries.map((item) => (
                <option key={item.id} value={item.id} className="bg-[#211f1a] text-[#f4efe3]">
                  {item.label}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 12 12"
              className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-[#f4efe3]/55"
              aria-hidden="true"
            >
              <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.25" />
            </svg>
          </label>
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
            An artistic map of {active.label} with its capital, {active.capital}, marked and a compass rose.
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
                strokeWidth="1.35"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
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
                strokeWidth="0.65"
                strokeOpacity="0.7"
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
            initial={reduceMotion ? false : { opacity: 0, rotate: -24, scale: 0.82 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '254px 350px' }}
            aria-hidden="true"
          >
            <circle
              cx="254"
              cy="350"
              r="28"
              fill="#eee8da"
              fillOpacity="0.6"
              stroke="#3a2a20"
              strokeDasharray="1.4 2.3"
              strokeWidth="0.9"
            />
            <circle cx="254" cy="350" r="21" fill="none" stroke="#3a2a20" strokeOpacity="0.48" strokeWidth="0.55" />
            <path d="m254 322 4.5 23.5-4.5 4.5-4.5-4.5Z" fill="#312219" />
            <path d="m254 378-4.5-23.5 4.5-4.5 4.5 4.5Z" fill="#f6eedc" stroke="#312219" strokeWidth="0.6" />
            <path d="m226 350 23.5-4.5 4.5 4.5-4.5 4.5Z" fill="#f6eedc" stroke="#312219" strokeWidth="0.6" />
            <path d="m282 350-23.5 4.5-4.5-4.5 4.5-4.5Z" fill="#312219" />
            <circle cx="254" cy="350" r="2.2" fill="#b86b2f" />
            <text
              x="254"
              y="316"
              textAnchor="middle"
              fill="#312219"
              fontFamily="Georgia, serif"
              fontSize="7"
              fontWeight="700"
            >
              N
            </text>
          </motion.g>

          <text x="20" y="27" fill="#6d5b49" fontFamily="ui-monospace, monospace" fontSize="5.5" letterSpacing="0.8">
            NATURAL EARTH / 1:110M
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
            NORTH UP
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
