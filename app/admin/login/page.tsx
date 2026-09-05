"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogIn, Lock, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Kontrola, či už nie je admin prihlásený, ak áno, rovno ho pošleme do dashboardu
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace("/admin/bookings");
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Prístup zamietnutý: Nesprávne údaje");
      setLoading(false);
    } else {
      toast.success("Prístup udelený. Vitajte.");
      router.push("/admin/bookings");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-200 relative overflow-hidden">
      {/* Dekoratívne pozadie - svetelný bod */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 p-10 rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="h-16 w-16 rounded-2xl bg-sky-500 flex items-center justify-center font-black text-slate-950 mx-auto shadow-lg shadow-sky-500/30 text-2xl italic transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              E
            </div>
            <div className="absolute -right-2 -top-2">
               <div className="h-6 w-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center">
                  <ShieldCheck size={12} className="text-sky-500" />
               </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              UltimateDrive <span className="text-sky-500">ADMiN</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
               <div className="h-[1px] w-8 bg-sky-500/30" />
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Admin Login v2.0</p>
               <div className="h-[1px] w-8 bg-sky-500/30" />
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
              <Mail size={12} className="text-sky-500" /> E-MAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:border-sky-500/50 focus:bg-slate-950 transition-all placeholder:text-slate-800"
              placeholder="admin@ultimatedrive.sk"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
              <Lock size={12} className="text-sky-500" /> Heslo
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:border-sky-500/50 focus:bg-slate-950 transition-all placeholder:text-slate-800"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-5 rounded-2xl transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 group"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" /> 
                  PRIHLÁSIŤ SA
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <p className="text-center text-[9px] text-red-600 font-bold uppercase tracking-widest">
          Všetky pokusy o neoprávnený prístup sú monitorované.
        </p>
      </div>
    </div>
  );
}