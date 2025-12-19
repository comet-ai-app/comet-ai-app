
export type Theme = 'light' | 'dark';
export type Page = 'landing' | 'dashboard' | 'projects' | 'settings';
export type Emotion = 'Normal' | 'Happy' | 'Serious' | 'Motivational';
export type Tone = 'Normal' | 'Soft' | 'Deep' | 'Energetic' | 'Calm';

export interface Language {
  code: string;
  name: string;
}

export interface Voice {
    id: string;
    name: string;
    apiVoice: string; // e.g., 'Kore', 'Puck' from Gemini API
}

interface BaseProject {
  id: string;
  name: string;
  createdAt: string;
}

export interface AudioProject extends BaseProject {
  type: 'TTS' | 'STS';
  audioBase64: string;
}

export interface TranscriptProject extends BaseProject {
  type: 'Live Transcript';
  transcript: string;
}

export interface DubbingProject extends BaseProject {
    type: 'Dubbing';
    fileName: string;
    dubbedAudioBase64: string;
    sourceTranscript: string;
    translatedTranscript: string;
}

export type Project = AudioProject | TranscriptProject | DubbingProject;

export interface SubtitleStyle {
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    bold: boolean;
    italic: boolean;
}
