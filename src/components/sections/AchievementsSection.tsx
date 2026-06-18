'use client';

import { motion } from 'framer-motion';
import { Award, Star, Mic2, Users, Code, Trophy, Cpu } from 'lucide-react';

const achievements = [
  { icon: Mic2, title: '25+ Live Performances', color: '#f59e0b' },
  { icon: Code, title: '6+ Projects Built', color: '#3b82f6' },
  { icon: Award, title: '6+ Certifications', color: '#10b981' },
  { icon: Users, title: 'HR Head – FYI', color: '#f43f5e' },
  { icon: Star, title: 'Open Source Contributor', color: '#8b5cf6' },
  { icon: Trophy, title: 'VIT Rap Battle Winner', color: '#f59e0b' },
  { icon: Cpu, title: 'Student Coordinator – AI Workshop', color: '#06b6d4' },
];

export default function AchievementsSection() {
  return (
    <div className="flex flex-col h-full rounded-xl border bg-slate-900/40 p-6 overflow-y-auto" style={{ borderColor: '#1e293b' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-yellow-500 led-pulse" />
        <h2 className="text-xl font-black font-mono tracking-widest text-slate-200">SESSION ACHIEVEMENTS</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-4 rounded-lg border bg-slate-900/60 transition-colors relative overflow-hidden"
            style={{ borderColor: '#1e293b' }}
          >
            {/* DAW-style rack glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: `linear-gradient(135deg, ${item.color}, transparent)` }} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0 border" style={{ borderColor: '#2d3a4f' }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Achievement unlocked</div>
                <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
              </div>
            </div>
            
            {/* LED Status line */}
            <div className="absolute top-0 bottom-0 left-0 w-1" style={{ background: item.color }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
