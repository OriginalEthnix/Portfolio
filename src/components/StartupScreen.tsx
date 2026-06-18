'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/stores/useStudioStore';

const STEPS = [
  { label: 'Initializing audio engine…', delay: 400 },
  { label: 'Loading Projects plugin…', delay: 800 },
  { label: 'Loading Certificates plugin…', delay: 1100 },
  { label: 'Loading Experience module…', delay: 1400 },
  { label: 'Loading Music session…', delay: 1700 },
  { label: 'Loading Skills rack…', delay: 2000 },
  { label: 'Opening session file…', delay: 2400 },
];

export default function StartupScreen() {
  const completeStartup = useStudioStore((s) => s.completeStartup);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
        setProgress(Math.round(((i + 1) / STEPS.length) * 100));
      }, step.delay);
    });

    setTimeout(() => {
      setDone(true);
      setTimeout(() => completeStartup(), 600);
    }, 2900);
  }, [completeStartup]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="startup"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#05070D' }}
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
            }}
          />

          {/* Logo area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            {/* FL Studio style logo */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-sm"
                    style={{
                      background: `hsl(${30 + i * 15}, 95%, 55%)`,
                      height: `${12 + i * 5}px`,
                    }}
                    animate={{ height: [`${12 + i * 5}px`, `${20 + i * 4}px`, `${12 + i * 5}px`] }}
                    transition={{ duration: 0.8 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <span className="text-4xl font-black tracking-tight" style={{ color: '#f59e0b', fontFamily: 'var(--font-geist-mono)' }}>
                VIBE STUDIO
              </span>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-sm"
                    style={{
                      background: `hsl(${270 - i * 15}, 80%, 70%)`,
                      height: `${24 - i * 5}px`,
                    }}
                    animate={{ height: [`${24 - i * 5}px`, `${14 - i * 2}px`, `${24 - i * 5}px`] }}
                    transition={{ duration: 0.7 + i * 0.15, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </div>
            </div>
            <div className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase">
              v1.0.0 &nbsp;|&nbsp; Dhruv_Wadhwa_Portfolio.flp
            </div>
          </motion.div>

          {/* Step list */}
          <div className="w-full max-w-sm space-y-2 mb-8 px-8">
            {STEPS.map((step, i) => (
              <AnimatePresence key={i}>
                {visibleSteps.includes(i) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-xs font-mono"
                  >
                    <span style={{ color: '#34d399' }}>✓</span>
                    <span className="text-slate-400">{step.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm px-8">
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: '#1e293b' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                  boxShadow: '0 0 10px rgba(245,158,11,0.6)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-mono text-slate-600">Loading session…</span>
              <span className="text-[10px] font-mono text-amber-500/70">{progress}%</span>
            </div>
          </div>

          {/* Bottom brand */}
          <motion.div
            className="absolute bottom-8 text-[10px] font-mono text-slate-700 tracking-widest"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            DHRUV WADHWA PRODUCTIONS
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
