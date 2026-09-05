"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Truck, Trash2, CheckCircle, Calendar,
  Clock, FileText, Map, Navigation, Plus, 
  ShieldAlert, User, Globe, ArrowUpRight, Sparkles, Navigation2, RotateCcw
} from "lucide-react";
import { toast } from "react-hot-toast";

const translations: any = {
  SK: {
    title: "Fleet", titleSpan: "Logistics", subtitle: "Manažment medzinárodných prevozov a vozového parku",
    form: {
      sectionTitle: "Nový dispečerský prevoz",
      vehicle: "Výber vozidla z flotily", vehicleSelect: "-- Vybrať vozidlo z ponuky --",
      driver: "Meno vodiča", driverPlaceholder: "Zadajte meno vodiča",
      start: "Miesto naloženia (Odkiaľ)", end: "Miesto vyloženia (Kam)", endPlaceholder: "Cieľová adresa / pobočka",
      departure: "Plánovaný odchod", deadline: "Deadline doručenia",
      notes: "Poznámka", notesPlaceholder: "Napr. Skontrolovať dokumentáciu, plná nádrž...",
      submit: "Vytvoriť a spustiť prevoz"
    },
    card: {
      loading: "Načítavam dispečing...",
      hiddenTitle: "Ohraničený prístup",
      hiddenDesc: "Tento modul je dostupný výhradne pre administrátorov a CEO."
    },
    messages: { successAdd: "Prevoz bol úspešne vytvorený", successDelete: "Záznam bol vymazaný" }
  }
};

