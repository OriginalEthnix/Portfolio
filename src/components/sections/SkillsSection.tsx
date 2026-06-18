'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { skills } from '@/data/portfolio';

const CATEGORIES = [
  { key: 'frontend', label: 'Frontend', color: '#61dafb' },
  { key: 'backend', label: 'Backend', color: '#f89820' },
  { key: 'databases', label: 'Databases', color: '#47a248' },
  { key: 'aiml', label: 'AI / ML', color: '#ff6f00' },
  { key: 'tools', label: 'Tools', color: '#f05032' },
] as const;

function LevelMeter({ level, color, animated }: { level: number; color: string; animated: boolean }) {
  const bars = 20;
  const filled = Math.round((level / 100) * bars);

  return (
    <div className="flex items-end gap-0.5 h-5">
      {Array.from({ length: bars }).map((_, i) => {
        const isLit = i < filled;
        const isClip = i >= 17;
        return (
          <motion.div
            key={i}
            className="w-1 rounded-sm"
            style={{ background: isLit ? (isClip ? '#ef4444' : color) : '#1e293b' }}
            initial={{ height: 4, opacity: 0 }}
            animate={animated ? {
              height: isLit ? [4, 16 - Math.abs(i - filled) * 0.5, 14] : 4,
              opacity: 1,
            } : { height: isLit ? 14 : 4, opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
          />
        );
      })}
    </div>
  );
}

function ChannelRow({ skill, index }: { skill: any; index: number }) {
  const [hovered, setHovered] = useState(false);

  let meterLevel = 0;
  if (skill.experienceLevel === 'PRODUCTION READY') meterLevel = 95;
  if (skill.experienceLevel === 'ADVANCED') meterLevel = 80;
  if (skill.experienceLevel === 'INTERMEDIATE') meterLevel = 60;
  if (skill.experienceLevel === 'BEGINNER') meterLevel = 40;

  const badgeClass = `level-${skill.experienceLevel.toLowerCase().split(' ')[0]}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="channel-row flex items-center gap-3 px-3 py-2"
    >
      {/* Channel number */}
      <span className="text-[9px] font-mono text-slate-700 w-4 shrink-0">{index + 1}</span>

      {/* LED */}
      <motion.div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: skill.color }}
        animate={{ opacity: hovered ? 1 : 0.5, boxShadow: hovered ? `0 0 8px ${skill.color}` : 'none' }}
      />

      {/* Name */}
      <span className="text-xs font-mono text-slate-300 w-28 shrink-0 truncate">{skill.name}</span>

      {/* Level meter */}
      <div className="flex-1 min-w-[60px]">
        <LevelMeter level={meterLevel} color={skill.color} animated={hovered} />
      </div>

      {/* Metrics */}
      <div className="hidden sm:flex items-center gap-2 w-20 shrink-0 justify-end text-[9px] font-mono text-slate-500">
         <span>{skill.projectsUsed} Proj</span>
         <span className="opacity-50">|</span>
         <span>{skill.yearsUsed} Yrs</span>
      </div>

      {/* Credibility Badge */}
      <div className="w-24 shrink-0 flex justify-end">
        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${badgeClass}`}>
          {skill.experienceLevel}
        </span>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]['key']>('frontend');
  const categoryData = skills[activeCategory];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse bg-green-400" />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Channel Rack — Skills</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #34d39930, transparent)' }} />
      </div>

      {/* Category tabs */}
      <div className="flex items-center border-b overflow-x-auto shrink-0"
        style={{ borderColor: '#1e293b', background: '#080c14' }}>
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border-r shrink-0 cursor-pointer"
            style={{
              borderColor: '#1e293b',
              color: activeCategory === cat.key ? cat.color : '#475569',
              background: activeCategory === cat.key ? `${cat.color}12` : 'transparent',
              borderBottom: activeCategory === cat.key ? `2px solid ${cat.color}` : '2px solid transparent',
            }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Channel rack header */}
      <div className="flex items-center px-3 py-1 text-[9px] font-mono text-slate-700 uppercase tracking-wider border-b"
        style={{ borderColor: '#0f172a', background: '#080c14' }}>
        <span className="w-4 mr-3">#</span>
        <span className="w-4 mr-3" />
        <span className="w-28 mr-3">Instrument</span>
        <span className="flex-1">Proficiency</span>
        <span className="hidden sm:block w-20 text-right mr-3">Metrics</span>
        <span className="w-24 text-right">Level</span>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        {categoryData.map((skill, i) => (
          <ChannelRow
            key={skill.name}
            skill={skill}
            index={i}
          />
        ))}

        {/* Footer bar */}
        <div className="px-3 py-3 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #34d39920, transparent)' }} />
          <span className="text-[9px] font-mono text-slate-700 uppercase">
            {categoryData.length} channels loaded
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #34d39920)' }} />
        </div>
      </div>
    </div>
  );
}
