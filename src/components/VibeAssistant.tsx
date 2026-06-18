'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/stores/useStudioStore';
import { MessageCircle, X, Minus, ChevronRight } from 'lucide-react';
import type { SectionId } from '@/stores/useStudioStore';

const ASSISTANT_ITEMS: { label: string; target: SectionId; icon: string }[] = [
  { label: 'Tell me about Dhruv', target: 'hero', icon: '👤' },
  { label: 'Show projects', target: 'projects', icon: '🎵' },
  { label: 'Show leadership experience', target: 'leadership', icon: '🎚️' },
  { label: 'Show music journey', target: 'music', icon: '🎤' },
  { label: 'View skills', target: 'skills', icon: '🎛️' },
  { label: 'Get in touch', target: 'contact', icon: '📤' },
];

export default function VibeAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const setActiveSection = useStudioStore((s) => s.setActiveSection);

  const handleSelect = (target: SectionId) => {
    setActiveSection(target);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-16 left-0 plugin-window"
            style={{ width: 280 }}
          >
            {/* Plugin window header */}
            <div className="plugin-window-header">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span style={{ fontSize: 6, fontWeight: 'bold', color: '#000' }}>VA</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Vibe Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="w-4 h-4 rounded flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Minus size={8} className="text-slate-500" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-4 h-4 rounded flex items-center justify-center hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  <X size={8} className="text-slate-500 hover:text-red-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-3">What would you like to explore?</div>
              <div className="space-y-1">
                {ASSISTANT_ITEMS.map((item) => (
                  <motion.button
                    key={item.target}
                    onClick={() => handleSelect(item.target)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all cursor-pointer group"
                    style={{ background: 'transparent', border: '1px solid transparent' }}
                    whileHover={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderColor: 'rgba(245, 158, 11, 0.2)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-200 flex-1 transition-colors">{item.label}</span>
                    <ChevronRight size={10} className="text-slate-700 group-hover:text-amber-400 transition-colors" />
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2 border-t border-slate-800">
                <div className="text-[8px] font-mono text-slate-700 text-center">VIBE ASSISTANT v2.0 — Plugin by VIBE STUDIO</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => {
          if (isMinimized) {
            setIsMinimized(false);
            setIsOpen(true);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="w-11 h-11 rounded-xl flex items-center justify-center border backdrop-blur-xl cursor-pointer"
        style={{
          background: isOpen ? 'rgba(245, 158, 11, 0.15)' : 'rgba(17, 24, 39, 0.9)',
          borderColor: isOpen ? '#f59e0b' : '#2d3a4f',
          boxShadow: isOpen ? '0 0 20px rgba(245, 158, 11, 0.2)' : '0 4px 12px rgba(0,0,0,0.3)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X size={16} className="text-amber-400" />
        ) : (
          <MessageCircle size={16} className="text-slate-400" />
        )}
      </motion.button>
    </div>
  );
}
