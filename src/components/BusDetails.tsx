import React from 'react';
import { BusData, CrowdStatus } from '../types';
import { CrowdBadge } from './CrowdBadge';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Gauge, 
  Users, 
  ShieldCheck, 
  Radio, 
  ArrowLeft, 
  CheckCircle2, 
  Circle,
  Cpu,
  Video,
  ExternalLink
} from 'lucide-react';

interface BusDetailsProps {
  bus: BusData;
  onBack: () => void;
  onViewLiveLocation: (bus: BusData) => void;
  onOpenDiagnostics?: () => void;
}

export const BusDetails: React.FC<BusDetailsProps> = ({
  bus,
  onBack,
  onViewLiveLocation,
  onOpenDiagnostics,
}) => {
  const crowdLevels: Array<{ status: CrowdStatus; emoji: string; label: string; desc: string }> = [
    {
      status: 'Less Crowded',
      emoji: '🟢',
      label: 'LESS CROWDED',
      desc: 'Plenty of seating and standing space available',
    },
    {
      status: 'Crowded',
      emoji: '🟡',
      label: 'CROWDED',
      desc: 'Moderate standing room; limited empty seats',
    },
    {
      status: 'Overcrowded',
      emoji: '🔴',
      label: 'OVERCROWDED',
      desc: 'High density; recommended to wait for next bus',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 animate-in fade-in duration-200">
      
      {/* Top back navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-bus-details"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-teal-300 transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Buses</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>LIVE YOLO TELEMETRY</span>
        </div>
      </div>

      {/* Main Bus Header Card */}
      <div 
        id="bus-details-header"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-950/70 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border-2 border-teal-500/40 flex items-center justify-center text-teal-300 font-black text-2xl sm:text-3xl shrink-0 shadow-lg shadow-teal-500/10">
              {bus.busNumber}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                  Chennai Corridor Bus
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Node #{bus.busNumber}-YOLO
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                BUS {bus.busNumber}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium mt-0.5">
                {bus.route}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="btn-view-live-location"
              onClick={() => onViewLiveLocation(bus)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm shadow-md shadow-teal-500/25 transition-all active:scale-[0.98]"
            >
              <MapPin className="w-4 h-4 stroke-[2.5]" />
              <span>View Live Location</span>
            </button>
            {onOpenDiagnostics && (
              <button
                onClick={onOpenDiagnostics}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold px-4 py-3 rounded-xl text-xs border border-slate-700 transition-colors"
              >
                <Cpu className="w-4 h-4" />
                <span>AI Diagnostics</span>
              </button>
            )}
          </div>
        </div>

        {/* Via route information */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="text-slate-400">
            <span className="text-slate-500 font-medium">Via Corridor: </span>
            <span className="text-slate-200 font-medium">{bus.via}</span>
          </div>
          <div className="text-slate-400 font-mono text-xs">
            Last updated a few seconds ago
          </div>
        </div>
      </div>

      {/* Large Crowd-Status Visualization Section */}
      <div 
        id="large-crowd-visualization"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-950/70"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>AI Crowd Density Meter</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Computed directly via onboard edge YOLO camera model
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Standing Count: <span className="text-white font-bold text-sm">{bus.standing_count ?? 'N/A'}</span>
          </div>
        </div>

        {/* 3 Status Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crowdLevels.map((lvl) => {
            const isCurrent = bus.status === lvl.status;
            let cardTheme = 'bg-slate-950/60 border-slate-800/80 opacity-60';
            
            if (isCurrent) {
              if (lvl.status === 'Less Crowded') {
                cardTheme = 'bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/50 opacity-100';
              } else if (lvl.status === 'Crowded') {
                cardTheme = 'bg-amber-950/30 border-amber-500/60 ring-2 ring-amber-500/20 shadow-lg shadow-amber-950/50 opacity-100';
              } else {
                cardTheme = 'bg-rose-950/30 border-rose-500/60 ring-2 ring-rose-500/20 shadow-lg shadow-rose-950/50 opacity-100';
              }
            }

            return (
              <div
                key={lvl.status}
                className={`relative rounded-xl border p-5 transition-all ${cardTheme}`}
              >
                {isCurrent && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-slate-900/90 px-2 py-0.5 rounded border border-teal-500/30">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>Active Status</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xl font-bold mb-2">
                  <span>{lvl.emoji}</span>
                  <span className={isCurrent ? 'text-white font-extrabold' : 'text-slate-300'}>
                    {lvl.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lvl.desc}
                </p>

                {isCurrent && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold flex items-center justify-between text-slate-300">
                    <span>Passenger Advisory:</span>
                    <span className="text-teal-300">
                      {lvl.status === 'Less Crowded' && 'Recommended for Boarding'}
                      {lvl.status === 'Crowded' && 'Moderate Availability'}
                      {lvl.status === 'Overcrowded' && 'Wait for Next Bus'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Metrics 4-Pack */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>ETA to Your Stop</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{bus.eta}</div>
          <div className="text-[11px] text-teal-400 font-mono mt-1">On Schedule</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Current Location</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white truncate">{bus.currentLocation}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">GPS Fixed</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>Telemetry Speed</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{bus.speed}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Normal Traffic</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>YOLO Camera Node</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {bus.cameraFps} FPS
          </div>
          <div className="text-[11px] text-emerald-400/90 font-mono mt-1">Edge Inference OK</div>
        </div>
      </div>

      {/* Corridor Stops Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>Route Timeline & Stop Sequence</span>
        </h3>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {bus.stops.map((stop, index) => (
            <div key={index} className="relative flex items-center justify-between text-xs sm:text-sm">
              {/* Dot icon */}
              <div 
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                  stop.passed 
                    ? 'bg-teal-500 text-slate-950 ring-4 ring-slate-900' 
                    : 'bg-slate-800 text-slate-400 ring-4 ring-slate-900'
                }`}
              >
                {stop.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              <div className="space-y-0.5">
                <div className={`font-semibold ${stop.passed ? 'text-slate-300' : 'text-white font-bold'}`}>
                  {stop.name}
                  {stop.name === bus.currentLocation && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded">
                      Current Location
                    </span>
                  )}
                </div>
                <div className="text-slate-500 text-xs font-mono">{stop.time}</div>
              </div>

              <div>
                {stop.crowdEst ? (
                  <CrowdBadge status={stop.crowdEst} size="sm" showIcon={false} />
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">Predicted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
