import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiBusLocation } from '../types';
import { BACKEND_BASE_URL, BUS_LOCATIONS_ENDPOINT, POLLING_INTERVAL_MS } from '../constants';

export type LocationConnectionStatus = 'LIVE' | 'CONNECTING' | 'CONNECTION_LOST';

export interface BusCoordinates {
  latitude: number;
  longitude: number;
}

export function useBusLocations(backendUrl: string = BACKEND_BASE_URL) {
  const [locations, setLocations] = useState<Record<string, BusCoordinates>>({});
  const [locationStatus, setLocationStatus] = useState<LocationConnectionStatus>('CONNECTING');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [rawLocations, setRawLocations] = useState<ApiBusLocation[]>([]);
  const hasReceivedDataRef = useRef<boolean>(false);

  const fetchLocations = useCallback(async () => {
    try {
      const targetUrl = `${backendUrl.replace(/\/$/, '')}${BUS_LOCATIONS_ENDPOINT}`;
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
      
      if (Array.isArray(data) && data.length > 0) {
        const nextMap: Record<string, BusCoordinates> = {};
        
        data.forEach((item: ApiBusLocation) => {
          if (
            item &&
            item.bus_id &&
            typeof item.latitude === 'number' &&
            !isNaN(item.latitude) &&
            typeof item.longitude === 'number' &&
            !isNaN(item.longitude)
          ) {
            const key = String(item.bus_id).trim().toUpperCase();
            nextMap[key] = {
              latitude: item.latitude,
              longitude: item.longitude,
            };
          }
        });

        // Retain last known positions, updating with newly received positions
        setLocations((prev) => ({
          ...prev,
          ...nextMap,
        }));
        setRawLocations(data);
        hasReceivedDataRef.current = true;
        setLocationStatus('LIVE');
        setErrorMessage(null);
        setLastSyncTime(new Date());
      }
    } catch (err: any) {
      // If error occurs, do NOT clear last known positions
      // Show "Connection Lost"
      setLocationStatus('CONNECTION_LOST');
      const msg = err.name === 'AbortError' 
        ? 'Connection timed out' 
        : (err.message || 'Connection Lost');
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    // Initial fetch
    fetchLocations();

    // Polling every 2 seconds
    const interval = setInterval(() => {
      fetchLocations();
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchLocations]);

  return {
    locations,
    locationStatus,
    isLoading,
    errorMessage,
    lastSyncTime,
    rawLocations,
    hasReceivedData: hasReceivedDataRef.current,
    refetch: fetchLocations,
  };
}
