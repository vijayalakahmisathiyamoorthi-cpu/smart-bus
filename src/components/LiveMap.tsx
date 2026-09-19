import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { BusData } from '../types';
import { CrowdBadge } from './CrowdBadge';
import { useBusLocations } from '../hooks/useBusLocations';
import { 
  MapPin, 
  Radio, 
  ArrowRight,
  Crosshair,
  Wifi,
  WifiOff,
  RotateCw,
  AlertCircle,
  Bus,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface LiveMapProps {
  buses: BusData[];
  selectedBusId?: string | null;
  onSelectBusDetails: (bus: BusData) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  buses,
  selectedBusId,
  onSelectBusDetails,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const polylineRef = useRef<L.Polyline | null>(null);

  // Poll live bus locations from backend GET /bus-locations every 2 seconds
  const {
    locations,
    locationStatus,
    isLoading,
    errorMessage,
    lastSyncTime,
    hasReceivedData,
    refetch,
  } = useBusLocations();

  const [activeBusId, setActiveBusId] = useState<string>(
    selectedBusId || buses[0]?.busNumber || '70A'
  );

  // Combined active bus with real-time crowd status and live GPS coordinates
  const activeBus = useMemo(() => {
    return buses.find((b) => b.busNumber === activeBusId) || buses[0] || null;
  }, [buses, activeBusId]);

  // Build HTML content for Leaflet popups showing the bus number prominently
  const buildPopupHtml = (bus: BusData, coords: [number, number], sourceTag: string) => {
    let ringColor = '#10b981';
    if (bus.status === 'Crowded') ringColor = '#f59e0b';
    if (bus.status === 'Overcrowded') ringColor = '#f43f5e';

    return `
      <div style="padding: 14px; min-width: 230px; font-family: sans-serif; background: #0f172a; border-radius: 12px; color: #f1f5f9;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="font-size: 16px; font-weight: 900; color: white; letter-spacing: 0.02em;">
            BUS ${bus.busNumber}
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #2dd4bf; background: #134e4a; padding: 2px 8px; border-radius: 6px; text-transform: uppercase;">
            ${sourceTag}
          </div>
        </div>

        <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">
          <strong style="color: #94a3b8;">Route:</strong> ${bus.route}
        </div>

        <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-bottom: 8px; background: #020617; padding: 4px 8px; border-radius: 6px; border: 1px solid #1e293b;">
          GPS: ${coords[0].toFixed(4)}°N, ${coords[1].toFixed(4)}°E
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding: 6px 8px; background: #020617; border-radius: 6px; margin-bottom: 10px;">
          <span style="color: #94a3b8;">Crowd Status:</span>
          <span style="font-weight: 800; color: ${ringColor};">${bus.status}</span>
        </div>

        ${typeof bus.standing_count === 'number' ? `
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>Standing Count:</span>
            <strong style="color: white;">${bus.standing_count} passengers</strong>
          </div>
        ` : ''}

        <button 
          id="map-popup-btn-${bus.busNumber}"
          style="
            width: 100%;
            padding: 8px 12px;
            background: #14b8a6;
            color: #020617;
            border: none;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            transition: background 0.15s ease;
          "
        >
          View Bus Details →
        </button>
      </div>
    `;
  };

  // Helper to create custom bus marker icon
  const createMarkerIcon = (busNumber: string, status: string) => {
    let ringColor = '#10b981';
    if (status === 'Crowded') ringColor = '#f59e0b';
    if (status === 'Overcrowded') ringColor = '#f43f5e';

    return L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="
            width: 42px;
            height: 42px;
            background-color: #020617;
            border: 2.5px solid ${ringColor};
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 16px ${ringColor}77;
            font-family: monospace;
            font-weight: 900;
            font-size: 11px;
            color: white;
            transition: transform 0.2s ease;
          ">
            <span style="font-size: 8px; font-weight: 800; color: ${ringColor}; line-height: 1;">BUS</span>
            <span style="letter-spacing: -0.5px;">${busNumber}</span>
          </div>
          <div style="
            position: absolute;
            bottom: -5px;
            width: 7px;
            height: 7px;
            background-color: ${ringColor};
            border-radius: 50%;
            box-shadow: 0 0 6px ${ringColor};
          "></div>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22],
    });
  };

  // 1. Initialize Leaflet Map with OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Chennai Corridors
      const initialCenter: [number, number] = [13.0750, 80.2200];
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 12,
        zoomControl: false,
      });

      // Zoom controls in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tile Layer as required
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Chennai Transit Corridor guideline polyline
      const routeCoords: [number, number][] = [
        [13.1147, 80.1009], // Avadi
        [13.0903, 80.1466], // Ambattur
        [13.1075, 80.2057], // Villivakkam
        [13.0850, 80.2100], // Anna Nagar
        [13.0827, 80.2707], // Central / Broadway
      ];

      polylineRef.current = L.polyline(routeCoords, {
        color: '#0d9488',
        weight: 3,
        opacity: 0.7,
        dashArray: '6, 8',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Handle responsive container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 2. Automatically update marker positions when API response changes
  // Uses backend location data as source of truth without reloading page
  // Keeps last known positions if connection is temporarily lost
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    buses.forEach((bus) => {
      const busId = bus.busNumber;
      const apiLoc = locations[busId.toUpperCase()];

      // Priority: 1. Live API location from /bus-locations -> 2. Initial bus fallback coordinates
      const coords: [number, number] = apiLoc 
        ? [apiLoc.latitude, apiLoc.longitude] 
        : bus.coordinates;

      const sourceTag = apiLoc ? 'Live GPS' : (hasReceivedData ? 'Last Known' : 'Initial');

      if (markersRef.current[busId]) {
        // Marker exists: update position smoothly
        const marker = markersRef.current[busId];
        const currentLatLng = marker.getLatLng();

        // Only update if coordinates actually changed
        if (currentLatLng.lat !== coords[0] || currentLatLng.lng !== coords[1]) {
          marker.setLatLng(coords);
        }

        // Update popup content with latest details and coordinates
        marker.setPopupContent(buildPopupHtml(bus, coords, sourceTag));
        // Update icon in case crowd status changed
        marker.setIcon(createMarkerIcon(bus.busNumber, bus.status));
      } else {
        // Create new marker on map
        const icon = createMarkerIcon(bus.busNumber, bus.status);
        const marker = L.marker(coords, { icon }).addTo(map);

        marker.bindPopup(buildPopupHtml(bus, coords, sourceTag));

        marker.on('click', () => {
          setActiveBusId(bus.busNumber);
        });

        marker.on('popupopen', () => {
          setActiveBusId(bus.busNumber);
          const btn = document.getElementById(`map-popup-btn-${bus.busNumber}`);
          if (btn) {
            btn.onclick = () => onSelectBusDetails(bus);
          }
        });

        markersRef.current[busId] = marker;
      }
    });

    // Check if any specific bus was selected via prop
    if (selectedBusId && markersRef.current[selectedBusId]) {
      const targetMarker = markersRef.current[selectedBusId];
      map.setView(targetMarker.getLatLng(), 14, { animate: true });
      targetMarker.openPopup();
      setActiveBusId(selectedBusId);
    }
  }, [buses, locations, selectedBusId, hasReceivedData, onSelectBusDetails]);

  // Center on a specific bus
  const focusBus = (bus: BusData) => {
    setActiveBusId(bus.busNumber);
    const map = mapInstanceRef.current;
    const marker = markersRef.current[bus.busNumber];
    if (map && marker) {
      map.setView(marker.getLatLng(), 14, { animate: true });
      marker.openPopup();
    }
  };

  // Center whole corridor
  const centerChennai = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([13.0750, 80.2200], 12, { animate: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-400" />
            <span>Chennai Corridor Live Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Real-time OpenStreetMap tracking powered by backend <code className="text-teal-300 font-mono text-xs">/bus-locations</code> API
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>🟢 Less Crowded</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>🟡 Crowded</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>🔴 Overcrowded</span>
          </span>
        </div>
      </div>

      {/* Main Map Canvas and Bus Selection Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[580px] sm:h-[640px]">
        
        {/* Interactive Map (Leaflet + OpenStreetMap) */}
        <div className="lg:col-span-8 xl:col-span-9 h-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Top-Left: Map Overlay Controls */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
            <button
              onClick={centerChennai}
              className="flex items-center gap-1.5 bg-slate-950/90 hover:bg-slate-900 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg backdrop-blur-md transition-colors"
              title="Reset map view to Chennai corridor"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Reset Center</span>
            </button>

            {/* LIVE Telemetry Count */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/90 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg backdrop-blur-md font-mono">
              <Bus className="w-3.5 h-3.5 text-teal-400" />
              <span>{buses.length} Buses Tracked</span>
            </div>
          </div>

          {/* Top-Right: Requirement 5 & 12 & 13 - Small LIVE Indicator / Connection Status */}
          <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
            {locationStatus === 'LIVE' ? (
              <div 
                id="live-map-status-indicator"
                className="flex items-center gap-2 bg-slate-950/90 border border-teal-500/50 text-teal-300 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md text-xs font-mono"
              >
                <div className="relative flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping absolute" />
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                </div>
                <span className="font-extrabold tracking-wider text-teal-200">● LIVE</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">• 2s GPS Sync</span>
              </div>
            ) : locationStatus === 'CONNECTION_LOST' ? (
              <div 
                id="live-map-status-indicator"
                className="flex items-center gap-2 bg-slate-950/95 border border-rose-500/60 text-rose-300 px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md text-xs font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="font-extrabold">● Connection Lost</span>
                <button
                  onClick={refetch}
                  className="inline-flex items-center gap-1 text-[11px] text-teal-300 hover:text-white underline ml-1 font-sans"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            ) : (
              <div 
                id="live-map-status-indicator"
                className="flex items-center gap-2 bg-slate-950/90 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md text-xs font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Connecting GPS...</span>
              </div>
            )}

            {/* Notice when showing preserved last known positions */}
            {locationStatus === 'CONNECTION_LOST' && (
              <div className="bg-slate-950/90 text-amber-300/90 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-amber-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Showing last known positions</span>
              </div>
            )}
          </div>

          {/* Bottom-Left: Live Map Attribution & Last Updated info */}
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden md:block">
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <Navigation className="w-3 h-3 text-teal-400" />
              <span>OpenStreetMap Engine</span>
              {lastSyncTime && (
                <span>• Synced: {lastSyncTime.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Bus Selector & Active Card */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>Select Bus to Track</span>
            <span className="text-teal-400 font-mono text-[11px]">
              {locationStatus === 'LIVE' ? 'GPS Active' : 'Cached GPS'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {buses.map((b) => {
              const isSelected = activeBus?.busNumber === b.busNumber;
              const liveCoord = locations[b.busNumber.toUpperCase()];
              const currentLat = liveCoord ? liveCoord.latitude : b.coordinates[0];
              const currentLng = liveCoord ? liveCoord.longitude : b.coordinates[1];

              return (
                <div
                  key={b.id}
                  id={`map-bus-selector-${b.busNumber}`}
                  onClick={() => focusBus(b)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-500/60 shadow-md shadow-teal-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">
                        BUS {b.busNumber}
                      </span>
                      {liveCoord ? (
                        <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-500/30">
                          LIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          CACHED
                        </span>
                      )}
                    </div>
                    <CrowdBadge status={b.status} size="sm" />
                  </div>

                  <div className="text-xs text-slate-300 truncate mb-1">
                    {b.route}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>GPS: <strong className="text-slate-200">{currentLat.toFixed(3)}, {currentLng.toFixed(3)}</strong></span>
                    {typeof b.standing_count === 'number' && (
                      <span>Standing: <strong className="text-white">{b.standing_count}</strong></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Bus Quick Action */}
          {activeBus && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-teal-500/30 shadow-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Tracking on Map:</span>
                <span className="font-bold text-white font-mono">BUS {activeBus.busNumber}</span>
              </div>
              <button
                id="btn-map-active-bus-details"
                onClick={() => onSelectBusDetails(activeBus)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition-colors shadow-sm"
              >
                <span>View Full Bus Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
