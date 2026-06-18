'use client';

import { motion } from 'framer-motion';
import { hobbies, type Hobby } from '@/data/portfolio';
import { useStudioStore } from '@/stores/useStudioStore';

function MidiPattern({ hobby, index }: { hobby: Hobby; index: number }) {
  // Generate random MIDI note pattern for this hobby
  const pattern = Array.from({ length: 16 }).map(() => ({
    active: Math.random() > 0.6,
    note: Math.floor(Math.random() * 12),
    length: Math.floor(Math.random() * 3) + 1,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col rounded-lg border overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(5,7,13,0.8), ${hobby.color}10)`,
        borderColor: `${hobby.color}30`,
      }}
      whileHover={{ borderColor: `${hobby.color}60`, boxShadow: `0 0 20px ${hobby.glow}` }}
    >
      {/* Pattern header */}
      <div className="px-3 py-2 flex items-center gap-2 border-b" style={{ borderColor: `${hobby.color}20`, background: `${hobby.color}15` }}>
        <span className="text-lg">{hobby.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-200 truncate">{hobby.name}</div>
          <div className="text-[9px] font-mono uppercase tracking-widest truncate" style={{ color: hobby.color }}>Pattern {index + 1}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed flex-1">
          {hobby.description}
        </p>

        <div className="space-y-1 mb-3">
          {hobby.achievements.map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-500">
              <span style={{ color: hobby.color }}>•</span> {a}
            </div>
          ))}
        </div>

        <div className="text-[9px] font-mono italic p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: `${hobby.color}aa` }}>
          "{hobby.vibe}"
        </div>
      </div>

      {/* Mini piano roll visual */}
      <div className="h-12 border-t flex" style={{ borderColor: `${hobby.color}20`, background: 'rgba(0,0,0,0.5)' }}>
        {/* Piano keys (left edge) */}
        <div className="w-4 border-r flex flex-col" style={{ borderColor: `${hobby.color}30` }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="piano-glow flex-1 border-b border-white/5" style={{ background: [1,3,6,8,10].includes(i) ? '#111' : '#fff', '--key-color': hobby.color } as any} />
          ))}
        </div>
        {/* Notes grid */}
        <div className="flex-1 grid grid-cols-16 grid-rows-12 relative overflow-hidden"
             style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: 'calc(100%/16) 100%' }}>
          <div className="playback-line" style={{ background: hobby.color }} />
          {pattern.map((p, i) => p.active && (
            <motion.div
              key={i}
              className="absolute rounded-sm border"
              style={{
                left: `${(i / 16) * 100}%`,
                top: `${(p.note / 12) * 100}%`,
                width: `${(p.length / 16) * 100}%`,
                height: `${100/12}%`,
                background: hobby.color,
                borderColor: `${hobby.color}80`,
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HobbiesSection() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse" style={{ background: '#f472b6' }} />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Piano Roll — Hobbies</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #f472b630, transparent)' }} />
        <span className="text-[9px] font-mono text-slate-600">{hobbies.length} patterns</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {hobbies.map((hobby, i) => (
            <MidiPattern key={hobby.id} hobby={hobby} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
