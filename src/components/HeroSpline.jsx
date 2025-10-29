import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <div className="absolute inset-0" aria-hidden>
      {/* 3D Spline scene as full-viewport background */}
      <Spline
        scene="https://prod.spline.design/4TrRyLcIHhcItjnk/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Subtle gradient and vignette overlays that don't block interaction */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}
