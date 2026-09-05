"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ChevronLeft, Calendar, Gauge, ShieldCheck, 
  Wrench, FileText, Save, Info, Shield, Globe, 
  Disc, AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";

export default function CarDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCarData = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select(`
        *,
        car_details (*)
      `)
      .eq("id", id)
      .single();

    if (!error && data) {
      setCar(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarData();
  }, [id]);

  const updateDetailField = (field: string, value: any) => {
    const currentDetails = car.car_details?.[0] || {};
    setCar({
      ...car,
      car_details: [{ ...currentDetails, [field]: value }]
    });
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const details = car.car_details[0];

    const { error } = await supabase
      .from("car_details")
      .update({
        license_plate: details.license_plate,
        vin_number: details.vin_number,
        mileage: details.mileage,
        last_service_km: details.last_service_km,
        stk_ek_expiration: details.stk_ek_expiration,
        pzp_expiration: details.pzp_expiration,
        kasko_expiration: details.kasko_expiration,
        vignette_sk_expiration: details.vignette_sk_expiration,
        vignette_hu_expiration: details.vignette_hu_expiration,
        vignette_at_expiration: details.vignette_at_expiration,
        vignette_cz_expiration: details.vignette_cz_expiration,
        engine_power: details.engine_power,
        notes: details.notes,
        // ZAPOJENÉ NOVÉ POLIA:
        tyre_type: details.tyre_type,
        tyre_tread_mm: details.tyre_tread_mm,
        damage_log: details.damage_log
      })
      .eq("car_id", id);

    if (!error) {
      toast.success("Technická karta úspešne aktualizovaná!");
      fetchCarData();
    } else {
      toast.error("Chyba pri ukladaní: " + error.message);
    }
    setIsSaving(false);
  };

  if (loading) return <div className="p-10 text-white font-urbanist animate-pulse uppercase italic font-black text-left">Sťahujem technické dáta...</div>;
  if (!car) return <div className="p-10 text-white text-left">Vozidlo nebolo nájdené.</div>;

  const details = car.car_details?.[0] || {};

  return (
    <div className="space-y-6 font-urbanist pb-20 text-left">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              {car.name} <span className="text-sky-500 ml-2">{details.license_plate || "BEZ ŠPZ"}</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 italic">
              Vehicle Intelligence & Asset Monitoring
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSaveDetails}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-4 bg-sky-500 text-black font-black uppercase italic rounded-2xl hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20"
        >
          {isSaving ? "Synchronizujem..." : <><Save size={18} /> Uložiť technickú kartu</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. IDENTIFIKÁCIA A KM */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl text-white">
            <h3 className="text-lg font-black text-white uppercase italic mb-6 flex items-center gap-2">
              <Info size={18} className="text-sky-500" /> Základná Identifikácia
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-sky-500 uppercase ml-2 tracking-widest">ŠPZ / EČV</label>
                <input 
                  type="text"
                  value={details.license_plate || ""}
                  onChange={(e) => updateDetailField("license_plate", e.target.value.toUpperCase())}
                  className="w-full bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-sky-500 font-black uppercase tracking-widest focus:border-sky-500 outline-none transition-all"
                  placeholder="BT123XX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">VIN Číslo</label>
                <input 
                  type="text"
                  value={details.vin_number || ""}
                  onChange={(e) => updateDetailField("vin_number", e.target.value.toUpperCase())}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white font-bold uppercase tracking-widest focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Aktuálne KM</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={details.mileage || 0}
                    onChange={(e) => updateDetailField("mileage", parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white font-black italic focus:border-sky-500 outline-none transition-all"
                  />
                  <Gauge className="absolute right-4 top-4 text-slate-600" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Servis pri (KM)</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={details.last_service_km || 0}
                    onChange={(e) => updateDetailField("last_service_km", parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white font-black italic focus:border-sky-500 outline-none transition-all"
                  />
                  <Wrench className="absolute right-4 top-4 text-slate-600" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. LEGISLATÍVA A POISTENIE */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl text-white">
            <h3 className="text-lg font-black text-white uppercase italic mb-6 flex items-center gap-2">
              <Shield size={18} className="text-orange-500" /> Poistenia & Kontroly
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-500 uppercase ml-2 tracking-widest">STK / EK Platnosť</label>
                <input 
                  type="date"
                  value={details.stk_ek_expiration || ""}
                  onChange={(e) => updateDetailField("stk_ek_expiration", e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[12px] text-white font-bold outline-none focus:border-rose-500 transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-500 uppercase ml-2 tracking-widest">PZP (Zákonná)</label>
                <input 
                  type="date"
                  value={details.pzp_expiration || ""}
                  onChange={(e) => updateDetailField("pzp_expiration", e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[12px] text-white font-bold outline-none focus:border-emerald-500 transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sky-500 uppercase ml-2 tracking-widest">KASKO (Havarijná)</label>
                <input 
                  type="date"
                  value={details.kasko_expiration || ""}
                  onChange={(e) => updateDetailField("kasko_expiration", e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[12px] text-white font-bold outline-none focus:border-sky-500 transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* 3. STAV PNEUMATÍK */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl text-white">
            <h3 className="text-lg font-black text-white uppercase italic mb-6 flex items-center gap-2">
              <Disc size={18} className="text-sky-500" /> Pneumatiky a obutie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Typ aktuálneho obutia</label>
                <select 
                  value={details.tyre_type || "Letné"}
                  onChange={(e) => updateDetailField("tyre_type", e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-white font-bold outline-none focus:border-sky-500 transition-all"
                >
                  <option value="Letné">Letné pneumatiky</option>
                  <option value="Zimné">Zimné pneumatiky</option>
                  <option value="Celoročné">Celoročné pneumatiky</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Hĺbka dezénu (Zostatok v mm)</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="6.5"
                  value={details.tyre_tread_mm || ""}
                  onChange={(e) => updateDetailField("tyre_tread_mm", parseFloat(e.target.value))}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-white font-black italic focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* 4. DIAĽNIČNÉ ZNÁMKY */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl text-white">
            <h3 className="text-lg font-black text-white uppercase italic mb-6 flex items-center gap-2">
              <Globe size={18} className="text-emerald-500" /> Diaľničné známky
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "vignette_sk_expiration", label: "Slovensko (SK)" },
                { id: "vignette_hu_expiration", label: "Maďarsko (HU)" },
                { id: "vignette_at_expiration", label: "Rakúsko (AT)" },
                { id: "vignette_cz_expiration", label: "Česko (CZ)" },
              ].map((v) => (
                <div key={v.id} className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-1">{v.label}</label>
                  <input 
                    type="date"
                    value={details[v.id] || ""}
                    onChange={(e) => updateDetailField(v.id, e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[12px] text-white font-bold outline-none focus:border-emerald-500 transition-all [color-scheme:dark]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR - POZNÁMKY & ŠKODY */}
        <div className="space-y-6">
          {/* INTERNÉ POZNÁMKY */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 flex flex-col backdrop-blur-xl text-white">
            <h3 className="font-black text-white uppercase italic mb-4 flex items-center gap-2">
              <FileText size={18} className="text-slate-500" /> Interné Poznámky
            </h3>
            <textarea 
              value={details.notes || ""}
              onChange={(e) => updateDetailField("notes", e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-slate-300 text-sm outline-none focus:border-sky-500 transition-all resize-none min-h-[160px]"
              placeholder="Všeobecné administratívne záznamy..."
            />
          </div>

          {/* DAMAGE LOG (EVIDENCIA ŠKÔD) */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 flex flex-col backdrop-blur-xl text-white">
            <h3 className="font-black text-rose-500 uppercase italic mb-4 flex items-center gap-2">
              <AlertTriangle size={18} /> Aktuálne škody / Kozmetika
            </h3>
            <textarea 
              value={details.damage_log || ""}
              onChange={(e) => updateDetailField("damage_log", e.target.value)}
              className="w-full bg-black/40 border border-rose-500/10 focus:border-rose-500 rounded-2xl p-4 text-rose-300/90 text-sm outline-none transition-all resize-none min-h-[200px]"
              placeholder="Napr. Ošúchaný pravý predný disk, mikroškrabanec na kapote od kamienka..."
            />
            <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-slate-500 uppercase font-bold leading-relaxed">
              Posledná aktualizácia: <br/> 
              <span className="text-white italic">{details.updated_at ? new Date(details.updated_at).toLocaleString('sk-SK') : 'Neznáma'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}