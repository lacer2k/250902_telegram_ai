import { Theme } from './types';

export const THEMES: Theme[] = [
  { name: 'Default', userBubbleClass: 'bg-blue-600', aiBubbleClass: 'bg-gray-700' },
  { name: 'Forest', userBubbleClass: 'bg-green-600', aiBubbleClass: 'bg-gray-800' },
  { name: 'Sunset', userBubbleClass: 'bg-purple-600', aiBubbleClass: 'bg-indigo-900' },
  { name: 'Ocean', userBubbleClass: 'bg-teal-600', aiBubbleClass: 'bg-slate-700' },
];

export const BACKGROUNDS: { name: string; url: string }[] = [
    { name: 'Default', url: 'https://picsum.photos/seed/telegrambg/480/900' },
    { name: 'Mountains', url: 'https://picsum.photos/seed/mountains/480/900' },
    { name: 'Abstract', url: 'https://picsum.photos/seed/abstract/480/900' },
    { name: 'Dark', url: 'https://picsum.photos/seed/darkness/480/900' },
];

export const SETTINGS_KEY = 'gemini-messenger-settings';
