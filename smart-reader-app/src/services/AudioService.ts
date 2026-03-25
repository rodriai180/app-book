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
  private static wordTimer: any = null;
  // Factor de calibración adaptativa: ajusta el timer según velocidad real de la voz
  // < 1.0 = acelerar timer (voz más rápida que estimado), > 1.0 = frenar timer
  private static calibrationFactor = 0.95;

  private static async getVoices(_lang: string): Promise<Speech.Voice[]> {
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
    let processed = text.replace(/^#+\s*/gm, '');
    processed = processed.replace(/[*_~`]/g, '');
    processed = processed.replace(/<[^>]+>/g, '');
    processed = processed.replace(/[#<>|\\^{}[\]]/g, '');
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
          const synth = (typeof window !== 'undefined' && (window as any).speechSynthesis) as SpeechSynthesis | undefined;
          if (synth) {
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = lang;
            // En web, pitch=1 (neutro) suena más natural que cualquier otro valor
            utterance.rate = options.rate ?? 1.0;
            utterance.pitch = 1.0;

            // Seleccionar la mejor voz web disponible con scoring
            const pickBestWebVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
              const prefix = lang.split('-')[0].toLowerCase();
              const candidates = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
              if (!candidates.length) return undefined;

              const scored = candidates.map(v => {
                const name = v.name.toLowerCase();
                let score = 0;
                // Voces neurales/online de Google suenan mucho mejor
                if (name.includes('google')) score += 40;
                if (!v.localService) score += 20; // online = neural
                if (name.includes('natural') || name.includes('neural') || name.includes('enhanced')) score += 25;
                if (name.includes('microsoft') && (name.includes('online') || name.includes('natural'))) score += 30;
                // Preferir el dialecto exacto
                if (v.lang.toLowerCase() === lang.toLowerCase()) score += 10;
                // Penalizar voces compactas o antiguas
                if (name.includes('compact') || name.includes('premium') === false && name.includes('ivona')) score -= 10;
                return { v, score };
              });

              scored.sort((a, b) => b.score - a.score);
              return scored[0].v;
            };

            const applyVoice = () => {
              const voices = synth.getVoices();
              const best = pickBestWebVoice(voices);
              if (best) {
                utterance.voice = best;

              }
            };
            applyVoice();
            if (synth.getVoices().length === 0) {
              synth.addEventListener('voiceschanged', applyVoice, { once: true } as any);
            }

            // Precalcular offsets de cada palabra para el timer-fallback
            const words = cleanText.split(/\s+/).filter(w => w.length > 0);
            const charOffsets: number[] = [];
            let scanPos = 0;
            for (const word of words) {
              const idx = cleanText.indexOf(word, scanPos);
              charOffsets.push(idx >= 0 ? idx : scanPos);
              scanPos = (idx >= 0 ? idx : scanPos) + word.length;
            }
            const rate = options.rate ?? 1.0;
            // ms base por carácter — se multiplica por calibrationFactor cada vez
            const msPerChar = (72 / rate) * AudioService.calibrationFactor;
            let usedRealEvents = false;
            let estimatedTotalMs = 0;
            let timerStartTime = 0;

            const startWordTimer = () => {
              // Pre-calcular tiempo absoluto (desde inicio) de cada palabra
              // Esto permite corregir drift: cada palabra se dispara en su tiempo exacto
              // sin acumular el error de los setTimeout anteriores
              const wordAbsMs: number[] = [];
              let cumMs = 0;
              for (let i = 0; i < words.length; i++) {
                wordAbsMs.push(cumMs);
                let ms = Math.max(60, words[i].length * msPerChar);
                const tail = cleanText[charOffsets[i] + words[i].length];
                if (/[.!?]/.test(tail))    ms += 600 / rate;
                else if (/[;]/.test(tail))  ms += 420 / rate;
                else if (/[,:]/.test(tail)) ms += 320 / rate;
                cumMs += ms;
              }
              estimatedTotalMs = cumMs;

              let wordIdx = 0;
              const startTime = Date.now();
              timerStartTime = startTime;

              const scheduleNext = () => {
                if (usedRealEvents || wordIdx >= words.length) return;

                // Disparar la palabra actual
                options.onBoundary?.({ charIndex: charOffsets[wordIdx], charLength: words[wordIdx].length });
                wordIdx++;
                if (wordIdx >= words.length) return;

                // Delay hasta la próxima palabra = tiempo absoluto esperado - tiempo ya transcurrido
                // Esto corrige cualquier drift acumulado de setTimeout anteriores
                const elapsed = Date.now() - startTime;
                const delay = Math.max(10, wordAbsMs[wordIdx] - elapsed);
                AudioService.wordTimer = setTimeout(scheduleNext, delay);
              };

              scheduleNext();
            };

            utterance.onstart = () => {
              options.onStart?.();
              if (options.onBoundary) startWordTimer();
            };
            utterance.onboundary = (event: SpeechSynthesisEvent) => {
              if (event.name === 'word') {
                if (!usedRealEvents) {
                  usedRealEvents = true;
                  clearTimeout(AudioService.wordTimer);
                  AudioService.wordTimer = null;
                }
                options.onBoundary?.({
                  charIndex: event.charIndex,
                  charLength: (event as any).charLength ?? 0,
                });
              }
            };
            utterance.onend = () => {
              clearTimeout(AudioService.wordTimer);
              AudioService.wordTimer = null;
              // Calibración adaptativa: ajustar factor para próxima vez
              if (!usedRealEvents && estimatedTotalMs > 300 && timerStartTime > 0) {
                const actualMs = Date.now() - timerStartTime;
                // estimatedTotalMs / calibrationFactor = lo que hubiera sido con factor=1.0
                const baseEstimate = estimatedTotalMs / AudioService.calibrationFactor;
                if (baseEstimate > 0) {
                  const newFactor = actualMs / baseEstimate;
                  // Media móvil exponencial: 20% nuevo, 80% anterior (convergencia suave)
                  AudioService.calibrationFactor = 0.80 * AudioService.calibrationFactor + 0.20 * newFactor;
                  AudioService.calibrationFactor = Math.max(0.5, Math.min(1.6, AudioService.calibrationFactor));

                }
              }
              this.isSpeaking = false;
              options.onDone?.();
            };
            utterance.onerror = (e: any) => {
              clearInterval(AudioService.wordTimer);
              AudioService.wordTimer = null;
              if (e.error === 'interrupted' || e.error === 'canceled') {
                this.isSpeaking = false;
  
                return;
              }
              this.isSpeaking = false;

              options.onError?.(e);
            };

            synth.cancel();
            synth.speak(utterance);
            return;
          }
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

          this.isSpeaking = false;
          options.onError?.(e);
        },
        onBoundary: options.onBoundary,
      });
    } catch (error) {

      this.isSpeaking = false;
    }
  }

  static stop() {
    this.isSpeaking = false;
    if (this.wordTimer) { clearTimeout(this.wordTimer); this.wordTimer = null; }
    try {
      if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
        (window as any).speechSynthesis.cancel();
      }
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
