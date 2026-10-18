import React from "react";

interface AudioWaveformProps {
  levels: number[];
  isListening: boolean;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  levels,
  isListening,
  className = "",
}) => {
  // If not listening, show baseline calm waveform
  const bars = isListening ? levels : [20, 25, 30, 35, 30, 25, 20];

  return (
    <div
      className={`flex items-center justify-center gap-1.5 h-10 px-3 py-1 ${className}`}
      aria-label="Audio Waveform"
    >
      {bars.map((level, index) => {
        // Clamp height between 15% and 100%
        const heightPct = Math.max(15, Math.min(100, level));

        return (
          <div
            key={index}
            className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 via-blue-500 to-fuchsia-500 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            style={{
              height: `${heightPct}%`,
              opacity: isListening ? 0.9 + (heightPct / 100) * 0.1 : 0.4,
              transform: isListening ? `scaleY(${0.8 + (heightPct / 100) * 0.4})` : "scaleY(1)",
            }}
          />
        );
      })}
    </div>
  );
};
