
import { Language, Emotion, Tone } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'en-IN', name: 'Hinglish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ur', name: 'Urdu' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
];

export const PREBUILT_VOICES: string[] = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

export const EMOTIONS: Emotion[] = ['Normal', 'Happy', 'Serious', 'Motivational'];

export const TONES: Tone[] = ['Normal', 'Soft', 'Deep', 'Energetic', 'Calm'];
