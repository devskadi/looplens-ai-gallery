export interface VideoItem {
  id: string;
  src: string;
  title: string;
  description?: string;
  isGenerated: boolean;
  aspectRatio?: '16:9' | '9:16';
  thumbnail?: string;
}

export interface VideoGenerationConfig {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  VALIDATING_KEY = 'VALIDATING_KEY',
  GENERATING = 'GENERATING',
  POLLING = 'POLLING',
  DOWNLOADING = 'DOWNLOADING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}