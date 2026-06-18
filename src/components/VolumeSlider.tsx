'use client';

import { useLofiEngine } from '@/stores/useLofiEngine';

export default function VolumeSlider() {
  const volume = useLofiEngine((s) => s.volume);
  const setVolume = useLofiEngine((s) => s.setVolume);

  return (
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #f59e0b ${volume * 100}%, #1e293b ${volume * 100}%)`,
        }}
      />
      <span className="text-xs text-slate-500 font-mono w-8">{Math.round(volume * 100)}%</span>
    </div>
  );
}
