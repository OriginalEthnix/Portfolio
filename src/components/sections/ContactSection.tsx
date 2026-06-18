'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { contactInfo } from '@/data/portfolio';
import { Mail, Phone, MapPin, Send, Calendar, FileDown } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 flex items-center gap-3 border-b shrink-0"
        style={{ background: '#0a0f1a', borderColor: '#1e293b' }}>
        <div className="w-2 h-2 rounded-full led-pulse" style={{ background: '#60a5fa' }} />
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Routing — Contact</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #60a5fa30, transparent)' }} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-8 items-center justify-center relative">
        {/* Routing wire between info and form */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-[2px] bg-slate-800 rounded">
           {status === 'sending' && <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] signal-dot" />}
        </div>
        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md p-6 rounded-xl border"
          style={{ background: 'rgba(5,7,13,0.8)', borderColor: '#1e293b' }}
        >
          <h2 className="text-xl font-bold mb-6 text-slate-200">Let's Build Something</h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border"
                style={{ background: '#60a5fa15', borderColor: '#60a5fa40', color: '#60a5fa' }}>
                <Mail size={18} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Email</div>
                <div className="text-sm text-slate-300">{contactInfo.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border"
                style={{ background: '#34d39915', borderColor: '#34d39940', color: '#34d399' }}>
                <Phone size={18} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Phone</div>
                <div className="text-sm text-slate-300">{contactInfo.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border"
                style={{ background: '#a78bfa15', borderColor: '#a78bfa40', color: '#a78bfa' }}>
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Location</div>
                <div className="text-sm text-slate-300">{contactInfo.location}</div>
              </div>
            </div>
          </div>

          {/* Booking & Downloads */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Session Booking & Files</h3>
            
            <motion.a
              href={`mailto:${contactInfo.email}?subject=Studio Session Booking`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded font-mono text-xs uppercase tracking-wider border cursor-pointer"
              style={{ color: '#34d399', borderColor: '#34d39950', background: '#34d39910' }}
              whileHover={{ scale: 1.02, background: '#34d39920' }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar size={14} /> Book Studio Session
            </motion.a>
            
            <motion.a
              href={contactInfo.resume || '#'}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded font-mono text-xs uppercase tracking-wider border cursor-pointer"
              style={{ color: '#e2e8f0', borderColor: '#475569', background: '#1e293b' }}
              whileHover={{ scale: 1.02, borderColor: '#94a3b8' }}
              whileTap={{ scale: 0.98 }}
              target="_blank" rel="noopener noreferrer"
            >
              <FileDown size={14} /> Export CV (Resume)
            </motion.a>
          </div>
        </motion.div>

        {/* Contact form (plugin style) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md p-6 rounded-xl border relative"
          style={{ background: 'linear-gradient(180deg, #111827, #0B0F19)', borderColor: '#2d3a4f' }}
        >
          {/* Rack screws */}
          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
          <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
          <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />

          <div className="text-center mb-6 pt-2">
            <h3 className="text-[12px] font-mono text-slate-400 uppercase tracking-[0.2em]">Message Compressor</h3>
            <div className="w-12 h-0.5 bg-blue-500 mx-auto mt-2 rounded-full opacity-50" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 block">INPUT SIGNAL</label>
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors font-mono"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 block">SOURCE</label>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors font-mono"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 block">VOICE NOTE</label>
              <textarea
                placeholder="Message..."
                required
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors resize-none font-mono"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={status !== 'idle'}
              className="w-full py-2.5 rounded font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ background: '#3b82f6', color: '#fff', boxShadow: '0 0 15px rgba(59,130,246,0.3)' }}
            >
              {status === 'idle' && <>📤 EXPORT TRACK</>}
              {status === 'sending' && 'RENDERING...'}
              {status === 'sent' && 'TRACK EXPORTED!'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
