import { useEffect, useRef, useState } from 'react';
import { LottieLight, type LottieHandle } from 'lottie-react';

const easeIn = { x: [0.2], y: [1] };
const easeOut = { x: [0.8], y: [0] };
const keyframe = (time: number, start: number[], end: number[]) => ({ t: time, s: start, e: end, i: easeIn, o: easeOut });
type MotionFrame = ReturnType<typeof keyframe> | { t: number; s: number[] };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function roundedShape(size: [number, number], radius: number, stroke = 0, fill = true) {
  return [
    { ty: 'rc', d: 1, s: { a: 0, k: size }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: radius }, nm: 'Shape' },
    fill
      ? { ty: 'fl', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'Fill' }
      : { ty: 'st', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: stroke }, lc: 2, lj: 2, ml: 4, nm: 'Stroke' },
    { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
  ];
}

function shapeLayer(index: number, name: string, position: [number, number], size: [number, number], radius: number, opacity = 100) {
  return {
    ddd: 0, ind: index, ty: 4, nm: name, sr: 1,
    ks: {
      o: { a: 0, k: opacity }, r: { a: 0, k: 0 }, p: { a: 0, k: [position[0], position[1], 0] },
      a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0, shapes: roundedShape(size, radius), ip: 0, op: 120, st: 0, bm: 0,
  };
}

function diamondLayer(index: number, position: [number, number], opacity: number, delay: number) {
  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: `Motus diamond ${index}`,
    sr: 1,
    ks: {
      o: { a: 0, k: opacity },
      r: { a: 1, k: [keyframe(0, [35], [48]), keyframe(45, [48], [40]), { t: 90, s: [40] }] },
      p: { a: 0, k: [position[0], position[1], 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [keyframe(delay, [92, 92, 100], [104, 104, 100]), keyframe(45 + delay, [104, 104, 100], [92, 92, 100]), { t: 90, s: [92, 92, 100] }] },
    },
    ao: 0,
    shapes: [
      { ty: 'rc', d: 1, s: { a: 0, k: [56, 56] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 14 }, nm: 'Rounded square' },
      { ty: 'st', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3.5 }, lc: 2, lj: 2, ml: 4, nm: 'Stroke' },
      { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
    ],
    ip: 0,
    op: 90,
    st: 0,
    bm: 0,
  };
}

export const motusMarkAnimation = {
  v: '5.12.2',
  fr: 60,
  ip: 0,
  op: 90,
  w: 120,
  h: 120,
  nm: 'Motus kinetic mark',
  ddd: 0,
  assets: [],
  layers: [
    diamondLayer(1, [60, 60], 100, 0),
    diamondLayer(2, [75, 51], 58, 5),
    diamondLayer(3, [48, 74], 30, 10),
  ],
};

const springBall = (index: number, opacity: number, delay: number) => ({
  ddd: 0,
  ind: index,
  ty: 4,
  nm: `Spring mass ${index}`,
  sr: 1,
  ks: {
    o: { a: 0, k: opacity },
    r: { a: 0, k: 0 },
    p: {
      a: 1,
      k: [
        keyframe(delay, [46, 50, 0], [402, 50, 0]),
        keyframe(42 + delay, [402, 50, 0], [348, 50, 0]),
        keyframe(64 + delay, [348, 50, 0], [378, 50, 0]),
        keyframe(82 + delay, [378, 50, 0], [366, 50, 0]),
        { t: 108, s: [366, 50, 0] },
      ],
    },
    a: { a: 0, k: [0, 0, 0] },
    s: {
      a: 1,
      k: [
        keyframe(delay, [100, 100, 100], [138, 72, 100]),
        keyframe(42 + delay, [138, 72, 100], [88, 112, 100]),
        keyframe(64 + delay, [88, 112, 100], [106, 94, 100]),
        { t: 108, s: [100, 100, 100] },
      ],
    },
  },
  ao: 0,
  shapes: [
    { ty: 'el', d: 1, s: { a: 0, k: [30, 30] }, p: { a: 0, k: [0, 0] }, nm: 'Mass' },
    { ty: 'fl', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'Fill' },
    { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
  ],
  ip: 0, op: 120, st: 0, bm: 0,
});

export const springSignalAnimation = {
  v: '5.12.2', fr: 60, ip: 0, op: 120, w: 520, h: 100, nm: 'Spring response', ddd: 0, assets: [],
  layers: [
    springBall(4, 18, 8),
    springBall(3, 35, 4),
    springBall(2, 100, 0),
    shapeLayer(1, 'Spring track', [260, 50], [430, 2], 1, 28),
  ],
};

const focusRing = (index: number, size: number, delay: number, opacity: number) => ({
  ...shapeLayer(index, `Focus ring ${index}`, [60, 60], [size, size], 18, opacity),
  shapes: roundedShape([size, size], 18, 3, false),
  ks: {
    o: { a: 1, k: [keyframe(delay, [20], [opacity]), keyframe(44 + delay, [opacity], [20]), { t: 100, s: [20] }] },
    r: { a: 0, k: 0 }, p: { a: 0, k: [60, 60, 0] }, a: { a: 0, k: [0, 0, 0] },
    s: { a: 1, k: [keyframe(delay, [78, 78, 100], [104, 104, 100]), keyframe(44 + delay, [104, 104, 100], [78, 78, 100]), { t: 100, s: [78, 78, 100] }] },
  },
});

const settleBallAnimation = {
  v: '5.12.2', fr: 60, ip: 0, op: 110, w: 120, h: 120, nm: 'Physical settle', ddd: 0, assets: [],
  layers: [
    {
      ...shapeLayer(2, 'Settling mass', [60, 28], [26, 26], 13),
      shapes: [{ ty: 'el', d: 1, s: { a: 0, k: [26, 26] }, p: { a: 0, k: [0, 0] }, nm: 'Ball' }, ...roundedShape([1, 1], 0).slice(1)],
      ks: {
        o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
        p: { a: 1, k: [keyframe(0, [60, 24, 0], [60, 88, 0]), keyframe(32, [60, 88, 0], [60, 52, 0]), keyframe(56, [60, 52, 0], [60, 88, 0]), keyframe(76, [60, 88, 0], [60, 72, 0]), { t: 108, s: [60, 88, 0] }] },
        a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: [keyframe(0, [100, 100, 100], [100, 100, 100]), keyframe(30, [100, 100, 100], [128, 72, 100]), keyframe(40, [128, 72, 100], [94, 106, 100]), { t: 108, s: [100, 100, 100] }] },
      },
    },
    shapeLayer(1, 'Ground', [60, 103], [76, 3], 2, 34),
  ],
};

const sourceLine = (index: number, y: number, width: number, delay: number, opacity: number) => ({
  ...shapeLayer(index, `Source line ${index}`, [60, y], [width, 8], 4, opacity),
  ks: {
    o: { a: 0, k: opacity }, r: { a: 0, k: 0 }, p: { a: 0, k: [60, y, 0] }, a: { a: 0, k: [0, 0, 0] },
    s: { a: 1, k: [keyframe(delay, [0, 100, 100], [108, 100, 100]), keyframe(35 + delay, [108, 100, 100], [100, 100, 100]), { t: 100, s: [100, 100, 100] }] },
  },
});

const principleAnimations = {
  focus: { v: '5.12.2', fr: 60, ip: 0, op: 100, w: 120, h: 120, nm: 'Readable focus', ddd: 0, assets: [], layers: [focusRing(3, 86, 8, 32), focusRing(2, 58, 4, 58), focusRing(1, 28, 0, 100)] },
  settle: settleBallAnimation,
  source: { v: '5.12.2', fr: 60, ip: 0, op: 100, w: 120, h: 120, nm: 'Source reveal', ddd: 0, assets: [], layers: [sourceLine(3, 82, 70, 16, 36), sourceLine(2, 59, 90, 8, 62), sourceLine(1, 36, 62, 0, 100)] },
};

const successBar = (index: number, size: [number, number], position: [number, number], rotation: number, start: number) => ({
  ddd: 0,
  ind: index,
  ty: 4,
  nm: `Check stroke ${index}`,
  sr: 1,
  ks: {
    o: { a: 0, k: 100 },
    r: { a: 0, k: rotation },
    p: { a: 0, k: [position[0], position[1], 0] },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 1, k: [keyframe(start, [0, 100, 100], [112, 100, 100]), keyframe(start + 12, [112, 100, 100], [100, 100, 100]), { t: start + 20, s: [100, 100, 100] }] },
  },
  ao: 0,
  shapes: [
    { ty: 'rc', d: 1, s: { a: 0, k: size }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 4 }, nm: 'Stroke bar' },
    { ty: 'fl', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'Fill' },
    { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
  ],
  ip: 0,
  op: 48,
  st: 0,
  bm: 0,
});

