import { useState, useCallback, useRef, useEffect } from 'react';

export interface TunerResult {
  note: string;
  octave: number;
  frequency: number;
  cents: number;
  timestamp: number;
}

export interface TunerState {
  isListening: boolean;
  hasPermission: boolean | null;
  error: string | null;
  currentPitch: TunerResult | null;
}

interface UseTunerOptions {
  minDecibels?: number;
  maxDecibels?: number;
  smoothingTimeConstant?: number;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function frequencyToNote(
  frequency: number,
  referenceA4: number = 440
): { note: string; octave: number; cents: number } {
  // Calculate semitones from A4
  const semitonesFromA4 = 12 * Math.log2(frequency / referenceA4);
  const roundedSemitones = Math.round(semitonesFromA4);

  // Calculate cents (deviation from nearest note)
  const cents = Math.round((semitonesFromA4 - roundedSemitones) * 100);

  // A4 is the 9th note (index 9) in octave 4
  const noteIndex = (roundedSemitones + 9 + 120) % 12;
  const octave = 4 + Math.floor((roundedSemitones + 9) / 12);

  return {
    note: NOTE_NAMES[noteIndex],
    octave,
    cents,
  };
}

export function useTuner(options: UseTunerOptions = {}) {
  const {
    minDecibels = -100,
    maxDecibels = -10,
    smoothingTimeConstant = 0.85,
  } = options;

  const [state, setState] = useState<TunerState>({
    isListening: false,
    hasPermission: null,
    error: null,
    currentPitch: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const referenceA4Ref = useRef<number>(440);

  const detectPitch = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);

    // Autocorrelation pitch detection
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const minPeriod = Math.floor(sampleRate / 1200); // Max freq ~1200 Hz
    const maxPeriod = Math.floor(sampleRate / 50); // Min freq ~50 Hz

    let bestCorrelation = 0;
    let bestPeriod = 0;

    // Check if there's enough signal
    let rms = 0;
    for (let i = 0; i < bufferLength; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / bufferLength);

    if (rms < 0.001) {
      // No significant signal
      setState((prev) => ({ ...prev, currentPitch: null }));
      animationFrameRef.current = requestAnimationFrame(detectPitch);
      return;
    }

    // Normalized autocorrelation for better pitch detection
    // First, find the first zero crossing to avoid detecting the DC component
    let firstZeroCrossing = 0;
    for (let i = 1; i < bufferLength; i++) {
      if (buffer[i - 1] < 0 && buffer[i] >= 0) {
        firstZeroCrossing = i;
        break;
      }
    }

    // Autocorrelation with normalization
    for (let period = Math.max(minPeriod, firstZeroCrossing); period <= maxPeriod; period++) {
      let correlation = 0;
      let norm1 = 0;
      let norm2 = 0;

      for (let i = 0; i < bufferLength - period; i++) {
        correlation += buffer[i] * buffer[i + period];
        norm1 += buffer[i] * buffer[i];
        norm2 += buffer[i + period] * buffer[i + period];
      }

      // Normalize the correlation
      const normFactor = Math.sqrt(norm1 * norm2);
      if (normFactor > 0) {
        correlation /= normFactor;
      }

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    if (bestCorrelation > 0.5 && bestPeriod > 0) {
      const frequency = sampleRate / bestPeriod;

      // Filter out unrealistic frequencies
      if (frequency >= 50 && frequency <= 1200) {
        const { note, octave, cents } = frequencyToNote(
          frequency,
          referenceA4Ref.current
        );

        setState((prev) => ({
          ...prev,
          currentPitch: {
            note,
            octave,
            frequency,
            cents,
            timestamp: Date.now(),
          },
        }));
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  }, []);

  const startListening = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone not supported in this browser');
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      mediaStreamRef.current = stream;

      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('AudioContext not supported');
      }

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      // Resume audio context (required on iOS after user gesture)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyser.minDecibels = minDecibels;
      analyser.maxDecibels = maxDecibels;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setState((prev) => ({
        ...prev,
        isListening: true,
        hasPermission: true,
      }));

      // Start pitch detection
      detectPitch();
    } catch (error) {
      console.error('Microphone error:', error);

      let errorMessage = 'Failed to access microphone';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Microphone permission denied';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = 'No microphone found';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = 'Microphone is in use by another app';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Microphone constraints not satisfied';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'HTTPS required for microphone access';
        } else {
          errorMessage = error.message;
        }
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        hasPermission: false,
      }));
    }
  }, [minDecibels, maxDecibels, smoothingTimeConstant, detectPitch]);

  const stopListening = useCallback(() => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;

    setState((prev) => ({
      ...prev,
      isListening: false,
      currentPitch: null,
    }));
  }, []);

  const setReferenceFrequency = useCallback((frequency: number) => {
    referenceA4Ref.current = frequency;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    setReferenceFrequency,
  };
}
