'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLofiEngine } from '@/stores/useLofiEngine';
import Equalizer from './Equalizer';
import { Volume2, VolumeX, Settings2 } from 'lucide-react';

export default function AudioControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    playState, volume, setVolume, 
    isMuted, toggleMute, 
    isMuffled, toggleMuffle, 
    filterIntensity, setFilterIntensity 
  } = useLofiEngine();

  const isPlaying = playState === 'playing' || playState === 'ai_override';

  const statusColor = 
    playState === 'playing' ? '#10b981' : 
    playState === 'paused' ? '#f59e0b' : 
    playState === 'ai_override' ? '#8b5cf6' : 
    '#64748b';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 p-4 rounded-xl border backdrop-blur-xl shadow-2xl"
            style={{
              background: 'rgba(17, 24, 39, 0.95)',
              borderColor: '#2d3a4f',
              minWidth: '260px',
            }}
          >
            <div className="space-y-5">
              
              {/* Header: Status & Visualizer */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
                  <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: statusColor }}>
                    {playState.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                {isPlaying && <Equalizer />}
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 size={12} /> Master Volume
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{isMuted ? '0%' : `${Math.round(volume * 100)}%`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={toggleMute} className="shrink-0 transition-colors hover:text-white text-slate-400 cursor-pointer">
                    {isMuted || volume === 0 ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-800"
                    style={{
                      background: `linear-gradient(to right, #10b981 ${(isMuted ? 0 : volume) * 100}%, #1e293b ${(isMuted ? 0 : volume) * 100}%)`,
                    }}
                  />
                </div>
              </div>

              {/* Low-Pass Filter Control */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Settings2 size={12} /> Low-Pass Filter
                  </span>
                  <button
                    onClick={toggleMuffle}
                    className={`w-8 h-4 rounded-full transition-colors duration-300 flex items-center cursor-pointer ${
                      isMuffled ? 'bg-violet-500/60 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mx-0.5 transition-colors duration-300 ${isMuffled ? 'bg-violet-300' : 'bg-slate-500'}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {isMuffled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[9px] font-mono text-slate-500 w-8">Int.</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={filterIntensity}
                          onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-800"
                          style={{ background: `linear-gradient(to right, #8b5cf6 ${filterIntensity}%, #1e293b ${filterIntensity}%)` }}
                        />
                        <span className="text-[9px] font-mono text-violet-400 w-8 text-right">{filterIntensity}%</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
          borderColor: playState === 'playing' ? '#10b981' : playState === 'ai_override' ? '#8b5cf6' : '#2d3a4f',
          boxShadow: playState === 'playing' ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <svg className={`w-5 h-5 ${playState === 'playing' ? 'text-emerald-400' : 'text-violet-400'}`} fill="currentColor" viewBox="0 0 24 24">
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
