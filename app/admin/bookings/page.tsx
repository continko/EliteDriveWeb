"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Car, User, Mail, MapPin, Wallet, Zap, ChevronDown, ChevronUp, 
  Phone, ShieldCheck, Download, ClipboardCheck, CreditCard, Banknote, FileText, Search, Trash2, Plus, Calendar, Building2, CheckCircle, RotateCcw
} from "lucide-react";
import { toast } from "react-hot-toast";

const translations: any = {
  SK: {
    title: "Rezervácie", 
    subtitle: "Každá rezervácia - pickupy, vrátenia a všetko okolo.",
    newBooking: "Nová rezervácia",
    search: "Hľadať v rezerváciach",
    filters: { 
      all: "All",
      pending: "Čakajúce", 
      onRent: "Prenajaté", 
      returned: "Ukončené", 
      canceled: "Zrušené" 
    },
    empty: "No reservations yet — add your first one.",
    card: { 
      confirm: "Potvrdiť", 
      storno: "Zrušiť", 
      endRental: "Ukončiť prenájom", 
      cancelledText: "Zrušená",
      returnedText: "Vrátené / Ukončené" 
    },
    details: {
      personal: "Osobné Údaje & Kontakt",
      logistics: "Logistika & Miesta",
      fin: "Financie & Protokol",
      verification: "Doklady & Údaje",
      protocolBtn: "Preberací protokol"
    },
    messages: { loading: "Sťahujem operačné dáta...", error: "Chyba synchronizácie", statusOk: "Rezervácia: AKTUALIZOVANÁ" }
  },
  EN: {
    title: "Reservations", 
    subtitle: "Every booking — pickups, returns, and what's on rent right now.",
    newBooking: "New Reservation",
    search: "Search reservations...",
    filters: { 
      all: "All", 
      pending: "Pending", 
      onRent: "On Rent", 
      returned: "Returned", 
      canceled: "Canceled" 
    },
    empty: "No reservations yet — add your first one.",
    card: { 
      confirm: "Confirm", 
      storno: "Cancel", 
      endRental: "End Rental", 
      cancelledText: "Cancelled",
      returnedText: "Returned" 
    },
    details: {
      personal: "Personal Details & Contact",
      logistics: "Logistics & Locations",
      fin: "Finance & Protocol",
      verification: "Documents & Data",
      protocolBtn: "Handover Protocol"
    },
    messages: { loading: "Downloading operational data...", error: "Sync error", statusOk: "Booking: UPDATED" }
  }
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMarket, setUserMarket] = useState("SK");
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("dashboard_lang");
    if (savedLang && translations[savedLang]) setUserMarket(savedLang);
    fetchBookings();

    // Automatický tichý refresh každých 90 sekúnd na pozadí
    const interval = setInterval(() => {
      fetchBookings(false); // voláme bez zapínania hlavného loading stavu, aby to neblikalo
    }, 90000);

    return () => clearInterval(interval);
  }, []);

  const t = translations[userMarket] || translations["SK"];

  const fetchBookings = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error(t.messages.error);
    else setBookings(data || []);
    if (showLoading) setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast.error("Error pri aktualizácii statusu");
      console.error(error);
    } else {
      toast.success(t.messages.statusOk);
      fetchBookings(false);
    }
  };

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.car_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.variable_symbol?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'pending') return b.status === 'pending';
    if (filter === 'canceled') return b.status === 'cancelled' || b.status === 'canceled';
    if (filter === 'onRent') return b.status === 'confirmed'; 
    return b.status === filter;
  });

  if (loading) return <div className="p-20 text-center text-white italic">Loading...</div>;

  return (
    <div className="space-y-8 font-urbanist text-left">
      
      {/* HLAVIČKA */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{t.subtitle}</p>
        </div>

        <button 
          onClick={() => toast("Sem môžeš pridať formulár pre vytvorenie rezervácie")}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
          style={{ background: '#f59e0b' }} 
        >
          <Plus size={16} /> {t.newBooking}
        </button>
      </div>

      {/* ZÁLOŽKY + VYHĽADÁVANIE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {[
            { id: 'all', label: t.filters.all, activeColor: "text-sky-400 border-sky-400", hoverColor: "hover:text-sky-400" },
            { id: 'pending', label: t.filters.pending, activeColor: "text-amber-400 border-amber-400", hoverColor: "hover:text-amber-400" },
            { id: 'onRent', label: t.filters.onRent, activeColor: "text-emerald-400 border-emerald-400", hoverColor: "hover:text-emerald-400" },
            { id: 'returned', label: t.filters.returned, activeColor: "text-slate-300 border-slate-300", hoverColor: "hover:text-slate-200" },
            { id: 'canceled', label: t.filters.canceled, activeColor: "text-rose-400 border-rose-400", hoverColor: "hover:text-rose-400" }
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`text-xs font-bold transition-all whitespace-nowrap pb-4 -mb-4 cursor-pointer border-b-2 ${
                  isActive 
                  ? `${tab.activeColor}` 
                  : `border-transparent text-slate-400 ${tab.hoverColor}`
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-all"
          />
        </div>
      </div>

      {/* ZOZNAM */}
      {filteredBookings.length === 0 ? (
        <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <Calendar size={24} />
          </div>
          <p className="text-xs font-medium text-slate-400">{t.empty}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isCancelled = b.status === 'cancelled' || b.status === 'canceled';
            const isConfirmed = b.status === 'confirmed';
            const isReturned = b.status === 'returned';
            const isPending = b.status === 'pending';

            return (
              <div key={b.id} className={`bg-slate-900/20 border rounded-[2.5rem] overflow-hidden transition-all ${isCancelled ? 'border-rose-500/20 opacity-75' : isReturned ? 'border-slate-700/50 opacity-80' : 'border-white/5'}`}>
                <div className="p-8 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-white italic uppercase">{b.car_name}</h3>
                      {isCancelled && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-black uppercase tracking-wider">
                          {t.card.cancelledText}
                        </span>
                      )}
                      {isReturned && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-black uppercase tracking-wider">
                          {t.card.returnedText}
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                          On Rent / Aktívna
                        </span>
                      )}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-wider">
                          Čakajúca
                        </span>
                      )}
                    </div>
                    
                    {/* Zobrazenie VS namiesto systémového ID */}
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                      VS: {b.variable_symbol || 'N/A'} • Klient: {b.customer_name} • {b.start_date} až {b.end_date}
                    </p>

                  </div>
                  <div className="flex items-center gap-4">
                    {b.status === 'pending' && !isCancelled && (
                      <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-5 py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer">
                        {t.card.confirm}
                      </button>
                    )}
                    <button onClick={() => toggleExpand(b.id)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all cursor-pointer">
                      {expandedId === b.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {expandedId === b.id && (
                  <div className="px-8 pb-10 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/5 bg-slate-950/40">
                    
                    {/* 1. OSOBNÉ ÚDAJE & KONTAKT */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-sky-400 uppercase italic flex items-center gap-2"><User size={12}/> {t.details.personal}</h4>
                      <div className="space-y-1 text-xs">
                        <p className="text-sm font-black text-white">{b.customer_name}</p>
                        <p className="text-slate-400 flex items-center gap-1.5"><Mail size={12}/> {b.customer_email}</p>
                        {b.customer_phone && <p className="text-slate-400 flex items-center gap-1.5"><Phone size={12}/> {b.customer_phone}</p>}
                        {b.birth_number && <p className="text-slate-500 pt-1">R.Č.: <span className="text-slate-300">{b.birth_number}</span></p>}
                      </div>

                      {(b.street || b.city) && (
                        <div className="pt-2 border-t border-white/5 text-xs text-slate-400">
                          <p className="text-[9px] text-slate-500 uppercase font-black">Adresa:</p>
                          <p>{b.street}</p>
                          <p>{b.zip} {b.city}</p>
                        </div>
                      )}
                    </div>

                    {/* 2. LOGISTIKA & MIESTA */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-amber-400 uppercase italic flex items-center gap-2"><MapPin size={12}/> {t.details.logistics}</h4>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-black block">Vyzdvihnutie (Pickup):</span>
                          <span className="text-white font-bold">{b.pickup_location || "Neuvedené"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-black block">Vrátenie (Return):</span>
                          <span className="text-white font-bold">{b.return_location || "Neuvedené"}</span>
                        </div>
                        <div className="pt-1 border-t border-white/5 flex justify-between">
                          <span className="text-slate-400">Platba:</span>
                          <span className="text-sky-400 font-bold uppercase">{b.payment_method || "---"}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. DOKLADY A DOPLNKY */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase italic flex items-center gap-2"><FileText size={12}/> {t.details.verification}</h4>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Číslo OP:</span>
                          <span className="text-white font-bold">{b.op_number || "Nezadané"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Číslo VP:</span>
                          <span className="text-white font-bold">{b.vp_number || "Nezadané"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Druhý vodič:</span>
                          <span className="text-white font-bold">{b.second_driver ? "Áno" : "Nie"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Flexi Depozit:</span>
                          <span className="text-white font-bold">{b.use_flexi_deposit ? "Áno" : "Nie"}</span>
                        </div>

                        {b.is_company && (
                          <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                            <p className="text-[9px] text-amber-400 uppercase font-black flex items-center gap-1"><Building2 size={10}/> Firma: {b.comp_name}</p>
                            <p className="text-[10px] text-slate-400">IČO: {b.comp_ico} | DIČ: {b.comp_dic}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 4. FINANCIE & AKCIE */}
                    <div className="space-y-3 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase italic mb-1">{t.details.fin}</h4>
                        <p className="text-2xl font-black text-emerald-400">{parseFloat(b.total_price || 0).toLocaleString()} €</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Depozit: {b.deposit_amount || 0} €</p>
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        {/* Protokol */}
                        {!isCancelled ? (
                          <a 
                            href={`/admin/bookings/protocol?bookingId=${b.id}&carId=${b.car_id || ''}`}
                            className="px-4 py-2.5 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500 hover:text-slate-950 text-sky-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <ClipboardCheck size={14} /> {t.details.protocolBtn}
                          </a>
                        ) : (
                          <div className="px-4 py-2.5 bg-slate-900/40 border border-white/5 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-not-allowed">
                            Protokol nedostupný
                          </div>
                        )}

                        {/* DYNAMICKÉ TLAČIDLO PODĽA STAVU */}
                        {isCancelled ? (
                          <span className="text-[9px] font-black uppercase text-rose-500 italic">
                            Rezervácia je stornovaná
                          </span>
                        ) : isReturned ? (
                          <span className="text-[9px] font-black uppercase text-slate-500 italic flex items-center gap-1">
                            <CheckCircle size={12}/> Prenájom bol ukončený
                          </span>
                        ) : isConfirmed ? (
                          <button 
                            onClick={() => updateStatus(b.id, 'returned')} 
                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw size={12} /> {t.card.endRental}
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateStatus(b.id, 'cancelled')} 
                            className="text-[9px] font-black uppercase text-rose-400 hover:text-rose-500 transition-colors text-left cursor-pointer"
                          >
                            {t.card.storno}
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}