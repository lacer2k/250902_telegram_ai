import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../types';
import { fetchSettings, saveSettings as saveSettingsToApi } from '../services/userService';
import { THEMES, BACKGROUNDS } from '../constants';

const defaultSettings: Settings = {
  displayName: 'User',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  backgroundUrl: BACKGROUNDS[0].url,
  theme: THEMES[0].name,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const fetchedSettings = await fetchSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error("Failed to load settings:", error);
        // If loading fails, we'll just use the default settings
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Update local settings state (does not save to DB)
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Save current settings to the DB
  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveSettingsToApi(settings);
    } catch (error) {
      console.error("Failed to save settings:", error);
      // In a real app, you might show an error to the user
    } finally {
      setIsSaving(false);
    }
  }, [settings]);
  
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];

  return { settings, isLoading, isSaving, updateSettings, saveSettings, activeTheme };
};
