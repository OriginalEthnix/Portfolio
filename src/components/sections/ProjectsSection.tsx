'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type Project } from '@/data/portfolio';
import { useStudioStore } from '@/stores/useStudioStore';
import { Play, Square, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

function VoiceButton({ project, isCurrentVoice, onPlay }: {
  project: Project;
  isCurrentVoice: boolean;
  onPlay: () => void;
}) {
  return (
    <motion.button
      onClick={onPlay}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer border"
      style={{
        color: isCurrentVoice ? project.color : '#64748b',
        borderColor: isCurrentVoice ? `${project.color}60` : '#2d3a4f',
        background: isCurrentVoice ? `${project.color}15` : 'transparent',
        boxShadow: isCurrentVoice ? `0 0 10px ${project.color}30` : 'none',
      }}
    >
      {isCurrentVoice ? <Square size={8} /> : <Play size={8} />}
      <span>{isCurrentVoice ? 'Stop' : 'Voice Note'}</span>
      {isCurrentVoice && (
        <div className="flex items-end gap-0.5 h-3 ml-0.5">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: project.color }}
              animate={{ height: ['3px', '8px', '3px'] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

function ProjectClip({ project, index }: { project: Project; index: number }) {
  const { expandedProjects, toggleExpandProject, currentVoiceId, setCurrentVoiceId } = useStudioStore();
  const isExpanded = expandedProjects.has(project.id);
  const isCurrentVoice = currentVoiceId === project.id;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVoice = () => {
    if (isCurrentVoice) {
      audioRef.current?.pause();
      setCurrentVoiceId(null);
    } else {
      // Stop any other audio
      setCurrentVoiceId(project.id);
      // Synthetic speech fallback since we don't have actual audio files
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(project.voiceText);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.onend = () => setCurrentVoiceId(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="playlist-row"
    >
      {/* Clip header row */}
      <div className="flex items-center gap-2 px-3 py-2 group">
        {/* Track number */}
        <div
          className="w-5 text-[9px] font-mono text-center shrink-0"
          style={{ color: '#475569' }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Color strip */}
        <div
          className="w-1 h-8 rounded-full shrink-0"
          style={{
            background: project.color,
            boxShadow: `0 0 8px ${project.glow}`,
          }}
        />

        {/* Clip body — colored like a DAW clip */}
        <motion.div
          className="flex-1 flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${project.color}20, ${project.color}08)`,
            border: `1px solid ${project.color}30`,
            minHeight: 40,
          }}
          whileHover={{
            borderColor: `${project.color}60`,
            boxShadow: `0 0 15px ${project.glow}`,
          }}
          onClick={() => toggleExpandProject(project.id)}
        >
          {/* Waveform lines inside clip (decorative) */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-end gap-0.5 h-6 opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: project.color }}
                initial={{ height: '20%' }}
                animate={{ height: ['20%', `${40 + Math.random() * 60}%`, '20%'] }}
                transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>

          <span className="text-base">{project.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-slate-200 truncate">{project.title}</div>
            <div className="text-[10px] font-mono truncate" style={{ color: `${project.color}cc` }}>
              {project.stack.join(' • ')}
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <VoiceButton project={project} isCurrentVoice={isCurrentVoice} onPlay={handleVoice} />
          <motion.button
            onClick={() => toggleExpandProject(project.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer border"
            style={{
              color: isExpanded ? project.color : '#64748b',
              borderColor: isExpanded ? `${project.color}50` : '#2d3a4f',
              background: isExpanded ? `${project.color}10` : 'transparent',
            }}
          >
            {isExpanded ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
            <span>Know More</span>
          </motion.button>
        </div>
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="mx-10 mb-3 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4"
              style={{
                background: 'rgba(5,7,13,0.8)',
                border: `1px solid ${project.color}25`,
              }}
            >
              {/* Left: Details */}
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: project.color }}>Description</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{project.desc}</p>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: project.color }}>Key Features</div>
                  <ul className="space-y-1">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
                        <span style={{ color: project.color }}>▸</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: project.color }}>Challenge</div>
                  <p className="text-xs text-slate-500 italic">{project.challenges}</p>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: project.color }}>Outcome</div>
                  <p className="text-xs text-slate-400">{project.outcome}</p>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((t) => (
                    <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                      style={{ color: project.color, borderColor: `${project.color}40`, background: `${project.color}10` }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Recruiter Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t" style={{ borderColor: `${project.color}20` }}>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase">Role</div>
                    <div className="text-[10px] font-mono text-slate-300 truncate">{project.role}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase">Users/Scale</div>
                    <div className="text-[10px] font-mono text-slate-300 truncate">{project.users}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase">Metric</div>
                    <div className="text-[10px] font-mono text-slate-300 truncate">{project.performanceMetric}</div>
                  </div>
                </div>
              </div>

              {/* Right: Project "screenshot" area */}
              <div
                className="rounded-lg flex flex-col items-center justify-center gap-2 min-h-32 p-3 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${project.color}10, ${project.color}05)`,
                  border: `1px solid ${project.color}20`,
                }}
              >
                {/* Image preview */}
                {project.image && (
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-[#05070D]" />
                  </div>
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-4xl">{project.icon}</span>
                  <span className="text-xs font-mono text-center" style={{ color: `${project.color}80` }}>{project.subtitle}</span>
                  
                  <div className="flex gap-2 mt-2">
                    <motion.a
                      href={project.demoLink || project.link}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono border cursor-pointer"
                      style={{ color: project.color, borderColor: `${project.color}50`, background: `${project.color}20` }}
                      whileHover={{ scale: 1.05, boxShadow: `0 0 12px ${project.glow}` }}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <ExternalLink size={10} />
                      Live Demo
                    </motion.a>
                    <motion.a
                      href={project.githubLink || '#'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono border cursor-pointer"
                      style={{ color: '#e2e8f0', borderColor: '#475569', background: '#1e293b80' }}
                      whileHover={{ scale: 1.05, borderColor: '#94a3b8' }}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <span className="w-3 h-3 flex items-center justify-center">{"</>"}</span>
                      Source
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectsSection() {
  return (
    <div className="h-full flex flex-col">
      {/* Section header - Playlist header style */}
      <div
        className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}
      >
        <div className="w-2 h-2 rounded-full bg-orange-500 led-pulse" />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
          Playlist — Projects
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #f9731630, transparent)' }} />
        <span className="text-[9px] font-mono text-slate-600">{projects.length} clips loaded</span>
      </div>

      {/* Column headers */}
      <div
        className="grid px-3 py-1 text-[9px] font-mono text-slate-600 uppercase tracking-wider border-b"
        style={{ gridTemplateColumns: '28px 6px 1fr 200px', borderColor: '#1e293b', background: '#080c14' }}
      >
        <span>#</span>
        <span />
        <span className="pl-3">Track Name / Stack</span>
        <span className="text-right pr-1">Controls</span>
      </div>

      {/* Clips */}
      <div className="flex-1 overflow-y-auto">
        {projects.map((p, i) => (
          <ProjectClip key={p.id} project={p} index={i} />
        ))}

        {/* End marker */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #f9731620, transparent)' }} />
          <span className="text-[9px] font-mono text-slate-700">END OF PLAYLIST</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #f9731620)' }} />
        </div>
      </div>
    </div>
  );
}
