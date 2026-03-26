import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon (AI Generated)",
    artist: "Synth Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: "5:25"
  },
  {
    id: 2,
    title: "Cybernetic Pulse (AI Generated)",
    artist: "Neural Network",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: "4:12"
  },
  {
    id: 3,
    title: "Digital Dreamscape (AI Generated)",
    artist: "Algorithm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: "6:08"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-16 h-16 rounded-md bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] flex-shrink-0">
          <Music className="text-white w-8 h-8" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-purple-300 font-bold truncate text-lg drop-shadow-[0_0_5px_rgba(216,180,254,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-400/80 text-sm truncate font-mono">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-1.5 bg-gray-800 rounded-full mb-4 cursor-pointer relative group"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full relative shadow-[0_0_8px_rgba(168,85,247,0.6)]"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_5px_#fff] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-gray-400">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-gray-300 hover:text-purple-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] cursor-pointer"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 hover:bg-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-gray-300 hover:text-purple-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] cursor-pointer"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