export const successAnimation = {
  v: '5.12.2',
  fr: 60,
  ip: 0,
  op: 48,
  w: 96,
  h: 96,
  nm: 'Motus confirmation',
  ddd: 0,
  assets: [],
  layers: [
    successBar(1, [26, 9], [38, 54], 42, 4),
    successBar(2, [45, 9], [59, 45], -43, 10),
  ],
};

export function MotusMotionMark({ className = '', tone = 'light', loop = false }: { className?: string; tone?: 'light' | 'dark'; loop?: boolean }) {
  const player = useRef<LottieHandle>(null);
  const reduced = useReducedMotion();
  return (
    <span className={`lottie-mark ${tone === 'light' ? 'lottie-tone-light' : 'lottie-tone-dark'} ${className}`} aria-hidden="true" onPointerEnter={() => { player.current?.stop(); player.current?.play(); }}>
      <LottieLight lottieRef={player} src={motusMarkAnimation} autoplay={!reduced} loop={loop && !reduced} speed={0.7} />
    </span>
  );
}

export function SpringSignal({ className = '', tone = 'light', loop = true }: { className?: string; tone?: 'light' | 'dark'; loop?: boolean }) {
  const reduced = useReducedMotion();
  return <span className={`lottie-spring ${tone === 'light' ? 'lottie-tone-light' : 'lottie-tone-dark'} ${className}`} aria-hidden="true"><LottieLight src={springSignalAnimation} autoplay={!reduced} loop={loop && !reduced} speed={0.78} /></span>;
}

