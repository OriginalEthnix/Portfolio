'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useStudioStore } from '@/stores/useStudioStore';

export default function SoundEngine() {
  const { soundEnabled } = useStudioStore();
  const soundsLoaded = useRef(false);

  // We define the sounds but only load them if soundEnabled is true or turns true.
  // Using pixabay or freesound placeholders for UI sounds.
  const sounds = useRef<{
    click: Howl | null;
    toggle: Howl | null;
    windowOpen: Howl | null;
  }>({
    click: null,
    toggle: null,
    windowOpen: null,
  });

  useEffect(() => {
    if (soundEnabled && !soundsLoaded.current) {
      // In a real project, we'd use local assets. Using generic click sounds.
      sounds.current = {
        click: new Howl({ src: ['https://cdn.pixabay.com/audio/2022/03/15/audio_793b516b75.mp3'], volume: 0.5 }),
        toggle: new Howl({ src: ['https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3'], volume: 0.4 }),
        windowOpen: new Howl({ src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3'], volume: 0.3 }),
      };
      soundsLoaded.current = true;
    }
  }, [soundEnabled]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!soundEnabled || !sounds.current.click) return;
      const target = e.target as HTMLElement;
      
      if (target.closest('button')) {
        sounds.current.click.play();
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [soundEnabled]);

  return null; // This component just manages audio state globally
}
