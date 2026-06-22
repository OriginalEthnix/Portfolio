'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '@/data/portfolio';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expanded, setExpanded] = useState(false);

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
        className="channel-row flex flex-col px-2 sm:px-3 py-2 cursor-pointer border-b border-transparent hover:border-slate-800"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          {/* Channel number */}
          <span className="text-[9px] font-mono text-slate-700 w-4 shrink-0">{index + 1}</span>

          {/* LED */}
          <motion.div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: skill.color }}
            animate={{ opacity: hovered || expanded ? 1 : 0.5, boxShadow: hovered || expanded ? `0 0 8px ${skill.color}` : 'none' }}
          />

          {/* Name */}
          <span className="text-xs font-mono text-slate-300 w-20 sm:w-28 shrink-0 truncate flex items-center gap-1">
            {skill.name}
            {expanded ? <ChevronUp size={10} className="text-slate-600" /> : <ChevronDown size={10} className="text-slate-600" />}
          </span>

          {/* Level meter */}
          <div className="flex-1 min-w-[60px]">
            <LevelMeter level={meterLevel} color={skill.color} animated={hovered || expanded} />
          </div>

          {/* Metrics */}
          <div className="hidden sm:flex items-center gap-2 w-20 shrink-0 justify-end text-[9px] font-mono text-slate-500">
             <span>{skill.projectsUsed} Proj</span>
             <span className="opacity-50">|</span>
             <span>{skill.yearsUsed} Yrs</span>
          </div>

          {/* Credibility Badge */}
          <div className="w-16 sm:w-24 shrink-0 flex justify-end">
            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${badgeClass} text-center truncate w-full sm:w-auto`}>
              {skill.experienceLevel}
            </span>
          </div>
        </div>

        {/* Details Panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden w-full pl-9 pr-2 pt-3 pb-1"
            >
              <div className="p-3 rounded-md bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                <div className="text-[9px] font-mono text-slate-400 uppercase">Skill Intelligence Data</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <div className="text-[8px] font-mono text-slate-600 uppercase">Primary Use</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">{skill.type || 'Development'}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-600 uppercase">Status</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">{skill.status || 'Active Integration'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]['key']>('frontend');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryData = skills[activeCategory];
  const allSkills = Object.values(skills).flat();
  const displayedSkills = searchQuery
    ? allSkills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : categoryData;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse bg-green-400" />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Channel Rack — Skills</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #34d39930, transparent)' }} />
      </div>

      {/* Category tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b"
        style={{ borderColor: '#1e293b', background: '#080c14' }}>
        <div className="flex items-center overflow-x-auto shrink-0">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setSearchQuery(''); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border-r shrink-0 cursor-pointer"
              style={{
                borderColor: '#1e293b',
                color: activeCategory === cat.key && !searchQuery ? cat.color : '#475569',
                background: activeCategory === cat.key && !searchQuery ? `${cat.color}12` : 'transparent',
                borderBottom: activeCategory === cat.key && !searchQuery ? `2px solid ${cat.color}` : '2px solid transparent',
              }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center px-3 py-1.5 border-t sm:border-t-0 border-slate-800">
           <Search size={12} className="text-slate-500 mr-2" />
           <input 
             type="text" 
             placeholder="Search Library..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="bg-transparent border-none outline-none text-[10px] font-mono text-slate-300 w-32 focus:w-48 transition-all"
             style={{ '::placeholder': { color: '#475569' } } as any}
           />
        </div>
      </div>

      {/* Channel rack header */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 text-[9px] font-mono text-slate-700 uppercase tracking-wider border-b"
        style={{ borderColor: '#0f172a', background: '#080c14' }}>
        <span className="w-4 shrink-0">#</span>
        <span className="w-2 shrink-0" />
        <span className="w-20 sm:w-28 shrink-0">Instrument</span>
        <span className="flex-1">Proficiency</span>
        <span className="hidden sm:block w-20 text-right shrink-0">Metrics</span>
        <span className="w-16 sm:w-24 text-right shrink-0">Level</span>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        {displayedSkills.length > 0 ? displayedSkills.map((skill, i) => (
          <ChannelRow
            key={skill.name}
            skill={skill}
            index={i}
          />
        )) : (
          <div className="p-4 text-center text-[10px] font-mono text-slate-500 mt-4">
            No instruments found matching "{searchQuery}"
          </div>
        )}

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
