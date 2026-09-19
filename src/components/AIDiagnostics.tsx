import React, { useState } from 'react';
import { BusData } from '../types';
import { CrowdBadge } from './CrowdBadge';
import { 
  Cpu, 
  Video, 
  Users, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  Zap,
  Lock
} from 'lucide-react';

interface AIDiagnosticsProps {
  buses: BusData[];
  onSelectBusDetails: (bus: BusData) => void;
}

export const AIDiagnostics: React.FC<AIDiagnosticsProps> = ({
  buses,
  onSelectBusDetails,
}) => {
  const [selectedBusNumber, setSelectedBusNumber] = useState('70A');
  const bus = buses.find((b) => b.busNumber === selectedBusNumber) || buses[0];

  // Synthetic bounding boxes for the simulated bus interior preview
  const boundingBoxes = [
    { id: 1, top: '22%', left: '26%', w: '18%', h: '38%', label: 'person: 0.96', tag: 'standing' },
    { id: 2, top: '28%', left: '44%', w: '16%', h: '35%', label: 'person: 0.92', tag: 'standing' },
    { id: 3, top: '24%', left: '60%', w: '17%', h: '40%', label: 'person: 0.89', tag: 'standing' },
    { id: 4, top: '35%', left: '12%', w: '15%', h: '30%', label: 'person: 0.94', tag: 'seated' },
    { id: 5, top: '38%', left: '76%', w: '15%', h: '28%', label: 'person: 0.91', tag: 'seated' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edge Computer Vision Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Crowd AI Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Real-time inference telemetry from onboard YOLO vision modules
          </p>
        </div>

        {/* Bus Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Select Unit:</span>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {buses.map((b) => (
              <button
                key={b.busNumber}
                onClick={() => setSelectedBusNumber(b.busNumber)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedBusNumber === b.busNumber
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b.busNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Privacy Banner */}
      <div className="bg-slate-900/90 border border-teal-500/40 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Passenger Privacy & Zero-Footage Transmission Guarantee</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              <Lock className="w-2.5 h-2.5" /> PRIVACY SAFE
            </span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Onboard YOLO cameras run edge inference and never transmit raw footage or passenger photos.
            The embedded hardware processes video in memory, extracts anonymized crowd counts and status,
            and only transmits numerical telemetry via JSON to the transit server.
          </p>
        </div>
      </div>

      {/* Top 6 Diagnostic Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* 1. YOLO Detection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>YOLO Model</span>
          </div>
          <div className="text-sm font-bold text-white">YOLOv8-Transit</div>
          <div className="text-[10px] text-teal-400 font-mono mt-1">Edge Nano FP16</div>
        </div>

        {/* 2. Camera Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Camera Status</span>
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{bus.cameraStatus}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">{bus.cameraFps} FPS Stream</div>
        </div>

        {/* 3. People Detection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>People Detect</span>
          </div>
          <div className="text-sm font-bold text-white">
            {(bus.standing_count ?? 11) + 18} Detected
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1">18 Seated</div>
        </div>

        {/* 4. Standing Count */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Standing Count</span>
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            {bus.standing_count ?? 'N/A'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Aisle Space Occupied</div>
        </div>

        {/* 5. Crowd Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Crowd Status
          </div>
          <div className="mt-1">
            <CrowdBadge status={bus.status} size="sm" />
          </div>
        </div>

        {/* 6. Last Frame Update */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span>Frame Update</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">42 ms</div>
          <div className="text-[10px] text-teal-400 font-mono mt-1">Latency OK</div>
        </div>

      </div>

      {/* Simulated Camera-Analysis Panel Clearly Labeled as "AI Detection Preview" */}
      <div 
        id="simulated-camera-panel"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>AI Detection Preview</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              BUS {bus.busNumber} • Interior Sensor Node #1
            </span>
          </div>

          <div className="text-xs font-mono text-amber-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Simulated Visual Matrix Demo</span>
          </div>
        </div>

        {/* Synthetic Bus Interior Canvas with Bounding Boxes */}
        <div className="relative w-full h-72 sm:h-96 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Simulated Dark Bus Interior Perspective Lines */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-800/80 opacity-40" xmlns="http://www.w3.org/2000/svg">
            <line x1="0%" y1="0%" x2="50%" y2="50%" strokeWidth="1" />
            <line x1="100%" y1="0%" x2="50%" y2="50%" strokeWidth="1" />
            <line x1="0%" y1="100%" x2="50%" y2="50%" strokeWidth="1" />
            <line x1="100%" y1="100%" x2="50%" y2="50%" strokeWidth="1" />
            {/* Horizontal aisle grid */}
            <line x1="20%" y1="50%" x2="80%" y2="50%" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="30%" y1="65%" x2="70%" y2="65%" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="15%" y1="80%" x2="85%" y2="80%" strokeWidth="1" strokeDasharray="4,4" />
          </svg>

          {/* Bounding Box Visuals */}
          {boundingBoxes.map((box) => (
            <div
              key={box.id}
              className={`absolute border-2 rounded transition-all duration-300 ${
                box.tag === 'standing' 
                  ? 'border-amber-400 bg-amber-500/15' 
                  : 'border-cyan-400 bg-cyan-500/10'
              }`}
              style={{
                top: box.top,
                left: box.left,
                width: box.w,
                height: box.h,
              }}
            >
              <span className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                box.tag === 'standing' ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
              }`}>
                {box.label}
              </span>
            </div>
          ))}

          {/* Center Aisle Density Radar Overlay */}
          <div className="absolute bottom-6 left-6 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-300 backdrop-blur-md space-y-1">
            <div className="text-teal-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Inference Telemetry Feed</span>
            </div>
            <div>Standing Vector: {bus.standing_count ?? 11} px-clusters</div>
            <div>Status Classified: <strong className="text-white">{bus.status}</strong></div>
            <div>Confidence Score: 0.942</div>
          </div>

          <div className="absolute top-4 right-4 bg-black/70 border border-teal-500/30 px-3 py-1.5 rounded-lg text-xs font-mono text-teal-300">
            FPS: 24.1 | TensorRT Native
          </div>
        </div>

        {/* Clear Non-Transmission Notice */}
        <p className="mt-3 text-[11px] text-slate-400 italic text-center">
          Notice: This visual analysis panel is a simulated demonstration. In live production, passenger faces and video streams are completely discarded immediately after neural weight scoring at the edge.
        </p>
      </div>

      {/* Fleet Sensor Monitoring Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400" />
          <span>Fleet Hardware Health & Telemetry Nodes</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Bus Unit</th>
                <th className="py-3 px-4">Edge Device</th>
                <th className="py-3 px-4">Camera Health</th>
                <th className="py-3 px-4">Standing Count</th>
                <th className="py-3 px-4">YOLO Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {buses.map((b) => (
                <tr key={b.busNumber} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">
                    BUS {b.busNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                    Jetson Nano #{b.busNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{b.cameraStatus} ({b.cameraFps} fps)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {b.standing_count ?? 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <CrowdBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectBusDetails(b)}
                      className="text-xs font-bold text-teal-400 hover:underline"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
