import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PlayState = 'playing' | 'paused' | 'stopped' | 'ai_override';

interface LofiEngineState {
  playState: PlayState;
  isInitialized: boolean;
  volume: number;
  isMuted: boolean;
  
  isMuffled: boolean;
  filterIntensity: number; // 0 to 100
  isRecruiterMode: boolean;
  
  initAudio: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  toggleMuffle: () => void;
  setFilterIntensity: (intensity: number) => void;
  toggleRecruiterMode: () => void;
  getFrequencyData: () => Uint8Array | null;
  
  interruptForVoiceover: () => void;
  resumeFromVoiceover: () => void;
  cleanup: () => void;
  
  autoplayBlocked: boolean;
  dismissAutoplayError: () => void;
}

const LOFI_AUDIO_URL = '/audio/background.mp3';

// Singleton Instances
let globalAudioContext: AudioContext | null = null;
let globalAudioElement: HTMLAudioElement | null = null;
let globalSourceNode: MediaElementAudioSourceNode | null = null;
let globalGainNode: GainNode | null = null;
let globalFilterNode: BiquadFilterNode | null = null;
let globalAnalyserNode: AnalyserNode | null = null;
let globalFrequencyData: Uint8Array | null = null;
let audioInstanceCount = 0;
let isInitializing = false;

