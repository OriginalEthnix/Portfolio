'use client';

import { motion } from 'framer-motion';
import { profile, projects, experiences, leadership, certificates, skills } from '@/data/portfolio';
import { useStudioStore } from '@/stores/useStudioStore';

export default function RecruiterView() {
  const { isRecruiterMode, toggleRecruiterMode } = useStudioStore();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white text-gray-900 p-8 md:p-16 max-w-4xl mx-auto relative"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      <div className="fixed top-6 right-6 md:top-10 md:right-10 z-50 flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">Vibe Mode</span>
        <motion.button
          onClick={toggleRecruiterMode}
          className="relative w-12 h-6 rounded-full border cursor-pointer shrink-0"
          style={{
            backgroundColor: !isRecruiterMode ? '#1a0a00' : '#374151',
            borderColor: !isRecruiterMode ? '#f59e0b80' : '#6b7280',
            boxShadow: !isRecruiterMode ? '0 0 8px rgba(245,158,11,0.3)' : 'none',
          }}
          whileTap={{ scale: 0.95 }}
          title="Toggle Vibe Mode (DAW UI)"
        >
          <motion.div
            className="absolute top-[3px] w-4 h-4 rounded-full"
            style={{ backgroundColor: !isRecruiterMode ? '#f59e0b' : '#9ca3af' }}
            animate={{ left: !isRecruiterMode ? '26px' : '3px' }}
            transition={{ type: 'spring', stiffness: 600, damping: 35 }}
          />
        </motion.button>
      </div>

      <header className="mb-8 pb-6 border-b-2 border-gray-900 text-center mt-12 md:mt-0">
        <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
        <p className="text-lg text-gray-600 mb-1">{profile.education}</p>
        <p className="text-sm text-gray-500">{profile.university}</p>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto italic">{profile.bio}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-700 border-b pb-2">Technical Arsenal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-600 mb-1">Frontend & Backend</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {skills.frontend.map(s => s.name).join(', ')} • {skills.backend.map(s => s.name).join(', ')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600 mb-1">Databases, AI & Tools</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {skills.databases.map(s => s.name).join(', ')} • {skills.aiml.map(s => s.name).join(', ')} • {skills.tools.map(s => s.name).join(', ')}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-700 border-b pb-2">Projects</h2>
        <div className="space-y-6">
          {projects.map((project, i) => (
            <div key={i}>
              <h3 className="text-lg font-bold text-gray-800">{project.title} <span className="text-sm font-normal text-gray-500">— {project.subtitle}</span></h3>
              <p className="text-xs text-gray-500 italic mb-2">{project.stack.join(' • ')}</p>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">{project.desc}</p>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-2 space-y-1">
                <li><span className="font-semibold">Outcome:</span> {project.outcome}</li>
                <li><span className="font-semibold">Key Feature:</span> {project.features[0]}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-700 border-b pb-2">Experience & Leadership</h2>
        <div className="space-y-5">
          {experiences.map((exp, i) => (
            <div key={i}>
              <h3 className="text-md font-bold text-gray-800">{exp.role}</h3>
              <div className="text-sm text-gray-500 mb-1">{exp.org} ({exp.duration})</div>
              <ul className="list-disc list-inside text-sm text-gray-700 ml-2 space-y-0.5">
                {exp.responsibilities.slice(0, 2).map((resp, j) => (
                  <li key={j}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
          {leadership.map((lead, i) => (
            <div key={`l-${i}`} className="text-sm text-gray-700">
              <span className="font-bold">{lead.role}</span> at {lead.org} ({lead.duration}) — {lead.desc}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-gray-700 border-b pb-2">Certifications</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-2">
          {certificates.map((cert, i) => (
            <li key={i}>
              <span className="font-semibold">{cert.name}</span> — {cert.issuer} ({cert.date})
            </li>
          ))}
        </ul>
      </section>

      <footer className="pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This is the minimal print-friendly view. Toggle &quot;Vibe Mode&quot; to experience the full interactive portfolio.</p>
        <p className="mt-2">Generated from VIBE STUDIO v1.0.0</p>
      </footer>
    </motion.div>
  );
}
