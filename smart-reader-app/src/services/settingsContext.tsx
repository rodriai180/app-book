import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

type ReadingSettings = {
    voice: string;
    rate: number;
    pitch: number;
    language: string;
};

interface SettingsContextType {
    settings: ReadingSettings;
    updateSettings: (newSettings: Partial<ReadingSettings>) => void;
    cycleVoice: () => void;
    cycleRate: () => void;
    cyclePitch: () => void;
    cycleLanguage: () => void;
}

const DEFAULT_SETTINGS: ReadingSettings = {
    voice: 'Pablo',
    rate: 0.9,
    pitch: 0.5,
    language: 'es-ES',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const PITCHES = [0.5, 1.0, 1.5];
const LANGUAGES = ['es-ES', 'en-US'];
const VOICES = ['Pablo', 'Sergio'];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

    const updateSettings = (newSettings: Partial<ReadingSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const cycleRate = () => {
        const currentIndex = RATES.indexOf(settings.rate);
        const nextIndex = (currentIndex + 1) % RATES.length;
        updateSettings({ rate: RATES[nextIndex] });
    };

    const cyclePitch = () => {
        const currentIndex = PITCHES.indexOf(settings.pitch);
        const nextIndex = (currentIndex + 1) % PITCHES.length;
        updateSettings({ pitch: PITCHES[nextIndex] });
    };

    const cycleLanguage = () => {
        const currentIndex = LANGUAGES.indexOf(settings.language);
        const nextIndex = (currentIndex + 1) % LANGUAGES.length;
        updateSettings({ language: LANGUAGES[nextIndex] });
    };

    const cycleVoice = () => {
        const currentIndex = VOICES.indexOf(settings.voice);
        const nextIndex = (currentIndex + 1) % VOICES.length;
        updateSettings({ voice: VOICES[nextIndex] });
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            cycleVoice,
            cycleRate,
            cyclePitch,
            cycleLanguage
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
