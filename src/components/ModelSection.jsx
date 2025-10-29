import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Info } from 'lucide-react';

// Public sample models mapped by airline code as a demo.
const MODEL_MAP = {
  PA: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  AA: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
  NX: 'https://modelviewer.dev/assets/ShopifyModels/Chair.glb',
};

const injectModelViewer = () => {
  if (customElements.get('model-viewer')) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const ModelSection = ({ selections, onOpenDetails }) => {
  const [ready, setReady] = useState(false);
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    injectModelViewer().then(() => setReady(true)).catch(() => setReady(false));
  }, []);

  const derivedTail = useMemo(() => {
    const s = selections.tailStart || 'X001';
    const e = selections.tailEnd || 'X009';
    return `${s} – ${e}`;
  }, [selections.tailStart, selections.tailEnd]);

  const handleLoad = () => {
    const url = MODEL_MAP[selections.airline] || MODEL_MAP.PA;
    setLoading(true);
    setSrc(url);
  };

  useEffect(() => {
    if (!viewerRef.current) return;
    const mv = viewerRef.current;
    const onLoad = () => setLoading(false);
    const onClick = (ev) => {
      // Fallback details based on click location
      const bounds = mv.getBoundingClientRect();
      const x = Math.round(((ev.clientX - bounds.left) / bounds.width) * 100);
      const y = Math.round(((ev.clientY - bounds.top) / bounds.height) * 100);
      onOpenDetails({
        title: 'Component details',
        subtitle: `${selections.airline} • Tail ${derivedTail}`,
        details: [
          `Model: ${src.split('/').pop() || '—'}`,
          `Click position: ${x}%, ${y}%`,
          'Status: Nominal',
        ],
      });
    };
    mv.addEventListener('load', onLoad);
    mv.addEventListener('click', onClick);
    return () => {
      mv.removeEventListener('load', onLoad);
      mv.removeEventListener('click', onClick);
    };
  }, [src, onOpenDetails, selections.airline, derivedTail]);

  return (
    <div className="relative w-full min-h-[45vh] md:min-h-[55vh] lg:min-h-[65vh] rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <Loader2 className="h-8 w-8 text-white/70 animate-spin mb-3" />
          <p className="text-white/80">Initializing 3D engine…</p>
          <p className="text-white/50 text-sm">Preparing viewer components</p>
        </div>
      )}

      {ready && (
        <>
          {!src && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <Info className="h-7 w-7 text-white/60 mb-2" />
              <h3 className="text-white text-lg font-medium">Load an aircraft model</h3>
              <p className="text-white/60 text-sm max-w-md">Choose your airline and tail range above, then press Load. Click the model to view contextual details.</p>
            </div>
          )}

          {/* @ts-ignore - custom element provided by script */}
          <model-viewer
            ref={viewerRef}
            src={src}
            ar
            auto-rotate
            camera-controls
            interaction-prompt="auto"
            exposure="0.9"
            environment-image="neutral"
            style={{ width: '100%', height: '100%' }}
          />

          {loading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-white/80 animate-spin mb-3" />
              <p className="text-white/80">Loading model…</p>
            </div>
          )}

          {/* Subtle bottom info bar */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
            <div className="text-xs text-white/60">Tail range: {derivedTail}</div>
            <div className="text-xs text-white/40">Tip: Drag to orbit • Scroll to zoom</div>
          </div>
        </>
      )}

      {/* Glow accents */}
      <div className="pointer-events-none absolute -inset-8 opacity-30 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.25),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(167,139,250,.25),transparent_35%)]" />
    </div>
  );
};

export default ModelSection;
