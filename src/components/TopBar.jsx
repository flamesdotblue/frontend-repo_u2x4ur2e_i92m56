import React, { useEffect, useMemo, useState } from 'react';

const AIRLINES = ['PrognosAir', 'AeroAlpha', 'NovaX'];

const AIRPORTS = [
  { code: 'LHR', name: 'London Heathrow', lat: 51.4775, lon: -0.4614 },
  { code: 'JFK', name: 'New York JFK', lat: 40.6413, lon: -73.7781 },
  { code: 'SFO', name: 'San Francisco', lat: 37.6213, lon: -122.3790 },
  { code: 'DEL', name: 'Delhi Indira Gandhi', lat: 28.5562, lon: 77.1000 },
];

const codeMap = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
  56: 'Freezing drizzle', 57: 'Heavy freezing drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  66: 'Freezing rain', 67: 'Heavy freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Heavy thunderstorm w/ hail',
};

export default function TopBar({ selections, setSelections, onLoadModel, airport, setAirport }) {
  const [wx, setWx] = useState({ temp: null, code: null, loading: false });

  const selectedAirport = useMemo(() => AIRPORTS.find(a => a.code === airport) || AIRPORTS[0], [airport]);

  useEffect(() => {
    let isMounted = true;
    async function fetchWx() {
      setWx(prev => ({ ...prev, loading: true }));
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedAirport.lat}&longitude=${selectedAirport.lon}&current=temperature_2m,weather_code&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        if (!isMounted) return;
        const temp = data?.current?.temperature_2m;
        const code = data?.current?.weather_code;
        setWx({ temp, code, loading: false });
      } catch (e) {
        if (!isMounted) return;
        setWx({ temp: null, code: null, loading: false });
      }
    }
    fetchWx();
    const t = setInterval(fetchWx, 5 * 60 * 1000);
    return () => { isMounted = false; clearInterval(t); };
  }, [selectedAirport.lat, selectedAirport.lon]);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white backdrop-blur">
        <span className="hidden sm:inline text-sm text-white/70">Airline</span>
        <select
          value={selections.airline}
          onChange={(e) => setSelections(s => ({ ...s, airline: e.target.value }))}
          className="bg-transparent text-white text-sm outline-none"
        >
          {AIRLINES.map(a => (
            <option key={a} value={a} className="bg-slate-900">{a}</option>
          ))}
        </select>
        <div className="mx-2 h-4 w-px bg-white/10" />
        <input
          value={selections.tailStart}
          onChange={(e) => setSelections(s => ({ ...s, tailStart: e.target.value }))}
          placeholder="Tail start"
          className="w-24 bg-transparent text-sm text-white placeholder-white/50 outline-none"
        />
        <span className="text-white/50">→</span>
        <input
          value={selections.tailEnd}
          onChange={(e) => setSelections(s => ({ ...s, tailEnd: e.target.value }))}
          placeholder="Tail end"
          className="w-24 bg-transparent text-sm text-white placeholder-white/50 outline-none"
        />
        <button
          onClick={onLoadModel}
          className="ml-3 rounded-xl bg-sky-500/90 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-sky-400"
        >
          Load
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white backdrop-blur">
        <span className="hidden sm:inline text-sm text-white/70">Airport</span>
        <select
          value={airport}
          onChange={(e) => setAirport(e.target.value)}
          className="bg-transparent text-white text-sm outline-none"
        >
          {AIRPORTS.map(a => (
            <option key={a.code} value={a.code} className="bg-slate-900">{a.code}</option>
          ))}
        </select>
        <div className="mx-2 h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2 text-sm">
          {wx.loading ? (
            <span className="text-white/60">Loading wx…</span>
          ) : (
            <>
              <span className="text-white/90">{wx.temp !== null ? `${Math.round(wx.temp)}°` : '--'}</span>
              <span className="hidden sm:inline text-white/60">{codeMap[wx.code] || 'N/A'}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
