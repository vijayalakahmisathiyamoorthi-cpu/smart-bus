import { useState, useEffect, useCallback, useRef } from 'react';
import { BusData, ApiBusStatus, CrowdStatus } from '../types';
import { BACKEND_BASE_URL, API_ENDPOINT, POLLING_INTERVAL_MS, INITIAL_BUSES } from '../constants';

export type ConnectionState = 'LIVE' | 'OFFLINE' | 'CONNECTING';

export function useBusStatus() {
  const [buses, setBuses] = useState<BusData[]>(INITIAL_BUSES);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>('CONNECTING');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>('Waiting for live data...');
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  const [backendUrl, setBackendUrl] = useState<string>(BACKEND_BASE_URL);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const consecutiveFailuresRef = useRef<number>(0);

  const fetchBusStatus = useCallback(async () => {
    // If user explicitly chose local simulation mode in Admin for presentation
    if (isSimulated) {
      setConnectionStatus('LIVE');
      setErrorMessage(null);
      setLastSyncTime(new Date());
      return;
    }

    try {
      const targetUrl = `${backendUrl.replace(/\/$/, '')}${API_ENDPOINT}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setRawApiResponse(data);
      consecutiveFailuresRef.current = 0;
      setConnectionStatus('LIVE');
      setErrorMessage(null);
      setLastSyncTime(new Date());

      // Parse and safely map backend data directly to buses without altering logic
      if (Array.isArray(data)) {
        setBuses((prevBuses) => {
          return prevBuses.map((bus) => {
            const apiMatch = data.find(
              (item: ApiBusStatus) => 
                item.bus_id && 
                String(item.bus_id).trim().toUpperCase() === String(bus.busNumber).trim().toUpperCase()
            );

            if (apiMatch) {
              // Direct assignment from backend: do NOT calculate crowd percentage, do NOT override
              return {
                ...bus,
                status: (apiMatch.status as CrowdStatus) || bus.status,
                standing_count: typeof apiMatch.standing_count === 'number' 
                  ? apiMatch.standing_count 
                  : bus.standing_count,
                lastUpdated: 'Just now',
              };
            }
            return bus;
          });
        });
      }
    } catch (err: any) {
      consecutiveFailuresRef.current += 1;
      setConnectionStatus('OFFLINE');
      const msg = err.name === 'AbortError' 
        ? 'Connection timed out' 
        : 'Live connection unavailable';
      setErrorMessage(msg);
      // We do NOT crash. We keep the existing bus state and will retry automatically.
    }
  }, [backendUrl, isSimulated]);

  useEffect(() => {
    // Initial fetch
    fetchBusStatus();

    // Regular polling every 2 seconds
    const interval = setInterval(() => {
      fetchBusStatus();
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchBusStatus]);

  // Helper to simulate dynamic crowd shift for SIH demo if requested in Admin
  const simulateLiveEvent = useCallback((busId: string, status: CrowdStatus, standing: number) => {
    setBuses((prev) =>
      prev.map((b) => (b.busNumber === busId ? { ...b, status, standing_count: standing, lastUpdated: 'Just now' } : b))
    );
    setLastSyncTime(new Date());
  }, []);

  return {
    buses,
    connectionStatus,
    lastSyncTime,
    errorMessage,
    rawApiResponse,
    backendUrl,
    setBackendUrl,
    isSimulated,
    setIsSimulated,
    fetchBusStatus,
    simulateLiveEvent,
  };
}
