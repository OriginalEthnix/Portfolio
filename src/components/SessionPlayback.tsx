'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/stores/useStudioStore';
import type { SectionId } from '@/stores/useStudioStore';
import { Square } from 'lucide-react';

const PLAYBACK_SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'skills', label: 'Skills' },
  { id: 'music', label: 'Music' },
  { id: 'contact', label: 'Contact' },
];

export default function SessionPlayback() {
  const { isPlaybackMode, playbackIndex, nextPlaybackStep, stopPlayback } = useStudioStore();

  useEffect(() => {
    if (!isPlaybackMode) return;

    const timer = setInterval(() => {
      nextPlaybackStep();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaybackMode, nextPlaybackStep]);

  return (
    <AnimatePresence>
      {isPlaybackMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-xl"
          style={{
            background: 'rgba(17, 24, 39, 0.95)',
            borderColor: '#f59e0b60',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)',
          }}
        >
          {/* Playback progress dots */}
          <div className="flex items-center gap-1.5">
            {PLAYBACK_SECTIONS.map((section, i) => (
              <div key={section.id} className="flex flex-col items-center gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: i === playbackIndex ? '#f59e0b' : i < playbackIndex ? '#34d399' : '#1e293b',
                    boxShadow: i === playbackIndex ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none',
                  }}
                  animate={i === playbackIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[7px] font-mono" style={{ color: i === playbackIndex ? '#f59e0b' : '#475569' }}>
                  {section.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-400 rounded-full"
              key={playbackIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>

          {/* Now playing label */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-0.5 h-3">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full bg-amber-400"
                  animate={{ height: ['3px', '10px', '3px'] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">
              Playing: {PLAYBACK_SECTIONS[playbackIndex]?.label}
            </span>
          </div>

          {/* Stop button */}
          <motion.button
            onClick={stopPlayback}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-md flex items-center justify-center border cursor-pointer"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <Square size={10} className="text-red-400" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
