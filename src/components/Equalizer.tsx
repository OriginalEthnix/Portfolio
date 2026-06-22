'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLofiEngine } from '@/stores/useLofiEngine';

export default function Equalizer() {
  const getFrequencyData = useLofiEngine((s) => s.getFrequencyData);
  const playState = useLofiEngine((s) => s.playState);
  const isPlaying = playState === 'playing' || playState === 'ai_override';
  const [bars, setBars] = useState<number[]>(Array(16).fill(5));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      const data = getFrequencyData();
      if (data) {
        const step = Math.floor(data.length / 16);
        const newBars = Array.from({ length: 16 }, (_, i) => {
          const val = data[i * step] || 0;
          return Math.max(4, (val / 255) * 100);
        });
        setBars(newBars);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, getFrequencyData]);

  return (
    <div className="flex items-end gap-[2px] h-6">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: `${height}%`,
            background: i < 5 ? '#f59e0b' : i < 11 ? '#a78bfa' : '#fbbf24',
            opacity: 0.8,
          }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.05, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
