import React, { useMemo, useState } from 'react';
import HeroSpline from './components/HeroSpline';
import TopBar from './components/TopBar';
import LeftDock from './components/LeftDock';
import ModelSection from './components/ModelSection';

export default function App() {
  // Global UI/state
  const [showSplash, setShowSplash] = useState(true);
  const [selections, setSelections] = useState({ airline: 'PrognosAir', tailStart: '', tailEnd: '' });
  const [airport, setAirport] = useState('LHR');
  const [hazardsOpen, setHazardsOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(t);
  }, []);

  const handleLoadModel = () => setTriggerKey(k => k + 1);

  const rightPanelContent = useMemo(() => {
    if (hazardsOpen) return 'Operational Hazards: crosswinds, runway wet, NOTAM: RWY 09L closed 02:00-03:00.';
    if (scheduleOpen) return 'Schedule: PA123 06:10Z → JFK · Gate A12 · Boarding T-25m. Next: PA458 09:30Z → SFO.';
    return null;
  }, [hazardsOpen, scheduleOpen]);

  return (
    <div className="relative h-screen min-h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Background 3D scene */}
      <HeroSpline />

      {/* Top controls */}
      <TopBar
        selections={selections}
        setSelections={setSelections}
        onLoadModel={handleLoadModel}
        airport={airport}
        setAirport={setAirport}
      />

      {/* Left action dock */}
      <LeftDock
        hazardsOpen={hazardsOpen}
        scheduleOpen={scheduleOpen}
        onToggleHazards={() => { setHazardsOpen(v => !v); setScheduleOpen(false); }}
        onToggleSchedule={() => { setScheduleOpen(v => !v); setHazardsOpen(false); }}
      />

      {/* Center headline */}
      <div className="pointer-events-none absolute inset-x-0 top-20 flex justify-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-white via-sky-200 to-teal-200 bg-clip-text text-transparent drop-shadow">PrognosAir</h1>
          <p className="mt-2 text-sm md:text-base text-white/70">Predict. Prepare. Perform.</p>
        </div>
      </div>

      {/* Model viewer card anchored bottom-right inside viewport */}
      <div className="absolute bottom-6 right-6 z-20 max-w-full px-4 md:px-0">
        <ModelSection
          selections={selections}
          triggerKey={triggerKey}
          onShowDetails={() => setDetailsOpen(true)}
        />
      </div>

      {/* Right side panel (no page scroll) */}
      {rightPanelContent && (
        <div className="fixed right-4 top-24 z-30 h-[70vh] w-[88vw] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/90 backdrop-blur">
          <div className="mb-2 flex items-center justify-between text-white/70">
            <span>{hazardsOpen ? 'Hazards' : 'Schedule'}</span>
            <button
              onClick={() => { setHazardsOpen(false); setScheduleOpen(false); }}
              className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
            >
              Close
            </button>
          </div>
          <div className="h-full overflow-auto pr-1">
            {rightPanelContent}
          </div>
        </div>
      )}

      {/* Details overlay */}
      {detailsOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur-sm">
          <div className="w-[92vw] max-w-xl rounded-2xl border border-white/10 bg-slate-900/90 p-5 text-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-medium text-white/90">Aircraft Details</h3>
              <button onClick={() => setDetailsOpen(false)} className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Close</button>
            </div>
            <ul className="space-y-2 text-white/80">
              <li>Airline: {selections.airline}</li>
              <li>Tail range: {selections.tailStart || '—'} → {selections.tailEnd || '—'}</li>
              <li>Systems: Nominal · Fuel: 78% · MTOW check: OK</li>
              <li>Turnaround: T-22m · Crew: Ready · Catering: In progress</li>
            </ul>
          </div>
        </div>
      )}

      {/* Splash screen (short, single-view) */}
      {showSplash && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950">
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-tr from-sky-500 to-teal-400 shadow-lg" />
            <div className="text-white/80">Launching PrognosAir…</div>
          </div>
        </div>
      )}

      {/* Footer microcopy pinned bottom-left */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 text-xs text-white/50">
        © {new Date().getFullYear()} PrognosAir · Single-screen interface
      </div>
    </div>
  );
}
