import React, { useEffect, useRef, useState } from 'react';
import { VideoItem } from '../types';
import { CloseIcon, PauseIcon, PlayIcon } from './Icons';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [video]);

  if (!video) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progressVal = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressVal);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <h2 className="text-lg font-bold drop-shadow-md">{video.title}</h2>
          <p className="text-sm opacity-80 drop-shadow-md">{video.isGenerated ? 'Generated with Veo' : 'Library Video'}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center relative bg-zinc-950" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={video.src}
          className="max-h-full max-w-full shadow-2xl"
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            // Explicit looping logic if `loop` attribute fails for some reason, though `loop` attr is standard.
             if(videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
             }
          }}
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
              <PlayIcon className="w-10 h-10 text-white ml-2" />
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center px-6 gap-4">
        <button onClick={togglePlay} className="text-white hover:text-purple-400 transition-colors">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        
        {/* Progress Bar */}
        <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-xs text-zinc-400 font-mono">
           LOOPING ACTIVE
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;