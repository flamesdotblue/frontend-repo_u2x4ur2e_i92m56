import React, { useEffect, useMemo, useState } from 'react';
import { Plane, CloudSun, Loader2 } from 'lucide-react';

const airports = {
  LHR: { name: 'London Heathrow', lat: 51.4700, lon: -0.4543 },
  JFK: { name: 'New York JFK', lat: 40.6413, lon: -73.7781 },
  SFO: { name: 'San Francisco', lat: 37.6213, lon: -122.3790 },
  DEL: { name: 'Delhi IGI', lat: 28.5562, lon: 77.1000 },
};

const airlines = [
  { code: 'PA', name: 'PrognosAir' },
  { code: 'AA', name: 'AeroAlpha' },
  { code: 'NX', name: 'NovaX' },
];

const weatherCodeToText = (code) => {
  const map = {
    0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Snow', 80: 'Rain showers', 95: 'Thunderstorm',
  };
  return map[code] || '—';
};

const TopBar = ({ selections, setSelections, onLoadModel }) => {
  const [airportKey, setAirportKey] = useState('LHR');
  const [weather, setWeather] = useState({ loading: true, temp: null, code: null });

  const airport = useMemo(() => airports[airportKey], [airportKey]);

  useEffect(() => {
    let active = true;
    setWeather((w) => ({ ...w, loading: true }));
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${airport.lat}&longitude=${airport.lon}&current=temperature_2m,weather_code`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const temp = data?.current?.temperature_2m;
        const code = data?.current?.weather_code;
        setWeather({ loading: false, temp, code });
      })
      .catch(() => active && setWeather({ loading: false, temp: null, code: null }));
    return () => { active = false; };
  }, [airport]);

  return (
    <div className="w-full sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 text-white/90">
          <Plane className="h-5 w-5 text-sky-400" />
          <span className="font-semibold">PrognosAir</span>
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
          <select
            className="bg-transparent text-white/90 text-sm px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={selections.airline}
            onChange={(e) => setSelections((s) => ({ ...s, airline: e.target.value }))}
          >
            {airlines.map((a) => (
              <option key={a.code} value={a.code} className="bg-slate-900">{a.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tail start"
            value={selections.tailStart}
            onChange={(e) => setSelections((s) => ({ ...s, tailStart: e.target.value.toUpperCase() }))}
            className="bg-transparent text-white/90 text-sm px-2 py-1 rounded-md placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <span className="text-white/40">→</span>
          <input
            type="text"
            placeholder="Tail end"
            value={selections.tailEnd}
            onChange={(e) => setSelections((s) => ({ ...s, tailEnd: e.target.value.toUpperCase() }))}
            className="bg-transparent text-white/90 text-sm px-2 py-1 rounded-md placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            onClick={onLoadModel}
            className="text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md border border-white/10 transition-colors"
          >
            Load
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <select
            className="bg-white/5 border border-white/10 text-white/90 text-sm px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={airportKey}
            onChange={(e) => setAirportKey(e.target.value)}
          >
            {Object.keys(airports).map((k) => (
              <option key={k} value={k} className="bg-slate-900">{k}</option>
            ))}
          </select>
          <div className="hidden md:flex flex-col">
            <span className="text-sm text-white/90">{airport.name}</span>
            <span className="text-xs text-white/60">{airportKey}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            <CloudSun className="h-4 w-4 text-amber-300" />
            {weather.loading ? (
              <span className="inline-flex items-center gap-1 text-white/70"><Loader2 className="h-3.5 w-3.5 animate-spin" />Fetching…</span>
            ) : (
              <span className="text-sm">{weather.temp != null ? `${Math.round(weather.temp)}°C` : '—'} • {weatherCodeToText(weather.code)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
