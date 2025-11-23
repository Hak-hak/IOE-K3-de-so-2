import React, { useRef, useState } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow w-full max-w-md">
      <button 
        type="button" 
        onClick={togglePlay}
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-blue-200"
        aria-label={isPlaying ? "Dừng" : "Phát"}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Câu hỏi Audio</span>
        <span className="text-sm text-slate-500 flex items-center gap-1">
          <Volume2 className="w-4 h-4" /> Nhấn để nghe
        </span>
      </div>
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={handleEnded} 
        className="hidden" 
      />
    </div>
  );
};