export const useLofiEngine = create<LofiEngineState>()(
  persist(
    (set, get) => ({
      playState: 'stopped',
      isInitialized: false,
      volume: 0.35,
      isMuted: false,
      
      isMuffled: false,
      filterIntensity: 100,
      isRecruiterMode: false,
      autoplayBlocked: false,
      dismissAutoplayError: () => set({ autoplayBlocked: false }),

      initAudio: async () => {
        const state = get();
        if (state.isInitialized || globalAudioElement || isInitializing) {
          if (globalAudioContext?.state === 'suspended') {
            await globalAudioContext.resume();
          }
          return;
        }

        isInitializing = true;

        try {
          globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          globalAudioElement = new Audio();
          
          audioInstanceCount++;
          console.log('Audio instances:', audioInstanceCount);

          globalAudioElement.crossOrigin = 'anonymous';
          globalAudioElement.loop = true;
          globalAudioElement.preload = 'auto';
          globalAudioElement.src = LOFI_AUDIO_URL;
          
          console.log(`[AudioEngine] Initializing audio from: ${globalAudioElement.src}`);
          console.log('Audio Source:', globalAudioElement.src);

          globalAudioElement.addEventListener('canplaythrough', () => {
            console.log('[AudioEngine] Audio loaded successfully');
            console.log(`[AudioEngine] Ready State: ${globalAudioElement?.readyState}`);
          });

          globalAudioElement.addEventListener('error', (e) => {
            console.log('[AudioEngine] Audio failed to load', e);
          });

          globalAudioElement.addEventListener('timeupdate', () => {
            if (globalAudioElement && Math.floor(globalAudioElement.currentTime) % 10 === 0 && globalAudioElement.currentTime > 0) {
              console.log(`[AudioEngine] Current timestamp: ${globalAudioElement.currentTime.toFixed(2)}s`);
            }
          });

          globalSourceNode = globalAudioContext.createMediaElementSource(globalAudioElement);
          globalGainNode = globalAudioContext.createGain();
          globalFilterNode = globalAudioContext.createBiquadFilter();
          globalAnalyserNode = globalAudioContext.createAnalyser();

          globalFilterNode.type = 'lowpass';
          globalFilterNode.frequency.value = 22000;
          globalFilterNode.Q.value = 1;

          globalAnalyserNode.fftSize = 64;
          globalAnalyserNode.smoothingTimeConstant = 0.8;

          // Chain: source -> filter -> gain -> analyser -> destination
          globalSourceNode.connect(globalFilterNode);
          globalFilterNode.connect(globalGainNode);
          globalGainNode.connect(globalAnalyserNode);
          globalAnalyserNode.connect(globalAudioContext.destination);

          // Start muted
          globalGainNode.gain.setValueAtTime(0, globalAudioContext.currentTime);

          globalFrequencyData = new Uint8Array(globalAnalyserNode.frequencyBinCount);

          set({ isInitialized: true });

          // Apply initial settings
          if (get().isMuffled) {
            get().setFilterIntensity(get().filterIntensity);
          }
        } catch (err) {
          console.warn('Audio initialization failed:', err);
        } finally {
          isInitializing = false;
        }
      },

      play: async () => {
        const state = get();
        if (!state.isInitialized || !globalAudioElement) await state.initAudio();
        
        const { volume, isMuted } = get();
        if (!globalAudioContext || !globalAudioElement || !globalGainNode) return;

        if (globalAudioElement && !globalAudioElement.paused && state.playState === 'playing') {
          return;
        }

        if (globalAudioContext.state === 'suspended') {
          await globalAudioContext.resume();
        }

        console.log(`[AudioEngine] Attempting playback... playState=${get().playState}, isMuted=${isMuted}, volume=${volume}`);

        globalAudioElement.play().then(() => {
          console.log(`[AudioEngine] Playback started successfully.`);
          set({ autoplayBlocked: false });
        }).catch(e => {
          console.warn("[AudioEngine] Autoplay blocked or failed:", e);
          set({ autoplayBlocked: true });
        });
        
        const targetVolume = isMuted ? 0 : volume;
        globalGainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
        globalGainNode.gain.setValueAtTime(globalGainNode.gain.value, globalAudioContext.currentTime);
        globalGainNode.gain.linearRampToValueAtTime(targetVolume, globalAudioContext.currentTime + 1.5);
        
        set({ playState: 'playing' });
      },

      pause: () => {
        if (!globalAudioContext || !globalAudioElement || !globalGainNode) return;

        globalGainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
        globalGainNode.gain.setValueAtTime(globalGainNode.gain.value, globalAudioContext.currentTime);
        globalGainNode.gain.linearRampToValueAtTime(0, globalAudioContext.currentTime + 0.5);

        setTimeout(() => {
          if (get().playState === 'paused' && globalAudioElement) {
            globalAudioElement.pause();
          }
        }, 500);

        set({ playState: 'paused' });
      },

      stop: () => {
        if (!globalAudioContext || !globalAudioElement || !globalGainNode) return;

        globalGainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
        globalGainNode.gain.setValueAtTime(globalGainNode.gain.value, globalAudioContext.currentTime);
        globalGainNode.gain.linearRampToValueAtTime(0, globalAudioContext.currentTime + 0.5);

        setTimeout(() => {
          if (get().playState === 'stopped' && globalAudioElement) {
            globalAudioElement.pause();
            globalAudioElement.currentTime = 0;
          }
        }, 500);

        set({ playState: 'stopped' });
      },

      interruptForVoiceover: () => {
        const { playState } = get();
        if (!globalAudioContext || !globalGainNode || playState !== 'playing') return;

        // Fast fade out
        globalGainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
        globalGainNode.gain.setValueAtTime(globalGainNode.gain.value, globalAudioContext.currentTime);
        globalGainNode.gain.linearRampToValueAtTime(0.02, globalAudioContext.currentTime + 0.3);

        set({ playState: 'ai_override' });
      },

      resumeFromVoiceover: () => {
        const { volume, isMuted, playState } = get();
        if (!globalAudioContext || !globalGainNode || playState !== 'ai_override') return;

        const targetVolume = isMuted ? 0 : volume;
        globalGainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
        globalGainNode.gain.setValueAtTime(globalGainNode.gain.value, globalAudioContext.currentTime);
        globalGainNode.gain.linearRampToValueAtTime(targetVolume, globalAudioContext.currentTime + 1.5);

        set({ playState: 'playing' });
      },

      setVolume: (newVolume: number) => {
        const { isMuted, playState } = get();
        set({ volume: newVolume });
        
        if (isMuted && newVolume > 0) {
          set({ isMuted: false });
        }
        
        if (globalGainNode && globalAudioContext && playState === 'playing') {
          const target = isMuted ? 0 : newVolume;
          globalGainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
          globalGainNode.gain.linearRampToValueAtTime(target, globalAudioContext.currentTime + 0.1);
        }
      },

      toggleMute: () => {
        const { isMuted, volume, playState } = get();
        const newMuted = !isMuted;
        set({ isMuted: newMuted });
        
        if (globalGainNode && globalAudioContext && playState === 'playing') {
          const target = newMuted ? 0 : volume;
          globalGainNode.gain.cancelScheduledValues(globalAudioContext.currentTime);
          globalGainNode.gain.setValueAtTime(globalGainNode.gain.value, globalAudioContext.currentTime);
          globalGainNode.gain.linearRampToValueAtTime(target, globalAudioContext.currentTime + 0.3);
        }
      },

      setFilterIntensity: (intensity: number) => {
        const { isMuffled } = get();
        set({ filterIntensity: intensity });
        
        if (globalFilterNode && globalAudioContext && isMuffled) {
          const minFreq = 400;
          const maxFreq = 22000;
          const logMin = Math.log(minFreq);
          const logMax = Math.log(maxFreq);
          
          const scale = 1 - (intensity / 100);
          const currentLog = logMin + scale * (logMax - logMin);
          const freq = Math.exp(currentLog);

          globalFilterNode.frequency.cancelScheduledValues(globalAudioContext.currentTime);
          globalFilterNode.frequency.linearRampToValueAtTime(freq, globalAudioContext.currentTime + 0.1);
        }
      },

      toggleMuffle: () => {
        const { isMuffled, filterIntensity } = get();
        const newMuffled = !isMuffled;
        set({ isMuffled: newMuffled });
        
        if (globalFilterNode && globalAudioContext) {
          globalFilterNode.frequency.cancelScheduledValues(globalAudioContext.currentTime);
          if (newMuffled) {
            get().setFilterIntensity(filterIntensity);
          } else {
            globalFilterNode.frequency.linearRampToValueAtTime(22000, globalAudioContext.currentTime + 0.5);
          }
        }
      },

      toggleRecruiterMode: () => {
        const { isRecruiterMode } = get();
        set({ isRecruiterMode: !isRecruiterMode });
      },

      getFrequencyData: () => {
        const { playState } = get();
        if (globalAnalyserNode && globalFrequencyData && (playState === 'playing' || playState === 'ai_override')) {
          globalAnalyserNode.getByteFrequencyData(globalFrequencyData as any);
          return globalFrequencyData;
        }
        return null;
      },
      
      cleanup: () => {
        // No-op for global singletons to prevent multiple mounts stopping audio
      }
    }),
    {
      name: 'portfolio-audio-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        isMuted: state.isMuted,
        isMuffled: state.isMuffled,
        filterIntensity: state.filterIntensity
      }),
    }
  )
);
