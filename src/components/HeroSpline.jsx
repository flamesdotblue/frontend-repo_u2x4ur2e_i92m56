import React from 'react';
import Spline from '@splinetool/react-spline';

const HeroSpline = () => {
  return (
    <div className="relative w-full h-[40vh] md:h-[55vh] lg:h-[60vh] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-black">
      <Spline
        scene="https://prod.spline.design/4TrRyLcIHhcItjnk/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-black/60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-white">PrognosAir</h1>
          <p className="text-sm md:text-base text-white/70">Futuristic fleet insight and realtime conditions</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-white/70 text-xs bg-white/5 backdrop-blur rounded-full px-3 py-1.5 border border-white/10">
          <span className="inline-block h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
          Interactive 3D scene • Press “E”
        </div>
      </div>
    </div>
  );
};

export default HeroSpline;
