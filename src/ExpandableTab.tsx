'use client';

import { defineSound, ensureReady } from '@web-kits/audio';
import {
    ArrowUpRight,
    AudioLines,
    BookOpen,
    Compass,
    Mail,
    MousePointer2,
    Orbit,
    Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';

const playOpen = defineSound({
    source: { type: 'sine', frequency: 440 },
    envelope: { decay: 0.1 },
    gain: 0.15,
});

const playClose = defineSound({
    source: { type: 'sine', frequency: 880 },
    envelope: { decay: 0.08 },
    gain: 0.15,
});

const slideStart = defineSound({
    source: { type: 'sine', frequency: 400 },
    envelope: { decay: 0.08 },
    gain: 0.08,
});

const slideEnd = defineSound({
    source: { type: 'sine', frequency: 600 },
    envelope: { decay: 0.08 },
    gain: 0.08,
});

const Arrow = () => <ArrowUpRight className="size-3.5" aria-hidden="true" />;

function ExplorePanel() {
    return (
        <div className="px-2 pb-2 pt-1 text-zinc-950">
            <div className="flex items-end justify-between border-b border-zinc-200 px-1 pb-3">
                <p className="text-lg font-semibold tracking-[-0.03em]">Projects</p>
                <span className="text-xs font-medium tabular-nums text-zinc-400">4 projects</span>
            </div>

            <button className="group flex w-full items-center gap-3 border-b border-zinc-100 px-1 py-3 text-left">
                <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#e9e5ff] text-[#5a45d6]">
                    <Orbit className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                    <span className="absolute -bottom-2 -right-2 size-5 rounded-full bg-[#ffb38a]/70 blur-sm" />
                </span>
                <span className="min-w-0 flex-1">
                    <strong className="block text-sm font-semibold">All projects</strong>
                    <span className="block text-xs text-zinc-500">View case studies</span>
                </span>
                <Arrow />
            </button>

            <button className="group flex w-full items-center gap-3 px-1 py-3 text-left">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#dff6ed] text-[#08795c]">
                    <Sparkles className="size-4 transition-transform duration-500 group-hover:scale-125" />
                </span>
                <span className="min-w-0 flex-1">
                    <strong className="block text-sm font-semibold">Experiments</strong>
                    <span className="block text-xs text-zinc-500">Motion and UI tests</span>
                </span>
                <Arrow />
            </button>
        </div>
    );
}

function NowPanel() {
    return (
        <div className="p-3 text-zinc-950">
            <div className="overflow-hidden rounded-2xl bg-[#141417] p-4 text-white">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#a8ff78] opacity-60" />
                            <span className="relative inline-flex size-2 rounded-full bg-[#a8ff78]" />
                        </span>
                        In progress
                    </span>
                    <span className="text-[10px] text-white/35">WIP · 72%</span>
                </div>
                <p className="mt-5 text-xl font-semibold tracking-[-0.04em]">Northstar</p>
                <p className="mt-1 text-xs leading-5 text-white/55">Portfolio case study.</p>
                <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                        className="block rounded-full bg-[#a8ff78]"
                        initial={{ width: '18%' }}
                        animate={{ width: '72%' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between px-1 pt-3 text-xs">
                <span className="text-zinc-500">Next: motion</span>
                <button className="flex items-center gap-1 font-semibold text-zinc-950">
                    View project <Arrow />
                </button>
            </div>
        </div>
    );
}

const FEEL_MODES = [
    { id: 'calm', label: 'Calm', detail: 'Short' },
    { id: 'spring', label: 'Spring', detail: 'Bouncy' },
    { id: 'alive', label: 'Full', detail: 'Expressive' },
] as const;

function FeelPanel() {
    const [mode, setMode] = useState<(typeof FEEL_MODES)[number]['id']>('spring');
    const [sound, setSound] = useState(true);

    return (
        <div className="p-3 text-zinc-950">
            <div className="flex items-center justify-between px-1">
                <div>
                    <p className="text-sm font-semibold">Motion style</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Choose how the preview moves.</p>
                </div>
                <MousePointer2 className="size-4 text-zinc-300" aria-hidden="true" />
            </div>

            <div className="relative mt-4 grid grid-cols-3 rounded-2xl bg-zinc-100 p-1">
                {FEEL_MODES.map((item) => {
                    const active = mode === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setMode(item.id)}
                            className="relative z-10 flex h-12 flex-col items-center justify-center rounded-xl"
                        >
                            {active && (
                                <motion.span
                                    layoutId="feel-mode"
                                    className="absolute inset-0 rounded-xl bg-white shadow-sm"
                                    transition={{ type: 'spring', stiffness: 430, damping: 32 }}
                                />
                            )}
                            <span className="relative text-xs font-semibold">{item.label}</span>
                            <span className="relative mt-0.5 text-[9px] text-zinc-400">{item.detail}</span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => setSound((value) => !value)}
                aria-pressed={sound}
                className="mt-3 flex w-full items-center justify-between rounded-xl px-1 py-2 text-left"
            >
                <span className="flex items-center gap-2 text-xs font-medium">
                    <AudioLines className="size-4" aria-hidden="true" />
                    Sound
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-500">
                    {sound ? 'On' : 'Off'}
                </span>
            </button>
        </div>
    );
}

function NotesPanel() {
    return (
        <div className="p-3 text-zinc-950">
            <button className="group w-full text-left">
                <div className="flex items-start justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d5be8]">Latest note</span>
                    <span className="text-[10px] tabular-nums text-zinc-400">6 min</span>
                </div>
                <p className="mt-3 max-w-[15rem] text-xl font-semibold leading-6 tracking-[-0.04em]">
                    Using motion to explain state changes.
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3">
                    <span className="text-xs text-zinc-500">August 18, 2026</span>
                    <span className="grid size-7 place-items-center rounded-full bg-zinc-950 text-white transition-transform group-hover:rotate-45">
                        <Arrow />
                    </span>
                </div>
            </button>
            <div className="mt-2 flex gap-2">
                <button className="flex-1 rounded-xl bg-[#f4f2ff] px-3 py-2 text-left text-xs font-medium text-[#5b49c8]">Process</button>
                <button className="flex-1 rounded-xl bg-[#fff1e9] px-3 py-2 text-left text-xs font-medium text-[#a94f22]">Notes</button>
            </div>
        </div>
    );
}

function ConnectPanel() {
    const [copied, setCopied] = useState(false);
    const email = 'hello@example.com';

    const copyEmail = async () => {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <div className="p-3 text-zinc-950">
            <div className="relative overflow-hidden rounded-2xl bg-[#e8f8d9] p-4">
                <motion.span
                    className="absolute -right-5 -top-7 size-24 rounded-full border border-[#7bbf49]/25"
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#47752b]">
                    <span className="size-2 rounded-full bg-[#61a936]" />
                    Available for work
                </div>
                <p className="mt-5 text-xl font-semibold tracking-[-0.04em]">Let&rsquo;s work together.</p>
                <p className="mt-1 text-xs text-[#47752b]">Tell me about your project.</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                    href={`mailto:${email}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-3 py-2.5 text-xs font-semibold text-white"
                    style={{ color: '#ffffff' }}
                >
                    <Mail className="size-3.5" aria-hidden="true" />
                    Email
                </a>
                <button
                    onClick={copyEmail}
                    className="flex items-center justify-center gap-1 rounded-xl bg-zinc-100 px-3 py-2.5 text-xs font-semibold"
                >
                    {copied ? 'Copied' : 'Copy email'}
                </button>
            </div>
        </div>
    );
}

type Tab = {
    id: string;
    label: string;
    icon: ReactNode;
    content: ReactNode;
};

const tabs: Tab[] = [
    { id: 'explore', label: 'Work', icon: <Compass className="size-4" />, content: <ExplorePanel /> },
    { id: 'now', label: 'Status', icon: <Orbit className="size-4" />, content: <NowPanel /> },
    { id: 'feel', label: 'Motion', icon: <AudioLines className="size-4" />, content: <FeelPanel /> },
    { id: 'notes', label: 'Notes', icon: <BookOpen className="size-4" />, content: <NotesPanel /> },
    { id: 'connect', label: 'Connect', icon: <Mail className="size-4" />, content: <ConnectPanel /> },
];

const NAV_H = 50;
const CARD_W = 290;
const COLLAPSED_W = 200;

const slideVariants = {
    enter: (dir: number) => ({ x: dir * 32, opacity: 0, filter: 'blur(4px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (dir: number) => ({ x: dir * -32, opacity: 0, filter: 'blur(4px)' }),
};

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 28 };
const EASE = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
const SLIDE_T = { duration: 0.24, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export function ExpandableTab() {
    const [activeId, setActiveId] = useState<string | null>('explore');
    const [direction, setDirection] = useState(0);
    const prevIdxRef = useRef(0);
    const [ghostRef, { height: contentHeight }] = useMeasure({ debounce: 0 });

    const activeTab = tabs.find((tab) => tab.id === activeId);
    const isExpanded = activeId !== null;
    const cardHeight = isExpanded ? contentHeight + NAV_H : NAV_H;

    const handleNavClick = async (id: string) => {
        const newIdx = tabs.findIndex((tab) => tab.id === id);

        if (id === activeId) {
            setActiveId(null);
            await ensureReady();
            playClose();
            return;
        }

        await ensureReady();
        if (activeId === null) {
            playOpen();
        } else {
            slideStart();
            setTimeout(() => slideEnd(), 60);
        }

        setDirection(newIdx > prevIdxRef.current ? 1 : -1);
        prevIdxRef.current = newIdx;
        setActiveId(id);
    };

    return (
        <>
            {isExpanded && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        left: -9999,
                        top: 0,
                        width: CARD_W,
                        pointerEvents: 'none',
                        visibility: 'hidden',
                    }}
                >
                    <div ref={ghostRef}>{activeTab?.content}</div>
                </div>
            )}

            <div className="flex h-96 items-end justify-center">
                <motion.div
                    className="relative mx-auto rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50"
                    style={{ overflow: 'hidden' }}
                    animate={{ height: cardHeight, width: isExpanded ? CARD_W : COLLAPSED_W }}
                    transition={SPRING}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            bottom: NAV_H,
                            overflow: 'hidden',
                        }}
                    >
                        <AnimatePresence custom={direction} initial={false}>
                            {isExpanded && (
                                <motion.div
                                    key={activeId}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={SLIDE_T}
                                    className="absolute inset-x-0 top-0"
                                >
                                    {activeTab?.content}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-[50px] border-t border-zinc-100 bg-white p-2">
                        <div className="flex h-9 w-full items-center justify-center gap-1">
                            {tabs.map((tab) => {
                                const isActive = activeId === tab.id;
                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => handleNavClick(tab.id)}
                                        aria-label={tab.label}
                                        aria-pressed={isActive}
                                        className="relative flex h-full items-center justify-center rounded-2xl text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                                        animate={{
                                            paddingLeft: isActive ? '1rem' : '0.5rem',
                                            paddingRight: isActive ? '1rem' : '0.5rem',
                                            gap: isActive ? '0.5rem' : '0rem',
                                            backgroundColor: isActive ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0)',
                                            color: isActive ? '#18181b' : '#a1a1aa',
                                        }}
                                        transition={EASE}
                                        whileHover={{ color: isActive ? '#18181b' : '#71717a' }}
                                    >
                                        {tab.icon}
                                        <AnimatePresence initial={false}>
                                            {isActive && (
                                                <motion.span
                                                    key={tab.id + '-label'}
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 'auto' }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{
                                                        opacity: { duration: 0.15, ease: 'easeInOut' },
                                                        width: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                                                    }}
                                                    className="overflow-hidden whitespace-nowrap font-semibold leading-4 tracking-tight"
                                                >
                                                    {tab.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
