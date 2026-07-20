"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, Activity, DollarSign, Zap, Landmark 
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

// Konštanta pre lokálne dáta trhov (v budúcnosti môžeš ťahať z DB)
const MARKET_DATA: any = {
  ALL: { cash: 126500, burn: 1251, vat: 34300, currency: "€" },
  SK: { cash: 85000, burn: 450, vat: 12000, currency: "€" },
  HR: { cash: 22000, burn: 320, vat: 8500, currency: "€" },
  HU: { cash: 12500000, burn: 180000, vat: 4500000, currency: "Ft" }, 
  BA: { cash: 15000, burn: 200, vat: 3000, currency: "KM" },
  ME: { cash: 11000, burn: 150, vat: 2000, currency: "€" }
};

export default function AdminDashboard() {
  const [country, setCountry] = useState("ALL");
  const [fleetLog, setFleetLog] = useState<any[]>([]);
  const [stats, setStats] = useState({ health: 100, totalCars: 0 });
  const [loading, setLoading] = useState(true);
  
  // Dynamické dáta podľa vybraného trhu
  const currentFinances = MARKET_DATA[country] || MARKET_DATA.ALL;

  // Dáta pre graf (v produkcii filtrované cez SQL podľa 'country')
  const chartData = [
    { name: 'Jan', revenue: 4500 },
    { name: 'Feb', revenue: 5200 },
    { name: 'Mar', revenue: 4800 },
    { name: 'Apr', revenue: 6100 },
    { name: 'Máj', revenue: country === "ALL" ? 45000 : 9500 }, 
  ];

  useEffect(() => {
    async function analyzeFleet() {
      // Ťaháme vždy celú flotilu pre globálny monitoring
      const { data: cars, error } = await supabase
        .from("cars")
        .select(`*, car_details(*)`);

      if (error || !cars) {
        setLoading(false);
        return;
      }

      const dynamicLogs: any[] = [];
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      cars.forEach(car => {
        const d = car.car_details?.[0];
        if (!d) return;

        const plate = d.license_plate || car.plate || "BEZ ŠPZ";
        const market = car.market_code || "SK"; // Predpokladá stĺpec market_code v DB
        const SERVICE_INTERVAL = 10000; 

        // 1. KONTROLA SERVISU
        if (d.mileage && d.last_service_km) {
          const kmSinceService = d.mileage - d.last_service_km;
          const remainingKm = SERVICE_INTERVAL - kmSinceService;

          if (kmSinceService > SERVICE_INTERVAL) {
            dynamicLogs.push({
              status: "Warning",
              market: market,
              title: "SERVIS PREKROČENÝ",
              desc: `${car.name} (${plate}): Prekročené o ${kmSinceService - SERVICE_INTERVAL} km. Stiahnuť na SK!`,
              time: "NOW"
            });
          } else if (remainingKm <= 2000) {
            dynamicLogs.push({
              status: "Upcoming",
              market: market,
              title: "Servis o chvíľu",
              desc: `${car.name} (${plate}): Zostáva už len ${remainingKm} km.`,
              time: "SOON"
            });
          }
        }

        // 2. UNIVERZÁLNA KONTROLA DÁTUMOV
        const checkDate = (dateStr: string, label: string) => {
          if (!dateStr) return;
          const expDate = new Date(dateStr);
          if (expDate <= thirtyDaysFromNow) {
            const expired = expDate < today;
            dynamicLogs.push({
              status: expired ? "Warning" : "Upcoming",
              market: market,
              title: `Expirácia ${label}`,
              desc: `${car.name} (${plate}): ${expired ? 'Expirovalo' : 'Končí'} ${expDate.toLocaleDateString('sk-SK')}`,
              time: expired ? "EXPIRED" : "SOON"
            });
          }
        };

        checkDate(d.stk_ek_expiration, "STK/EK");
        checkDate(d.pzp_expiration, "PZP");
        checkDate(d.kasko_expiration, "KASKO");
        checkDate(d.vignette_sk_expiration, "SK Známka");
        checkDate(d.vignette_hu_expiration, "HU Známka");
      });

      setFleetLog(dynamicLogs);
      setStats({
        totalCars: cars.length,
        health: Math.max(0, 100 - (dynamicLogs.length * 5))
      });
      setLoading(false);
    }

    analyzeFleet();
  }, []);

  return (
    <div className="space-y-8 pb-20 text-left font-urbanist text-white">
      
      {/* HEADER FILTRE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          {["ALL", "SK", "HR", "HU", "BA", "ME"].map((c) => (
            <button 
              key={c}
              onClick={() => setCountry(c)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${
                country === c ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20" : "text-slate-500 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* METRIKY - Dynamicky podľa trhu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Disponibilný Cash" val={`${currentFinances.cash.toLocaleString()} ${currentFinances.currency}`} sub={`Pobočka ${country}`} icon={<DollarSign size={20} />} color="text-emerald-400" />
        <MetricCard label="VAT Refund" val={`+${currentFinances.vat.toLocaleString()} ${currentFinances.currency}`} sub="Očakávaný kapitál" icon={<Landmark size={20} />} color="text-sky-400" />
        <MetricCard label="Operational Burn" val={`-${currentFinances.burn.toLocaleString()} ${currentFinances.currency}`} sub="Denný náklad" icon={<Zap size={20} />} color="text-rose-500" />
        <MetricCard label="Health Score" val={`${stats.health}%`} sub={`${stats.totalCars} áut celkovo`} icon={<Activity size={20} />} color={stats.health > 80 ? "text-emerald-400" : "text-amber-500"} />
      </div>

      {/* HLAVNÝ OBSAH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRAF */}
        <div className="lg:col-span-2 p-10 rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10 relative z-10">
             <h3 className="font-black uppercase italic text-white tracking-widest text-sm flex items-center gap-2">
              <TrendingUp size={18} className="text-sky-500" /> {country} Market Performance
            </h3>
          </div>
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SYSTEM LOG - GLOBÁLNY MONITORING */}
        <div className="p-8 rounded-[3rem] border border-white/5 bg-slate-900/40 space-y-6 flex flex-col max-h-[550px]">
          <h3 className="font-black uppercase italic text-white tracking-widest text-sm flex items-center justify-between">
            Global Fleet Log <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
          </h3>
          <div className="space-y-2 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {fleetLog.length > 0 ? fleetLog.map((log, idx) => (
              <LogItem 
                key={idx} 
                status={log.status} 
                title={log.title} 
                desc={log.desc} 
                time={log.time} 
                market={log.market}
              />
            )) : (
              <div className="py-20 text-center opacity-20 text-[10px] font-black uppercase italic">Všetko OK</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// SUB-KOMPONENTY
function MetricCard({ label, val, sub, icon, color }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl group hover:border-white/10 transition-all text-left">
      <div className={`${color} mb-4 opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-white mt-1 italic tracking-tighter">{val}</p>
      <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 tracking-tight">{sub}</p>
    </div>
  );
}

function LogItem({ status, title, desc, time, market }: any) {
  const isWarning = status === "Warning";
  const isUpcoming = status === "Upcoming";
  
  const marketColors: any = {
    SK: "text-blue-400 bg-blue-400/10",
    HR: "text-rose-400 bg-rose-400/10",
    HU: "text-emerald-400 bg-emerald-400/10",
    BA: "text-amber-400 bg-amber-400/10",
    ME: "text-purple-400 bg-purple-400/10"
  };

  const dotColor = isWarning ? "bg-rose-500 shadow-rose-500/50" : isUpcoming ? "bg-amber-500 shadow-amber-500/50" : "bg-sky-500 shadow-sky-500/50";
  const textColor = isWarning ? "text-rose-500" : isUpcoming ? "text-amber-500" : "text-sky-400";
  const bgColor = isWarning ? "bg-rose-500/5" : isUpcoming ? "bg-amber-500/5" : "hover:bg-white/[0.02]";

  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all border border-transparent hover:border-white/5 group ${bgColor}`}>
      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${dotColor} shadow-[0_0_8px]`} />
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-1.5 py-0.5 rounded text-[7px] font-black ${marketColors[market] || "bg-white/10 text-white"}`}>
            {market}
          </span>
          <p className={`text-[11px] font-black uppercase italic truncate tracking-tight ${textColor}`}>
            {title}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 font-medium line-clamp-2 uppercase mt-0.5 tracking-tighter">{desc}</p>
      </div>
      <span className="text-[9px] text-slate-700 font-black uppercase italic shrink-0">{time}</span>
    </div>
  );
}