'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore, SectionId } from '@/stores/useStudioStore';
import { Search, Folder, FileBadge, Briefcase, Award, Code, Music, Mail, Download, User } from 'lucide-react';

type CommandItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: () => void;
  group: 'Navigation' | 'Actions';
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setActiveSection } = useStudioStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const navItem = (id: SectionId, title: string, icon: React.ReactNode): CommandItem => ({
    id: `nav-${id}`,
    title: `Go to ${title}`,
    icon,
    group: 'Navigation',
    action: () => {
      setActiveSection(id);
      setIsOpen(false);
    },
  });

  const commands: CommandItem[] = [
    navItem('projects', 'Projects', <Folder size={14} />),
    navItem('certificates', 'Certificates', <FileBadge size={14} />),
    navItem('experience', 'Experience', <Briefcase size={14} />),
    navItem('leadership', 'Leadership', <Award size={14} />),
    navItem('skills', 'Skills', <Code size={14} />),
    navItem('music', 'Music', <Music size={14} />),
    navItem('contact', 'Contact', <Mail size={14} />),
    {
      id: 'action-resume',
      title: 'Download Resume',
      icon: <Download size={14} />,
      group: 'Actions',
      action: () => {
        window.open('/resume.pdf', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'action-github',
      title: 'Open GitHub',
      icon: <Code size={14} />,
      group: 'Actions',
      action: () => {
        window.open('https://github.com/OriginalEthnix', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'action-linkedin',
      title: 'Open LinkedIn',
      icon: <User size={14} />,
      group: 'Actions',
      action: () => {
        window.open('https://linkedin.com/in/dhruv-wadhwa-2b8b97264', '_blank');
        setIsOpen(false);
      },
    },
  ];

  const filteredCommands = commands.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filteredCommands[selectedIndex];
      if (cmd) cmd.action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" style={{ background: 'rgba(5, 7, 13, 0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border overflow-hidden shadow-2xl"
            style={{ background: '#0a0f1a', borderColor: '#1e293b' }}
          >
            <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: '#1e293b' }}>
              <Search size={16} className="text-slate-500 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands... (e.g., 'Projects')"
                className="w-full bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-600 font-mono text-sm"
              />
              <div className="flex items-center gap-1 ml-3">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border" style={{ background: '#1e293b', borderColor: '#2d3a4f', color: '#94a3b8' }}>ESC</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500 font-mono text-xs">No commands found.</div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <div
                    key={cmd.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer transition-colors"
                    style={{
                      background: idx === selectedIndex ? '#1e293b' : 'transparent',
                      color: idx === selectedIndex ? '#e2e8f0' : '#94a3b8'
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => cmd.action()}
                  >
                    <div style={{ color: idx === selectedIndex ? '#f59e0b' : '#64748b' }}>
                      {cmd.icon}
                    </div>
                    <span className="font-mono text-xs">{cmd.title}</span>
                    {idx === selectedIndex && (
                      <span className="ml-auto text-[9px] font-mono text-slate-500">↵</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
