'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type Project } from '@/data/portfolio';
import { useStudioStore } from '@/stores/useStudioStore';
import { useLofiEngine } from '@/stores/useLofiEngine';
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
      <span className="hidden sm:inline">{isCurrentVoice ? 'Stop' : 'Voice Note'}</span>
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
  const { interruptForVoiceover, resumeFromVoiceover } = useLofiEngine();
  const isExpanded = expandedProjects.has(project.id);
  const isCurrentVoice = currentVoiceId === project.id;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVoice = () => {
    if (isCurrentVoice) {
      audioRef.current?.pause();
      setCurrentVoiceId(null);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      resumeFromVoiceover();
    } else {
      // Stop any other audio
      setCurrentVoiceId(project.id);
      interruptForVoiceover();
      // Synthetic speech fallback since we don't have actual audio files
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(project.voiceText);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.onend = () => {
          setCurrentVoiceId(null);
          resumeFromVoiceover();
        };
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
          {/* Waveform lines inside clip (decorative) - strictly z-0 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-end gap-0.5 h-6 opacity-20 z-0 pointer-events-none hidden sm:flex">
            {Array.from({ length: 12 }).map((_, i) => (
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

          <span className="text-base relative z-10 shrink-0">{project.icon}</span>
          <div className="flex-1 min-w-0 flex items-center justify-between relative z-10 pr-0 sm:pr-14">
            <div className="min-w-0 w-full">
              <div className="font-semibold text-sm text-slate-200 truncate flex items-center gap-1.5 sm:gap-2">
                <span className="truncate">{project.title}</span>
                {index === 0 && (
                  <span className="px-1.5 py-[1px] rounded text-[6px] sm:text-[8px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-500 border border-amber-500/50 shrink-0 hidden sm:inline-block">
                    HEADLINER
                  </span>
                )}
                {/* Status LED */}
                <div className="flex items-center gap-1 ml-0.5 sm:ml-1 shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    index === 0 ? 'led-live' : 
                    index === 1 ? 'led-dev' : 
                    index === 2 ? 'led-completed' : 'led-source'
                  }`} />
                  <span className="text-[7px] sm:text-[8px] font-mono text-slate-500 uppercase hidden sm:inline">
                    {index === 0 ? 'LIVE' : index === 1 ? 'DEV' : index === 2 ? 'COMPLETED' : 'OPEN SOURCE'}
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-mono truncate" style={{ color: `${project.color}cc` }}>
                {project.stack.join(' • ')}
              </div>
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
            <span className="hidden sm:inline">Know More</span>
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
              className="mx-2 sm:mx-6 md:mx-10 mb-4 p-4 sm:p-5 rounded-lg flex flex-col gap-5 relative overflow-hidden group"
              style={{
                background: 'rgba(5,7,13,0.95)',
                border: `1px solid ${project.color}30`,
              }}
            >
              {/* Background Glow - strictly z-0 to avoid overlapping content */}
              <div 
                className="absolute inset-0 z-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08] pointer-events-none" 
                style={{ background: `radial-gradient(circle at top right, ${project.color}, transparent 70%)` }} 
              />

              <div className="relative z-10 flex flex-col lg:flex-row gap-5 lg:gap-8">
                
                {/* Image/Preview Area - Top on Mobile, Left on Desktop */}
                <div className="w-full lg:w-2/5 shrink-0 flex flex-col gap-4">
                  <div 
                    className="rounded-lg overflow-hidden border relative flex items-center justify-center bg-black/50 aspect-video lg:aspect-auto lg:h-full min-h-[200px]"
                    style={{ borderColor: `${project.color}20` }}
                  >
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <span className="text-5xl">{project.icon}</span>
                        <span className="text-xs font-mono" style={{ color: project.color }}>NO PREVIEW</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                  
                  {/* Title & Badges */}
                  <div className="mb-4 border-b pb-3" style={{ borderColor: `${project.color}20` }}>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                      {project.icon} {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((t) => (
                        <span key={t} className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap"
                          style={{ color: project.color, borderColor: `${project.color}40`, background: `${project.color}10` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Description & Details */}
                  <div className="space-y-4 mb-6 flex-1">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: project.color }}>Description</div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">{project.desc}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: project.color }}>Key Features</div>
                        <ul className="space-y-1">
                          {project.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-xs text-slate-400 break-words">
                              <span style={{ color: project.color, marginTop: '2px' }}>▸</span> 
                              <span className="flex-1">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: project.color }}>Challenge</div>
                          <p className="text-xs text-slate-400 italic break-words">{project.challenges}</p>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: project.color }}>Outcome</div>
                          <p className="text-xs text-slate-300 font-medium break-words">{project.outcome}</p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                        <div className="text-[9px] font-mono text-slate-500 uppercase mb-0.5">Role</div>
                        <div className="text-[10px] font-mono text-slate-300 truncate">{project.role || 'Developer'}</div>
                      </div>
                      <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                        <div className="text-[9px] font-mono text-slate-500 uppercase mb-0.5">Users</div>
                        <div className="text-[10px] font-mono text-slate-300 truncate">{project.users || 'N/A'}</div>
                      </div>
                      <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                        <div className="text-[9px] font-mono text-slate-500 uppercase mb-0.5">Timeline</div>
                        <div className="text-[10px] font-mono text-slate-300 truncate">3 Months</div>
                      </div>
                      <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                        <div className="text-[9px] font-mono text-slate-500 uppercase mb-0.5">Complexity</div>
                        <div className="text-[10px] font-mono text-slate-300 truncate">High</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Always at the bottom */}
                  <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t" style={{ borderColor: `${project.color}20` }}>
                    <motion.a
                      href={project.demoLink || project.link}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold border cursor-pointer transition-colors"
                      style={{ color: '#05070D', borderColor: project.color, background: project.color }}
                      whileHover={{ scale: 1.02, boxShadow: `0 0 15px ${project.glow}` }}
                      whileTap={{ scale: 0.98 }}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </motion.a>
                    <motion.a
                      href={project.githubLink || '#'}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-mono border cursor-pointer transition-colors"
                      style={{ color: '#e2e8f0', borderColor: '#475569', background: '#1e293b80' }}
                      whileHover={{ scale: 1.02, borderColor: '#94a3b8', background: '#1e293b' }}
                      whileTap={{ scale: 0.98 }}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <span className="w-4 h-4 flex items-center justify-center font-bold">{"</>"}</span>
                      Source Code
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
        className="grid grid-cols-[28px_6px_1fr_auto] md:grid-cols-[28px_6px_1fr_200px] px-3 py-1 text-[9px] font-mono text-slate-600 uppercase tracking-wider border-b"
        style={{ borderColor: '#1e293b', background: '#080c14' }}
      >
        <span>#</span>
        <span />
        <span className="pl-3">Track Name / Stack</span>
        <span className="hidden md:block text-right pr-1">Controls</span>
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
