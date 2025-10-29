import React, { useEffect, useMemo, useRef, useState } from 'react';

const MODEL_MAP = {
  PrognosAir: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  AeroAlpha: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
  NovaX: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
};

export default function ModelSection({ selections, triggerKey, onShowDetails }) {
  const containerRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = useMemo(() => MODEL_MAP[selections.airline] || MODEL_MAP.PrognosAir, [selections.airline]);

  // Inject model-viewer script once
  useEffect(() => {
    const existing = document.querySelector('script#model-viewer');
    if (existing) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'model-viewer';
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
    return () => {};
  }, []);

  // Reset load state on source change or trigger
  useEffect(() => {
    setLoaded(false);
  }, [src, triggerKey]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur-lg shadow-2xl"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-white/80">
          {selections.airline} · Tail {selections.tailStart || '—'} to {selections.tailEnd || '—'}
        </div>
        <button
          onClick={onShowDetails}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
        >
          Details
        </button>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/40">
        {!scriptReady && (
          <div className="absolute inset-0 grid place-items-center text-white/60">Preparing 3D…</div>
        )}

        {scriptReady && (
          // eslint-disable-next-line react/no-unknown-property
          <model-viewer
            src={src}
            ar
            autoplay
            exposure="1.1"
            shadow-intensity="0.5"
            camera-controls
            interaction-prompt="auto"
            auto-rotate
            style={{ width: '100%', height: '100%' }}
            onLoad={() => setLoaded(true)}
          />
        )}

        {!loaded && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/20 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-white/70">
        <span>Drag to orbit · Scroll to zoom · Double-tap to reset</span>
        <span>GLB via model-viewer</span>
      </div>
    </div>
  );
}
