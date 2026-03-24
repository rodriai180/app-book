import { useState, useEffect, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { AudioService } from '../../services/AudioService';

export const useReaderPlayback = (pages: string[], currentPage: number, setCurrentPage: (p: number | ((p: number) => number)) => void, settings: any) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordInfo, setCurrentWordInfo] = useState<{ charIndex: number; charLength: number } | null>(null);
    const headerAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: isPlaying ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying || pages.length === 0) {
            AudioService.stop();
            return;
        }

        let isMounted = true;

        const playCurrentPage = async () => {
            await AudioService.speak(pages[currentPage], {
                rate: settings.rate,
                pitch: settings.pitch,
                language: settings.language,
                voice: settings.voice,
                onBoundary: (event) => {
                    if (isMounted) setCurrentWordInfo({ charIndex: event.charIndex, charLength: event.charLength });
                },
                onDone: () => {
                    if (isMounted) {
                        setCurrentWordInfo(null);
                        if (currentPage < pages.length - 1) {
                            setTimeout(() => {
                                if (isMounted) setCurrentPage(prev => (prev as number) + 1);
                            }, 500);
                        } else {
                            setIsPlaying(false);
                        }
                    }
                },
                onError: () => {
                    if (isMounted) {
                        setCurrentWordInfo(null);
                        setIsPlaying(false);
                    }
                }
            });
        };

        playCurrentPage();

        return () => {
            isMounted = false;
            AudioService.stop();
        };
    }, [isPlaying, currentPage, settings.rate, settings.pitch, settings.voice, settings.language, pages]);

    const handleTogglePlayback = useCallback(() => {
        if (pages.length === 0) return;
        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);
        if (!newIsPlaying) {
          AudioService.stop();
        }
    }, [pages, isPlaying]);

    const stopPlayback = useCallback(() => {
        setIsPlaying(false);
        // No borramos currentWordInfo: queremos mantener la última palabra leída visible
        AudioService.stop();
    }, []);

    return {
        isPlaying,
        setIsPlaying,
        currentWordInfo,
        headerAnim,
        handleTogglePlayback,
        stopPlayback
    };
};
