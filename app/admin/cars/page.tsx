"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Trash2, Edit3, Activity, Fuel, Zap, Gauge
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminCarsList() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMarket, setActiveMarket] = useState("ALL");

  const fetchCars = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('cars')
      .select(`
        *,
        car_prices (*),
        car_details (mileage, stk_ek_expiration)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error Details:", error);
      toast.error("Chyba pri načítaní áut UltimateDrive");
    } else if (data) {
      setCars(data);
      setFilteredCars(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCars(); }, []);

  // CLIENT-SIDE FILTER pre trhy (SK, HR, HU, ME, BA)
  useEffect(() => {
    if (activeMarket === "ALL") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(car => {
        const hasMarketCode = car.market_code?.toUpperCase() === activeMarket.toUpperCase();
        const hasPriceForMarket = car.car_prices?.some((p: any) => p.market?.toUpperCase() === activeMarket.toUpperCase());
        
        return hasMarketCode || hasPriceForMarket;
      });
      setFilteredCars(filtered);
    }
  }, [activeMarket, cars]);

  const deleteCar = async (id: string) => {
    if (!confirm("Naozaj chceš odstrániť toto vozidlo z UltimateDrive flotily?")) return;
    
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) {
      toast.error("Nepodarilo sa odstrániť vozidlo.");
    } else {
      toast.success("Vozidlo bolo úspešne vymazané z flotily.");
      fetchCars();
    }
  };

  const getCarPriceRow = (car: any) => {
    if (!car.car_prices || !Array.isArray(car.car_prices) || car.car_prices.length === 0) {
      return null;
    }

    const targetMarket = activeMarket === "ALL" ? "SK" : activeMarket;
    let found = car.car_prices.find((p: any) => p.market?.toUpperCase() === targetMarket.toUpperCase());
    
    if (!found) {
      found = car.car_prices[0];
    }

    return found;
  };

  const calculateAveragePrice = () => {
    if (!filteredCars || filteredCars.length === 0) return 0;
    
    let total = 0;
    let count = 0;

    filteredCars.forEach(car => {
      const priceRow = getCarPriceRow(car);
      if (priceRow && priceRow.price_1_day) {
        total += priceRow.price_1_day;
        count++;
      }
    });

    return count > 0 ? Math.round(total / count) : 0;
  };

  // Reálny súčet obstarávacej ceny zo stĺpca purchase_price + konzolový test
  const calculateTotalAssetValue = () => {
    if (!filteredCars || filteredCars.length === 0) return 0;
    
    let total = 0;
    filteredCars.forEach(car => {
      console.log(`Auto: ${car.brand} ${car.name} | purchase_price:`, car.purchase_price);
      if (car.purchase_price) {
        total += Number(car.purchase_price);
      }
    });

    return total;
  };

  return (
    <div className="space-y-10 font-urbanist text-left pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
            Garage <span className="text-sky-400">Assets</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
            <Activity size={14} className="text-sky-400" /> Aktuálny stav UltimateDrive flotily
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Prepínač krajín */}
          <div className="flex gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {["ALL", "SK", "HR", "HU", "ME", "BA"].map((m) => (
              <button 
                key={m}
                onClick={() => setActiveMarket(m)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                  activeMarket === m 
                    ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <Link href="/admin/cars/new" 
                className="flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-sky-500/20">
            <Plus size={16} strokeWidth={3} /> Pridať vozidlo
          </Link>
        </div>
      </div>

      {/* RÝCHLE ŠTATISTIKY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label="Vozidlá v správe" value={filteredCars.length.toString()} sub="Aktívne v ponuke" color="sky" />
          <StatBox label="Odhadovaná hodnota" value={`${calculateTotalAssetValue().toLocaleString()} €`} sub="Celej flotily" color="emerald" />
          <StatBox label="Priemerný denný nájom" value={`${calculateAveragePrice()} €`} sub={activeMarket === "ALL" ? "Cez všetky trhy" : `Pre trh ${activeMarket}`} color="purple" />
      </div>

      {/* GRID S AUTAMI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 text-white">
        {loading ? (
          <div className="col-span-full py-32 text-center">
            <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Synchronizujem garáž UltimateDrive...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-slate-900/20">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">V tejto sekcii zatiaľ nemáš žiadne stroje</p>
          </div>
        ) : filteredCars.map((car) => {
          const details = car.car_details?.[0];
          const stkDays = details?.stk_ek_expiration ? Math.ceil((new Date(details.stk_ek_expiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

          const currentPriceRow = getCarPriceRow(car);

          const validImageUrl = car.image_url && car.image_url.startsWith('http') 
            ? car.image_url 
            : "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop";

          return (
            <div key={car.id} className="group bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500 backdrop-blur-xl flex flex-col justify-between">
              
              {/* Image Section */}
              <div className="h-52 relative overflow-hidden bg-slate-950">
                <img 
                  src={validImageUrl} 
                  alt={car.name || "UltimateDrive Car"} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                />
                
                {/* STK Alert */}
                {stkDays !== null && stkDays < 30 && (
                  <div className="absolute bottom-4 left-6 px-3 py-1 bg-rose-600 text-white text-[8px] font-black uppercase rounded-full animate-pulse z-20">
                    STK vyprší o {stkDays} dní
                  </div>
                )}

                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black text-sky-400 uppercase tracking-widest">
                    {activeMarket === "ALL" ? (car.market_code || currentPriceRow?.market || "SK") : activeMarket}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{car.brand}</h3>
                      <p className="text-sky-400 font-black text-sm uppercase italic mt-1">{car.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black italic tracking-tighter text-white">
                        {currentPriceRow?.price_1_day ? `${currentPriceRow.price_1_day}€` : '—'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        deň ({currentPriceRow?.market?.toUpperCase() || (activeMarket === "ALL" ? "SK" : activeMarket)})
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-5 my-5 border-y border-white/5 bg-slate-950/30 rounded-2xl px-2">
                    <TechInfo icon={<Fuel size={14}/>} value={car.fuel} />
                    <TechInfo icon={<Zap size={14}/>} value={car.power} />
                    <TechInfo icon={<Gauge size={14}/>} value={details?.mileage ? `${details.mileage.toLocaleString()} km` : car.transmission} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link 
                    href={`/admin/cars/${car.id}`} 
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-slate-950 transition-all shrink-0"
                    title="Technická karta a servis"
                  >
                    <Activity size={18} />
                  </Link>

                  <Link href={`/admin/cars/edit/${car.id}`} className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 px-4 rounded-2xl border border-white/5 transition-all text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <Edit3 size={14} /> Výbava
                  </Link>
                  
                  <button 
                    onClick={() => deleteCar(car.id)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shrink-0 active:scale-95"
                    title="Vymazať vozidlo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, color }: any) {
  const colors: any = {
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20"
  };
  return (
    <div className={`p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-xl text-left relative overflow-hidden`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black italic tracking-tight ${colors[color].split(' ')[0]}`}>{value}</p>
      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{sub}</p>
    </div>
  );
}

function TechInfo({ icon, value }: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-slate-400">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-tighter truncate max-w-full text-slate-300">{value}</span>
    </div>
  );
}