import * as Speech from 'expo-speech';

export interface SpeechOptions {
  voice?: string;
  pitch?: number;
  rate?: number;
  language?: string;
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: any) => void;
  onBoundary?: (event: { charIndex: number; charLength: number }) => void;
}

export class AudioService {
  private static isSpeaking = false;

  static async speak(text: string, options: SpeechOptions = {}) {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
      }

      // If it's a page marker, we skip speaking it entirely
      if (text.startsWith('--- ')) {
        options.onDone?.();
        return;
      }

      // Clean structural markers (# Header -> Header)
      let cleanText = text.replace(/^#+\s+/g, '');

      this.isSpeaking = true;
      
      // Try to find a specific voice if requested
      let voiceId: string | undefined;
      const lang = options.language || 'es-ES';

      if (options.voice && options.voice !== 'Predeterminada') {
        try {
          const voices = await Speech.getAvailableVoicesAsync();
          
          // Debug: Log all available voices for this language
          const langPrefix = lang.split('-')[0];
          let langVoices = voices.filter(v => v.language.startsWith(langPrefix));
          
          console.log(`[AudioService] Available voices for ${lang}:`, langVoices.map(v => v.name));
          
          if (langVoices.length === 0) langVoices = voices;

          const isRequestedMale = options.voice === 'Pablo' || options.voice === 'Sergio';
          
          // 1. Try EXACT name match
          let selectedVoice = langVoices.find(v => v.name.toLowerCase().includes(options.voice!.toLowerCase()));
          
          // 2. If not found, try GENDER heuristic
          if (!selectedVoice) {
            selectedVoice = langVoices.find(v => {
              const lowerName = v.name.toLowerCase();
              if (isRequestedMale) {
                // Both Pablo and Sergio prefer the same high-quality profile (which the user says sounds male)
                return lowerName.includes('male') || 
                       lowerName.includes('pablo') || 
                       lowerName.includes('sergio') ||
                       lowerName.includes('andres') ||
                       lowerName.includes('manuel') || 
                       lowerName.includes('guy') || 
                       lowerName.includes('paco') ||
                       lowerName.includes('google español') || // Mapping the preferred voice here
                       (lowerName.includes('sabina') === false && lowerName.includes('helena') === false && lowerName.includes('elena') === false);
              } else {
                // Secondary heuristic for other voices
                return lowerName.includes('female') || 
                       lowerName.includes('elena') || 
                       lowerName.includes('lucia') || 
                       lowerName.includes('monica') || 
                       lowerName.includes('zira') ||
                       lowerName.includes('helena');
              }
            });
          }

          // 3. Fallback to quality
          if (!selectedVoice && langVoices.length > 0) {
             langVoices.sort((a, b) => {
               const aScore = (a.quality === 'Enhanced' ? 10 : 0) + (a.name.includes('Google') ? 5 : 0);
               const bScore = (b.quality === 'Enhanced' ? 10 : 0) + (b.name.includes('Google') ? 5 : 0);
               return bScore - aScore;
             });
             selectedVoice = langVoices[0];
          }

          if (selectedVoice) {
            console.log(`[AudioService] Selected: ${selectedVoice.name} (Gender Match: ${isRequestedMale ? 'Male' : 'Female'})`);
            voiceId = selectedVoice.identifier;
          } else {
            console.log(`[AudioService] No voice found for ${options.voice}, using system default.`);
          }
        } catch (e) {
          console.warn('Could not fetch voices:', e);
        }
      }

      Speech.speak(cleanText, {
        language: lang,
        pitch: options.pitch ?? 1.0,
        rate: options.rate ?? 1.0,
        voice: voiceId,
        onStart: options.onStart,
        onDone: () => {
          AudioService.isSpeaking = false;
          options.onDone?.();
        },
        onStopped: () => {
          AudioService.isSpeaking = false;
          options.onStopped?.();
        },
        onError: (e) => {
          AudioService.isSpeaking = false;
          options.onError?.(e);
        },
        onBoundary: (event) => {
          options.onBoundary?.(event);
        },
      });
    } catch (error) {
      console.error('TTS Speak Error:', error);
      AudioService.isSpeaking = false;
    }
  }

  static async stop() {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('TTS Stop Error:', error);
    }
  }

  static async pause() {
    // Note: expo-speech pause is only available on iOS in some versions
    // We will use stop/start logic for cross-platform reliability if pause is not stable
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('TTS Pause Error:', error);
    }
  }

  static async isSpeakingNow(): Promise<boolean> {
    return await Speech.isSpeakingAsync();
  }
}
