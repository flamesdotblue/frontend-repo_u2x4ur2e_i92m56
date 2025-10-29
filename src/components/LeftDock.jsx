import React from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';

export default function LeftDock({ onToggleHazards, onToggleSchedule, hazardsOpen, scheduleOpen }) {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
      <button
        onClick={onToggleHazards}
        className={`group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white shadow-lg backdrop-blur transition hover:bg-white/10 ${
          hazardsOpen ? 'ring-2 ring-amber-400/60' : ''
        }`}
        aria-pressed={hazardsOpen}
        aria-label="Toggle Hazard Panel"
      >
        <AlertTriangle className="h-5 w-5 text-amber-300" />
        <span className="hidden md:inline text-sm">Hazards</span>
      </button>

      <button
        onClick={onToggleSchedule}
        className={`group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white shadow-lg backdrop-blur transition hover:bg-white/10 ${
          scheduleOpen ? 'ring-2 ring-sky-400/60' : ''
        }`}
        aria-pressed={scheduleOpen}
        aria-label="Toggle Schedule Panel"
      >
        <Calendar className="h-5 w-5 text-sky-300" />
        <span className="hidden md:inline text-sm">Schedule</span>
      </button>
    </div>
  );
}
