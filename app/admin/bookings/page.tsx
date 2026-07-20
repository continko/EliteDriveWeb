"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Car, User, Mail, MapPin, Wallet, Zap, ChevronDown, ChevronUp, 
  Phone, ShieldCheck, Download, ClipboardCheck, CreditCard, Banknote
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- MULTI-MARKET TRANSLATIONS ---
const translations: any = {
  SK: {
    title: "Prehľad", titleSpan: "Rezervácií",
    filters: { all: "Všetky", pending: "Nové", confirmed: "Schválené", cancelled: "Archív" },
    stats: { flow: "Potvrdený Flow", deposit: "Vratný Depozit" },
    card: { date: "Dĺžka prenájmu", total: "Celková Suma", confirm: "Potvrdiť", storno: "Stornovať", protocol: "Protokol", download: "Stiahnuť PDF" },
    details: {
      personal: "Osobné Údaje", name: "Meno a Priezvisko", birthId: "Rodné Číslo", op: "Číslo OP", vp: "Číslo VP", notSet: "Neuvedené",
      logistics: "Miesta Odovzdania", pickup: "Vyzdvihnutie", return: "Vrátenie",
      payment: "Platba a Doplnky", payMethod: "Spôsob Platby", cardPay: "Platobná Karta", cashPay: "Hotovosť",
      coverage: "Krytie a Služby", ins: "Poistenie", flexi: "Flexi Depozit", fin: "Financie & Protokol"
    },
    messages: { loading: "Sťahujem operačné dáta...", error: "Chyba synchronizácie", statusOk: "Rezervácia: AKTUALIZOVANÁ" }
  },
  HR: {
    title: "Pregled", titleSpan: "Rezervacija",
    filters: { all: "Sve", pending: "Nove", confirmed: "Odobrene", cancelled: "Arhiva" },
    stats: { flow: "Potvrđeni prihod", deposit: "Povratni depozit" },
    card: { date: "Trajanje najma", total: "Ukupan iznos", confirm: "Potvrdi", storno: "Otkaži", protocol: "Protokol", download: "Preuzmi PDF" },
    details: {
      personal: "Osobni podaci", name: "Ime i prezime", birthId: "OIB", op: "Broj osobne iskaznice", vp: "Broj vozačke dozvole", notSet: "Nije navedeno",
      logistics: "Lokacije primopredaje", pickup: "Preuzimanje", return: "Povrat",
      payment: "Plaćanje i dodaci", payMethod: "Način plaćanja", cardPay: "Bankovna kartica", cashPay: "Gotovina",
      coverage: "Osiguranje i usluge", ins: "Osiguranje", flexi: "Flexi Depozit", fin: "Financije i Protokol"
    },
    messages: { loading: "Učitavanje podataka...", error: "Greška sinkronizacije", statusOk: "Rezervacija: AŽURIRANA" }
  },
  BA: {
    title: "Pregled", titleSpan: "Rezervacija",
    filters: { all: "Sve", pending: "Nove", confirmed: "Odobrene", cancelled: "Arhiva" },
    stats: { flow: "Potvrđeni prihod", deposit: "Povratni depozit" },
    card: { date: "Trajanje najma", total: "Ukupan iznos", confirm: "Potvrdi", storno: "Otkaži", protocol: "Protokol", download: "Preuzmi PDF" },
    details: {
      personal: "Lični podaci", name: "Ime i prezime", birthId: "JMBG", op: "Broj lične karte", vp: "Broj vozačke dozvole", notSet: "Nije navedeno",
      logistics: "Lokacije primopredaje", pickup: "Preuzimanje", return: "Povrat",
      payment: "Plaćanje i dodaci", payMethod: "Način plaćanja", cardPay: "Bankovna kartica", cashPay: "Gotovina",
      coverage: "Osiguranje i usluge", ins: "Osiguranje", flexi: "Flexi Depozit", fin: "Finansije i Protokol"
    },
    messages: { loading: "Učitavanje podataka...", error: "Greška sinkronizacije", statusOk: "Rezervacija: AŽURIRANA" }
  },
  HU: {
    title: "Foglalások", titleSpan: "Áttekintése",
    filters: { all: "Összes", pending: "Új", confirmed: "Jóváhagyott", cancelled: "Archívum" },
    stats: { flow: "Visszaigazolt Bevétel", deposit: "Visszatérítendő Letét" },
    card: { date: "Bérlés időtartama", total: "Teljes Összeg", confirm: "Megerősítés", storno: "Sztornózás", protocol: "Jegyzőkönyv", download: "PDF Letöltése" },
    details: {
      personal: "Személyes Adatok", name: "Vezetéknév és Keresztnév", birthId: "Személyi szám", op: "Személyi igazolvány szám", vp: "Jogosítvány szám", notSet: "Nincs megadva",
      logistics: "Átadási Helyszínek", pickup: "Átvétel", return: "Leadás",
      payment: "Fizetés és Extrák", payMethod: "Fizetési mód", cardPay: "Bankkártya", cashPay: "Készpénz",
      coverage: "Biztosítás és Szolgáltatások", ins: "Biztosítás", flexi: "Flexi Letét", fin: "Pénzügyek és Protokoll"
    },
    messages: { loading: "Adatok letöltése...", error: "Szinkronizálási hiba", statusOk: "Foglalás: FRISSÍTVE" }
  },
  EN: {
    title: "Bookings", titleSpan: "Overview",
    filters: { all: "All", pending: "New", confirmed: "Confirmed", cancelled: "Archive" },
    stats: { flow: "Confirmed Revenue", deposit: "Refundable Deposit" },
    card: { date: "Rental Period", total: "Total Price", confirm: "Confirm", storno: "Cancel", protocol: "Protocol", download: "Download PDF" },
    details: {
      personal: "Personal Details", name: "Full Name", birthId: "ID Number", op: "ID Card", vp: "Driving License", notSet: "Not specified",
      logistics: "Logistics", pickup: "Pick-up", return: "Drop-off",
      payment: "Payment & Extras", payMethod: "Payment Method", cardPay: "Credit Card", cashPay: "Cash",
      coverage: "Coverage & Services", ins: "Insurance", flexi: "Flexi Deposit", fin: "Finance & Protocol"
    },
    messages: { loading: "Downloading operational data...", error: "Sync error", statusOk: "Booking: UPDATED" }
  }
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMarket, setUserMarket] = useState("SK");
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any>(null);

  // --- SYNCHRONIZÁCIA JAZYKA ---
  useEffect(() => {
    const savedLang = localStorage.getItem("dashboard_lang");
    if (savedLang) setUserMarket(savedLang);

    const handleStorageChange = () => {
      const updatedLang = localStorage.getItem("dashboard_lang");
      if (updatedLang) setUserMarket(updatedLang);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Interval ako fallback pre zmeny v tom istom okne
    const interval = setInterval(() => {
      const currentLang = localStorage.getItem("dashboard_lang");
      if (currentLang && currentLang !== userMarket) setUserMarket(currentLang);
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [userMarket]);

  // Initial Data Fetch
  useEffect(() => {
    async function initialize() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('market_code').eq('id', user.id).single();
        // Ak nemáme v localStorage nič, použijeme market z profilu
        if (!localStorage.getItem("dashboard_lang") && profile?.market_code && profile.market_code !== 'ALL') {
          setUserMarket(profile.market_code);
        }
      }
      fetchBookings();
    }
    initialize();
  }, []);

  const t = translations[userMarket] || translations["SK"];

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error(t.messages.error);
    else setBookings(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error("Error");
    else {
      toast.success(t.messages.statusOk);
      fetchBookings();
    }
  };

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);
  const filteredBookings = bookings.filter(b => filter === 'all' ? true : b.status === filter);

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">{t.messages.loading}</p>
    </div>
  );

  return (
    <div className="space-y-10 font-urbanist">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 text-left">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
            {t.title} <span className="text-sky-500">{t.titleSpan}</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                  filter === f 
                  ? 'bg-sky-500 text-slate-950 border-sky-500 shadow-lg shadow-sky-500/20' 
                  : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                }`}
              >
                {t.filters[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-emerald-500/20 p-6 rounded-[2rem] flex items-center gap-6 backdrop-blur-xl">
           <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Wallet size={24} />
           </div>
           <div>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.stats.flow}</p>
             <p className="text-3xl font-black text-emerald-400 italic tracking-tighter leading-none">
               {totalRevenue.toLocaleString(userMarket === 'HU' ? 'hu-HU' : 'sk-SK')} <span className="text-sm">€</span>
             </p>
           </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4 text-left">
        {filteredBookings.map((b) => (
          <div key={b.id} className={`group bg-slate-900/20 border transition-all duration-500 rounded-[2.5rem] overflow-hidden ${expandedId === b.id ? 'border-white/20 ring-1 ring-white/10' : 'border-white/5 hover:border-white/10'}`}>
            
            <div className="p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6 w-full lg:w-1/3">
                <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-inner ${b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-sky-500/10 text-sky-500'}`}>
                  <Car size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">ID: {b.id.substring(0,8)}</p>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-sky-500 transition-colors">
                    {b.car_name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap justify-between lg:justify-center gap-8 lg:gap-12 w-full lg:w-auto">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.card.date}</p>
                  <p className="text-xs font-bold text-white italic flex items-center gap-2">
                    {b.start_date} <span className="h-px w-3 bg-slate-700" /> {b.end_date}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.card.total}</p>
                  <p className="text-xl font-black text-emerald-400 italic tracking-tighter leading-none">
                    {parseFloat(b.total_price).toLocaleString(userMarket === 'HU' ? 'hu-HU' : 'sk-SK')} €
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                {b.status === 'pending' && (
                  <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-6 py-4 rounded-2xl bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
                    {t.card.confirm}
                  </button>
                )}
                <button onClick={() => toggleExpand(b.id)} className={`p-4 rounded-2xl border transition-all ${expandedId === b.id ? 'bg-white text-slate-950 border-white' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}>
                  {expandedId === b.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* EXPANDED DETAIL */}
            {expandedId === b.id && (
              <div className="px-8 pb-10 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/5 bg-slate-950/40 animate-in fade-in duration-500 text-left">
                
                {/* 1. OSOBNÉ ÚDAJE */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] flex items-center gap-2 italic"><User size={12}/> {t.details.personal}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">{t.details.name}</p>
                      <p className="text-sm font-black text-white uppercase italic">{b.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">{t.details.birthId}</p>
                      <p className="text-sm font-bold text-slate-200">{b.birth_number || t.details.notSet}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{t.details.op}</p>
                        <p className="text-xs font-bold text-slate-200">{b.op_number || "---"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{t.details.vp}</p>
                        <p className="text-xs font-bold text-slate-200">{b.vp_number || "---"}</p>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-col gap-1 text-[13px] text-slate-400 font-bold">
                      <span className="flex items-center gap-2"><Mail size={12}/> {b.customer_email}</span>
                      <span className="flex items-center gap-2"><Phone size={12}/> {b.customer_phone}</span>
                    </div>
                  </div>
                </div>

                {/* 2. LOGISTIKA */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2 italic"><MapPin size={12}/> {t.details.logistics}</h4>
                  <div className="space-y-5">
                    <div className="relative pl-4 border-l border-amber-500/30">
                       <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
                       <p className="text-[10px] text-slate-500 uppercase font-black">{t.details.pickup}</p>
                       <p className="text-xs font-black text-white uppercase italic">{b.pickup_location}</p>
                    </div>
                    <div className="relative pl-4 border-l border-slate-700">
                       <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-slate-700" />
                       <p className="text-[10px] text-slate-500 uppercase font-black">{t.details.return}</p>
                       <p className="text-xs font-black text-white uppercase italic">{b.return_location}</p>
                    </div>
                  </div>
                </div>

                {/* 3. PLATBA & DOPLNKY */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2 italic">
                    <Zap size={12}/> {t.details.payment}
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-black mb-2">{t.details.payMethod}</p>
                      <div className="flex items-center gap-3">
                        {b.payment_method === 'card' ? <CreditCard size={18} className="text-sky-400"/> : <Banknote size={18} className="text-emerald-400"/>}
                        <span className="text-xs font-black text-white uppercase italic">
                          {b.payment_method === 'card' ? t.details.cardPay : t.details.cashPay}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2 italic">
                       {t.details.coverage}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/20 shadow-sm">
                          <ShieldCheck size={12} />
                          <span className="text-[9px] font-black uppercase tracking-tight">{t.details.ins}: {b.insurance_type}</span>
                        </div>

                        {String(b.use_flexi_deposit) === "true" && (
                          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-sm">
                            <Zap size={12} />
                            <span className="text-[9px] font-black uppercase tracking-tight">{t.details.flexi}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. AKCIE & DEPOZIT */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{t.details.fin}</h4>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{t.stats.deposit}</p>
                        <p className="text-xl font-black text-white italic">{parseFloat(b.deposit_amount).toLocaleString(userMarket === 'HU' ? 'hu-HU' : 'sk-SK')} €</p>
                    </div>

                    {!b.protocol_created ? (
                      <button onClick={() => { setActiveBooking(b); setShowProtocolModal(true); }} className="w-full py-4 bg-sky-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shadow-sky-500/20">
                        <ClipboardCheck size={16} /> {t.card.protocol}
                      </button>
                    ) : (
                      <button className="w-full py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-400 transition-all">
                        <Download size={16} /> {t.card.download}
                      </button>
                    )}

                    {b.status !== 'cancelled' && (
                       <button onClick={() => updateStatus(b.id, 'cancelled')} className="w-full py-3 text-[9px] font-black uppercase text-rose-500/50 hover:text-rose-500 transition-colors">
                         {t.card.storno}
                       </button>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}