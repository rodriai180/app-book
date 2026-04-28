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
  sentencePause?: number;
}

export class AudioService {
  private static isSpeaking = false;
  private static voicesCache: Speech.Voice[] = [];
  private static wordTimer: any = null;
  private static boundaryTimers: any[] = [];
  // Factor de calibración adaptativa: ajusta el timer según velocidad real de la voz
  // < 1.0 = acelerar timer (voz más rápida que estimado), > 1.0 = frenar timer
  private static calibrationFactor = 1.0;

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
            const rate = options.rate ?? 1.0;

            const pickBestWebVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
              const prefix = lang.split('-')[0].toLowerCase();
              const candidates = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
              if (!candidates.length) return undefined;
              const scored = candidates.map(v => {
                const name = v.name.toLowerCase();
                let score = 0;
                if (name.includes('google')) score += 40;
                if (!v.localService) score += 20;
                if (name.includes('natural') || name.includes('neural') || name.includes('enhanced')) score += 25;
                if (name.includes('microsoft') && (name.includes('online') || name.includes('natural'))) score += 30;
                if (v.lang.toLowerCase() === lang.toLowerCase()) score += 10;
                if (name.includes('compact')) score -= 10;
                return { v, score };
              });
              scored.sort((a, b) => b.score - a.score);
              return scored[0].v;
            };

            // Split text into sentences keeping their exact start offset in cleanText
            type Sentence = { text: string; offset: number };
            const splitSentences = (text: string): Sentence[] => {
              const result: Sentence[] = [];
              const re = /[^.!?]*[.!?]+\s*/g;
              let m: RegExpExecArray | null;
              while ((m = re.exec(text)) !== null) {
                const trimmed = m[0].trimEnd();
                if (trimmed.length > 0) result.push({ text: trimmed, offset: m.index });
              }
              const tail = text.slice(re.lastIndex).trim();
              if (tail.length > 0) result.push({ text: tail, offset: re.lastIndex });
              return result;
            };

            const sentences = splitSentences(cleanText);
            if (sentences.length === 0) { options.onDone?.(); return; }

            let bestVoice = pickBestWebVoice(synth.getVoices());
            if (!bestVoice) {
              synth.addEventListener('voiceschanged', () => {
                bestVoice = pickBestWebVoice(synth.getVoices());
              }, { once: true } as any);
            }

            const msPerChar = (72 / rate) * AudioService.calibrationFactor;
            const boundaryDelay = Math.round(110 / Math.max(0.5, rate));
            // Explicit pause injected between sentences (ms) — this is what guarantees
            // punctuation pauses regardless of voice behaviour
            const sentencePauseMs = options.sentencePause !== undefined
              ? options.sentencePause
              : Math.round(420 / rate);

            let sentIdx = 0;
            let doneFired = false;  // guard against Chrome firing onend twice

            const speakSentence = () => {
              if (sentIdx >= sentences.length) {
                if (!doneFired) {
                  doneFired = true;
                  this.isSpeaking = false;
                  options.onDone?.();
                }
                return;
              }

              const { text: sentText, offset: sentOffset } = sentences[sentIdx];
              const utt = new SpeechSynthesisUtterance(sentText);
              utt.lang = lang;
              utt.rate = rate;
              utt.pitch = 1.0;
              if (bestVoice) utt.voice = bestVoice;

              // Word-timer fallback (for voices that don't fire onboundary)
              const sentWords = sentText.split(/\s+/).filter(w => w.length > 0);
              const sentOffsets: number[] = [];
              let sp = 0;
              for (const w of sentWords) {
                const idx = sentText.indexOf(w, sp);
                sentOffsets.push(idx >= 0 ? idx : sp);
                sp = (idx >= 0 ? idx : sp) + w.length;
              }
              let usedRealEvents = false;

              const startSentenceTimer = () => {
                const wordAbsMs: number[] = [];
                let cumMs = 0;
                for (let i = 0; i < sentWords.length; i++) {
                  wordAbsMs.push(cumMs);
                  let ms = Math.max(60, sentWords[i].length * msPerChar);
                  const tail = sentWords[i][sentWords[i].length - 1];
                  if (/[.!?]/.test(tail))    ms += 650 / rate;
                  else if (/[;]/.test(tail))  ms += 450 / rate;
                  else if (/[,:]/.test(tail)) ms += 300 / rate;
                  cumMs += ms;
                }
                let wIdx = 0;
                const startTime = Date.now();
                const scheduleNext = () => {
                  if (usedRealEvents || wIdx >= sentWords.length) return;
                  options.onBoundary?.({ charIndex: sentOffset + sentOffsets[wIdx], charLength: sentWords[wIdx].length });
                  wIdx++;
                  if (wIdx >= sentWords.length) return;
                  const elapsed = Date.now() - startTime;
                  AudioService.wordTimer = setTimeout(scheduleNext, Math.max(10, wordAbsMs[wIdx] - elapsed));
                };
                scheduleNext();
              };

              utt.onstart = () => {
                if (sentIdx === 0) options.onStart?.();
                if (options.onBoundary) startSentenceTimer();
              };

              utt.onboundary = (event: SpeechSynthesisEvent) => {
                if (event.name === 'word') {
                  if (!usedRealEvents) {
                    usedRealEvents = true;
                    clearTimeout(AudioService.wordTimer);
                    AudioService.wordTimer = null;
                  }
                  const ci = sentOffset + event.charIndex;
                  const cl = (event as any).charLength ?? 0;
                  const t = setTimeout(() => options.onBoundary?.({ charIndex: ci, charLength: cl }), boundaryDelay);
                  AudioService.boundaryTimers.push(t);
                }
              };

              let endFired = false;  // guard: Chrome sometimes fires onend twice per utterance
              utt.onend = () => {
                if (endFired) return;
                endFired = true;
                clearTimeout(AudioService.wordTimer);
                AudioService.wordTimer = null;
                sentIdx++;
                // Explicit pause before next sentence
                AudioService.wordTimer = setTimeout(speakSentence, sentencePauseMs);
              };

              utt.onerror = (e: any) => {
                clearTimeout(AudioService.wordTimer);
                AudioService.wordTimer = null;
                if (e.error === 'interrupted' || e.error === 'canceled') {
                  this.isSpeaking = false;
                  return;
                }
                this.isSpeaking = false;
                options.onError?.(e);
              };

              synth.speak(utt);
            };

            // Only cancel if something is actually playing — calling cancel() on an
            // idle synth triggers a Chrome bug that speaks the next utterance twice.
            if (synth.speaking || synth.pending) {
              synth.cancel();
              setTimeout(() => speakSentence(), 50);
            } else {
              speakSentence();
            }
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
    this.boundaryTimers.forEach(t => clearTimeout(t));
    this.boundaryTimers = [];
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