export default function AdminLogistics() {
  const [transports, setTransports] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [userMarket, setUserMarket] = useState("SK");
  const [isCEO, setIsCEO] = useState(false);

  const [newTransport, setNewTransport] = useState({
    car_id: "",
    driver_name: "",
    start_location: "Kragujevská 12, Žilina (HQ)",
    end_location: "",
    target_market: "HR", 
    transport_type: "odťahovka",
    scheduled_date: "",
    deadline: "",
    notes: "",
    fuel_level: "100%",
    status: 'active'
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("dashboard_lang");
    if (savedLang) setUserMarket(savedLang);
  }, []);

  const t = translations[userMarket] || translations["SK"];

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "Nezadaný";
    try {
      const parts = isoString.split('T');
      const dateParts = parts[0].split('-');
      const timeParts = parts[1].split(':');
      return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]} o ${timeParts[0]}:${timeParts[1]}`;
    } catch (e) { return isoString; }
  };

  const getGoogleMapsUrl = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const getWazeUrl = (address: string) => `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'CEO') setIsCEO(true);
      }
      
      const { data: cData } = await supabase.from("cars").select("id, car_name, plate_number");
      const { data: tData } = await supabase.from("logistics").select("*").order("created_at", { ascending: false });
      
      setCars(cData || []);
      setTransports(tData || []);
    } catch (error) {
      console.error(error);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCar = cars.find(c => c.id === newTransport.car_id);
    
    const payload = {
      ...newTransport,
      car_name: selectedCar?.car_name || "Neznáme vozidlo",
      plate_number: selectedCar?.plate_number || "BE-FAST",
      status: 'active'
    };

    const { error } = await supabase.from("logistics").insert([payload]);
    if (error) {
      toast.error(error.message);
      console.error(error);
    } else {
      toast.success(t.messages.successAdd);
      setNewTransport({
        car_id: "", driver_name: "", start_location: "Kragujevská 12, Žilina (HQ)",
        end_location: "", target_market: "HR", transport_type: "odťahovka",
        scheduled_date: "", deadline: "", notes: "", fuel_level: "100%", status: 'active'
      });
      fetchData();
    }
  };

  const deleteTransport = async (id: string) => {
    if (!isCEO) return;
    const { error } = await supabase.from("logistics").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      console.error(error);
    } else {
      toast.success(t.messages.successDelete);
      fetchData();
    }
  };

  const updateStatus = async (id: string, targetStatus: string) => {
    if (!isCEO) return;

    // Okamžitá a istá aktualizácia UI lokálne
    setTransports(prev => prev.map(item => item.id === id ? { ...item, status: targetStatus } : item));

    const { error } = await supabase.from("logistics").update({ status: targetStatus }).eq("id", id);
    
    if (error) {
      toast.error("Chyba DB: " + error.message);
      console.error("Supabase Update Error:", error);
      fetchData(); // Vráti pôvodný stav len ak nastala reálna chyba
    } else {
      toast.success(targetStatus === 'completed' ? "Prevoz bol úspešne uzavretý" : "Prevoz bol opäť aktivovaný");
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold tracking-wider text-slate-400">{t.card.loading}</span>
    </div>
  );

  return (
    <div className="space-y-10 pb-24 text-left text-white font-urbanist max-w-7xl mx-auto px-4 lg:px-0">
      
      {/* 🌟 HLAVIČKA */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" /> Live Dispatch System
          </div>
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight">
            {t.title} <span className="text-sky-400">{t.titleSpan}</span>
          </h1>
          <p className="text-xs font-medium text-slate-400">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span>Aktívne prevozy:</span>
            <strong className="text-sky-400 font-black">{transports.filter(x => x.status !== 'completed').length}</strong>
          </div>
        </div>
      </header>

      {/* 📝 FORMULÁR PREVOZU */}
      <section className="bg-slate-900/50 border border-white/10 p-8 lg:p-10 rounded-3xl shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-sky-400 pointer-events-none">
          <Truck size={200} />
        </div>

        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Plus size={18} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-wide">{t.form.sectionTitle}</h2>
            <p className="text-[11px] text-slate-400">Zadajte potrebné detaily pre naplánovanie trasy</p>
          </div>
        </div>

        <form onSubmit={handleAddTransport} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Vozidlo */}
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{t.form.vehicle}</label>
              <select className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all text-white"
                value={newTransport.car_id} onChange={(e) => setNewTransport({...newTransport, car_id: e.target.value})} required>
                <option value="">{t.form.vehicleSelect}</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.car_name} [{c.plate_number}]</option>)}
              </select>
            </div>

            {/* Vodič */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.form.driver}</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder={t.form.driverPlaceholder} className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" 
                  value={newTransport.driver_name} onChange={(e) => setNewTransport({...newTransport, driver_name: e.target.value})} required />
              </div>
            </div>

            {/* Cieľový trh */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cieľový trh</label>
              <div className="relative">
                <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <select className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold outline-none focus:border-sky-400 transition-all appearance-none text-white"
                  value={newTransport.target_market} onChange={(e) => setNewTransport({...newTransport, target_market: e.target.value})}>
                  <option value="SK">Slovensko (SK)</option>
                  <option value="HR">Chorvátsko (HR)</option>
                  <option value="HU">Maďarsko (HU)</option>
                  <option value="BA">Bosna a Hercegovina (BA)</option>
                </select>
              </div>
            </div>

            {/* Odchod */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{t.form.departure}</label>
              <input type="datetime-local" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold [color-scheme:dark]" 
                value={newTransport.scheduled_date} onChange={(e) => setNewTransport({...newTransport, scheduled_date: e.target.value})} required />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{t.form.deadline}</label>
              <input type="datetime-local" className="w-full bg-slate-950 border border-rose-500/30 rounded-2xl px-4 py-3.5 text-xs font-bold text-rose-400 [color-scheme:dark]" 
                value={newTransport.deadline} onChange={(e) => setNewTransport({...newTransport, deadline: e.target.value})} required />
            </div>

            {/* Nakládka */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t.form.start}</label>
              <input type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" 
                value={newTransport.start_location} onChange={(e) => setNewTransport({...newTransport, start_location: e.target.value})} required />
            </div>

            {/* Vykládka */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{t.form.end}</label>
              <input type="text" placeholder={t.form.endPlaceholder} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" 
                value={newTransport.end_location} onChange={(e) => setNewTransport({...newTransport, end_location: e.target.value})} required />
            </div>

            {/* Poznámky */}
            <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.form.notes}</label>
              <input type="text" placeholder={t.form.notesPlaceholder} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold focus:border-sky-400 outline-none transition-all" 
                value={newTransport.notes} onChange={(e) => setNewTransport({...newTransport, notes: e.target.value})} />
            </div>

            <div className="lg:col-span-3 pt-2">
              <button type="submit" className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase text-xs tracking-widest rounded-2xl transition-all cursor-pointer shadow-lg shadow-sky-500/20">
                {t.form.submit}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* 🚛 ZOZNAM PREVOZOV */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Prevozy v systéme ({transports.length})</h3>
        </div>

        {isCEO ? (
          <div className="grid grid-cols-1 gap-5">
            {transports.map((t_item) => {
              const isCompleted = t_item.status === 'completed';
              return (
                <div key={t_item.id} className={`border rounded-3xl p-6 lg:p-7 transition-all ${isCompleted ? 'bg-slate-900/20 border-white/5 opacity-40' : 'bg-slate-900/50 border-white/10 shadow-lg hover:border-white/20'}`}>
                  
                  {/* Hlavné informácie o aute a vodičovi */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-slate-800 text-slate-500' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'}`}>
                        <Truck size={24} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-base font-black uppercase tracking-tight text-white">{t_item.car_name}</h4>
                          <span className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[10px] font-mono font-bold text-slate-300 border border-white/5">
                            {t_item.plate_number}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="text-sky-400 font-bold uppercase text-[11px]">Trh: {t_item.target_market || "SK"}</span>
                          <span>•</span>
                          <span>Vodič: <strong className="text-white">{t_item.driver_name || "Neznámy"}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Akcie (Hotovo / Zmazať) */}
                    <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
                      {isCompleted ? (
                        <button onClick={() => updateStatus(t_item.id, 'active')} 
                          className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 transition-all cursor-pointer">
                          <RotateCcw size={15} />
                          <span>Obnoviť</span>
                        </button>
                      ) : (
                        <button onClick={() => updateStatus(t_item.id, 'completed')} 
                          className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/30 hover:text-slate-950 text-emerald-400 transition-all cursor-pointer">
                          <CheckCircle size={15} />
                          <span>Uzavrieť</span>
                        </button>
                      )}

                      <button onClick={() => deleteTransport(t_item.id)} 
                        className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-slate-950 transition-all cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Trasa (Nakládka vs Vykládka) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5 pt-5 border-t border-white/5">
                    
                    {/* Nakládka */}
                    <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">Nakládka (Odkiaľ)</span>
                        <p className="text-xs font-medium text-slate-200">{t_item.start_location}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a href={getGoogleMapsUrl(t_item.start_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-sky-500 hover:text-slate-950 rounded-xl text-slate-400 transition-all" title="Google Maps">
                          <Map size={13} />
                        </a>
                        <a href={getWazeUrl(t_item.start_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-sky-500 hover:text-slate-950 rounded-xl text-slate-400 transition-all" title="Waze">
                          <Navigation2 size={13} />
                        </a>
                      </div>
                    </div>

                    {/* Vykládka */}
                    <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 block">Vykládka (Kam)</span>
                        <p className="text-xs font-medium text-slate-200">{t_item.end_location}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a href={getGoogleMapsUrl(t_item.end_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-rose-500 hover:text-slate-950 rounded-xl text-slate-400 transition-all" title="Google Maps">
                          <Map size={13} />
                        </a>
                        <a href={getWazeUrl(t_item.end_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-rose-500 hover:text-slate-950 rounded-xl text-slate-400 transition-all" title="Waze">
                          <Navigation2 size={13} />
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* Harmonogram a poznámky */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-sky-400" />
                        <span>Odchod: <strong className="text-white">{formatDateTime(t_item.scheduled_date)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
                        <Clock size={13} />
                        <span>Deadline: <strong className="text-white font-bold">{formatDateTime(t_item.deadline)}</strong></span>
                      </div>
                    </div>

                    {t_item.notes && (
                      <div className="flex items-center gap-1.5 text-slate-300 italic">
                        <FileText size={13} className="text-slate-500" />
                        <span>{t_item.notes}</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-14 border border-white/5 bg-slate-900/20 rounded-3xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3.5 bg-white/5 rounded-2xl text-slate-500">
              <ShieldAlert size={28} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-base font-black uppercase text-slate-400">{t.card.hiddenTitle}</h3>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1.5 leading-relaxed">
                {t.card.hiddenDesc}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}