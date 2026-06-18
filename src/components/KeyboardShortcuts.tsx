'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore, SectionId } from '@/stores/useStudioStore';

export default function KeyboardShortcuts() {
  const [showOverlay, setShowOverlay] = useState(false);
  const { setActiveSection, isRecruiterMode } = useStudioStore();

  useEffect(() => {
    if (isRecruiterMode) return; // Disable shortcuts in recruiter mode

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '?') {
        setShowOverlay(true);
        return;
      }
      
      if (e.key === 'Escape') {
        setShowOverlay(false);
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        const s = useStudioStore.getState();
        if (s.isPlaybackMode) s.stopPlayback();
        else s.startPlayback();
      }

      if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
        useStudioStore.getState().toggleSound?.();
        // Fallthrough if we also want 'm' to navigate to music section
      }

      const keyToSection: Record<string, SectionId> = {
        'p': 'projects',
        'c': 'certificates',
        'e': 'experience',
        'l': 'leadership',
        's': 'skills',
        'h': 'hobbies',
        'm': 'music',
        't': 'contact'
      };

      const section = keyToSection[e.key.toLowerCase()];
      if (section && !e.ctrlKey && !e.metaKey) {
        setActiveSection(section);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveSection, isRecruiterMode]);

  return (
    <AnimatePresence>
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5, 7, 13, 0.8)', backdropFilter: 'blur(4px)' }} onClick={() => setShowOverlay(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border p-6 relative shadow-2xl"
            style={{ background: '#0a0f1a', borderColor: '#1e293b' }}
          >
            <button onClick={() => setShowOverlay(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
              ✕
            </button>
            <h2 className="text-amber-500 font-mono font-black text-lg mb-4">KEYBOARD CONTROLS</h2>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <Shortcut keyName="P" label="Projects" />
              <Shortcut keyName="C" label="Certificates" />
              <Shortcut keyName="E" label="Experience" />
              <Shortcut keyName="L" label="Leadership" />
              <Shortcut keyName="S" label="Skills" />
              <Shortcut keyName="H" label="Hobbies" />
              <Shortcut keyName="M" label="Music" />
              <Shortcut keyName="T" label="Contact" />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              <Shortcut keyName="CTRL+K" label="Search Commands" />
              <Shortcut keyName="ESC" label="Close Windows" />
              <Shortcut keyName="SPACE" label="Play / Pause Audio" />
              <Shortcut keyName="M" label="Go to Music / Mute" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Shortcut({ keyName, label }: { keyName: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-400 font-mono text-xs">{label}</span>
      <kbd className="px-1.5 py-0.5 rounded border font-mono text-[10px]" style={{ background: '#1e293b', borderColor: '#2d3a4f', color: '#94a3b8' }}>
        {keyName}
      </kbd>
    </div>
  );
}
