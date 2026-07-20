"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Truck, Trash2, CheckCircle, Calendar,
  Fuel, EyeOff, Clock, FileText,
  Map, Compass, Plus, Type
} from "lucide-react";
import { toast } from "react-hot-toast";

const translations: any = {
  SK: {
    title: "Fleet", titleSpan: "Logistics", subtitle: "Medzinárodné interné prevozy",
    form: {
      vehicle: "1. Výber auta z flotily", vehicleSelect: "-- Vybrať vozidlo z ponuky --",
      manualVehicle: "Zadať vozidlo manuálne (Mimo flotily)",
      carNamePlaceholder: "Napr. BMW M3 G80", platePlaceholder: "ŠPZ (napr. ZA-123XX)",
      driver: "Vodič odťahovky", driverPlaceholder: "Kto to vezie?",
      fuel: "Stav nádrže autá", fuelFull: "100% (Full)", fuelReserve: "Rezerva",
      start: "Miesto naloženia (Odkiaľ)", end: "Miesto vyloženia (Kam - cieľový trh)", endPlaceholder: "Zadajte cieľovú adresu pobočky",
      departure: "Plánovaný Odchod", deadline: "Deadline Doručenia",
      notes: "Interné poznámky k prevozu", notesPlaceholder: "Napr. Prevoz na chorvátsky trh, auto umyť...",
      submit: "Zadať interný presun auta"
    },
    card: {
      fuel: "Palivo", deadline: "Deadline doručenia", pointA: "Nakládka", pointB: "Vykládka",
      instructions: "Inštrukcie", loading: "Synchronizujem Logistics...",
      hiddenTitle: "Monitoring je skrytý",
      hiddenDesc: "Aktuálne trasy spravuje centrála."
    },
    messages: { successAdd: "Interný prevoz bol úspešne naplánovaný", successDone: "Preprava uzavretá", successDelete: "Zmazané" }
  }
};

