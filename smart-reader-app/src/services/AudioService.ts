import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

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
  private static voicesCache: Speech.Voice[] = [];

  private static async getVoices(lang: string): Promise<Speech.Voice[]> {
    try {
      if (this.voicesCache.length > 0) return this.voicesCache;
      
      const voices = await Speech.getAvailableVoicesAsync();
      if (voices && voices.length > 0) {
        this.voicesCache = voices;
      }
      return voices || [];
    } catch (e) {
      return [];
    }
  }

  private static preprocessText(text: string): string {
    if (!text) return '';
    let processed = text.replace(/^#+\s+/g, '');
    processed = processed.replace(/[*_~`]/g, '');
    processed = processed.replace(/([.?!,;:])\s*/g, '$1 ');
    return processed.trim();
  }

  private static async getBestVoice(lang: string): Promise<string | undefined> {
    try {
      const voices = await this.getVoices(lang);
      const langPrefix = lang.split('-')[0].toLowerCase();
      const langVoices = voices.filter(v => v.language.toLowerCase().startsWith(langPrefix));
      
      if (langVoices.length === 0) return undefined;

      langVoices.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        const aScore = 
          (aName.includes('pablo') || aName.includes('sergio') || aName.includes('male') || aName.includes('masculine') ? 50 : 0) +
          (aName.includes('google') ? 20 : 0) + 
          (a.quality === 'Enhanced' ? 10 : 0) +
          (aName.includes('natural') || aName.includes('neural') ? 15 : 0);
          
        const bScore = 
          (bName.includes('pablo') || bName.includes('sergio') || bName.includes('male') || bName.includes('masculine') ? 50 : 0) +
          (bName.includes('google') ? 20 : 0) + 
          (b.quality === 'Enhanced' ? 10 : 0) +
          (bName.includes('natural') || bName.includes('neural') ? 15 : 0);
          
        return bScore - aScore;
      });

      return langVoices[0].identifier;
    } catch (e) {
      return undefined;
    }
  }

  static async speak(text: string, options: SpeechOptions = {}) {
    try {
      if (this.isSpeaking) {
        this.stop();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const cleanText = this.preprocessText(text);
      if (!cleanText || cleanText.startsWith('---')) {
        options.onDone?.();
        return;
      }

      this.isSpeaking = true;
      const lang = options.language || 'es-ES';
      const voiceId = await this.getBestVoice(lang);

      if (Platform.OS === 'web') {
        try {
          Speech.speak(cleanText, {
            language: lang,
            voice: voiceId,
            onStart: options.onStart,
            onDone: () => {
              this.isSpeaking = false;
              options.onDone?.();
            },
            onError: (err) => {
              if (this.isSpeaking && voiceId) {
                Speech.speak(cleanText, {
                  language: lang,
                  onDone: () => { this.isSpeaking = false; options.onDone?.(); }
                });
              } else {
                this.isSpeaking = false;
              }
            }
          });
          return;
        } catch (webErr) {
          this.isSpeaking = false;
          return;
        }
      }

      Speech.speak(cleanText, {
        language: lang,
        pitch: options.pitch ?? 1.0,
        rate: options.rate ?? 1.0,
        voice: voiceId,
        onStart: options.onStart,
        onDone: () => {
          this.isSpeaking = false;
          options.onDone?.();
        },
        onStopped: () => {
          this.isSpeaking = false;
          options.onStopped?.();
        },
        onError: (e) => {
          console.warn('[AudioService] Native TTS Error:', e);
          this.isSpeaking = false;
          options.onError?.(e);
        },
      });
    } catch (error) {
      console.error('[AudioService] Critical Error:', error);
      this.isSpeaking = false;
    }
  }

  static stop() {
    this.isSpeaking = false;
    try {
      Speech.stop().catch(() => {});
    } catch (e) {}
  }

  static async pause() {
    this.stop();
  }

  static async isSpeakingNow(): Promise<boolean> {
    return await Speech.isSpeakingAsync();
  }
}
