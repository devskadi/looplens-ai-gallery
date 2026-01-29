import React from 'react';
import { VideoItem } from '../types';
import { PlayIcon } from './Icons';

interface VideoGridProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onSelectVideo }) => {
  // Distribute videos into 4 columns (for desktop)
  // On mobile/tablet we'll use fewer columns but keep the same logic for simplicity, 
  // just hiding the empty ones or letting them wrap if we changed layout.
  // Actually, let's keep it simple: 2 columns on mobile, 4 on lg.
  const numCols = 4;
  const columns: VideoItem[][] = Array.from({ length: numCols }, () => []);

  // Repeat videos many times to create a massive wall for seamless looping
  const repeatedVideos = Array.from({ length: 10 }).flatMap(() => videos);

  repeatedVideos.forEach((video, index) => {
    // Basic distribution
    columns[index % numCols].push(video);
  });

  const columnClasses = [
    'flex',             // Always show col 0
    'flex',             // Always show col 1
    'hidden lg:flex',   // High-res only col 2
    'hidden lg:flex',   // High-res only col 3
  ];

  const columnOffsets = [
    'mt-0',      // Col 0
    'mt-24',     // Col 1 (Offset down)
    'mt-12',     // Col 2 (Partial offset)
    'mt-36',     // Col 3 (Deep offset)
  ];

  return (
    <div className="flex flex-row gap-2 p-2">
      {columns.map((colVideos, colIndex) => (
        <div
          key={colIndex}
          className={`flex-1 flex flex-col gap-2 ${columnClasses[colIndex]} ${columnOffsets[colIndex]}`}
        >
          {colVideos.map((video) => (
            <div
              key={video.id}
              className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer shadow-lg"
              onClick={() => onSelectVideo(video)}
            >
              {/* Container - now adapts to video height */}
              <div className="relative w-full h-auto bg-zinc-950">
                <video
                  src={video.src}
                  className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity block"
                  preload="metadata"
                  muted
                  playsInline
                  autoPlay
                  loop
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                    <PlayIcon className="w-4 h-4 text-white ml-1" />
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {video.isGenerated && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-purple-200 bg-purple-900/60 backdrop-blur-md rounded border border-purple-500/30 shadow-sm">
                      AI
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;