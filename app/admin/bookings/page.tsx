"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Car, 
  User, 
  Mail,
  Calendar as CalendarIcon,
  LogOut,
  MapPin
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      toast.error("Chyba pri načítaní dát");
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();

    const subscription = supabase
      .channel('bookings_updates')
      .on('postgres_changes' as any, { event: '*', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Chyba pri aktualizácii");
    } else {
      toast.success(`Rezervácia: ${status === 'confirmed' ? 'Potvrdená' : 'Zrušená'}`);
      fetchBookings();
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Odhlásené");
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error("Chyba pri odhlasovaní");
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => {
      const price = parseFloat(String(b.total_price)) || 0;
      return sum + price;
    }, 0);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617]">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sky-500 font-black tracking-widest text-[10px] uppercase italic animate-pulse">EliteDrive Secure Access...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-sky-500/30">
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-[100]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-sky-500/20">E</div>
            <span className="font-black tracking-tighter text-white uppercase italic">EliteDrive <span className="text-sky-500">Admin</span></span>
          </div>
          <button onClick={handleSignOut} className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/10 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-slate-950 transition-all text-[10px] font-black uppercase tracking-widest active:scale-95">
            <LogOut size={14} /> Odhlásiť
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] space-y-2 backdrop-blur-sm">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">Potvrdený obrat</p>
            <p className="text-4xl font-black text-emerald-400 tracking-tighter italic">{totalRevenue.toLocaleString('sk-SK')} €</p>
          </div>
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] space-y-2 backdrop-blur-sm">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">Nové dopyty</p>
            <p className="text-4xl font-black text-white tracking-tighter italic">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] space-y-2 backdrop-blur-sm">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">Status systému</p>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
               <p className="text-2xl font-black text-sky-500 uppercase italic tracking-tighter underline decoration-sky-500/20 underline-offset-4">Live Monitor</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3 italic uppercase"><Clock className="text-sky-500" size={20} /> Posledné aktivity</h2>
          </div>

          <div className="grid gap-4">
            {bookings.length === 0 ? (
              <div className="p-20 text-center rounded-[3rem] border border-dashed border-white/10 text-slate-600 font-bold uppercase tracking-widest text-xs">Zatiaľ žiadne rezervácie.</div>
            ) : (
              bookings.map((b) => {
                const currentPrice = parseFloat(String(b.total_price)) || 0;
                const hasSecondDriver = b.second_driver === true || b.second_driver === "true";

                return (
                  <div key={b.id} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/20 p-8 transition-all hover:bg-slate-900/40 hover:border-white/20">
                    {/* ZMENA: items-center -> items-start */}
                    <div className="grid grid-cols-1 md:grid-cols-5 items-start gap-8">
                      
                      {/* AUTO & CENA */}
                      <div className="space-y-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sky-500 mb-1">
                          <Car size={14} />
                          <span className="text-[13px] font-black uppercase tracking-widest text-slate-500">Vozidlo</span>
                        </div>
                        <p className="text-xl font-black text-white leading-none italic">{b.car_name}</p>
                        <p className="text-emerald-400 font-black text-lg tracking-tighter">
                          {currentPrice.toLocaleString('sk-SK')} €
                        </p>
                      </div>

                      {/* ZÁKAZNÍK */}
                      <div className="space-y-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sky-500 mb-1">
                          <User size={14} />
                          <span className="text-[13px] font-black uppercase tracking-widest text-slate-500">Klient</span>
                        </div>
                        <p className="text-sm font-bold text-slate-100">{b.customer_name}</p>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-400">
                             <Mail size={10} className="text-sky-500/50" />
                             <span className="text-[14px] truncate max-w-[150px]">{b.customer_email}</span>
                          </div>
                          <p className="text-[14px] text-slate-500 font-medium ml-4">{b.customer_phone}</p>
                        </div>
                      </div>

                      {/* LOGISTIKA */}
                      <div className="space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sky-500">
                          <CalendarIcon size={14} />
                          <span className="text-[13px] font-black uppercase tracking-widest text-slate-500">Logistika</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-300 space-y-1">
                          <div>
                            <p className="flex items-center gap-1"><span className="text-sky-500/50 text-[13px] w-6 uppercase">Od:</span> {b.start_date}</p>
                            <p className="text-[14px] text-slate-500 flex items-center gap-1 ml-7"><MapPin size={13} /> {b.pickup_location}</p>
                          </div>
                          <div className="mt-1">
                            <p className="flex items-center gap-1"><span className="text-amber-500/50 text-[13px] w-6 uppercase">Do:</span> {b.end_date}</p>
                            <p className="text-[14px] text-slate-500 flex items-center gap-1 ml-7"><MapPin size={13} /> {b.return_location}</p>
                          </div>
                        </div>
                      </div>

                      {/* SLUŽBY */}
                      <div className="space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500">
                          <CheckCircle2 size={14} />
                          <span className="text-[13px] font-black uppercase tracking-widest text-slate-500">Služby</span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-1">
                          {hasSecondDriver ? (
                            <span className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase italic">Druhý vodič</span>
                          ) : (
                            <span className="text-[12px] text-slate-600 italic">Základná výbava</span>
                          )}
                        </div>
                      </div>

                      {/* AKCIE - Pridané md:self-start pre zarovnanie hore */}
                      <div className="flex justify-center md:justify-end gap-3 md:self-start">
                        {b.status === 'pending' ? (
                          <>
                            <button onClick={() => updateStatus(b.id, 'confirmed')} className="h-10 px-4 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-black uppercase hover:bg-emerald-400 transition-all flex items-center gap-2 active:scale-95">
                              <CheckCircle2 size={14} /> Potvrdiť
                            </button>
                            <button onClick={() => updateStatus(b.id, 'cancelled')} className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-red-400 text-[10px] font-black uppercase hover:bg-red-500/10 transition-all flex items-center gap-2 active:scale-95">
                              <XCircle size={14} />
                            </button>
                          </>
                        ) : (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${b.status === 'confirmed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            <span className="text-[9px] font-black uppercase tracking-widest">{b.status === 'confirmed' ? 'VYBAVENÉ' : 'ZRUŠENÉ'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}