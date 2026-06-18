'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore, type SectionId } from '@/stores/useStudioStore';
import {
  ChevronRight, ChevronDown, Folder, FolderOpen,
  Music2, Award, Briefcase, Star, Zap, Heart, Mic2, Mail, PanelLeftClose, PanelLeft
} from 'lucide-react';

const BROWSER_ITEMS: { id: SectionId; label: string; icon: React.ElementType; color: string; sub?: string[] }[] = [
  { id: 'projects', label: 'Projects', icon: Zap, color: '#f97316', sub: ['UniFixed', 'Smart City', 'Midas Core', 'Goal Tracker', 'Library MS'] },
  { id: 'certificates', label: 'Certificates', icon: Award, color: '#06b6d4', sub: ['IBM AI', 'IBM Software Eng.', 'Scaler JavaScript', 'JPMorgan Forage', 'Google Gen AI', 'NPTEL Forest Mgmt'] },
  { id: 'experience', label: 'Experiences', icon: Briefcase, color: '#a78bfa', sub: ['FYI HR Head', 'Open Source Dev', 'Music Club Core', 'AI Club Mgmt', 'Stage Coord.', 'QDLAI Workshop', 'FYI Committee', 'Wakhra Punjab'] },
  { id: 'leadership', label: 'Leadership', icon: Star, color: '#fbbf24', sub: ['HR Head', 'Stage Coord.', 'Workshop Coord.', 'Open Source', 'AI Club Mgmt'] },
  { id: 'skills', label: 'Skills', icon: Music2, color: '#34d399', sub: ['Frontend', 'Backend', 'Databases', 'AI / ML', 'Tools'] },
  { id: 'hobbies', label: 'Hobbies', icon: Heart, color: '#f472b6', sub: ['Rap', 'Music Production', 'Public Speaking', 'Event Hosting', 'Gym & Fitness', 'Content Creation'] },
  { id: 'music', label: 'Music', icon: Mic2, color: '#ef4444', sub: ['WADHWAVE', 'Discography', 'Performances', 'Rap Battles', 'Projects'] },
  { id: 'achievements', label: 'Achievements', icon: Star, color: '#10b981', sub: ['Performances', 'Projects', 'Certifications', 'Leadership'] },
  { id: 'contact', label: 'Contact', icon: Mail, color: '#60a5fa', sub: ['Email', 'LinkedIn', 'GitHub', 'Instagram', 'Resume'] },
];

function BrowserItem({
  item,
  isActive,
  onSelect,
}: {
  item: typeof BROWSER_ITEMS[number];
  isActive: boolean;
  onSelect: (id: SectionId) => void;
}) {
  const [expanded, setExpanded] = useState(isActive);
  const Icon = item.icon;
  const FolderIcon = expanded ? FolderOpen : Folder;
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div>
      <motion.div
        onClick={() => { setExpanded(!expanded); onSelect(item.id); }}
        whileHover={{ x: 2 }}
        className="flex items-center gap-1.5 px-2 py-1 cursor-pointer rounded-sm group"
        style={{
          background: isActive ? `${item.color}15` : 'transparent',
        }}
      >
        <ChevronIcon size={10} style={{ color: item.color, opacity: 0.7 }} />
        <FolderIcon size={12} style={{ color: item.color }} />
        <span
          className="text-[11px] font-mono"
          style={{ color: isActive ? item.color : '#94a3b8' }}
        >
          {item.label}
        </span>
        {isActive && (
          <div className="ml-auto w-1 h-1 rounded-full" style={{ background: item.color }} />
        )}
      </motion.div>

      <AnimatePresence>
        {expanded && item.sub && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.sub.map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 pl-7 py-0.5 cursor-pointer hover:bg-white/5"
                onClick={() => onSelect(item.id)}
              >
                <div className="w-1 h-1 rounded-full opacity-40" style={{ background: item.color }} />
                <span className="text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors">{s}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BrowserPanel() {
  const { isBrowserOpen, toggleBrowser, activeSection, setActiveSection } = useStudioStore();

  return (
    <>
      {/* Toggle button (always visible) */}
      <motion.button
        onClick={toggleBrowser}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-5 flex items-center justify-center py-3 cursor-pointer rounded-r"
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderLeft: 'none',
          color: '#475569',
        }}
        whileHover={{ color: '#f59e0b' }}
        aria-label="Toggle browser"
      >
        {isBrowserOpen ? <PanelLeftClose size={10} /> : <PanelLeft size={10} />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isBrowserOpen && (
          <motion.div
            key="browser"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 180, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full overflow-hidden shrink-0 border-r flex flex-col"
            style={{ background: '#080b12', borderColor: '#1e293b' }}
          >
            {/* Browser header */}
            <div
              className="px-2 py-1.5 border-b flex items-center justify-between shrink-0"
              style={{ borderColor: '#1e293b', background: '#0d1117' }}
            >
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Browser</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
              </div>
            </div>

            {/* File path */}
            <div className="px-2 py-1 border-b" style={{ borderColor: '#0f172a' }}>
              <span className="text-[9px] font-mono text-slate-700">
                ~/portfolio/<span style={{ color: '#f59e0b' }}>v1.0.0</span>
              </span>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-1">
              {BROWSER_ITEMS.map((item) => (
                <BrowserItem
                  key={item.id}
                  item={item}
                  isActive={activeSection === item.id}
                  onSelect={setActiveSection}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-2 py-1.5 border-t shrink-0" style={{ borderColor: '#1e293b' }}>
              <span className="text-[9px] font-mono text-slate-700">Dhruv_Wadhwa.flp</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