export function PrincipleMotion({ kind, tone = 'dark', className = '' }: { kind: keyof typeof principleAnimations; tone?: 'light' | 'dark'; className?: string }) {
  const reduced = useReducedMotion();
  return <span className={`lottie-principle ${tone === 'light' ? 'lottie-tone-light' : 'lottie-tone-dark'} ${className}`} aria-hidden="true"><LottieLight src={principleAnimations[kind]} autoplay={!reduced} loop={!reduced} speed={0.72} /></span>;
}

export function MotionCheck({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const reduced = useReducedMotion();
  return <LottieLight src={successAnimation} autoplay={!reduced} loop={false} className={`lottie-check ${tone === 'light' ? 'lottie-tone-light' : 'lottie-tone-dark'} ${className}`} aria-hidden="true" />;
}

export function MotionReset({ playKey }: { playKey: number }) {
  const player = useRef<LottieHandle>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (playKey > 0 && !reduced) {
      player.current?.stop();
      player.current?.play();
    }
  }, [playKey, reduced]);
  return <LottieLight lottieRef={player} src={motusMarkAnimation} autoplay={false} loop={false} speed={1.8} className="lottie-reset lottie-tone-light" aria-hidden="true" />;
}

const circleShape = (size: number, fill = true, strokeWidth = 0, opacity = 100) => [
  { ty: 'el', d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [0, 0] }, nm: 'Circle' },
  fill
    ? { ty: 'fl', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: opacity }, r: 1, nm: 'Fill' }
    : { ty: 'st', c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: opacity }, w: { a: 0, k: strokeWidth }, lc: 2, lj: 2, ml: 4, nm: 'Stroke' },
  { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
];

const animatedCircle = (
  index: number,
  name: string,
  positionFrames: MotionFrame[] | [number, number, number],
  size: number,
  scaleFrames?: MotionFrame[],
  opacity = 100,
) => ({
  ddd: 0, ind: index, ty: 4, nm: name, sr: 1,
  ks: {
    o: { a: 0, k: opacity }, r: { a: 0, k: 0 },
    p: typeof positionFrames[0] === 'object'
      ? { a: 1, k: positionFrames }
      : { a: 0, k: positionFrames },
    a: { a: 0, k: [0, 0, 0] },
    s: scaleFrames ? { a: 1, k: scaleFrames } : { a: 0, k: [100, 100, 100] },
  },
  ao: 0, shapes: circleShape(size), ip: 0, op: 96, st: 0, bm: 0,
});

