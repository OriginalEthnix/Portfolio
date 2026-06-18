'use client';

import { motion } from 'framer-motion';
import { profile, sessionStats, sessionNotes } from '@/data/portfolio';
import { useStudioStore } from '@/stores/useStudioStore';

function WaveformBar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-0.5 rounded-full"
      style={{ background: 'rgba(245, 158, 11, 0.4)', minHeight: 4 }}
      animate={{ height: ['4px', '20px', '8px', '16px', '4px'] }}
      transition={{ duration: 1.8, repeat: Infinity, delay, ease: 'easeInOut' }}
      whileHover={{ scaleY: 1.8, background: 'rgba(245, 158, 11, 0.9)' }}
    />
  );
}

export default function HeroSection() {
  const setActiveSection = useStudioStore((s) => s.setActiveSection);

  return (
    <div
      className="relative overflow-hidden rounded-xl border"
      style={{
        background: 'linear-gradient(135deg, #080c14 0%, #0d1420 50%, #0a0f1a 100%)',
        borderColor: '#1e293b',
        minHeight: 280,
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: DAW project info */}
        <div className="shrink-0 w-full md:w-72">
          {/* File header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {['#f97316', '#f59e0b', '#34d399'].map((c) => (
                <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-500">Dhruv_Wadhwa_Portfolio.flp</span>
          </div>

          {/* Project metadata table */}
          <div
            className="rounded-lg border p-4 space-y-2.5 font-mono text-xs"
            style={{ background: 'rgba(5,7,13,0.8)', borderColor: '#1e293b' }}
          >
            {[
              { key: 'Project', val: 'Dhruv_Wadhwa_Portfolio.flp', color: '#f59e0b' },
              { key: 'Tempo', val: `${profile.tempo} BPM`, color: '#34d399' },
              { key: 'Genre', val: profile.genre, color: '#a78bfa' },
              { key: 'Status', val: profile.status, color: '#f97316' },
              { key: 'Version', val: profile.version, color: '#60a5fa' },
            ].map(({ key, val, color }) => (
              <div key={key} className="flex items-baseline gap-2">
                <span className="text-slate-600 w-16 shrink-0">{key}</span>
                <span className="text-slate-700">:</span>
                <span style={{ color }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Waveform */}
          <div className="mt-4 flex items-end gap-0.5 h-10 px-2">
            {Array.from({ length: 48 }).map((_, i) => (
              <WaveformBar key={i} delay={i * 0.04} />
            ))}
          </div>
        </div>

        {/* Center: Main title */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-2">
              Now Opening Session
            </div>
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-3"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #f97316, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {profile.title}
            </h1>
            <p className="text-base font-mono text-slate-400 mb-1">{profile.education}</p>
            <p className="text-sm font-mono text-slate-600 mb-6">{profile.university}</p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-lg mb-6">{profile.bio}</p>

            {/* Role tags */}
            <div className="flex flex-wrap gap-2">
              {profile.roles.map((role, i) => {
                const colors = ['#f97316', '#06b6d4', '#a78bfa', '#34d399'];
                return (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border"
                    style={{
                      color: colors[i % colors.length],
                      borderColor: `${colors[i % colors.length]}40`,
                      background: `${colors[i % colors.length]}10`,
                    }}
                  >
                    {role}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right: Quick nav & Stats */}
        <div className="hidden xl:flex flex-col gap-6 shrink-0 w-48">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1 border-b border-slate-800 pb-1">Quick Load</span>
            {[
              { label: 'Projects', id: 'projects' as const, color: '#f97316' },
              { label: 'Certs', id: 'certificates' as const, color: '#06b6d4' },
              { label: 'Experience', id: 'experience' as const, color: '#a78bfa' },
              { label: 'Skills', id: 'skills' as const, color: '#34d399' },
              { label: 'Music', id: 'music' as const, color: '#ef4444' },
            ].map(({ label, id, color }) => (
              <motion.button
                key={id}
                onClick={() => setActiveSection(id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-left px-2 py-1.5 rounded cursor-pointer text-xs font-mono transition-colors"
                style={{ color: '#475569' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = color; e.currentTarget.style.background = `${color}08`; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="w-1.5 h-3 rounded-sm" style={{ background: color }} />
                {label}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col gap-2 p-3 rounded-lg border bg-slate-900/50" style={{ borderColor: '#1e293b' }}>
            <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest mb-1 border-b border-amber-500/20 pb-1">Session Stats</span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono mt-1">
              <div className="flex flex-col"><span className="text-slate-500 text-[9px] uppercase">Projects</span><span className="text-slate-300">{sessionStats.projects}</span></div>
              <div className="flex flex-col"><span className="text-slate-500 text-[9px] uppercase">Stack</span><span className="text-slate-300">{sessionStats.techStack}</span></div>
              <div className="flex flex-col"><span className="text-slate-500 text-[9px] uppercase">Certs</span><span className="text-slate-300">{sessionStats.certifications}</span></div>
              <div className="flex flex-col"><span className="text-slate-500 text-[9px] uppercase">Shows</span><span className="text-slate-300">{sessionStats.performances}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
