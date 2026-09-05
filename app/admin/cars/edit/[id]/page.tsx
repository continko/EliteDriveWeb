"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Euro, Shield, Globe, Hammer, ListPlus, Gauge, Power } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const MARKETS = ["SK", "HR", "HU", "ME", "BA"];

export default function EditCarEquipmentAndPricing() {
  const { id } = useParams();
  const router = useRouter();
  
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState("SK");

  // Stav pre výbavu auta a is_active z tabuľky 'cars'
  const [equipmentInput, setEquipmentInput] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Všetky cenové riadky z DB pre toto auto
  const [allPriceRows, setAllPriceRows] = useState<any[]>([]);

  // Aktuálne ceny vo formulári pre vybraný trh (vrátane extra_km_price)
  const [marketPrices, setMarketPrices] = useState({
    price_1_day: 0,
    price_2_3_days: 0,
    price_4_7_days: 0,
    price_8_14_days: 0,
    price_15_22_days: 0,
    price_23_plus_days: 0,
    deposit: 1000,
    extra_km_price: 0,
  });

  const fetchCarAndPrices = async () => {
    setLoading(true);
    
    // Načítame základné info o aute a jeho ceny
    const { data: carData, error: carError } = await supabase
      .from("cars")
      .select(`*, car_prices (*)`)
      .eq("id", id)
      .single();

    if (carError || !carData) {
      toast.error("Vozidlo sa nenašlo");
      router.push("/admin/cars");
      return;
    }
    
    setCar(carData);
    setIsActive(carData.is_active ?? true);
    
    // Ak má auto pole equipment (pole stringov), spojíme ho čiarkami späť do textu
    if (carData.equipment && Array.isArray(carData.equipment)) {
      setEquipmentInput(carData.equipment.join(", "));
    } else {
      setEquipmentInput("");
    }

    if (carData.car_prices) {
      setAllPriceRows(carData.car_prices);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchCarAndPrices();
  }, [id]);

  // Sledovanie zmeny trhu -> vytiahne správne ceny z poľa
  useEffect(() => {
    const existingRow = allPriceRows.find(
      (r: any) => r.market?.toUpperCase() === selectedMarket.toUpperCase()
    );

    if (existingRow) {
      setMarketPrices({
        price_1_day: existingRow.price_1_day || 0,
        price_2_3_days: existingRow.price_2_3_days || 0,
        price_4_7_days: existingRow.price_4_7_days || 0,
        price_8_14_days: existingRow.price_8_14_days || 0,
        price_15_22_days: existingRow.price_15_22_days || 0,
        price_23_plus_days: existingRow.price_23_plus_days || 0,
        deposit: existingRow.deposit || 1000,
        extra_km_price: existingRow.extra_km_price || 0,
      });
    } else {
      setMarketPrices({
        price_1_day: 0,
        price_2_3_days: 0,
        price_4_7_days: 0,
        price_8_14_days: 0,
        price_15_22_days: 0,
        price_23_plus_days: 0,
        deposit: 1000,
        extra_km_price: 0,
      });
    }
  }, [selectedMarket, allPriceRows]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Spracovanie a uloženie výbavy A STAVU (is_active) do tabuľky 'cars'
      const parsedEquipment = equipmentInput
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

      const { error: carError } = await supabase
        .from("cars")
        .update({ 
          equipment: parsedEquipment,
          is_active: isActive // <-- TU SA TO TERAZ SPRÁVNE UKLADAJÚ DO DB
        })
        .eq("id", id);

      if (carError) throw carError;

      // 2. Uloženie cien pre aktuálne zvolený trh do 'car_prices'
      const existingPriceRow = allPriceRows.find(
        (r: any) => r.market?.toUpperCase() === selectedMarket.toUpperCase()
      );

      if (existingPriceRow) {
        // UPDATE
        const { error: priceError } = await supabase
          .from("car_prices")
          .update(marketPrices)
          .eq("id", existingPriceRow.id);
        if (priceError) throw priceError;
      } else {
        // INSERT
        const { error: priceError } = await supabase
          .from("car_prices")
          .insert([{
            car_id: id,
            market: selectedMarket.toUpperCase(),
            ...marketPrices
          }]);
        if (priceError) throw priceError;
      }

      toast.success("Konfigurácia vozidla úspešne aktualizovaná!");
      await fetchCarAndPrices(); // Refresh dát z DB
    } catch (err: any) {
      console.error(err);
      toast.error(`Chyba pri ukladaní: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-white font-urbanist">
        <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Otváram konfigurátor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-urbanist text-left text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <Link href="/admin/cars" className="group flex items-center gap-2 text-slate-500 hover:text-sky-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Späť do garáže
          </Link>
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            Správa konfigurácie: <span className="text-sky-500">{car?.brand} {car?.name}</span>
          </h1>
        </div>

        {/* TRHOVÝ PREPÍNAČ PRE CENY */}
        <div className="flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 flex items-center gap-1">
            <Globe size={12} className="text-sky-500" /> Trh:
          </span>
          {MARKETS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMarket(m)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                selectedMarket === m
                  ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
                  : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* VĽAVO: STAV VOZIDLA, VÝBAVA A CENNÍKY */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SEKCIA STAVU VOZIDLA (AKTÍVNE / COMING SOON) */}
          <div className="p-8 rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl border ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                <Power size={20} strokeWidth={3} />
              </div>
              <div>
                <h2 className="font-black uppercase tracking-widest text-sm italic">Stav vozidla vo flotile</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  {isActive ? "Vozidlo je aktívne a zverejnené pre zákazníkov" : "Vozidlo je skryté / označené ako Coming Soon"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
                isActive 
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" 
                  : "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              }`}
            >
              {isActive ? "● Aktívne" : "⏳ Coming Soon"}
            </button>
          </div>

          {/* SEKČIA VÝBAVY */}
          <div className="p-10 rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 text-sky-500 border-b border-white/5 pb-4">
              <Hammer size={20} strokeWidth={3} />
              <h2 className="font-black uppercase tracking-widest text-sm italic">Prémiová výbava vozidla</h2>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <ListPlus size={12} /> Prvky výbavy (oddeľuj čiarkou)
              </label>
              <textarea 
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="Carbon ceramic brakes, Clubsport package, Bose Surround..." 
                className="w-full bg-slate-950 border border-white/10 rounded-[2rem] p-6 text-sm text-white font-medium outline-none focus:border-sky-500 transition-all min-h-[120px] resize-none placeholder:text-slate-800"
              />
              <p className="text-[9px] text-slate-600 uppercase font-bold tracking-tight pl-2">
                Zadané prvky sa automaticky pretransformują na štítky v detaile auta pre zákazníkov.
              </p>
            </div>
          </div>

          {/* REVENUE MATICA */}
          <div className="p-10 rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <Euro size={20} strokeWidth={3} />
                <h2 className="font-black uppercase tracking-widest text-sm italic">Revenue Config ({selectedMarket})</h2>
              </div>
              <span className="text-[9px] px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-black uppercase tracking-widest">
                Sadzby pre {selectedMarket}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "1 Deň", key: "price_1_day" },
                { label: "2 - 3 Dni", key: "price_2_3_days" },
                { label: "4 - 7 Dní", key: "price_4_7_days" },
                { label: "8 - 14 Dní", key: "price_8_14_days" },
                { label: "15 - 22 Dní", key: "price_15_22_days" },
                { label: "23+ Dní", key: "price_23_plus_days" },
              ].map((p) => (
                <div key={p.key} className="space-y-2 bg-slate-950/40 p-5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Prenájom na {p.label}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={marketPrices[p.key as keyof typeof marketPrices] || ""}
                      onChange={(e) => setMarketPrices({...marketPrices, [p.key]: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3.5 font-black italic text-xl text-white placeholder-slate-800 focus:outline-none focus:border-sky-500 transition-all"
                    />
                    <span className="absolute right-4 font-black italic text-sm text-slate-500">€ / deň</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CENA ZA NADLIMIT KM */}
            <div className="pt-6 border-t border-white/5">
              <div className="space-y-2 bg-sky-500/5 p-5 rounded-2xl border border-sky-500/20">
                <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Gauge size={12} /> Cena za nadlimit km (1 km) - {selectedMarket}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={marketPrices.extra_km_price || ""}
                    onChange={(e) => setMarketPrices({...marketPrices, extra_km_price: Number(e.target.value)})}
                    placeholder="0.0"
                    className="w-full bg-slate-900 border border-sky-500/20 rounded-xl px-4 py-3.5 font-black italic text-xl text-sky-400 placeholder-sky-900/50 focus:outline-none focus:border-sky-500 transition-all"
                  />
                  <span className="absolute right-4 font-black italic text-sm text-sky-400/50">€ / km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VPRAVO: DEPOZIT A POTVRDENIE */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="p-10 rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3 text-amber-500 border-b border-white/5 pb-4">
              <Shield size={20} strokeWidth={3} />
              <h2 className="font-black uppercase tracking-widest text-sm italic">Security Settings</h2>
            </div>

            <div className="space-y-2 bg-slate-950/40 p-5 rounded-2xl border border-white/5">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">
                Vratný Depozit ({selectedMarket})
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={marketPrices.deposit || ""}
                  onChange={(e) => setMarketPrices({...marketPrices, deposit: Number(e.target.value)})}
                  placeholder="2500"
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3.5 font-black italic text-xl text-amber-500 placeholder-amber-900/50 focus:outline-none focus:border-amber-500 transition-all"
                />
                <span className="absolute right-4 font-black italic text-sm text-amber-500/50">€</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-8 rounded-[2.5rem] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-sky-500/20 active:scale-95 disabled:opacity-50 group cursor-pointer"
          >
            {saving ? (
              <div className="h-6 w-6 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} className="group-hover:rotate-12 transition-transform" /> 
                <span className="uppercase tracking-[0.2em] italic">Uložiť konfiguráciu</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}