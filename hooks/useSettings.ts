import { useState, useEffect } from 'react';
import { Settings, Theme } from '../types';

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

const SETTINGS_KEY = 'gemini-messenger-settings';

const defaultSettings: Settings = {
  displayName: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  backgroundUrl: BACKGROUNDS[0].url,
  theme: THEMES[0].name,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        // Basic validation to ensure stored settings are not malformed
        const parsed = JSON.parse(storedSettings);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };
  
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];

  return { settings, updateSettings, activeTheme };
};
