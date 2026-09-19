import React, { useState } from 'react';
import { BusData, CrowdStatus } from '../types';
import { CrowdBadge } from './CrowdBadge';
import { ConnectionState } from '../hooks/useBusStatus';
import { 
  SlidersHorizontal, 
  Activity, 
  Video, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  RefreshCw, 
  ExternalLink,
  Code,
  Sparkles,
  Radio
} from 'lucide-react';

interface AdminViewProps {
  buses: BusData[];
  connectionStatus: ConnectionState;
  lastSyncTime: Date | null;
  errorMessage: string | null;
  rawApiResponse: any;
  backendUrl: string;
  onUpdateBackendUrl: (url: string) => void;
  onRefresh: () => void;
  isSimulated: boolean;
  onToggleSimulated: (val: boolean) => void;
  onSimulateEvent: (busId: string, status: CrowdStatus, standing: number) => void;
  onSelectBusDetails: (bus: BusData) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  buses,
  connectionStatus,
  lastSyncTime,
  errorMessage,
  rawApiResponse,
  backendUrl,
  onUpdateBackendUrl,
  onRefresh,
  isSimulated,
  onToggleSimulated,
  onSimulateEvent,
  onSelectBusDetails,
}) => {
  const [urlInput, setUrlInput] = useState(backendUrl);
  const [showJson, setShowJson] = useState(false);

  const activeBusesCount = buses.length;
  const connectedCamerasCount = buses.filter((b) => b.cameraStatus === 'Online').length;
  const crowdedBusesCount = buses.filter((b) => b.status === 'Crowded').length;
  const overcrowdedBusesCount = buses.filter((b) => b.status === 'Overcrowded').length;

  const handleUrlSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBackendUrl(urlInput);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span>Transit Authority Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin & Fleet Telemetry Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Real-time status of connected bus cameras, YOLO edge instances, and FastAPI server link
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            <span>Poll /all-bus-status</span>
          </button>
        </div>
      </div>

      {/* 5 Core Admin Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Active Buses */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Active Buses
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {activeBusesCount}
          </div>
          <div className="text-[11px] text-teal-400 font-mono mt-1">From API Telemetry</div>
        </div>

        {/* 2. Crowded Buses */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Crowded Buses
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {crowdedBusesCount}
          </div>
          <div className="text-[11px] text-amber-400/80 font-mono mt-1">🟡 Moderate Crowd</div>
        </div>

        {/* 3. Overcrowded Buses */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Overcrowded Buses
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {overcrowdedBusesCount}
          </div>
          <div className="text-[11px] text-rose-400/80 font-mono mt-1">🔴 High Congestion</div>
        </div>

        {/* 4. API Connection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            API Connection
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${connectionStatus === 'LIVE' ? 'bg-teal-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {connectionStatus}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
            {connectionStatus === 'LIVE' ? 'FastAPI 2s poll OK' : (errorMessage || 'Waiting...')}
          </div>
        </div>

        {/* 5. YOLO Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            YOLO Status
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${connectionStatus === 'LIVE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono">
              {connectionStatus === 'LIVE' ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400/80 font-mono mt-1">Edge Crowd Inference</div>
        </div>
      </div>

      {/* Bus Monitoring Table */}
      <div 
        id="admin-bus-monitoring-table"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Bus Monitoring Table</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Last Synced: {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Bus</th>
                <th className="py-3.5 px-4">Camera</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Standing</th>
                <th className="py-3.5 px-4">Last Update</th>
                <th className="py-3.5 px-4 text-right">Quick Demo Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {buses.map((b) => (
                <tr key={b.busNumber} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">
                    BUS {b.busNumber}
                    <div className="text-[11px] text-slate-400 font-normal">{b.route}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{b.cameraStatus}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <CrowdBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {b.standing_count ?? 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                    {b.lastUpdated}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {/* Demo triggers for Hackathon presentation */}
                    <button
                      onClick={() => onSimulateEvent(b.busNumber, 'Less Crowded', 3)}
                      className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 text-[10px] font-bold"
                    >
                      Less
                    </button>
                    <button
                      onClick={() => onSimulateEvent(b.busNumber, 'Crowded', 11)}
                      className="px-2 py-1 rounded bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-500/30 text-[10px] font-bold"
                    >
                      Crowded
                    </button>
                    <button
                      onClick={() => onSimulateEvent(b.busNumber, 'Overcrowded', 19)}
                      className="px-2 py-1 rounded bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-500/30 text-[10px] font-bold"
                    >
                      Over
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend API Configuration & Debugging */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-400" />
          <span>Real-Time Backend API Endpoint Configuration</span>
        </h3>

        <form onSubmit={handleUrlSave} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              FASTAPI SERVER BASE URL (Polls /all-bus-status every 2 seconds):
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white focus:border-teal-400"
              placeholder="https://canned-fondly-womanhood.ngrok-free.dev"
            />
          </div>
          <div className="sm:self-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Update URL
            </button>
          </div>
        </form>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="space-y-1">
            <div>Crowd Status: <code className="text-teal-300 font-mono">{backendUrl}/all-bus-status</code></div>
            <div>Bus Locations: <code className="text-cyan-300 font-mono">{backendUrl}/bus-locations</code></div>
          </div>
          <button
            onClick={() => setShowJson(!showJson)}
            className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showJson ? 'Hide Raw API JSON' : 'Inspect Raw API JSON'}</span>
          </button>
        </div>

        {showJson && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300 max-h-60 overflow-y-auto">
            <pre>{JSON.stringify(rawApiResponse || { notice: 'No active payload received from remote tunnel yet. Retrying every 2s.' }, null, 2)}</pre>
          </div>
        )}
      </div>

    </div>
  );
};
