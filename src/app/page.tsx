"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useLofiEngine } from "@/stores/useLofiEngine";
import { useStudioStore } from "@/stores/useStudioStore";

import StartupScreen from "@/components/StartupScreen";
import TopBar from "@/components/TopBar";
import ContactBar from "@/components/ContactBar";
import BrowserPanel from "@/components/BrowserPanel";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import BoringView from "@/components/BoringView";
import AudioControls from "@/components/AudioControls";
import VibeAssistant from "@/components/VibeAssistant";
import SessionPlayback from "@/components/SessionPlayback";

export default function Home() {
  const { isBoringMode, isStartupComplete, addTypedKey } = useStudioStore();
  const initAudio = useLofiEngine((s) => s.initAudio);
  const isInitialized = useLofiEngine((s) => s.isInitialized);
  const cleanup = useLofiEngine((s) => s.cleanup);

  const handleUserInteraction = useCallback(() => {
    if (!isInitialized) {
      initAudio();
    }
  }, [isInitialized, initAudio]);

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
    <div className="flex flex-col flex-1 min-h-screen" style={{ background: "#05070D" }}>
      <AnimatePresence mode="wait">
        {!isStartupComplete ? (
          <StartupScreen key="startup" />
        ) : isBoringMode ? (
          <BoringView key="boring" />
        ) : (
          <div key="vibes" className="flex flex-col h-screen overflow-hidden">
            <TopBar />
            <ContactBar />
            
            <div className="flex flex-1 overflow-hidden relative">
              <BrowserPanel />
              <WorkspaceLayout />
              
              {/* V2 Integrations */}
              <VibeAssistant />
              <SessionPlayback />
            </div>

            <AudioControls />

            {/* Status bar */}
            <footer
              className="border-t px-4 py-1 flex items-center justify-between shrink-0 z-40"
              style={{ background: "#080b12", borderColor: "#1e293b" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 led-pulse" />
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    READY
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-700">|</span>
                <span className="text-[9px] font-mono text-slate-600">
                  CPU: 4%
                </span>
                <span className="text-[9px] font-mono text-slate-700">|</span>
                <span className="text-[9px] font-mono text-slate-600">
                  RAM: 82MB
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-slate-600">
                  Dhruv Wadhwa &copy; {new Date().getFullYear()}
                </span>
                <span className="text-[9px] font-mono text-amber-500/60 uppercase tracking-widest">
                  THE VIBE STUDIO
                </span>
              </div>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
