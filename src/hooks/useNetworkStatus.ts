import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  effectiveType?: string;
  downlink?: number;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } })?.connection;

    return {
      isOnline: online,
      isSlowConnection: conn ? ['slow-2g', '2g'].includes(conn.effectiveType || '') || (conn.downlink !== undefined && conn.downlink < 0.8) : false,
      effectiveType: conn?.effectiveType,
      downlink: conn?.downlink,
    };
  });

  useEffect(() => {
    const updateStatus = () => {
      const online = navigator.onLine;
      const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } })?.connection;
      const isSlow = conn ? ['slow-2g', '2g'].includes(conn.effectiveType || '') || (conn.downlink !== undefined && conn.downlink < 0.8) : false;

      setStatus({
        isOnline: online,
        isSlowConnection: isSlow,
        effectiveType: conn?.effectiveType,
        downlink: conn?.downlink,
      });
    };

    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();
    const handleConnectionChange = () => updateStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const conn = (navigator as unknown as { connection?: { addEventListener?: (type: string, listener: () => void) => void; removeEventListener?: (type: string, listener: () => void) => void } })?.connection;
    conn?.addEventListener?.('change', handleConnectionChange);

    // Poll for slow connection (some browsers don't fire change)
    const interval = setInterval(updateStatus, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      conn?.removeEventListener?.('change', handleConnectionChange);
      clearInterval(interval);
    };
  }, []);

  return status;
};
