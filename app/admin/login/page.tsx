"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogIn, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Nesprávne údaje!");
      setLoading(false);
    } else {
      toast.success("Vitaj späť!");
      // Jednoduchý router push teraz bude fungovať, lebo ho nič nezruší
      router.push("/admin/bookings");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-md space-y-8 p-10 rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-sky-500 flex items-center justify-center font-black text-slate-950 mx-auto shadow-lg shadow-sky-500/20 text-xl italic">E</div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">EliteDrive <span className="text-sky-500 underline decoration-sky-500/30">Secure</span></h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vstup len pre autorizovaný personál</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
              <Mail size={12} className="text-sky-500" /> E-mail
            </label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-700"
              placeholder="admin@elitedrive.sk"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
              <Lock size={12} className="text-sky-500" /> Heslo
            </label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-700"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <><LogIn size={18} /> PRIHLÁSIŤ SA</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}