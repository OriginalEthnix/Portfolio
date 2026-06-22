'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { certificates, type Certificate } from '@/data/portfolio';
import { useStudioStore } from '@/stores/useStudioStore';
import { useLofiEngine } from '@/stores/useLofiEngine';
import { Play, Square, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

function CertRow({ cert, index }: { cert: Certificate; index: number }) {
  const { expandedCertificates, toggleExpandCertificate, currentVoiceId, setCurrentVoiceId } = useStudioStore();
  const { interruptForVoiceover, resumeFromVoiceover } = useLofiEngine();
  const isExpanded = expandedCertificates.has(cert.id);
  const isPlaying = currentVoiceId === cert.id;

  const handleVoice = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setCurrentVoiceId(null);
      resumeFromVoiceover();
    } else {
      setCurrentVoiceId(cert.id);
      interruptForVoiceover();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(cert.voiceText);
        utt.rate = 0.95;
        utt.onend = () => {
          setCurrentVoiceId(null);
          resumeFromVoiceover();
        };
        window.speechSynthesis.speak(utt);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="playlist-row"
    >
      <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3 py-2 w-full">
        {/* Track index */}
        <span className="text-[9px] font-mono text-slate-600 w-4 sm:w-5 text-center shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Color indicator */}
        <div className="w-1 h-6 sm:h-7 rounded-full shrink-0" style={{ background: cert.color, boxShadow: `0 0 6px ${cert.glow}` }} />

        {/* Main track */}
        <motion.div
          className="flex-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded cursor-pointer min-w-0"
          style={{
            background: `linear-gradient(90deg, ${cert.color}18, ${cert.color}06)`,
            border: `1px solid ${cert.color}25`,
          }}
          whileHover={{ borderColor: `${cert.color}50`, boxShadow: `0 0 12px ${cert.glow}` }}
          onClick={() => toggleExpandCertificate(cert.id)}
        >
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-semibold text-slate-200 truncate flex items-center gap-1.5 sm:gap-2">
                <span className="truncate">{cert.name}</span>
                <span className="px-1 sm:px-1.5 py-[1px] rounded text-[6px] sm:text-[7px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">VERIFIED</span>
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono truncate mt-0.5 sm:mt-0" style={{ color: `${cert.color}aa` }}>
                {cert.issuer} &nbsp;•&nbsp; {cert.date}
              </div>
            </div>
          </div>

          {/* Mini VU bars */}
          <div className="hidden sm:flex items-end gap-0.5 h-5 opacity-30 shrink-0 ml-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: cert.color }}
                initial={{ height: '20%' }}
                animate={{ height: ['20%', `${40 + Math.random() * 60}%`, '20%'] }}
                transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-1">
          <motion.button
            onClick={handleVoice}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-8 h-8 sm:w-6 sm:h-6 rounded flex items-center justify-center border cursor-pointer shrink-0"
            style={{
              color: isPlaying ? cert.color : '#475569',
              borderColor: isPlaying ? `${cert.color}60` : '#2d3a4f',
              background: isPlaying ? `${cert.color}15` : 'transparent',
            }}
          >
            {isPlaying ? <Square size={10} className="sm:w-2 sm:h-2" /> : <Play size={10} className="sm:w-2 sm:h-2" />}
          </motion.button>
          <motion.button
            onClick={() => toggleExpandCertificate(cert.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-1 w-8 h-8 sm:w-auto sm:h-auto sm:px-2 sm:py-1 rounded text-[10px] font-mono cursor-pointer border shrink-0"
            style={{
              color: isExpanded ? cert.color : '#475569',
              borderColor: isExpanded ? `${cert.color}50` : '#2d3a4f',
              background: isExpanded ? `${cert.color}10` : 'transparent',
            }}
          >
            {isExpanded ? <ChevronUp size={12} className="sm:w-2 sm:h-2" /> : <ChevronDown size={12} className="sm:w-2 sm:h-2" />}
            <span className="hidden sm:inline">Know More</span>
          </motion.button>
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="mx-1 sm:mx-6 md:mx-10 mb-3 p-3 sm:p-4 rounded-lg flex flex-col md:grid md:grid-cols-2 gap-4"
              style={{ background: 'rgba(5,7,13,0.8)', border: `1px solid ${cert.color}20` }}
            >
              {/* Left */}
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: cert.color }}>Summary</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{cert.summary}</p>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: cert.color }}>Skills Learned</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((s) => (
                      <span key={s} className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                        style={{ color: cert.color, borderColor: `${cert.color}40`, background: `${cert.color}10` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: cert.color }}>Date</div>
                    <p className="text-xs text-slate-400">{cert.date}</p>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: cert.color }}>Credential ID</div>
                    <p className="text-[10px] font-mono text-slate-500 break-all">{cert.credentialId}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <motion.a
                    href={cert.verifyUrl || '#'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono border cursor-pointer"
                    style={{ color: cert.color, borderColor: `${cert.color}50`, background: `${cert.color}20` }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 12px ${cert.glow}` }}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <ExternalLink size={10} />
                    Official Verification
                  </motion.a>
                </div>
              </div>

              {/* Right: cert preview area */}
              <div
                className="rounded-lg flex items-center justify-center relative overflow-hidden p-2 min-h-[140px] sm:min-h-[180px] w-full"
                style={{ background: `linear-gradient(135deg, ${cert.color}12, ${cert.color}04)`, border: `1px solid ${cert.color}20` }}
              >
                {cert.image ? (
                  <img src={cert.image} alt={cert.name} className="max-w-full h-auto max-h-[200px] object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-center opacity-50">
                    <div className="text-3xl drop-shadow-md mb-2">🏅</div>
                    <div className="text-xs font-mono font-semibold" style={{ color: cert.color }}>{cert.issuer}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CertificatesSection() {
  const groupedCerts = certificates.reduce((acc, cert) => {
    const yearMatch = cert.date.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : 'Other';
    if (!acc[year]) acc[year] = [];
    acc[year].push(cert);
    return acc;
  }, {} as Record<string, Certificate[]>);

  const years = Object.keys(groupedCerts).sort((a, b) => b.localeCompare(a));

  let globalIndex = 0;

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse" style={{ background: '#06b6d4' }} />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Playlist — Certificates</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #06b6d430, transparent)' }} />
        <span className="text-[9px] font-mono text-slate-600">{certificates.length} tracks</span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 relative pl-2 sm:pl-4">
        {/* Vertical Timeline Line */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-800" />
        
        {years.map((year) => (
          <div key={year} className="mb-4 relative">
            <div className="sticky top-0 z-10 flex items-center gap-2 sm:gap-3 py-2 bg-[#05070D]/90 backdrop-blur-sm pl-4 sm:pl-6 -ml-4 sm:-ml-6">
              <div className="absolute left-4 sm:left-6 w-2 h-2 -ml-1 rounded-full bg-cyan-500 border border-slate-900" />
              <span className="text-[10px] sm:text-xs font-black font-mono text-cyan-400 tracking-widest pl-4">{year}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
            </div>
            <div className="pl-4 sm:pl-6 border-l border-transparent">
              {groupedCerts[year].map((c) => {
                const currentIndex = globalIndex++;
                return <CertRow key={c.id} cert={c} index={currentIndex} />;
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 pl-6">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #06b6d420, transparent)' }} />
          <span className="text-[9px] font-mono text-slate-700">END OF PLAYLIST</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #06b6d420)' }} />
        </div>
      </div>
    </div>
  );
}
