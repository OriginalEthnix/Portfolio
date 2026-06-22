'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { experiences, type Experience } from '@/data/portfolio';
import { useStudioStore } from '@/stores/useStudioStore';
import { Play, Square, ChevronDown, ChevronUp } from 'lucide-react';

function ExperienceTrack({ exp, index }: { exp: Experience; index: number }) {
  const { expandedExperiences, toggleExpandExperience, currentVoiceId, setCurrentVoiceId } = useStudioStore();
  const isExpanded = expandedExperiences.has(exp.id);
  const isPlaying = currentVoiceId === exp.id;

  const handleVoice = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setCurrentVoiceId(null);
    } else {
      setCurrentVoiceId(exp.id);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(exp.voiceText);
        utt.rate = 0.95;
        utt.onend = () => setCurrentVoiceId(null);
        window.speechSynthesis.speak(utt);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="playlist-row"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Timeline node - Recording dot style */}
        <div className="flex flex-col items-center shrink-0 gap-1 mt-1">
          <div className="w-3 h-3 rounded-full flex items-center justify-center border-2 z-10" style={{ background: '#0a0f1a', borderColor: exp.color }}>
             <motion.div 
               className="w-1.5 h-1.5 rounded-full" 
               style={{ background: exp.color }}
               animate={{ opacity: [1, 0.4, 1] }}
               transition={{ duration: 1.5, repeat: Infinity }}
             />
          </div>
          {index < experiences.length - 1 && (
            <div className="w-px flex-1 min-h-4" style={{ background: `linear-gradient(to bottom, ${exp.color}40, transparent)` }} />
          )}
        </div>

        {/* Track body */}
        <motion.div
          className="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${exp.color}15, ${exp.color}05)`,
            border: `1px solid ${exp.color}25`,
          }}
          whileHover={{ borderColor: `${exp.color}55`, boxShadow: `0 0 14px ${exp.glow}` }}
          onClick={() => toggleExpandExperience(exp.id)}
        >
          <span className="text-xl shrink-0">{exp.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-200">{exp.role}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: `${exp.color}20`, color: exp.color }}>{exp.type}</span>
            </div>
            <div className="text-[11px] font-mono" style={{ color: `${exp.color}aa` }}>
              {exp.org} &nbsp;·&nbsp; {exp.duration}
            </div>
          </div>

          {/* Duration bar -> Audio clip style */}
          <div className="hidden sm:flex items-center gap-1 shrink-0 ml-4">
            <div className="w-20 h-7 rounded flex items-center justify-center overflow-hidden border" style={{ background: `${exp.color}15`, borderColor: `${exp.color}30` }}>
               <div className="flex items-center gap-[2px] h-5 px-1.5 opacity-70">
                 {Array.from({ length: 12 }).map((_, i) => (
                   <motion.div 
                     key={i} 
                     className="w-[2px] rounded-full" 
                     style={{ background: exp.color }} 
                     initial={{ height: '20%' }}
                     animate={{ height: ['20%', `${40 + Math.random() * 60}%`, '20%'] }}
                     transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * 0.1 }}
                   />
                 ))}
               </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <motion.button
            onClick={handleVoice}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="w-6 h-6 rounded flex items-center justify-center border cursor-pointer"
            style={{
              color: isPlaying ? exp.color : '#475569',
              borderColor: isPlaying ? `${exp.color}60` : '#2d3a4f',
              background: isPlaying ? `${exp.color}15` : 'transparent',
            }}
          >
            {isPlaying ? <Square size={8} /> : <Play size={8} />}
          </motion.button>
          <motion.button
            onClick={() => toggleExpandExperience(exp.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono cursor-pointer border"
            style={{
              color: isExpanded ? exp.color : '#475569',
              borderColor: isExpanded ? `${exp.color}50` : '#2d3a4f',
              background: isExpanded ? `${exp.color}10` : 'transparent',
            }}
          >
            {isExpanded ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
            <span className="hidden sm:inline">Know More</span>
          </motion.button>
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="ml-4 sm:ml-12 mr-3 mb-3 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4"
              style={{ background: 'rgba(5,7,13,0.8)', border: `1px solid ${exp.color}20` }}>
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: exp.color }}>Responsibilities</div>
                  <ul className="space-y-1">
                    {exp.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-xs text-slate-400">
                        <span style={{ color: exp.color }}>▸</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: exp.color }}>Achievements</div>
                  <ul className="space-y-1">
                    {exp.achievements.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="text-yellow-400">★</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: exp.color }}>Impact</div>
                  <div className="p-3 rounded border bg-black/40 flex flex-col gap-2" style={{ borderColor: `${exp.color}40` }}>
                    <p className="text-xs text-slate-300 leading-relaxed italic">"{exp.impact}"</p>
                    {/* Visual Impact Metric */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-[10px] font-mono text-slate-400">Scale/Reach:</div>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
                        <motion.div 
                          className="absolute top-0 bottom-0 left-0"
                          style={{ background: exp.color, boxShadow: `0 0 10px ${exp.glow}` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${70 + Math.random() * 30}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg p-3 flex items-center justify-center"
                  style={{ background: `${exp.color}10`, border: `1px solid ${exp.color}20` }}>
                  <span className="text-3xl">{exp.icon}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ExperienceSection() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse" style={{ background: '#a78bfa' }} />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
          <span className="hidden sm:inline">RECORDING TIMELINE — </span>Experience
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #a78bfa30, transparent)' }} />
        <span className="text-[9px] font-mono text-slate-600">{experiences.length} tracks</span>
      </div>
      <div className="flex-1 overflow-y-auto pb-8 relative">
        {/* Playhead Scrubber */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-rose-500/50 z-50 pointer-events-none"
          style={{ boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)' }}
          initial={{ top: 0 }}
          animate={{ top: '100%' }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute -left-1 -top-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-rose-500" />
        </motion.div>
        {experiences.map((e, i) => {
          // Extract year from duration (e.g. "June 2024–Present" -> "2024")
          const currentYear = e.duration.match(/\b20\d{2}\b/)?.[0] || '';
          const prevYear = i > 0 ? experiences[i-1].duration.match(/\b20\d{2}\b/)?.[0] || '' : '';
          const showYearMarker = currentYear && currentYear !== prevYear;

          return (
            <div key={e.id}>
              {showYearMarker && (
                <div className="flex items-center gap-4 px-4 py-2 opacity-50">
                   <div className="text-[10px] font-mono text-slate-400 tracking-widest bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">{currentYear}</div>
                   <div className="flex-1 h-px border-t border-dashed border-slate-700" />
                </div>
              )}
              <ExperienceTrack exp={e} index={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
