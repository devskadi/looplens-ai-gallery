import { GoogleGenAI } from "@google/genai";
import { VideoGenerationConfig } from "../types";

// Access window.aistudio safely without redefining the global type which causes conflicts
const getAIStudio = () => (window as any).aistudio;

const VEO_MODEL = 'veo-3.1-fast-generate-preview';

export const validateApiKey = async (): Promise<boolean> => {
  const aiStudio = getAIStudio();
  if (aiStudio && aiStudio.hasSelectedApiKey) {
    const hasKey = await aiStudio.hasSelectedApiKey();
    if (!hasKey && aiStudio.openSelectKey) {
      await aiStudio.openSelectKey();
      // Assume success after dialog interaction to avoid race conditions
      return true;
    }
    return hasKey;
  }
  return true; // Fallback if not in the specific environment
};

export const generateVeoVideo = async (
  config: VideoGenerationConfig,
  onStatusUpdate: (status: string) => void
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select a key.");
  }

  // Create a fresh instance for every call to ensure key is fresh
  const ai = new GoogleGenAI({ apiKey });

  onStatusUpdate("Initializing generation...");

  let operation = await ai.models.generateVideos({
    model: VEO_MODEL,
    prompt: config.prompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio,
    },
  });

  onStatusUpdate("Veo is dreaming... (this may take a minute)");

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(operation.error.message || "Video generation failed");
  }

  const generatedVideos = operation.response?.generatedVideos;
  if (!generatedVideos || generatedVideos.length === 0) {
    throw new Error("No video returned from generation.");
  }

  const downloadLink = generatedVideos[0].video?.uri;
  if (!downloadLink) {
    throw new Error("Video URI missing in response.");
  }

  onStatusUpdate("Downloading video stream...");

  // Fetch the actual video bytes using the key
  const response = await fetch(`${downloadLink}&key=${apiKey}`);
  if (!response.ok) {
    throw new Error(`Failed to download video bytes: ${response.statusText}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};