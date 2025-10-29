import React, { useEffect, useState } from 'react';
import HeroSpline from './components/HeroSpline';
import TopBar from './components/TopBar';
import LeftDock from './components/LeftDock';
import ModelSection from './components/ModelSection';
import { X, Loader2 } from 'lucide-react';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selections, setSelections] = useState({ airline: 'PA', tailStart: 'PA100', tailEnd: 'PA199' });
  const [details, setDetails] = useState(null);
  const [panel, setPanel] = useState(null); // 'hazard' | 'schedule' | null
  const [triggerLoad, setTriggerLoad] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const onOpenDetails = (payload) => setDetails(payload);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,.12),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(167,139,250,.14),transparent_35%)]">
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 mb-4 flex items-center justify-center">
              <span className="text-xl font-bold">PA</span>
            </div>
            <h2 className="text-2xl font-semibold mb-1">PrognosAir</h2>
            <p className="text-white/70 mb-4">Initializing flight intelligence…</p>
            <Loader2 className="h-5 w-5 text-white/80 animate-spin" />
          </div>
        </div>
      )}

      <TopBar
        selections={selections}
        setSelections={setSelections}
        onLoadModel={() => setTriggerLoad((n) => n + 1)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <HeroSpline />
        <ModelSection
          selections={selections}
          onOpenDetails={onOpenDetails}
          key={triggerLoad}
        />
      </main>

      <LeftDock onHazardClick={() => setPanel('hazard')} onScheduleClick={() => setPanel('schedule')} />

      {panel && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1" onClick={() => setPanel(null)} />
          <div className="w-full sm:w-[420px] h-full bg-slate-900/95 backdrop-blur-xl border-l border-white/10 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{panel === 'hazard' ? 'Hazard Center' : 'Maintenance Schedule'}</h3>
              <button className="p-2 rounded-md hover:bg-white/5" onClick={() => setPanel(null)}><X className="h-5 w-5" /></button>
            </div>
            {panel === 'hazard' ? (
              <div className="space-y-3 text-sm text-white/80">
                <p>Live advisories: None detected in the last hour.</p>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-300/20 text-amber-200">Proactive monitoring enabled. You’ll be alerted to temperature spikes, vibration anomalies, and hydraulic pressure deviations.</div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-white/80">
                <p>Next service window for selected tail range:</p>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  <li>Airframe inspection • +7 days</li>
                  <li>Engine borescope • +14 days</li>
                  <li>Avionics calibration • +30 days</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetails(null)} />
          <div className="relative z-10 w-[92%] max-w-lg bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-lg font-semibold">{details.title}</h4>
                <p className="text-white/60 text-sm">{details.subtitle}</p>
              </div>
              <button className="p-2 rounded-md hover:bg-white/5" onClick={() => setDetails(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {details.details?.map((d, i) => (
                <div key={i} className="text-white/80 text-sm">{d}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-white/40 text-xs">
        Built with a professional, futuristic aesthetic. Optimized for desktop, tablet, and mobile.
      </footer>
    </div>
  );
}

export default App;
