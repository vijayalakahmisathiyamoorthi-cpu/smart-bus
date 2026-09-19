import React, { useState, useMemo } from 'react';
import { NavPage, BusData, TransitAlert } from './types';
import { useBusStatus } from './hooks/useBusStatus';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RouteSearch } from './components/RouteSearch';
import { BusGrid } from './components/BusGrid';
import { BusDetails } from './components/BusDetails';
import { LiveMap } from './components/LiveMap';
import { AllRoutes } from './components/AllRoutes';
import { FindBusView } from './components/FindBusView';
import { AIVoice } from './components/AIVoice';
import { AIDiagnostics } from './components/AIDiagnostics';
import { AdminView } from './components/AdminView';
import { Alerts } from './components/Alerts';
import { Footer } from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [mapFocusedBusId, setMapFocusedBusId] = useState<string | null>(null);
  const [routeFilter, setRouteFilter] = useState<{ from: string; to: string } | null>(null);

  // Real-Time Bus Status Hook (polls FastAPI /all-bus-status every 2 seconds)
  const {
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
  } = useBusStatus();

  // Generate alerts dynamically from live API bus status
  const liveAlerts = useMemo<TransitAlert[]>(() => {
    const list: TransitAlert[] = [];

    // Overcrowded buses get urgent danger alert
    buses.filter((b) => b.status === 'Overcrowded').forEach((b) => {
      list.push({
        id: `alert-overcrowded-${b.busNumber}`,
        busNumber: b.busNumber,
        title: `Bus ${b.busNumber} is currently Overcrowded`,
        message: `${b.standing_count ?? 0} standing passengers detected by YOLO model. Passengers advised to wait or take alternate route.`,
        type: 'crowd',
        severity: 'danger',
        timestamp: 'Live detection',
      });
    });

    // Crowded buses get warning alert
    buses.filter((b) => b.status === 'Crowded').forEach((b) => {
      list.push({
        id: `alert-crowded-${b.busNumber}`,
        busNumber: b.busNumber,
        title: `Bus ${b.busNumber} is currently Crowded`,
        message: `${b.standing_count ?? 0} standing passengers. Limited seating remaining on ${b.route}.`,
        type: 'crowd',
        severity: 'warning',
        timestamp: 'Live detection',
      });
    });

    // System connectivity alert
    list.push({
      id: 'alert-system-fastapi',
      title: connectionStatus === 'LIVE' ? 'YOLO + FastAPI Connected' : 'Waiting for live data...',
      message: connectionStatus === 'LIVE' 
        ? 'Real-time crowd counts polled every 2 seconds from /all-bus-status endpoint.'
        : 'Connecting to backend https://canned-fondly-womanhood.ngrok-free.dev/all-bus-status...',
      type: 'system',
      severity: connectionStatus === 'LIVE' ? 'success' : 'warning',
      timestamp: lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Just now',
    });

    // Less crowded comfort alerts
    buses.filter((b) => b.status === 'Less Crowded').forEach((b) => {
      list.push({
        id: `alert-less-${b.busNumber}`,
        busNumber: b.busNumber,
        title: `Bus ${b.busNumber} is Less Crowded`,
        message: `${b.standing_count ?? 0} standing passengers on ${b.route}. Recommended for comfortable boarding.`,
        type: 'crowd',
        severity: 'info',
        timestamp: 'Live detection',
      });
    });

    return list;
  }, [buses, connectionStatus, lastSyncTime]);

  // Find Bus 70A for the Hero card and direct navbar navigation
  const bus70A = useMemo(() => {
    return buses.find((b) => b.busNumber === '70A') || buses[0];
  }, [buses]);

  // Handle viewing a bus in full detail
  const handleSelectBusDetails = (bus: BusData) => {
    setSelectedBus(bus);
  };

  // Open Bus 70A specifically
  const handleOpenBus70A = () => {
    if (bus70A) {
      setSelectedBus(bus70A);
    }
  };

  // View a bus on the live map
  const handleViewBusOnMap = (bus: BusData) => {
    setMapFocusedBusId(bus.busNumber);
    setSelectedBus(null);
    setCurrentPage('live-map');
  };

  // Handle Route Search from Hero / Home
  const handleRouteSearch = (from: string, to: string) => {
    if (!from && !to) {
      setRouteFilter(null);
      return;
    }
    setRouteFilter({ from, to });
  };

  // Filtered buses based on route search (if active on Home)
  const homeFilteredBuses = useMemo(() => {
    if (!routeFilter) return buses;
    const f = routeFilter.from.toLowerCase().trim();
    const t = routeFilter.to.toLowerCase().trim();

    return buses.filter((bus) => {
      const matchesFrom =
        !f ||
        bus.source.toLowerCase().includes(f) ||
        bus.via.toLowerCase().includes(f) ||
        bus.stops.some((s) => s.name.toLowerCase().includes(f));

      const matchesTo =
        !t ||
        bus.destination.toLowerCase().includes(t) ||
        bus.via.toLowerCase().includes(t) ||
        bus.stops.some((s) => s.name.toLowerCase().includes(t));

      return matchesFrom && matchesTo;
    });
  }, [buses, routeFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Fixed/Clean Top Navigation Bar */}
      <Navbar
        currentPage={selectedBus ? 'bus-70a' : currentPage}
        onSelectPage={(page) => {
          setSelectedBus(null);
          setCurrentPage(page);
        }}
        connectionStatus={connectionStatus}
        onOpenBus70A={handleOpenBus70A}
        unreadAlertCount={liveAlerts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If a bus detail is open, show the Bus Details View */}
        {selectedBus ? (
          <BusDetails
            bus={buses.find((b) => b.busNumber === selectedBus.busNumber) || selectedBus}
            onBack={() => setSelectedBus(null)}
            onViewLiveLocation={(b) => handleViewBusOnMap(b)}
            onOpenDiagnostics={() => {
              setSelectedBus(null);
              setCurrentPage('diagnostics');
            }}
          />
        ) : (
          <>
            {/* PAGE 1: HOME */}
            {currentPage === 'home' && (
              <div className="space-y-6">
                {/* 4. Hero Section */}
                <HeroSection
                  bus70A={bus70A}
                  onViewLiveMap={() => {
                    setMapFocusedBusId('70A');
                    setCurrentPage('live-map');
                  }}
                  onViewBusDetails={(busNum) => {
                    const match = buses.find((b) => b.busNumber === busNum);
                    if (match) setSelectedBus(match);
                  }}
                />

                {/* 5. Route Search Card */}
                <RouteSearch onSearch={handleRouteSearch} />

                {/* 6 & 7. Live Bus Section & Bus Cards */}
                <BusGrid
                  buses={homeFilteredBuses}
                  onSelectBus={handleSelectBusDetails}
                  onViewMap={handleViewBusOnMap}
                  filteredRouteNotice={
                    routeFilter
                      ? `Showing buses between "${routeFilter.from}" and "${routeFilter.to}" (${homeFilteredBuses.length} found)`
                      : null
                  }
                  onClearFilter={() => setRouteFilter(null)}
                />
              </div>
            )}

            {/* PAGE 2: LIVE MAP */}
            {currentPage === 'live-map' && (
              <LiveMap
                buses={buses}
                selectedBusId={mapFocusedBusId}
                onSelectBusDetails={handleSelectBusDetails}
              />
            )}

            {/* PAGE 3: ALL ROUTES */}
            {currentPage === 'all-routes' && (
              <AllRoutes
                buses={buses}
                onSelectBus={handleSelectBusDetails}
                onViewMap={handleViewBusOnMap}
              />
            )}

            {/* PAGE 4: FIND BUS */}
            {currentPage === 'find-bus' && (
              <FindBusView
                buses={buses}
                onSelectBus={handleSelectBusDetails}
                onViewMap={handleViewBusOnMap}
              />
            )}

            {/* PAGE 5: AI VOICE */}
            {currentPage === 'ai-voice' && (
              <AIVoice
                buses={buses}
                onSelectBus={handleSelectBusDetails}
              />
            )}

            {/* PAGE 6: ALERTS */}
            {currentPage === 'alerts' && (
              <Alerts
                alerts={liveAlerts}
                buses={buses}
                onSelectBus={handleSelectBusDetails}
              />
            )}

            {/* PAGE 7: AI DIAGNOSTICS */}
            {currentPage === 'diagnostics' && (
              <AIDiagnostics
                buses={buses}
                onSelectBusDetails={handleSelectBusDetails}
              />
            )}

            {/* PAGE 8: ADMIN */}
            {currentPage === 'admin' && (
              <AdminView
                buses={buses}
                connectionStatus={connectionStatus}
                lastSyncTime={lastSyncTime}
                errorMessage={errorMessage}
                rawApiResponse={rawApiResponse}
                backendUrl={backendUrl}
                onUpdateBackendUrl={setBackendUrl}
                onRefresh={fetchBusStatus}
                isSimulated={isSimulated}
                onToggleSimulated={setIsSimulated}
                onSimulateEvent={simulateLiveEvent}
                onSelectBusDetails={handleSelectBusDetails}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectPage={(page) => {
          setSelectedBus(null);
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