const shiftingFrame = (
  index: number,
  name: string,
  positions: MotionFrame[],
  rotations: MotionFrame[],
  opacity: number,
) => ({
  ddd: 0, ind: index, ty: 4, nm: name, sr: 1,
  ks: {
    o: { a: 0, k: opacity }, r: { a: 1, k: rotations }, p: { a: 1, k: positions },
    a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0, shapes: roundedShape([48, 68], 16, 3, false), ip: 0, op: 240, st: 0, bm: 0,
});

const heroFrameShiftAnimation = {
  v: '5.12.2', fr: 60, ip: 0, op: 240, w: 160, h: 120, nm: 'Motus frame shift', ddd: 0, assets: [],
  layers: [
    shiftingFrame(4, 'Front frame', [
      keyframe(0, [58, 60, 0], [72, 60, 0]),
      keyframe(80, [72, 60, 0], [60, 60, 0]),
      keyframe(160, [60, 60, 0], [58, 60, 0]),
      { t: 240, s: [58, 60, 0] },
    ], [keyframe(0, [-8], [0]), keyframe(80, [0], [-11]), keyframe(160, [-11], [-8]), { t: 240, s: [-8] }], 100),
    shiftingFrame(3, 'Rear frame', [
      keyframe(0, [102, 60, 0], [88, 60, 0]),
      keyframe(80, [88, 60, 0], [100, 60, 0]),
      keyframe(160, [100, 60, 0], [102, 60, 0]),
      { t: 240, s: [102, 60, 0] },
    ], [keyframe(0, [8], [0]), keyframe(80, [0], [11]), keyframe(160, [11], [8]), { t: 240, s: [8] }], 42),
    {
      ...shapeLayer(2, 'Responsive core', [80, 60], [22, 22], 11, 100),
      shapes: roundedShape([22, 22], 11),
      ks: {
        o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [80, 60, 0] }, a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [keyframe(0, [82, 82, 100], [118, 76, 100]), keyframe(80, [118, 76, 100], [76, 118, 100]), keyframe(160, [76, 118, 100], [82, 82, 100]), { t: 240, s: [82, 82, 100] }] },
      },
      op: 240,
    },
    {
      ...shapeLayer(1, 'Alignment line', [80, 105], [38, 3], 2, 28),
      ks: {
        o: { a: 1, k: [keyframe(0, [18], [48]), keyframe(80, [48], [18]), keyframe(160, [18], [18]), { t: 240, s: [18] }] },
        r: { a: 0, k: 0 }, p: { a: 0, k: [80, 105, 0] }, a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [keyframe(0, [55, 100, 100], [100, 100, 100]), keyframe(80, [100, 100, 100], [55, 100, 100]), keyframe(160, [55, 100, 100], [55, 100, 100]), { t: 240, s: [55, 100, 100] }] },
      },
      op: 240,
    },
  ],
};

export function HeroMotionIcon({ tone = 'dark', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={`landing-motion-icon hero-motion-icon ${tone === 'light' ? 'lottie-tone-light' : 'lottie-tone-dark'} ${className}`} aria-hidden="true">
      <LottieLight src={heroFrameShiftAnimation} autoplay={!reduced} loop={!reduced} speed={.78} />
    </span>
  );
}

const animatedBar = (index: number, name: string, position: [number, number], size: [number, number], scaleFrames: MotionFrame[], opacity = 100) => ({
  ...shapeLayer(index, name, position, size, Math.min(size[0], size[1]) / 2, opacity),
  ks: {
    o: { a: 0, k: opacity }, r: { a: 0, k: 0 }, p: { a: 0, k: [position[0], position[1], 0] },
    a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: scaleFrames },
  },
  op: 96,
});

const previewIconAnimation = {
  v: '5.12.2', fr: 60, ip: 0, op: 96, w: 120, h: 120, nm: 'Preview icon', ddd: 0, assets: [],
  layers: [
    animatedCircle(3, 'Preview point', [
      keyframe(0, [40, 60, 0], [78, 60, 0]),
      keyframe(34, [78, 60, 0], [60, 60, 0]),
      { t: 76, s: [60, 60, 0] },
    ], 16, [keyframe(0, [72, 72, 100], [112, 112, 100]), keyframe(38, [112, 112, 100], [100, 100, 100]), { t: 76, s: [100, 100, 100] }]),
    {
      ...shapeLayer(2, 'Preview frame', [60, 60], [84, 62], 22, 100),
      shapes: roundedShape([84, 62], 22, 3, false),
      ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [60, 60, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: [keyframe(0, [84, 84, 100], [103, 103, 100]), keyframe(34, [103, 103, 100], [100, 100, 100]), { t: 76, s: [100, 100, 100] }] } },
      op: 96,
    },
    animatedCircle(1, 'Preview echo', [60, 60, 0], 44, [keyframe(18, [45, 45, 100], [112, 112, 100]), keyframe(52, [112, 112, 100], [100, 100, 100]), { t: 76, s: [100, 100, 100] }], 15),
  ],
};

