"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Navigation, Globe, RefreshCw, Radio, MapPin, Clock, Fuel, Zap, Target 
} from "lucide-react";
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

import L from 'leaflet';

// Pomocný komponent na ovládanie mapy (FlyTo)
function MapViewHandler({ center }: { center: [number, number] | null }) {
  const map = require('react-leaflet').useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const vehicleIcon = (status: string, isActive: boolean) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${isActive ? '#f87171' : (status === 'active' ? '#10b981' : '#64748b')}; 
              padding: 8px; border-radius: 12px; border: 2px solid white; 
              box-shadow: ${isActive ? '0 0 20px #f87171' : '0 4px 10px rgba(0,0,0,0.3)'}; 
              color: white; transition: all 0.3s ease;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

export default function FleetTracking() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFleet = async () => {
    const { data, error } = await supabase.from("fleet_tracking").select("*");
    if (!error && data) setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFleet();
    const channel = supabase.channel('fleet-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fleet_tracking' }, () => fetchFleet())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Funkcia pre kliknutie na auto v zozname
  const handleVehicleClick = (v: any) => {
    setSelectedVehicle(v);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 text-left font-urbanist">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30">
            <Globe className="text-sky-500 animate-pulse" size={28} />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Fleet <span className="text-sky-500">Center</span></h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 italic leading-none">Command & Control Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <div className="bg-black/40 px-5 py-3 rounded-2xl border border-white/5 text-center">
             <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Live Tracking</p>
             <p className="text-xl font-black italic leading-none">{vehicles.length} Units</p>
          </div>
          <button onClick={fetchFleet} className="p-4 bg-white text-black rounded-2xl hover:bg-sky-500 transition-all active:scale-95">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* BOČNÝ LIST S FOCUS FUNKCIOU */}
        <div className="w-80 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {vehicles.map(v => (
            <div 
              key={v.id} 
              onClick={() => handleVehicleClick(v)}
              className={`bg-slate-900/40 border ${selectedVehicle?.id === v.id ? 'border-sky-500 bg-sky-500/5' : 'border-white/5'} p-5 rounded-[2rem] hover:border-sky-500/50 transition-all cursor-pointer group relative overflow-hidden text-left`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="text-left">
                  <h3 className="text-lg font-black text-white uppercase italic leading-none">{v.vehicle_name}</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">
                    {selectedVehicle?.id === v.id ? 'Sledované zariadenie' : 'Online'}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${v.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-700/50 text-slate-400'}`}>
                  <Target size={16} className={selectedVehicle?.id === v.id ? 'animate-spin' : ''} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 relative z-10">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex flex-col items-center">
                  <p className="text-[7px] font-black text-slate-500 uppercase flex items-center gap-1"><Zap size={8}/> Speed</p>
                  <p className="text-sm font-black text-white italic">{v.speed || 0} km/h</p>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex flex-col items-center">
                  <p className="text-[7px] font-black text-slate-500 uppercase flex items-center gap-1"><Fuel size={8}/> Fuel</p>
                  <p className="text-sm font-black text-white italic">{v.fuel_level || 0}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAPA S HANDLEROM */}
        <div className="flex-1 rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
          <MapContainer 
            center={[48.66, 19.33] as any} 
            zoom={7} 
            style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(0.6) contrast(0.9)' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Toto pohne mapou pri zmene výberu */}
            {selectedVehicle && <MapViewHandler center={[selectedVehicle.last_lat, selectedVehicle.last_lng]} />}

            {vehicles.map(v => (
              <Marker 
                key={v.id} 
                position={[v.last_lat, v.last_lng]} 
                icon={vehicleIcon(v.status, selectedVehicle?.id === v.id)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-left">
                    <p className="font-black uppercase text-xs text-slate-900">{v.vehicle_name}</p>
                    <div className="flex gap-2 mt-2">
                       <span className="bg-sky-500 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase">{v.speed || 0} km/h</span>
                       <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase italic">⛽ {v.fuel_level || 0}%</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950/20 rounded-[3.5rem]"></div>
        </div>
      </div>
    </div>
  );
}