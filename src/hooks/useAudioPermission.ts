import { useState, useEffect, useCallback } from 'react';

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export function useAudioPermission() {
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [isChecking, setIsChecking] = useState(true);

  const checkPermission = useCallback(async () => {
    setIsChecking(true);

    // Check if mediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermission('unsupported');
      setIsChecking(false);
      return;
    }

    // Try to check permission status via Permissions API
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({
          name: 'microphone' as PermissionName,
        });

        setPermission(result.state as PermissionState);

        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermission(result.state as PermissionState);
        });
      } catch {
        // Permissions API not supported for microphone in this browser
        // Default to 'prompt' state
        setPermission('prompt');
      }
    }

    setIsChecking(false);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach((track) => track.stop());
      setPermission('granted');
      return true;
    } catch (error) {
      setPermission('denied');
      return false;
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    permission,
    isChecking,
    requestPermission,
    checkPermission,
  };
}
