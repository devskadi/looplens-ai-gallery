import React, { useState } from 'react';
import { generateVeoVideo, validateApiKey } from '../services/geminiService';
import { VideoGenerationConfig, GenerationStatus, VideoItem } from '../types';
import { LoaderIcon, SparklesIcon, CloseIcon } from './Icons';

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoCreated: (video: VideoItem) => void;
}

const CreateVideoModal: React.FC<CreateVideoModalProps> = ({ isOpen, onClose, onVideoCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setError(null);
    setStatus(GenerationStatus.VALIDATING_KEY);
    setStatusMessage("Checking API Key...");

    try {
      // 1. Validate API Key selection
      const isKeyValid = await validateApiKey();
      if (!isKeyValid) {
        throw new Error("Please select a valid paid API key to use Veo.");
      }

      setStatus(GenerationStatus.GENERATING);
      
      // 2. Call Generation Service
      const config: VideoGenerationConfig = {
        prompt,
        aspectRatio,
        resolution: '720p', // Defaulting to 720p for speed
      };

      const videoUrl = await generateVeoVideo(config, (msg) => setStatusMessage(msg));

      setStatus(GenerationStatus.COMPLETED);
      
      // 3. Create Video Item
      const newVideo: VideoItem = {
        id: Date.now().toString(),
        src: videoUrl,
        title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
        description: prompt,
        isGenerated: true,
        aspectRatio: aspectRatio,
      };

      onVideoCreated(newVideo);
      onClose();
      // Reset state
      setPrompt('');
      setStatus(GenerationStatus.IDLE);

    } catch (err: any) {
      console.error(err);
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "Something went wrong.");
    }
  };

  const isProcessing = status !== GenerationStatus.IDLE && status !== GenerationStatus.ERROR && status !== GenerationStatus.COMPLETED;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            Generate with Veo
          </h2>
          <button onClick={onClose} disabled={isProcessing} className="text-zinc-400 hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want Veo to create... e.g., A cyberpunk city in rain, neon lights reflection."
              className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              disabled={isProcessing}
            />
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAspectRatio('16:9')}
                disabled={isProcessing}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                16:9 Landscape
              </button>
              <button
                onClick={() => setAspectRatio('9:16')}
                disabled={isProcessing}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                9:16 Portrait
              </button>
            </div>
          </div>

          {/* Status / Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {isProcessing && (
             <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <LoaderIcon className="w-8 h-8 text-purple-500" />
                <p className="text-sm text-purple-200 animate-pulse">{statusMessage}</p>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-3">
           <button 
             onClick={onClose} 
             disabled={isProcessing}
             className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
           >
             Cancel
           </button>
           <button
             onClick={handleGenerate}
             disabled={!prompt.trim() || isProcessing}
             className={`px-6 py-2 rounded-lg text-sm font-semibold text-white shadow-lg shadow-purple-900/20 flex items-center gap-2 transition-all ${
                !prompt.trim() || isProcessing 
                  ? 'bg-zinc-700 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
             }`}
           >
             {isProcessing ? 'Creating...' : 'Generate Video'}
             {!isProcessing && <SparklesIcon className="w-4 h-4" />}
           </button>
        </div>

      </div>
    </div>
  );
};

export default CreateVideoModal;