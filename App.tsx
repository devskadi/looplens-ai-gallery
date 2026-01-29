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
  { id: 'v1', src: '/videos/Lark20260129-082153.mp4', title: 'Video 1', description: '', isGenerated: false },
  { id: 'v2', src: '/videos/Lark20260129-082155.mp4', title: 'Video 2', description: '', isGenerated: false },
  { id: 'v3', src: '/videos/Lark20260129-082157.mp4', title: 'Video 3', description: '', isGenerated: false },
  { id: 'v4', src: '/videos/Lark20260129-082159.mp4', title: 'Video 4', description: '', isGenerated: false },
  { id: 'v5', src: '/videos/Lark20260129-082202.mp4', title: 'Video 5', description: '', isGenerated: false },
  { id: 'v6', src: '/videos/Lark20260129-082204.mp4', title: 'Video 6', description: '', isGenerated: false },
  { id: 'v7', src: '/videos/Lark20260129-082206.mp4', title: 'Video 7', description: '', isGenerated: false },
  { id: 'v8', src: '/videos/Lark20260129-082239.mp4', title: 'Video 8', description: '', isGenerated: false },
  { id: 'v9', src: '/videos/Lark20260129-082243.mp4', title: 'Video 9', description: '', isGenerated: false },
  { id: 'v10', src: '/videos/Lark20260129-082245.mp4', title: 'Video 10', description: '', isGenerated: false },
  { id: 'v11', src: '/videos/Lark20260129-082247.mp4', title: 'Video 11', description: '', isGenerated: false },
  { id: 'v12', src: '/videos/Lark20260129-082249.mp4', title: 'Video 12', description: '', isGenerated: false },
  { id: 'v13', src: '/videos/Lark20260129-082250.mp4', title: 'Video 13', description: '', isGenerated: false },
  { id: 'v14', src: '/videos/Lark20260129-082254.mp4', title: 'Video 14', description: '', isGenerated: false },
  { id: 'v15', src: '/videos/Lark20260129-082257.mp4', title: 'Video 15', description: '', isGenerated: false },
  { id: 'v16', src: '/videos/Lark20260129-082258.mp4', title: 'Video 16', description: '', isGenerated: false },
  { id: 'v17', src: '/videos/Lark20260129-082300.mp4', title: 'Video 17', description: '', isGenerated: false },
  { id: 'v18', src: '/videos/Lark20260129-082302.mp4', title: 'Video 18', description: '', isGenerated: false },
  { id: 'v19', src: '/videos/Lark20260129-082305.mp4', title: 'Video 19', description: '', isGenerated: false },
  { id: 'v20', src: '/videos/Lark20260129-082308.mp4', title: 'Video 20', description: '', isGenerated: false },
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

      const currentScroll = scrollContainer.scrollTop;
      const maxScroll = scrollContainer.scrollHeight;

      // Set initial position to skip the top gaps if starting for the first time
      if (currentScroll === 0 && maxScroll > 0) {
        scrollContainer.scrollTop = maxScroll * 0.2;
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      // Loop point: jump from 80% back to 20% to stay in the identical repeating middle section
      if (currentScroll + scrollContainer.clientHeight >= maxScroll * 0.8) {
        scrollContainer.scrollTop = maxScroll * 0.2;
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
        isGenerated: false
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