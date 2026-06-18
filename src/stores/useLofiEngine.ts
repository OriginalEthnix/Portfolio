import { create } from "zustand";

interface LofiEngineState {
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  gainNode: GainNode | null;
  filterNode: BiquadFilterNode | null;
  analyserNode: AnalyserNode | null;
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  isInitialized: boolean;
  volume: number;
  isMuffled: boolean;
  isBoringMode: boolean;
  frequencyData: Uint8Array | null;

  initAudio: () => Promise<void>;
  setVolume: (volume: number) => void;
  toggleMuffle: () => void;
  toggleBoringMode: () => void;
  getFrequencyData: () => Uint8Array | null;
  cleanup: () => void;
}

const LOFI_AUDIO_URL =
  "https://cdn.pixabay.com/audio/2024/11/01/audio_6a5c43e13a.mp3";

export const useLofiEngine = create<LofiEngineState>((set, get) => ({
  audioContext: null,
  sourceNode: null,
  gainNode: null,
  filterNode: null,
  analyserNode: null,
  audioElement: null,
  isPlaying: false,
  isInitialized: false,
  volume: 0.35,
  isMuffled: false,
  isBoringMode: false,
  frequencyData: null,

  initAudio: async () => {
    const state = get();
    if (state.isInitialized) {
      if (state.audioContext?.state === "suspended") {
        await state.audioContext.resume();
      }
      return;
    }

    try {
      const audioContext = new AudioContext();
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audio.src = LOFI_AUDIO_URL;

      const sourceNode = audioContext.createMediaElementSource(audio);
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      const analyserNode = audioContext.createAnalyser();

      filterNode.type = "lowpass";
      filterNode.frequency.value = 22000;
      filterNode.Q.value = 1;

      analyserNode.fftSize = 64;
      analyserNode.smoothingTimeConstant = 0.8;

      // Chain: source -> filter -> gain -> analyser -> destination
      sourceNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      // Start with 0 volume and fade in
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        get().volume,
        audioContext.currentTime + 2
      );

      const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);

      set({
        audioContext,
        sourceNode,
        gainNode,
        filterNode,
        analyserNode,
        audioElement: audio,
        isInitialized: true,
        frequencyData,
      });

      await audio.play();
      set({ isPlaying: true });
    } catch (err) {
      console.warn("Audio initialization failed:", err);
    }
  },

  setVolume: (volume: number) => {
    const { gainNode, audioContext } = get();
    set({ volume });
    if (gainNode && audioContext) {
      gainNode.gain.linearRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.1
      );
    }
  },

  toggleMuffle: () => {
    const { filterNode, audioContext, isMuffled } = get();
    if (filterNode && audioContext) {
      const newMuffled = !isMuffled;
      filterNode.frequency.linearRampToValueAtTime(
        newMuffled ? 400 : 22000,
        audioContext.currentTime + 0.5
      );
      set({ isMuffled: newMuffled });
    }
  },

  toggleBoringMode: () => {
    const { isBoringMode } = get();
    set({ isBoringMode: !isBoringMode });
  },

  getFrequencyData: () => {
    const { analyserNode, frequencyData } = get();
    if (analyserNode && frequencyData) {
      analyserNode.getByteFrequencyData(frequencyData as any);
      return frequencyData;
    }
    return null;
  },

  cleanup: () => {
    const { audioContext, audioElement } = get();
    audioElement?.pause();
    audioContext?.close();
    set({
      audioContext: null,
      sourceNode: null,
      gainNode: null,
      filterNode: null,
      analyserNode: null,
      audioElement: null,
      isPlaying: false,
      isInitialized: false,
      frequencyData: null,
    });
  },
}));
