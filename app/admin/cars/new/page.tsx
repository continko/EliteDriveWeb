"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Car, Save, ArrowLeft, Image as ImageIcon, 
  Settings2, Fuel, Zap, Clock, Shield, Euro,
  Globe, Gauge, Hammer
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // STAVY PRE FORMULÁR - UltimateDrive Branding
  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    year: new Date().getFullYear(),
    market_code: "SK",
    image_url: "",
    power: "",
    fuel: "Benzín",
    transmission: "Automat",
    drive: "4x4",
    min_age: 21,
    min_license_years: 2,
    equipment: "", 
  });

  // STAVY PRE CENY
  const [prices, setPrices] = useState({
    price_1_day: 0,
    price_2_3_days: 0,
    price_4_7_days: 0,
    price_8_14_days: 0,
    price_15_22_days: 0,
    price_23_plus_days: 0,
    deposit: 1000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Vložíme auto do tabuľky 'cars'
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .insert([{
          ...formData,
          equipment: formData.equipment.split(",").map(i => i.trim()).filter(i => i !== ""),
          is_active: true
        }])
        .select()
        .single();

      if (carError) throw carError;

      // 2. Vložíme ceny do tabuľky 'car_prices'
      const { error: priceError } = await supabase
        .from('car_prices')
        .insert([{
          car_id: carData.id,
          ...prices
        }]);

      if (priceError) throw priceError;

      toast.success("Stroj bol úspešne pridaný do UltimateDrive flotily!");
      router.push("/admin/cars");
    } catch (error: any) {
      toast.error(`Chyba pri ukladaní: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <Link href="/admin/cars" className="group flex items-center gap-2 text-slate-500 hover:text-sky-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Späť do garáže
          </Link>
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            <span className="text-sky-500">Pridať nové vozidlo</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <Shield size={18} className="text-sky-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Konfigurácia nového vozidla pre UltimateDrive
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SPECS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Značka a Model */}
          <div className="p-10 rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm space-y-8">
            <div className="flex items-center gap-3 text-sky-500">
              <Car size={20} strokeWidth={3} />
              <h2 className="font-black uppercase tracking-widest text-sm italic">Údaje o vozidle</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Značka" placeholder="napr. Porsche" 
                          onChange={(v: any) => setFormData({...formData, brand: v})} />
              <InputGroup label="Model" placeholder="napr. 911 GT3 RS" 
                          onChange={v => setFormData({...formData, name: v})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Globe size={12} /> Cieľový Trh
                </label>
                <select 
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm text-white font-bold outline-none focus:border-sky-500 transition-all appearance-none cursor-pointer"
                    onChange={e => setFormData({...formData, market_code: e.target.value})}
                >
                  <option value="SK">Slovensko (SK)</option>
                  <option value="HR">Chorvátsko (HR)</option>
                  <option value="HU">Maďarsko (HU)</option>
                  <option value="BA">Bosna (BA)</option>
                  <option value="ME">Čierna Hora (ME)</option>
                </select>
              </div>
              <InputGroup label="Palivo" placeholder="Benzín" icon={<Fuel size={12}/>}
                          onChange={v => setFormData({...formData, fuel: v})} />
              <InputGroup label="Výkon" placeholder="525 hp / 465 Nm" icon={<Zap size={12}/>}
                          onChange={v => setFormData({...formData, power: v})} />
            </div>
          </div>

          {/* Výbava a Foto */}
          <div className="p-10 rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm space-y-8">
            <div className="flex items-center gap-3 text-sky-500">
              <Hammer size={20} strokeWidth={3} />
              <h2 className="font-black uppercase tracking-widest text-sm italic">Technické detaily</h2>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prémiová Výbava (oddeľuj čiarkou)</label>
              <textarea 
                placeholder="Carbon ceramic brakes, Clubsport package, Bose Surround..." 
                className="w-full bg-slate-950 border border-white/10 rounded-[2rem] p-6 text-sm text-white font-medium outline-none focus:border-sky-500 transition-all min-h-[120px] resize-none"
                onChange={e => setFormData({...formData, equipment: e.target.value})} 
              />
            </div>

            <InputGroup label="URL Fotografie (High Res)" placeholder="https://images.ultimatedrive.sk/911-gt3.jpg" icon={<ImageIcon size={12}/>}
                        onChange={v => setFormData({...formData, image_url: v})} />
          </div>
        </div>

        {/* RIGHT COLUMN: PRICING */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-10 rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl space-y-8">
            <div className="flex items-center gap-3 text-emerald-500">
              <Euro size={20} strokeWidth={3} />
              <h2 className="font-black uppercase tracking-widest text-sm italic">Revenue Config</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "1 Deň", key: "price_1_day" },
                { label: "2 - 3 Dni", key: "price_2_3_days" },
                { label: "4 - 7 Dní", key: "price_4_7_days" },
                { label: "8 - 14 Dní", key: "price_8_14_days" },
                { label: "15+ Dní", key: "price_15_22_days" },
              ].map((p) => (
                <div key={p.key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{p.label}</span>
                  <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        className="bg-transparent text-right text-white font-black outline-none w-20 text-lg italic" 
                        placeholder="0"
                        onChange={e => setPrices({...prices, [p.key]: Number(e.target.value)})} 
                    />
                    <span className="text-xs text-slate-600">€</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Depozit (Security)</span>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        className="bg-transparent text-right text-amber-500 font-black outline-none w-24 text-xl italic" 
                        placeholder="2500"
                        onChange={e => setPrices({...prices, deposit: Number(e.target.value)})} 
                    />
                    <span className="text-xs text-amber-500/50">€</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-8 rounded-[2.5rem] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-sky-500/20 active:scale-95 disabled:opacity-50 group"
          >
            {loading ? (
                <div className="h-6 w-6 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    <Save size={20} className="group-hover:rotate-12 transition-transform" /> 
                    <span className="uppercase tracking-[0.2em] italic">Potvrdiť do garáže</span>
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// POMOCNÝ KOMPONENT PRE ČISTÝ KÓD
function InputGroup({ label, placeholder, onChange, icon }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                {icon} {label}
            </label>
            <input 
                required 
                placeholder={placeholder} 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm text-white font-bold outline-none focus:border-sky-500 transition-all placeholder:text-slate-800"
                onChange={e => onChange(e.target.value)} 
            />
        </div>
    );
}