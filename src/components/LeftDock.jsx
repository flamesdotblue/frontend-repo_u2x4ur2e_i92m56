import React from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';

const LeftDock = ({ onHazardClick, onScheduleClick }) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
      <button
        onClick={onHazardClick}
        className="group h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-300 hover:text-amber-200 backdrop-blur transition-colors"
        aria-label="Hazards"
      >
        <AlertTriangle className="h-6 w-6" />
      </button>
      <button
        onClick={onScheduleClick}
        className="group h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-sky-300 hover:text-sky-200 backdrop-blur transition-colors"
        aria-label="Schedule"
      >
        <Calendar className="h-6 w-6" />
      </button>
    </div>
  );
};

export default LeftDock;
