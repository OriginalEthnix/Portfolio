'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLofiEngine } from '@/stores/useLofiEngine';
import VolumeSlider from './VolumeSlider';
import Equalizer from './Equalizer';

export default function AudioControls() {
  const [isOpen, setIsOpen] = useState(false);
  const isMuffled = useLofiEngine((s) => s.isMuffled);
  const toggleMuffle = useLofiEngine((s) => s.toggleMuffle);
  const isPlaying = useLofiEngine((s) => s.isPlaying);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 p-4 rounded-xl border backdrop-blur-xl"
            style={{
              background: 'rgba(17, 24, 39, 0.95)',
              borderColor: '#2d3a4f',
              minWidth: '220px',
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Volume</span>
                {isPlaying && <Equalizer />}
              </div>
              <VolumeSlider />
              <div className="border-t border-slate-700/50 pt-3">
                <button
                  onClick={toggleMuffle}
                  className="flex items-center justify-between w-full group cursor-pointer"
                >
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Low-Pass Filter
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full transition-colors duration-300 flex items-center ${
                      isMuffled ? 'bg-violet-500/60 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full mx-0.5 transition-colors duration-300 ${
                        isMuffled ? 'bg-violet-300' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-xl cursor-pointer"
        style={{
          background: 'rgba(17, 24, 39, 0.9)',
          borderColor: isPlaying ? '#f59e0b' : '#2d3a4f',
          boxShadow: isPlaying ? '0 0 20px rgba(245, 158, 11, 0.15)' : 'none',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isPlaying ? { boxShadow: ['0 0 20px rgba(245, 158, 11, 0.1)', '0 0 20px rgba(245, 158, 11, 0.3)', '0 0 20px rgba(245, 158, 11, 0.1)'] } : {}}
        transition={isPlaying ? { duration: 2, repeat: Infinity } : {}}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