export default function AdminLogistics() {
  const [transports, setTransports] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [userMarket, setUserMarket] = useState("SK");
  const [isCEO, setIsCEO] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);

  const [newTransport, setNewTransport] = useState({
    car_id: "",
    manual_car_name: "",
    manual_plate_number: "",
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

  const formatDateTimeManual = (isoString: string) => {
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
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role, market_code').eq('id', user.id).single();
        if (profile?.role === 'CEO') setIsCEO(true);
      }
      
      // OPRAVA: Vyhodený market_code, ktorý spôsoboval chybu 400
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
    
    let finalCarName = newTransport.manual_car_name;
    let finalPlate = newTransport.manual_plate_number;
    let finalTargetMarket = newTransport.target_market;

    if (!isManualInput) {
      const selectedCar = cars.find(c => c.id === newTransport.car_id);
      finalCarName = selectedCar?.car_name || "Neznáme auto";
      finalPlate = selectedCar?.plate_number || "BE-FAST";
    }

    const payload = {
      driver_name: newTransport.driver_name,
      start_location: newTransport.start_location,
      end_location: newTransport.end_location,
      transport_type: newTransport.transport_type,
      scheduled_date: newTransport.scheduled_date,
      deadline: newTransport.deadline,
      notes: newTransport.notes,
      fuel_level: newTransport.fuel_level,
      status: newTransport.status,
      car_name: finalCarName,
      plate_number: finalPlate,
      target_market: finalTargetMarket
    };

    const { error } = await supabase.from("logistics").insert([payload]);
    if (error) toast.error(error.message);
    else {
      toast.success(t.messages.successAdd);
      setNewTransport({
        ...newTransport,
        car_id: "", manual_car_name: "", manual_plate_number: "",
        end_location: "", notes: "", deadline: "", scheduled_date: ""
      });
      fetchData();
    }
  };

  const deleteTransport = async (id: string) => {
    if (!isCEO) return;
    const { error } = await supabase.from("logistics").delete().eq("id", id);
    if (!error) { toast.success(t.messages.successDelete); fetchData(); }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (!isCEO) return;
    const newStatus = currentStatus === 'completed' ? 'active' : 'completed';
    const { error } = await supabase.from("logistics").update({ status: newStatus }).eq("id", id);
    if (!error) { toast.success(t.messages.successDone); fetchData(); }
  };

  if (loading) return <div className="p-20 text-center text-white italic font-black uppercase tracking-[0.3em] animate-pulse">{t.card.loading}</div>;

  return (
    <div className="space-y-8 pb-20 text-left text-white font-urbanist">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
            {t.title} <span className="text-sky-500">{t.titleSpan}</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">{t.subtitle}</p>
        </div>
        
        <button type="button" onClick={() => setIsManualInput(!isManualInput)}
          className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer">
          {isManualInput ? <Plus size={14} className="text-sky-500" /> : <Type size={14} className="text-sky-500" />}
          {isManualInput ? "Vybrať z ponuky áut" : "Zadať auto ručne"}
        </button>
      </header>

      {/* DISPEČING FORMULÁR */}
      <section className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <form onSubmit={handleAddTransport} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {!isManualInput ? (
              <div className="space-y-2 lg:col-span-2">
                <label className="text-[10px] font-black text-sky-500 uppercase ml-2 italic">{t.form.vehicle}</label>
                <select className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-sky-500 outline-none transition-all"
                  value={newTransport.car_id} onChange={(e) => setNewTransport({...newTransport, car_id: e.target.value})} required>
                  <option value="">{t.form.vehicleSelect}</option>
                  {cars.map(c => <option key={c.id} value={c.id}>{c.car_name} [{c.plate_number}]</option>)}
                </select>
              </div>
            ) : (
              <>
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-[10px] font-black text-sky-500 uppercase ml-2 italic">Názov auta (Manuálne)</label>
                  <input type="text" placeholder={t.form.carNamePlaceholder} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-sky-500 outline-none" 
                    value={newTransport.manual_car_name} onChange={(e) => setNewTransport({...newTransport, manual_car_name: e.target.value})} required />
                </div>
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-[10px] font-black text-sky-500 uppercase ml-2 italic">ŠPZ auta</label>
                  <input type="text" placeholder={t.form.platePlaceholder} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-sky-500 outline-none" 
                    value={newTransport.manual_plate_number} onChange={(e) => setNewTransport({...newTransport, manual_plate_number: e.target.value})} required />
                </div>
              </>
            )}

            <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 italic">{t.form.driver}</label>
              <input type="text" placeholder={t.form.driverPlaceholder} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-sky-500 outline-none" 
                value={newTransport.driver_name} onChange={(e) => setNewTransport({...newTransport, driver_name: e.target.value})} required />
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 italic">Cieľový trh (Kam ide)</label>
              <select className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold outline-none focus:border-sky-500"
                value={newTransport.target_market} onChange={(e) => setNewTransport({...newTransport, target_market: e.target.value})}>
                <option value="SK">Slovensko (SK)</option>
                <option value="HR">Chorvátsko (HR)</option>
                <option value="HU">Maďarsko (HU)</option>
                <option value="BA">Bosna (BA)</option>
              </select>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black text-emerald-500 uppercase ml-2 italic ">{t.form.start}</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-emerald-500 outline-none" 
                value={newTransport.start_location} onChange={(e) => setNewTransport({...newTransport, start_location: e.target.value})} required />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black text-rose-500 uppercase ml-2 italic ">{t.form.end}</label>
              <input type="text" placeholder={t.form.endPlaceholder} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-rose-500 outline-none" 
                value={newTransport.end_location} onChange={(e) => setNewTransport({...newTransport, end_location: e.target.value})} required />
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-black text-sky-500 uppercase ml-2 italic">{t.form.departure}</label>
              <input type="datetime-local" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold [color-scheme:dark]" 
                value={newTransport.scheduled_date} onChange={(e) => setNewTransport({...newTransport, scheduled_date: e.target.value})} required />
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-black text-rose-500 uppercase ml-2 italic">{t.form.deadline}</label>
              <input type="datetime-local" className="w-full bg-black border border-rose-500/20 rounded-xl px-5 py-4 text-xs font-bold text-rose-500 [color-scheme:dark]" 
                value={newTransport.deadline} onChange={(e) => setNewTransport({...newTransport, deadline: e.target.value})} required />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 italic">{t.form.notes}</label>
              <input type="text" placeholder={t.form.notesPlaceholder} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-sky-500 outline-none" 
                value={newTransport.notes} onChange={(e) => setNewTransport({...newTransport, notes: e.target.value})} />
            </div>

            <button type="submit" className="lg:col-span-4 h-[55px] bg-sky-500 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-white transition-all cursor-pointer shadow-lg shadow-sky-500/20">
              {t.form.submit}
            </button>
          </div>
        </form>
      </section>

      {/* MONITORING PREVOZOV */}
      <div className="space-y-4">
        {isCEO ? (
          transports.map((t_item) => (
            <div key={t_item.id} className={`border rounded-3xl p-6 transition-all ${t_item.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10 opacity-40' : 'bg-slate-900/70 border-white/5 shadow-2xl'}`}>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1 w-full min-w-0">
                  
                  <div className="flex items-center gap-4 min-w-[260px] shrink-0">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${t_item.status === 'completed' ? 'bg-emerald-500 text-black' : 'bg-sky-500 text-black'}`}>
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tight text-white leading-tight">{t_item.car_name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-white/10 text-slate-200 px-2 py-0.5 rounded text-[10px] font-black font-mono tracking-wider">{t_item.plate_number}</span>
                        {/* OPRAVENÉ: Už žiadny Presov, teraz je to čistý Interný prevoz */}
                        <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide">
                          INTERNÝ PREVOZ ➔ {t_item.target_market || "Pobočka"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ADRESY S NAVIGÁCIOU */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 bg-black/50 p-4 rounded-2xl flex-1 border border-white/5 w-full min-w-0">
                    
                    <div className="flex items-center justify-between gap-3 min-w-0 bg-white/[0.01] px-4 py-3 rounded-xl border border-white/[0.03]">
                      <div className="min-w-0">
                        <span className="text-[10px] text-emerald-400 font-black block uppercase tracking-wider mb-0.5 italic">{t.card.pointA}</span>
                        <p className="font-mono text-sm text-slate-200 truncate font-bold">{t_item.start_location}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <a href={getGoogleMapsUrl(t_item.start_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-sky-400 hover:text-black rounded-lg transition-all text-slate-400" title="Google Maps">
                          <Map size={15} />
                        </a>
                        <a href={getWazeUrl(t_item.start_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-sky-400 hover:text-black rounded-lg transition-all text-slate-400" title="Waze">
                          <Compass size={15} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 min-w-0 bg-white/[0.01] px-4 py-3 rounded-xl border border-white/[0.03]">
                      <div className="min-w-0">
                        <span className="text-[10px] text-rose-400 font-black block uppercase tracking-wider mb-0.5 italic">{t.card.pointB}</span>
                        <p className="font-mono text-sm text-slate-200 truncate font-bold">{t_item.end_location}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <a href={getGoogleMapsUrl(t_item.end_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-rose-400 hover:text-black rounded-lg transition-all text-slate-400" title="Google Maps">
                          <Map size={15} />
                        </a>
                        <a href={getWazeUrl(t_item.end_location)} target="_blank" rel="noopener noreferrer" 
                           className="p-2 bg-white/5 hover:bg-rose-400 hover:text-black rounded-lg transition-all text-slate-400" title="Waze">
                          <Compass size={15} />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex items-center lg:justify-end gap-2 shrink-0 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                  <button onClick={() => toggleStatus(t_item.id, t_item.status)} className={`p-4 rounded-xl transition-all cursor-pointer ${t_item.status === 'completed' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                    <CheckCircle size={20} />
                  </button>
                  <button onClick={() => deleteTransport(t_item.id)} className="p-4 bg-rose-600/10 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* SPODNÁ INFO LIŠTA PRE VODIČOV */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 pt-4 border-t border-white/5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-sky-500" />
                  <span>Nakladať od: <span className="text-white italic font-semibold">{formatDateTimeManual(t_item.scheduled_date)}</span></span>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
                  <Clock size={14} />
                  <span>{t.card.deadline}: <span className="text-white font-black italic">{formatDateTimeManual(t_item.deadline)}</span></span>
                </div>

                <div className="bg-white/5 px-2.5 py-1 rounded-md">
                  Vodič: <span className="text-white italic font-mono font-semibold">{t_item.driver_name || "Neznámy"}</span>
                </div>

                {t_item.notes && (
                  <div className="flex items-center gap-2 text-slate-300 normal-case font-normal truncate max-w-md lg:ml-auto border-l border-white/10 pl-4 w-full lg:w-auto">
                    <FileText size={14} className="text-slate-500 shrink-0" />
                    <span className="truncate text-xs"><span className="font-black text-[10px] uppercase tracking-wider text-slate-500 mr-1">{t.card.instructions}:</span> {t_item.notes}</span>
                  </div>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="p-12 border border-white/5 bg-slate-900/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white/5 rounded-full text-slate-600">
              <EyeOff size={30} />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-black uppercase italic text-slate-400">{t.card.hiddenTitle}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 leading-relaxed">
                {t.card.hiddenDesc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}