"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLofiEngine } from "@/stores/useLofiEngine";
import { useStudioStore } from "@/stores/useStudioStore";

import StartupScreen from "@/components/StartupScreen";
import TopBar from "@/components/TopBar";
import ContactBar from "@/components/ContactBar";
import BrowserPanel from "@/components/BrowserPanel";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import RecruiterView from "@/components/RecruiterView";
import AudioControls from "@/components/AudioControls";
import VibeAssistant from "@/components/VibeAssistant";
import SessionPlayback from "@/components/SessionPlayback";
import CommandPalette from "@/components/CommandPalette";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import SoundEngine from "@/components/SoundEngine";

export default function Home() {
  const { isRecruiterMode, isStartupComplete, addTypedKey } = useStudioStore();
  const play = useLofiEngine((s) => s.play);
  const isInitialized = useLofiEngine((s) => s.isInitialized);
  const cleanup = useLofiEngine((s) => s.cleanup);
  const autoplayBlocked = useLofiEngine((s) => s.autoplayBlocked);
  const dismissAutoplayError = useLofiEngine((s) => s.dismissAutoplayError);

  const handleUserInteraction = useCallback(() => {
    if (!isInitialized) {
      play();
    }
  }, [isInitialized, play]);

  useEffect(() => {
    // Listen for first user interaction to bypass autoplay restrictions
    const events = ["click", "scroll", "keydown", "touchstart"] as const;
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
      cleanup();
    };
  }, [handleUserInteraction, cleanup]);

  // Easter egg listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      addTypedKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addTypedKey]);

  return (
    <div className="flex flex-col flex-1 min-h-dvh" style={{ background: "#05070D" }}>
      <AnimatePresence>
        {autoplayBlocked && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-red-500/10 border border-red-500/50 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md cursor-pointer"
            onClick={() => {
              play();
              dismissAutoplayError();
            }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-red-200">Click anywhere to resume audio</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isStartupComplete ? (
          <StartupScreen key="startup" />
        ) : isRecruiterMode ? (
          <RecruiterView key="recruiter" />
        ) : (
          <div key="vibes" className="flex flex-col h-dvh overflow-hidden pb-safe">
            <TopBar />
            <ContactBar />
            
            <div className="flex flex-1 overflow-hidden relative">
              <BrowserPanel />
              <WorkspaceLayout />
              
              {/* V2 Integrations */}
              <VibeAssistant />
              <SessionPlayback />
              <CommandPalette />
              <KeyboardShortcuts />
              <SoundEngine />
            </div>

            <AudioControls />

            {/* Status bar */}
            <footer
              className="border-t px-2 md:px-4 py-1 flex items-center justify-between shrink-0 z-40"
              style={{ background: "#080b12", borderColor: "#1e293b" }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 led-pulse" />
                  <span className="text-[8px] md:text-[9px] font-mono text-slate-500 uppercase tracking-widest">READY</span>
                </div>
                <span className="hidden sm:inline text-[8px] md:text-[9px] font-mono text-slate-700">|</span>
                <span className="hidden sm:inline text-[8px] md:text-[9px] font-mono text-slate-600">CPU: 4%</span>
                <span className="hidden md:inline text-[8px] md:text-[9px] font-mono text-slate-700">|</span>
                <span className="hidden md:inline text-[8px] md:text-[9px] font-mono text-slate-600">RAM: 82MB</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-[8px] md:text-[9px] font-mono text-slate-600">Dhruv Wadhwa &copy; {new Date().getFullYear()}</span>
                <span className="hidden sm:inline text-[8px] md:text-[9px] font-mono text-amber-500/60 uppercase tracking-widest">THE VIBE STUDIO</span>
              </div>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
