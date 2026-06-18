'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { musicData } from '@/data/portfolio';
import { ExternalLink, Play, Pause } from 'lucide-react';

export default function MusicSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const color = '#ef4444'; // Red for music

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background visualizer effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-col items-center justify-center gap-4">
        <motion.div
          className="w-[120%] h-64 rounded-[100%] border border-red-500/30"
          animate={{ scale: isPlaying ? [1, 1.1, 1] : 1, opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.3 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="w-[150%] h-96 rounded-[100%] border border-red-500/20 absolute"
          animate={{ scale: isPlaying ? [1, 1.05, 1] : 1, opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0 z-10"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse" style={{ background: color }} />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Artist Mode — {musicData.artistName}</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 z-10 flex flex-col md:flex-row gap-8">
        {/* Left: Artist Info */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center p-6 rounded-xl border relative overflow-hidden group"
            style={{ background: `linear-gradient(180deg, ${color}15, rgba(5,7,13,0.9))`, borderColor: `${color}30` }}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                 style={{ background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)` }} />

            <h1 className="text-4xl font-black tracking-widest mb-1" style={{ color }}>{musicData.artistName}</h1>
            <h2 className="text-[10px] font-mono text-slate-400 tracking-[0.3em] mb-4">AKA {musicData.altName}</h2>
            <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{musicData.tagline}"</p>

            <div className="grid grid-cols-2 gap-3 w-full mb-6 text-left">
              <div className="p-2 rounded bg-black/40 border border-red-500/20">
                <div className="text-[8px] font-mono text-slate-500 uppercase">Shows</div>
                <div className="text-xs font-mono text-slate-200">{musicData.stats.performances}</div>
              </div>
              <div className="p-2 rounded bg-black/40 border border-red-500/20">
                <div className="text-[8px] font-mono text-slate-500 uppercase">Releases</div>
                <div className="text-xs font-mono text-slate-200">{musicData.stats.tracksReleased}</div>
              </div>
              <div className="p-2 rounded bg-black/40 border border-red-500/20">
                <div className="text-[8px] font-mono text-slate-500 uppercase">WIP</div>
                <div className="text-xs font-mono text-slate-200">{musicData.stats.inProgress}</div>
              </div>
              <div className="p-2 rounded bg-black/40 border border-red-500/20">
                <div className="text-[8px] font-mono text-slate-500 uppercase">Wins</div>
                <div className="text-xs font-mono text-slate-200">{musicData.stats.rapBattlesWon}</div>
              </div>
            </div>

            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer mb-6"
              style={{
                background: isPlaying ? `${color}20` : '#111827',
                border: `2px solid ${isPlaying ? color : '#374151'}`,
                boxShadow: isPlaying ? `0 0 30px ${color}40` : 'none',
              }}
            >
              {isPlaying ? <Pause size={24} color={color} /> : <Play size={24} className="text-slate-300 ml-1" />}
            </motion.button>

            <div className="flex gap-3 w-full justify-center">
              {Object.entries(musicData.platforms).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                   className="px-3 py-1.5 rounded border text-[9px] font-mono uppercase tracking-wider transition-colors"
                   style={{ borderColor: '#374151', color: '#9ca3af' }}
                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.color = '#9ca3af'; }}>
                  {platform}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl border"
            style={{ background: 'rgba(5,7,13,0.8)', borderColor: '#1e293b' }}
          >
            <h3 className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color }}>Biography</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{musicData.bio}</p>
          </motion.div>
        </div>

        {/* Right: Tracks and Achievements */}
        <div className="md:w-2/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-[10px] font-mono uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color }}>
              <span className="w-4 h-px bg-current" /> Discography / Projects
            </h3>
            <div className="space-y-2">
              {musicData.tracks.map((track, i) => (
                <motion.div
                  key={track.title}
                  whileHover={{ x: 4, background: `${color}15`, borderColor: `${color}40` }}
                  className="daw-clip flex items-center gap-3 p-3 rounded-md transition-all relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)`, borderColor: `${color}20` }}
                >
                  <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
                    {Array.from({length: 16}).map((_, j) => (
                      <div key={j} className="w-[1px] h-full" style={{ background: color, transform: `scaleY(${Math.random() * 0.8 + 0.2})` }} />
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded bg-slate-900 border border-red-500/30 flex items-center justify-center shrink-0 z-10 relative overflow-hidden group-hover:border-red-500 transition-colors">
                    {/* Placeholder cover art */}
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ background: `linear-gradient(45deg, ${color}, transparent)` }} />
                    <Play size={14} className="text-white ml-0.5 relative z-10 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-200">{track.title}</div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: `${color}aa` }}>
                      {track.status} • {track.bpm} BPM
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500 shrink-0">{track.duration}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-[10px] font-mono uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color }}>
              <span className="w-4 h-px bg-current" /> Milestones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {musicData.achievements.map((ach, i) => (
                <div key={i} className="p-3 rounded-lg border text-xs text-slate-300"
                     style={{ background: 'rgba(5,7,13,0.6)', borderColor: '#1e293b' }}>
                  {ach}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tour Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            <h3 className="text-[10px] font-mono uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color }}>
              <span className="w-4 h-px bg-current" /> Tour Dates / Live Setlog
            </h3>
            <div className="rounded-xl border p-4 bg-black/40 relative overflow-hidden" style={{ borderColor: '#1e293b' }}>
              <div className="space-y-3 relative z-10">
                 <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="w-16" style={{ color }}>Feb 26</span>
                    <span className="text-slate-300 flex-1">VIBRANCE 2026 Mainstage</span>
                    <span className="text-slate-500 text-right hidden sm:block">VIT Chennai</span>
                 </div>
                 <div className="w-full h-px bg-slate-800/50" />
                 <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="w-16" style={{ color }}>Oct 25</span>
                    <span className="text-slate-300 flex-1">VITC Rap Battle Finals</span>
                    <span className="text-slate-500 text-right hidden sm:block">Amphitheatre</span>
                 </div>
                 <div className="w-full h-px bg-slate-800/50" />
                 <div className="flex items-center gap-3 text-xs font-mono opacity-60">
                    <span className="w-16" style={{ color }}>Sep 25</span>
                    <span className="text-slate-300 flex-1">Music Club Orientation</span>
                    <span className="text-slate-500 text-right hidden sm:block">AB1</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Spotify Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="w-full"
          >
            <h3 className="text-[10px] font-mono uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color }}>
              <span className="w-4 h-px bg-current" /> Streaming Output
            </h3>
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/user/WADHWAVE?utm_source=generator&theme=0" 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </motion.div>

          {/* Audio Visualizer (Fake) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1 min-h-[100px] p-4 rounded-xl border flex flex-col justify-between"
            style={{ background: '#05070D', borderColor: '#1e293b' }}
          >
            <div className="text-[9px] font-mono text-slate-600 uppercase">Master Analyzer</div>
            <div className="flex items-end gap-1 h-16 w-full px-2">
              {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{ background: color, minHeight: 2 }}
                  animate={isPlaying ? {
                    height: ['2px', `${Math.random() * 60 + 4}px`, '2px']
                  } : { height: '2px' }}
                  transition={{ duration: 0.3 + Math.random() * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
