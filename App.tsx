import React, { useState, useRef, useEffect } from 'react';
import VideoGrid from './components/VideoGrid';
import CreateVideoModal from './components/CreateVideoModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import { VideoItem } from './types';
import {
  SparklesIcon,
  UploadIcon,
  HomeIcon,
  FilmIcon
} from './components/Icons';

// Initial dummy data
const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: '1',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    title: 'Blooming Flower',
    description: 'A beautiful timelapse of a flower blooming in nature.',
    isGenerated: false,
    aspectRatio: '16:9'
  },
  {
    id: '2',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'For Bigger Blazes',
    description: 'Classic demo video showcasing high contrast scenes.',
    isGenerated: false,
    aspectRatio: '16:9'
  },
  {
    id: '3',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Elephant Dream',
    description: 'The first open movie project.',
    isGenerated: false,
    aspectRatio: '16:9'
  }
];

const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let lastTime = 0;
    const scrollSpeed = 1.2; // increased for faster pace

    const scroll = (time: number) => {
      if (!lastTime) lastTime = time;

      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop += scrollSpeed;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [videos]);

  const handleVideoCreated = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newVideos: VideoItem[] = (Array.from(files) as File[]).map((file, index) => ({
        id: (Date.now() + index).toString(),
        src: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded from local: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
        isGenerated: false,
        aspectRatio: '16:9'
      }));
      setVideos((prev) => [...newVideos, ...prev]);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f11] text-zinc-200 overflow-hidden font-sans">

      <aside
        className="w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col relative z-30 shrink-0"
      >
        {/* Brand Area */}
        <div className="h-16 flex items-center justify-center border-b border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-2 space-y-4 mt-4">
          {/* Generate Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-95 group relative"
          >
            <SparklesIcon className="w-5 h-5" />
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-800 text-[10px] text-zinc-200 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
              Generate AI
            </div>
          </button>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700 transition-all active:scale-95 group relative"
          >
            <UploadIcon className="w-5 h-5" />
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-800 text-[10px] text-zinc-200 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
              Upload Video
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="video/*"
            multiple
            onChange={handleFileUpload}
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 space-y-2 mt-4">
          <div className="h-12 flex items-center justify-center text-purple-400 bg-purple-500/10 rounded-xl cursor-pointer group relative">
            <HomeIcon className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-800 text-[10px] text-zinc-200 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
              Gallery
            </div>
          </div>
          <div className="h-12 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors group relative">
            <FilmIcon className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-800 text-[10px] text-zinc-200 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
              Collections
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Top Gradient Fade for scroll polish */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0f0f11] to-transparent z-10 pointer-events-none" />

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="max-w-[1600px] mx-auto p-4 sm:p-4">
            {/* Masonry Grid */}
            <VideoGrid videos={videos} onSelectVideo={setSelectedVideo} />

            {/* Empty State */}
            {videos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl">
                <FilmIcon className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg">Your gallery is empty</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 text-purple-400 hover:text-purple-300 hover:underline">
                  Upload your first video
                </button>
              </div>
            )}
          </div>

          <div className="h-20" /> {/* Bottom spacer */}
        </div>

      </main>

      {/* Modals */}
      <CreateVideoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onVideoCreated={handleVideoCreated}
      />

      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

    </div>
  );
};

export default App;