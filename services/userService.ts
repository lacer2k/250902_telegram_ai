import { Settings } from '../types';
import { THEMES, BACKGROUNDS, SETTINGS_KEY } from '../constants';

const defaultSettings: Settings = {
  displayName: 'User',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatarUrl: '',
  backgroundUrl: BACKGROUNDS[0].url,
  theme: THEMES[0].name,
};

// Simulate network delay
const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Fetches user settings, simulating an API call to a database.
 * Falls back to local storage for this mock implementation.
 */
export const fetchSettings = async (): Promise<Settings> => {
  await apiDelay(500); // Simulate network latency
  try {
    const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      // Merge with defaults to ensure all keys are present
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error("Failed to fetch or parse settings from localStorage", error);
  }
  return defaultSettings;
};

/**
 * Saves user settings, simulating an API call to a database.
 * Saves to local storage for this mock implementation.
 */
export const saveSettings = async (settings: Settings): Promise<void> => {
  await apiDelay(1000); // Simulate network latency
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage", error);
    // In a real app, you might want to throw the error to be handled by the UI
    throw new Error('Failed to save settings.');
  }
};