const pressIconAnimation = {
  v: '5.12.2', fr: 60, ip: 0, op: 96, w: 120, h: 120, nm: 'Press icon', ddd: 0, assets: [],
  layers: [
    animatedCircle(3, 'Press center', [60, 60, 0], 34, [keyframe(0, [100, 100, 100], [74, 74, 100]), keyframe(22, [74, 74, 100], [106, 106, 100]), keyframe(43, [106, 106, 100], [100, 100, 100]), { t: 76, s: [100, 100, 100] }]),
    {
      ...shapeLayer(2, 'Press ring', [60, 60], [72, 72], 36, 45),
      shapes: circleShape(72, false, 3, 45),
      ks: { o: { a: 1, k: [keyframe(0, [18], [58]), keyframe(28, [58], [18]), { t: 76, s: [18] }] }, r: { a: 0, k: 0 }, p: { a: 0, k: [60, 60, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: [keyframe(0, [72, 72, 100], [108, 108, 100]), keyframe(38, [108, 108, 100], [100, 100, 100]), { t: 76, s: [100, 100, 100] }] } },
      op: 96,
    },
    shapeLayer(1, 'Press base', [60, 92], [58, 4], 2, 22),
  ],
};

const copyIconAnimation = {
  v: '5.12.2', fr: 60, ip: 0, op: 96, w: 120, h: 120, nm: 'Copy icon', ddd: 0, assets: [],
  layers: [
    {
      ...shapeLayer(3, 'Front sheet', [67, 65], [54, 62], 13, 100),
      shapes: roundedShape([54, 62], 13, 3, false),
      ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 1, k: [keyframe(0, [61, 59, 0], [70, 68, 0]), keyframe(35, [70, 68, 0], [67, 65, 0]), { t: 76, s: [67, 65, 0] }] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
      op: 96,
    },
    {
      ...shapeLayer(2, 'Back sheet', [51, 49], [54, 62], 13, 45),
      shapes: roundedShape([54, 62], 13, 3, false),
      ks: { o: { a: 0, k: 45 }, r: { a: 0, k: 0 }, p: { a: 1, k: [keyframe(0, [58, 56, 0], [48, 46, 0]), keyframe(35, [48, 46, 0], [51, 49, 0]), { t: 76, s: [51, 49, 0] }] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
      op: 96,
    },
    animatedBar(1, 'Copied line', [67, 65], [24, 5], [keyframe(24, [0, 100, 100], [108, 100, 100]), keyframe(45, [108, 100, 100], [100, 100, 100]), { t: 76, s: [100, 100, 100] }], 100),
  ],
};

const tuneIconAnimation = {
  v: '5.12.2', fr: 60, ip: 0, op: 96, w: 120, h: 120, nm: 'Tune icon', ddd: 0, assets: [],
  layers: [
    animatedCircle(6, 'Top control', [keyframe(0, [42, 36, 0], [78, 36, 0]), keyframe(38, [78, 36, 0], [68, 36, 0]), { t: 76, s: [68, 36, 0] }], 14),
    animatedCircle(5, 'Middle control', [keyframe(6, [78, 60, 0], [42, 60, 0]), keyframe(44, [42, 60, 0], [52, 60, 0]), { t: 76, s: [52, 60, 0] }], 14),
    animatedCircle(4, 'Bottom control', [keyframe(12, [50, 84, 0], [72, 84, 0]), keyframe(50, [72, 84, 0], [64, 84, 0]), { t: 76, s: [64, 84, 0] }], 14),
    shapeLayer(3, 'Top rail', [60, 36], [76, 3], 2, 28),
    shapeLayer(2, 'Middle rail', [60, 60], [76, 3], 2, 28),
    shapeLayer(1, 'Bottom rail', [60, 84], [76, 3], 2, 28),
  ],
};

const landingIconAnimations = {
  preview: previewIconAnimation,
  press: pressIconAnimation,
  copy: copyIconAnimation,
  tune: tuneIconAnimation,
};

export type LandingMotionIconKind = keyof typeof landingIconAnimations;

export function LandingMotionIcon({ kind, tone = 'light', className = '' }: { kind: LandingMotionIconKind; tone?: 'light' | 'dark'; className?: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const player = useRef<LottieHandle>(null);
  const reduced = useReducedMotion();
  const replay = () => {
    if (reduced) return;
    player.current?.stop();
    player.current?.play();
  };

  useEffect(() => {
    if (reduced || !host.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      replay();
      observer.disconnect();
    }, { threshold: .4 });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [kind, reduced]);

  return (
    <span ref={host} className={`landing-motion-icon ${tone === 'light' ? 'lottie-tone-light' : 'lottie-tone-dark'} ${className}`} aria-hidden="true" onPointerEnter={replay}>
      <LottieLight lottieRef={player} src={landingIconAnimations[kind]} autoplay={false} loop={false} speed={.86} />
    </span>
  );
}
