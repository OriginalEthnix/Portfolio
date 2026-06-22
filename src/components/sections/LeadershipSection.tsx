'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { leadership } from '@/data/portfolio';

function MixerChannel({ role, index }: { role: typeof leadership[number]; index: number }) {
  const [fader, setFader] = useState(80);
  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [solo, setSolo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center gap-2 p-3 rounded-lg border min-w-[90px] sm:min-w-[100px] flex-1 relative"
      style={{
        background: `linear-gradient(180deg, ${role.color}10, rgba(5,7,13,0.8))`,
        borderColor: hovered ? `${role.color}60` : '#1e293b',
        boxShadow: hovered ? `0 0 20px ${role.color}20` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {hovered && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-[105%] left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg border z-50 text-center pointer-events-none"
          style={{ background: 'rgba(5,7,13,0.98)', borderColor: `${role.color}40`, boxShadow: `0 8px 30px ${role.color}30` }}
        >
           <div className="text-[10px] font-bold text-white mb-1">{role.role}</div>
           <div className="text-[8px] font-mono mb-2" style={{ color: role.color }}>{role.org}</div>
           <div className="text-[9px] text-slate-300 leading-relaxed">{role.desc}</div>
        </motion.div>
      )}
      {/* Channel label */}
      <div
        className="text-[8px] font-mono uppercase tracking-widest text-center px-1 py-0.5 rounded w-full"
        style={{ background: `${role.color}20`, color: role.color }}
      >
        CH {String(index + 1).padStart(2, '0')}
      </div>

      {/* VU meter */}
      <div className="flex gap-0.5 items-end h-16">
        {[...Array(2)].map((_, col) => (
          <div key={col} className="flex flex-col-reverse gap-0.5">
            {Array.from({ length: 12 }).map((_, row) => {
              const defaultLevel = Math.round((fader / 100) * 12);
              const isClip = row >= 10;
              const litColor = isClip ? '#ef4444' : row > 7 ? '#fbbf24' : role.color;
              
              return (
                <motion.div
                  key={row}
                  className="w-2 h-1 rounded-sm"
                  style={{ background: (row < defaultLevel && !muted) || solo ? litColor : '#1e293b' }}
                  animate={hovered && !muted ? {
                    background: [
                      row < 4 ? litColor : '#1e293b',
                      row < 11 ? litColor : '#1e293b',
                      row < 6 ? litColor : '#1e293b'
                    ]
                  } : {}}
                  transition={{ duration: 0.3 + Math.random() * 0.2, repeat: hovered ? Infinity : 0, repeatType: "mirror" }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Solo / Mute Buttons */}
      <div className="flex gap-1.5 w-full justify-center my-1 z-10 relative">
        <button
          onClick={() => { setMuted(!muted); if (!muted) setSolo(false); }}
          className="w-6 h-6 flex items-center justify-center rounded text-[9px] font-black shadow-sm transition-colors"
          style={{ background: muted ? '#ef4444' : '#1e293b', color: muted ? 'white' : '#64748b' }}
        >M</button>
        <button
          onClick={() => { setSolo(!solo); if (!solo) setMuted(false); }}
          className="w-6 h-6 flex items-center justify-center rounded text-[9px] font-black shadow-sm transition-colors"
          style={{ background: solo ? '#fbbf24' : '#1e293b', color: solo ? 'black' : '#64748b' }}
        >S</button>
      </div>

      {/* Fader */}
      <div className="w-full flex flex-col items-center gap-1">
        <input
          type="range"
          min={0}
          max={100}
          value={fader}
          onChange={(e) => setFader(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: role.color }}
        />
        <span className="text-[9px] font-mono" style={{ color: `${role.color}aa` }}>
          {fader}%
        </span>
      </div>

      {/* Channel info */}
      <div className="text-center">
        <div className="text-[10px] font-semibold text-slate-300 leading-tight">{role.role}</div>
        <div className="text-[9px] font-mono mt-0.5" style={{ color: `${role.color}80` }}>{role.org}</div>
        <div className="text-[8px] font-mono text-slate-600 mt-0.5">{role.duration}</div>
      </div>

      {/* Status LED */}
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: role.color }}
        animate={{ opacity: [0.4, 1, 0.4], boxShadow: [`0 0 4px ${role.color}`, `0 0 8px ${role.color}`, `0 0 4px ${role.color}`] }}
        transition={{ duration: 2 + index * 0.3, repeat: Infinity }}
      />
    </motion.div>
  );
}

export default function LeadershipSection() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse" style={{ background: '#fbbf24' }} />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Mixer — Leadership</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #fbbf2430, transparent)' }} />
        <span className="text-[9px] font-mono text-slate-600">{leadership.length} channels</span>
      </div>

      {/* Master label */}
      <div className="px-3 py-2 flex items-center gap-2 border-b"
        style={{ borderColor: '#1e293b', background: '#080c14' }}>
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">FL Studio Mixer</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-auto p-3">
        <div className="flex gap-2 h-full min-h-48">
          {leadership.map((role, i) => (
            <MixerChannel key={role.id} role={role} index={i} />
          ))}

          {/* Master channel */}
          <div
            className="flex flex-col items-center gap-2 p-3 rounded-lg border min-w-[90px] sm:min-w-[100px]"
            style={{ background: 'rgba(5,7,13,0.9)', borderColor: '#2d3a4f' }}
          >
            <div className="text-[8px] font-mono uppercase tracking-widest text-center px-1 py-0.5 rounded w-full bg-slate-800 text-slate-400">
              MASTER
            </div>
            <div className="flex gap-0.5 items-end h-16">
              {[...Array(2)].map((_, col) => (
                <div key={col} className="flex flex-col-reverse gap-0.5">
                  {Array.from({ length: 12 }).map((_, row) => (
                    <motion.div
                      key={row}
                      className="w-2 h-1 rounded-sm"
                      style={{ background: row >= 10 ? '#ef4444' : row > 7 ? '#fbbf24' : '#34d399' }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, delay: row * 0.05, repeat: Infinity }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-[10px] font-semibold text-slate-300">Dhruv W.</div>
            <div className="text-[8px] font-mono text-slate-600">Master Bus</div>
          </div>
        </div>
      </div>
    </div>
  );
}
