import React, { useState } from 'react';
import { TransitAlert, BusData } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Radio, 
  ArrowRight, 
  Trash2,
  Filter
} from 'lucide-react';

interface AlertsProps {
  alerts: TransitAlert[];
  buses: BusData[];
  onSelectBus: (bus: BusData) => void;
  onClearAlerts?: () => void;
}

export const Alerts: React.FC<AlertsProps> = ({
  alerts,
  buses,
  onSelectBus,
}) => {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'crowd' | 'proximity' | 'system'>('all');

  const visibleAlerts = alerts.filter((a) => !dismissedIds.has(a.id));
  const filtered = visibleAlerts.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const removeAlert = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const handleBusClick = (busNumber?: string) => {
    if (!busNumber) return;
    const match = buses.find((b) => b.busNumber === busNumber);
    if (match) onSelectBus(match);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-teal-400" />
            <span>Transit & Crowd Alerts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Real-time proximity warnings, crowd density surges, and system telemetry notifications
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('crowd')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'crowd'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Crowd
          </button>
          <button
            onClick={() => setFilterType('proximity')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'proximity'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Proximity
          </button>
          <button
            onClick={() => setFilterType('system')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === 'system'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3.5">
        {filtered.map((alert) => {
          let borderStyles = 'border-slate-800 bg-slate-900/80';
          let iconColor = 'text-teal-400';
          let IconComponent = Info;

          if (alert.severity === 'danger') {
            borderStyles = 'border-rose-500/40 bg-rose-950/20';
            iconColor = 'text-rose-400';
            IconComponent = AlertTriangle;
          } else if (alert.severity === 'warning') {
            borderStyles = 'border-amber-500/40 bg-amber-950/20';
            iconColor = 'text-amber-400';
            IconComponent = AlertTriangle;
          } else if (alert.severity === 'success') {
            borderStyles = 'border-emerald-500/40 bg-emerald-950/20';
            iconColor = 'text-emerald-400';
            IconComponent = CheckCircle2;
          }

          return (
            <div
              key={alert.id}
              id={`alert-card-${alert.id}`}
              className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-md shadow-slate-950/50 flex items-start justify-between gap-3 ${borderStyles}`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {alert.title}
                    </h3>
                    {alert.busNumber && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-teal-300 border border-teal-500/30">
                        BUS {alert.busNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    {alert.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {alert.busNumber && (
                  <button
                    onClick={() => handleBusClick(alert.busNumber)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    <span>View Bus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            No alerts currently in this category.
          </div>
        )}
      </div>

    </div>
  );
};
