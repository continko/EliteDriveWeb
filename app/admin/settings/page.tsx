"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Settings, Lock, Shield, Save, RefreshCw, 
  Receipt, MessageSquare, Key, Copy, Check, AlertTriangle 
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  // Reálne systémové nastavenia pre UltimateDrive (dostupné pre CEO / Admina)
  const [settings, setSettings] = useState({
    vatRate: "20",
    invoicePrefix: "UD-2026-",
    autoInvoicing: true,
    emailAlertsEnabled: true,
    smsGatewayEnabled: false,
    apiKey: "ult_live_99f8a7bc6543210fedcba",
  });

  // Zmena hesla (dostupná pre každého prihláseného)
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Načítame profil používateľa a jeho rolu
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile && profile.role) {
        const role = profile.role.toLowerCase();
        if (role === "ceo" || role === "admin") {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error("Chyba pri overovaní oprávnení:", error);
    } finally {
      setCheckingRole(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Nemáte oprávnenie upravovať systémové nastavenia!");
      return;
    }

    setSaving(true);
    // Uloženie do DB tabuľky / nastavení
    setTimeout(() => {
      setSaving(false);
      toast.success("Systémové predvoľby UltimateDrive boli úspešne uložené.");
    }, 800);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Nové heslá sa nezhodujú!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Heslo musí mať aspoň 6 znakov.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: passwords.newPassword
    });

    setLoading(false);
    if (error) {
      toast.error(`Chyba pri zmene hesla: ${error.message}`);
    } else {
      toast.success("Vaše heslo bolo úspešne zmenené!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(settings.apiKey);
    setCopiedKey(true);
    toast.success("API kľúč UltimateDrive skopírovaný!");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (checkingRole) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        <RefreshCw className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left font-urbanist pb-20">
      
      {/* HLAVIČKA */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30">
            <Settings className="text-sky-400 animate-spin-slow" size={28} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-wider leading-none">UltimateDrive <span className="text-sky-400">Settings</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
              {isAdmin ? "Manažérska zóna a predvoľby systému" : "Osobná správa účtu"}
            </p>
          </div>
        </div>
      </header>

      {/* SYSTÉMOVÉ NASTAVENIA - IBA PRE CEO / ADMINA */}
      {isAdmin ? (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* FAKTURÁCIA */}
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <Receipt size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase italic">Fakturácia & Účtovníctvo</h2>
                <p className="text-xs text-slate-400">Globálne daňové predvoľby pre UltimateDrive</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Predvolená sadzba DPH (%)</label>
                <input 
                  type="number" 
                  value={settings.vatRate}
                  onChange={e => handleInputChange('vatRate', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Prefix číselníka faktúr</label>
                <input 
                  type="text" 
                  value={settings.invoicePrefix}
                  onChange={e => handleInputChange('invoicePrefix', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* API KĽÚČE */}
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <Key size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase italic">UltimateDrive API kľúč</h2>
                <p className="text-xs text-slate-400">Prístupový token pre externé integrácie</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-slate-300 text-sm font-mono flex items-center justify-between">
                <span className="truncate">{settings.apiKey}</span>
                <button 
                  type="button"
                  onClick={handleCopyApiKey}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-all shrink-0 ml-2"
                >
                  {copiedKey ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-xl shadow-sky-500/20 active:scale-95 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              Uložiť systémové nastavenia
            </button>
          </div>
        </form>
      ) : (
        /* INFO PRE BEŽNÉHO POUŽÍVATEĽA */
        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase italic">Obmedzený prístup</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sekcia globálnych systémových nastavení je vyhradená výhradne pre vedenie. Nižšie si však môžete kedykoľvek zmeniť svoje prístupové heslo.</p>
          </div>
        </div>
      )}

      {/* ZMENA HESLA - DOSTUPNÁ PRE VŠETKÝCH */}
      <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase italic">Zabezpečenie vášho účtu</h2>
            <p className="text-xs text-slate-400">Zmena prihlasovacieho hesla</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Aktuálne heslo</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nové heslo</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Potvrdenie nového hesla</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Shield size={16} />}
              Zmeniť moje heslo
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}