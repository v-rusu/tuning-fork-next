import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ToneGenerator,
  type WaveformType,
  type ToneGeneratorOptions,
} from '@/lib/tuner/tone-generator';

interface UseToneGeneratorState {
  isPlaying: boolean;
  frequency: number;
  waveform: WaveformType;
  volume: number;
}

export function useToneGenerator(initialOptions: ToneGeneratorOptions = {}) {
  const [state, setState] = useState<UseToneGeneratorState>({
    isPlaying: false,
    frequency: initialOptions.frequency ?? 440,
    waveform: initialOptions.waveform ?? 'sine',
    volume: initialOptions.volume ?? 0.5,
  });

  const generatorRef = useRef<ToneGenerator | null>(null);

  // Store initial options in a ref to avoid dependency issues
  const initialOptionsRef = useRef(initialOptions);

  // Initialize generator
  useEffect(() => {
    generatorRef.current = new ToneGenerator(initialOptionsRef.current);

    return () => {
      if (generatorRef.current) {
        generatorRef.current.dispose();
        generatorRef.current = null;
      }
    };
  }, []);

  const start = useCallback(async () => {
    if (!generatorRef.current) {
      generatorRef.current = new ToneGenerator({
        frequency: state.frequency,
        waveform: state.waveform,
        volume: state.volume,
      });
    }

    try {
      await generatorRef.current.start();
      setState((prev) => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Failed to start tone generator:', error);
    }
  }, [state.frequency, state.waveform, state.volume]);

  const stop = useCallback(() => {
    if (generatorRef.current) {
      generatorRef.current.stop();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const toggle = useCallback(async () => {
    if (state.isPlaying) {
      stop();
    } else {
      await start();
    }
  }, [state.isPlaying, start, stop]);

  const setFrequency = useCallback((frequency: number) => {
    setState((prev) => ({ ...prev, frequency }));
    if (generatorRef.current) {
      generatorRef.current.setFrequency(frequency);
    }
  }, []);

  const setWaveform = useCallback((waveform: WaveformType) => {
    setState((prev) => ({ ...prev, waveform }));
    if (generatorRef.current) {
      generatorRef.current.setWaveform(waveform);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setState((prev) => ({ ...prev, volume: clampedVolume }));
    if (generatorRef.current) {
      generatorRef.current.setVolume(clampedVolume);
    }
  }, []);

  // Play a specific frequency momentarily (for string buttons)
  const playFrequency = useCallback(
    async (frequency: number, duration: number = 2000) => {
      const wasPlaying = state.isPlaying;
      const previousFrequency = state.frequency;

      if (wasPlaying) {
        stop();
      }

      setFrequency(frequency);
      await start();

      // Auto-stop after duration unless user was already playing
      setTimeout(() => {
        if (!wasPlaying) {
          stop();
          setFrequency(previousFrequency);
        }
      }, duration);
    },
    [state.isPlaying, state.frequency, start, stop, setFrequency]
  );

  return {
    ...state,
    start,
    stop,
    toggle,
    setFrequency,
    setWaveform,
    setVolume,
    playFrequency,
  };
}
