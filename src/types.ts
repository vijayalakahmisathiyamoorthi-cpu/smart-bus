export type CrowdStatus = 'Less Crowded' | 'Crowded' | 'Overcrowded';

export interface BusStop {
  name: string;
  time: string;
  passed: boolean;
  crowdEst?: CrowdStatus;
}

export interface BusData {
  id: string;
  bus_id: string;
  busNumber: string;
  source: string;
  destination: string;
  route: string;
  via: string;
  eta: string;
  etaMinutes: number;
  status: CrowdStatus;
  standing_count?: number;
  currentLocation: string;
  speed: string;
  lastUpdated: string;
  coordinates: [number, number]; // [lat, lng]
  cameraStatus: 'Online' | 'Degraded' | 'Offline';
  cameraFps: number;
  stops: BusStop[];
}

export interface ApiBusStatus {
  bus_id: string;
  standing_count?: number;
  status: string;
  [key: string]: any;
}

export interface ApiBusLocation {
  bus_id: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

export interface TransitAlert {
  id: string;
  busNumber?: string;
  title: string;
  message: string;
  type: 'crowd' | 'proximity' | 'system';
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
}

export type NavPage = 
  | 'home' 
  | 'live-map' 
  | 'all-routes' 
  | 'find-bus' 
  | 'ai-voice' 
  | 'bus-70a' 
  | 'alerts'
  | 'diagnostics'
  | 'admin';

export interface RouteFilterParams {
  from: string;
  to: string;
}
