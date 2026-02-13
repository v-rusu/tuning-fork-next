export type WaveformType = 'sine' | 'triangle' | 'sawtooth' | 'square';

export interface ToneGeneratorOptions {
  frequency?: number;
  waveform?: WaveformType;
  volume?: number;
}

export class ToneGenerator {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  private frequency = 440;
  private waveform: WaveformType = 'sine';
  private volume = 0.5;

  constructor(options: ToneGeneratorOptions = {}) {
    this.frequency = options.frequency ?? 440;
    this.waveform = options.waveform ?? 'sine';
    this.volume = options.volume ?? 0.5;
  }

  private initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  async start(): Promise<void> {
    if (this.isPlaying) return;

    this.initAudioContext();

    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    // Resume audio context if suspended (required for some browsers)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create oscillator
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = this.waveform;
    this.oscillator.frequency.setValueAtTime(
      this.frequency,
      this.audioContext.currentTime
    );

    // Create gain node for volume control
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // Start with fade in to avoid clicks
    this.oscillator.start();
    this.gainNode.gain.linearRampToValueAtTime(
      this.volume,
      this.audioContext.currentTime + 0.05
    );

    this.isPlaying = true;
  }

  stop(): void {
    if (!this.isPlaying || !this.audioContext || !this.gainNode) return;

    // Fade out to avoid clicks
    this.gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + 0.05
    );

    // Stop oscillator after fade out
    setTimeout(() => {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    }, 60);

    this.isPlaying = false;
  }

  setFrequency(frequency: number): void {
    this.frequency = frequency;
    if (this.oscillator && this.audioContext) {
      this.oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
    }
  }

  setWaveform(waveform: WaveformType): void {
    this.waveform = waveform;
    if (this.oscillator) {
      this.oscillator.type = waveform;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(
        this.volume,
        this.audioContext.currentTime
      );
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getFrequency(): number {
    return this.frequency;
  }

  getWaveform(): WaveformType {
    return this.waveform;
  }

  getVolume(): number {
    return this.volume;
  }

  dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Play a single tone for a specified duration
export async function playTone(
  frequency: number,
  duration: number = 1000,
  options: Omit<ToneGeneratorOptions, 'frequency'> = {}
): Promise<void> {
  const generator = new ToneGenerator({ ...options, frequency });
  await generator.start();
  return new Promise((resolve) => {
    setTimeout(() => {
      generator.stop();
      setTimeout(() => {
        generator.dispose();
        resolve();
      }, 100);
    }, duration);
  });
}
