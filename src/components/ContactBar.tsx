'use client';

import { motion } from 'framer-motion';
import { useStudioStore, type SectionId } from '@/stores/useStudioStore';
import { contactInfo, socialLinks } from '@/data/portfolio';
import { Code, Briefcase, Camera, PlaySquare, Music, Mail } from 'lucide-react';

const CONTACT_ITEMS = [
  { icon: Code, label: 'GitHub', href: socialLinks.github, color: '#ffffff' },
  { icon: Briefcase, label: 'LinkedIn', href: socialLinks.linkedin, color: '#38bdf8' },
  { icon: Camera, label: 'Instagram', href: socialLinks.wadhwave, color: '#f472b6' },
  { icon: PlaySquare, label: 'YouTube', href: socialLinks.youtube, color: '#ef4444' },
  { icon: Music, label: 'Spotify', href: socialLinks.spotify, color: '#22c55e' },
  { icon: Mail, label: 'Email', href: socialLinks.gmail, color: '#f59e0b' },
];

const NAV_SECTIONS: { id: SectionId; label: string; color: string }[] = [
  { id: 'projects', label: 'Projects', color: '#f97316' },
  { id: 'certificates', label: 'Certs', color: '#06b6d4' },
  { id: 'experience', label: 'Experience', color: '#a78bfa' },
  { id: 'leadership', label: 'Leadership', color: '#fbbf24' },
  { id: 'skills', label: 'Skills', color: '#34d399' },
  { id: 'hobbies', label: 'Hobbies', color: '#f472b6' },
  { id: 'music', label: 'Music', color: '#ef4444' },
  { id: 'contact', label: 'Contact', color: '#60a5fa' },
];

export default function ContactBar() {
  const { activeSection, setActiveSection } = useStudioStore();

  return (
    <div
      className="border-b"
      style={{ background: 'rgba(11, 15, 25, 0.95)', borderColor: '#1e293b' }}
    >
      {/* Section navigation strip */}
      <div className="flex items-center overflow-x-auto" style={{ borderBottom: '1px solid #0f172a' }}>
        <div className="px-3 py-2.5 md:py-1.5 border-r shrink-0" style={{ borderColor: '#1e293b' }}>
          <span className="text-[10px] md:text-[9px] font-mono text-slate-600 uppercase tracking-widest">Navigate</span>
        </div>
        {NAV_SECTIONS.map((sec) => (
          <motion.button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 md:px-4 py-2.5 md:py-1.5 text-[11px] md:text-[10px] font-mono uppercase tracking-wider border-r shrink-0 cursor-pointer transition-all"
            style={{
              borderColor: '#1e293b',
              color: activeSection === sec.id ? sec.color : '#475569',
              background: activeSection === sec.id ? `${sec.color}12` : 'transparent',
              borderBottom: activeSection === sec.id ? `2px solid ${sec.color}` : '2px solid transparent',
            }}
          >
            {sec.label}
          </motion.button>
        ))}
        <div className="flex-1" />
      </div>

      {/* Contact strip */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 overflow-x-auto">
        {CONTACT_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="social-dock-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider cursor-pointer shrink-0"
            style={{
              color: '#94a3b8',
              '--dock-color': item.color,
              '--dock-bg': `${item.color}10`,
            } as any}
          >
            <item.icon size={12} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
