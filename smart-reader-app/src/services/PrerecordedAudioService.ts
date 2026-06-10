import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../constants/firebaseConfig';
import { AudioSlideData } from '../models/BookModels';

export class PrerecordedAudioService {
  private static audio: HTMLAudioElement | null = null;
  private static token: object | null = null;

  static isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof Audio !== 'undefined';
  }

  static stop() {
    this.token = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }

  static async play(
    slide: AudioSlideData,
    onBoundary: (charIndex: number, charLength: number) => void,
    onDone: () => void,
    startCharIndex = 0,
  ): Promise<void> {
    this.stop();
    const tok = {};
    this.token = tok;

    const url = await getDownloadURL(ref(storage, slide.audioPath));
    if (this.token !== tok) return; // fue cancelado durante la resolución de URL

    const audio = new Audio(url);
    this.audio = audio;

    // Si hay offset, buscar el timestamp de palabra más cercano y seekear
    const startWordIdx = startCharIndex > 0
      ? Math.max(0, slide.words.findIndex(w => w.charIndex >= startCharIndex))
      : 0;
    if (startWordIdx > 0) {
      audio.currentTime = slide.words[startWordIdx].time;
    }

    let wordIdx = startWordIdx;
    audio.addEventListener('timeupdate', () => {
      const ct = audio.currentTime;
      while (wordIdx < slide.words.length && slide.words[wordIdx].time <= ct) {
        onBoundary(slide.words[wordIdx].charIndex, slide.words[wordIdx].charLength);
        wordIdx++;
      }
    });

    const finish = () => {
      if (this.audio === audio) this.audio = null;
      onDone();
    };
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);

    try {
      await audio.play();
    } catch {
      if (this.audio === audio) this.audio = null;
      onDone();
    }
  }
}
