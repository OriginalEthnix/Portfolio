'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStudioStore } from '@/stores/useStudioStore';
import { useLofiEngine } from '@/stores/useLofiEngine';
import { profile } from '@/data/portfolio';
import {
  Play, Square, Pause, Timer
} from 'lucide-react';


function SessionTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5">
      <Timer size={10} className="text-slate-600" />
      <span className="text-[10px] font-mono text-slate-500 tabular-nums">{h}:{m}:{s}</span>
    </div>
  );
}

function EqBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: '#f59e0b', minHeight: 2 }}
          animate={isPlaying ? {
            height: ['4px', `${6 + Math.random() * 10}px`, '4px'],
          } : { height: '3px' }}
          transition={{ duration: 0.4 + i * 0.08, repeat: Infinity, delay: i * 0.06 }}
        />
      ))}
    </div>
  );
}

function NowPlayingMarquee({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="hidden md:flex flex-col items-center justify-center overflow-hidden w-48 shrink-0 border rounded px-2 py-0.5 relative" style={{ borderColor: '#1e293b', background: '#0a0f1a' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, #0a0f1a 0%, transparent 10%, transparent 90%, #0a0f1a 100%)', zIndex: 10 }} />
      <div className="w-full overflow-hidden">
        <motion.div
          className="whitespace-nowrap text-[10px] font-mono"
          style={{ color: isPlaying ? '#34d399' : '#f59e0b' }}
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          NOW PLAYING: Dhruv_Wadhwa_Portfolio.flp • {isPlaying ? 'AUDIO ACTIVE' : 'PAUSED'} • 
        </motion.div>
      </div>
    </div>
  );
}

export default function TopBar() {
  const { isBoringMode, toggleBoringMode } = useStudioStore();
  const { isPlaying, isInitialized, initAudio } = useLofiEngine();
  const [bpm] = useState(140);

  const handlePlay = () => {
    if (!isInitialized) initAudio();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="sticky top-0 z-40 border-b"
      style={{
        background: 'rgba(5, 7, 13, 0.92)',
        backdropFilter: 'blur(20px)',
        borderColor: '#1e293b',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2 min-h-[64px] gap-4">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 shrink-0">
          {/* macOS dots */}
          <div className="hidden sm:flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>

          <div className="w-px h-6 bg-slate-800 shrink-0 hidden sm:block" />

          {/* Brand & Badge */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="text-xs font-black tracking-widest text-amber-500" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              VIBE STUDIO
            </span>
            <span className="text-[9px] font-mono text-slate-600">v1.0.0</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1.5" style={{ background: '#0f3020', color: '#34d399' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-pulse" />
              SESSION ACTIVE
            </span>
          </div>

          <div className="w-px h-6 bg-slate-800 shrink-0 hidden lg:block" />

          {/* Transport controls */}
          <div className="flex items-center gap-1 shrink-0">
            <motion.button
              onClick={handlePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded flex items-center justify-center cursor-pointer"
              style={{
                background: isPlaying ? '#f59e0b20' : '#1e293b',
                border: `1px solid ${isPlaying ? '#f59e0b60' : '#2d3a4f'}`,
              }}
            >
              <Play size={10} style={{ color: isPlaying ? '#f59e0b' : '#64748b' }} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded flex items-center justify-center cursor-pointer"
              style={{ background: '#1e293b', border: '1px solid #2d3a4f' }}
            >
              <Pause size={10} className="text-slate-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded flex items-center justify-center cursor-pointer"
              style={{ background: '#1e293b', border: '1px solid #2d3a4f' }}
            >
              <Square size={10} className="text-slate-600" />
            </motion.button>
          </div>

          {/* BPM & EQ */}
          <div className="hidden xl:flex items-center gap-3 shrink-0 ml-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-slate-600">BPM</span>
              <span className="text-sm font-black font-mono text-amber-500">{bpm}</span>
            </div>
            <EqBars isPlaying={isPlaying} />
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="hidden md:flex flex-1 justify-center shrink-0">
          <NowPlayingMarquee isPlaying={isPlaying} />
        </div>

        {/* RIGHT SECTION (PERSONAL BRANDING) */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Session Timer */}
          <div className="hidden lg:block shrink-0">
            <SessionTimer />
          </div>

          <div className="w-px h-6 bg-slate-800 shrink-0 hidden lg:block" />

          {/* Personal Branding */}
          <div className="flex items-center gap-3">
            {/* Roles */}
            <div className="hidden sm:flex flex-col gap-1 border-r border-slate-800 pr-3 text-right">
              {profile.roles.map((r) => (
                <span key={r} className="text-[9px] leading-none font-mono text-slate-300 uppercase">
                  {r}
                </span>
              ))}
            </div>

            {/* Name */}
            <div className="flex flex-col items-start justify-center">
              <span className="text-2xl font-black uppercase tracking-wider text-amber-500">
                DHRUV WADHWA
              </span>
            </div>
          </div>

          <div className="w-px h-6 bg-slate-800 shrink-0 hidden sm:block" />

          {/* Boring Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-mono text-slate-600 uppercase hidden xl:block">
              {isBoringMode ? 'Resume' : 'Vibe'}
            </span>
            <motion.button
              onClick={toggleBoringMode}
              className="relative w-10 h-5 rounded-full border cursor-pointer"
              style={{
                backgroundColor: isBoringMode ? '#374151' : '#1a0a00',
                borderColor: isBoringMode ? '#6b7280' : '#f59e0b80',
                boxShadow: isBoringMode ? 'none' : '0 0 8px rgba(245,158,11,0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full"
                style={{ backgroundColor: isBoringMode ? '#6b7280' : '#f59e0b' }}
                animate={{ left: isBoringMode ? '2px' : '22px' }}
                transition={{ type: 'spring', stiffness: 600, damping: 35 }}
              />
            </motion.button>
          </div>
        </div>

      </div>
    </motion.header>
  );
}
