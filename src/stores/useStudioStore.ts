import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SectionId =
  | "hero"
  | "projects"
  | "certificates"
  | "experience"
  | "leadership"
  | "skills"
  | "hobbies"
  | "music"
  | "achievements"
  | "contact";

interface StudioStore {
  // Mode
  isRecruiterMode: boolean;
  toggleRecruiterMode: () => void;

  // Sound Engine
  soundEnabled: boolean;
  toggleSound: () => void;

  // Active section
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;

  // Browser panel
  isBrowserOpen: boolean;
  toggleBrowser: () => void;

  // Startup
  isStartupComplete: boolean;
  completeStartup: () => void;

  // Easter egg
  isArtistMode: boolean;
  setArtistMode: (val: boolean) => void;

  // Easter egg typed sequence
  typedKeys: string;
  addTypedKey: (key: string) => void;
  resetTypedKeys: () => void;

  // Mixer dock visibility
  isMixerOpen: boolean;
  toggleMixer: () => void;

  // Expanded items in sections
  expandedProjects: Set<string>;
  toggleExpandProject: (id: string) => void;

  expandedCertificates: Set<string>;
  toggleExpandCertificate: (id: string) => void;

  expandedExperiences: Set<string>;
  toggleExpandExperience: (id: string) => void;

  // Currently playing audio (for project/cert voice notes)
  currentVoiceId: string | null;
  setCurrentVoiceId: (id: string | null) => void;

  // Session playback
  isPlaybackMode: boolean;
  playbackIndex: number;
  startPlayback: () => void;
  stopPlayback: () => void;
  nextPlaybackStep: () => void;
}

export const useStudioStore = create<StudioStore>()(
  persist(
    (set, get) => ({
      isRecruiterMode: false,
      toggleRecruiterMode: () => set((s) => ({ isRecruiterMode: !s.isRecruiterMode })),

      soundEnabled: false,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      activeSection: "hero",
      setActiveSection: (section) => set({ activeSection: section }),

      isBrowserOpen: true,
      toggleBrowser: () => set((s) => ({ isBrowserOpen: !s.isBrowserOpen })),

      isStartupComplete: false,
      completeStartup: () => set({ isStartupComplete: true }),

      isArtistMode: false,
      setArtistMode: (val) => set({ isArtistMode: val }),

      typedKeys: "",
      addTypedKey: (key) => {
        const newKeys = (get().typedKeys + key).slice(-8); // "wadhwave" is 8 chars
        set({ typedKeys: newKeys });
        if (newKeys === "wadhwave") {
          set({ isArtistMode: true, typedKeys: "" });
        }
      },
      resetTypedKeys: () => set({ typedKeys: "" }),

      isMixerOpen: true,
      toggleMixer: () => set((s) => ({ isMixerOpen: !s.isMixerOpen })),

      expandedProjects: new Set(),
      toggleExpandProject: (id) => {
        const s = get().expandedProjects;
        const next = new Set(s);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set({ expandedProjects: next });
      },

      expandedCertificates: new Set(),
      toggleExpandCertificate: (id) => {
        const s = get().expandedCertificates;
        const next = new Set(s);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set({ expandedCertificates: next });
      },

      expandedExperiences: new Set(),
      toggleExpandExperience: (id) => {
        const s = get().expandedExperiences;
        const next = new Set(s);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set({ expandedExperiences: next });
      },

      currentVoiceId: null,
      setCurrentVoiceId: (id) => set({ currentVoiceId: id }),

      isPlaybackMode: false,
      playbackIndex: 0,
      startPlayback: () => set({ isPlaybackMode: true, playbackIndex: 0 }),
      stopPlayback: () => set({ isPlaybackMode: false, playbackIndex: 0 }),
      nextPlaybackStep: () => {
        const sections: SectionId[] = ['hero', 'projects', 'experience', 'leadership', 'skills', 'music', 'contact'];
        const nextIndex = (get().playbackIndex + 1) % sections.length;
        set({ playbackIndex: nextIndex, activeSection: sections[nextIndex] });
      },
    }),
    {
      name: "vibe-studio-storage",
      partialize: (state) => ({
        isRecruiterMode: state.isRecruiterMode,
        soundEnabled: state.soundEnabled,
      }), // only persist these fields
    }
  )
);
