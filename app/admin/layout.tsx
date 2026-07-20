"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarRange, 
  CarFront, 
  Settings, 
  LogOut,
  Globe,
  Wallet,
  Map,
  Box // Pridaná ikona pre Inventory
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

const translations: any = {
  SK: {
    ops: "Operácie",
    strategy: "Stratégia a Flotila",
    system: "Systém",
    dashboard: "Dashboard",
    bookings: "Rezervácie",
    logistics: "Logistika & Preprava",
    inventory: "Sklad & Zásoby",
    fleet: "Moja Flotila",
    tracking: "Live Sledovanie",
    finance: "Financie & DPH",
    settings: "Nastavenia",
    logout: "Odhlásiť sa",
    access: "Úroveň prístupu",
    role_ceo: "Globálny CEO",
    role_mgr: "Manažér trhu"
  },
  HR: {
    ops: "Operacije",
    strategy: "Strategija i Flota",
    system: "Sustav",
    dashboard: "Kontrolna ploča",
    bookings: "Rezervacije",
    logistics: "Logistika i prijevoz",
    inventory: "Zalihe & Inventar",
    fleet: "Moja flota",
    tracking: "Praćenje uživo",
    finance: "Financije i PDV",
    settings: "Postavke",
    logout: "Odjavi se",
    access: "Razina pristupa",
    role_ceo: "Globalni CEO",
    role_mgr: "Lokalni menadžer"
  },
  HU: {
    ops: "Műveletek",
    strategy: "Stratégia és Flotta",
    system: "Rendszer",
    dashboard: "Irányítópult",
    bookings: "Foglalások",
    logistics: "Logisztika és Szállítás",
    inventory: "Készlet & Raktár",
    fleet: "Flottám",
    tracking: "Élő követés",
    finance: "Pénzügyek és ÁFA",
    settings: "Beállítások",
    logout: "Kijelentkezés",
    access: "Hozzáférési szint",
    role_ceo: "Globális CEO",
    role_mgr: "Helyi menedzser"
  },
  EN: {
    ops: "Operations",
    strategy: "Strategy & Fleet",
    system: "System",
    dashboard: "Dashboard",
    bookings: "Bookings",
    logistics: "Logistics & Towing",
    inventory: "Inventory & Stock",
    fleet: "My Fleet",
    tracking: "Live Tracking",
    finance: "Finance & VAT",
    settings: "Settings",
    logout: "Sign Out",
    access: "Access Level",
    role_ceo: "Global CEO",
    role_mgr: "Market Manager"
  }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [userRole, setUserRole] = useState<'CEO' | 'MANAGER' | null>(null);
  const [userMarket, setUserMarket] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>("SK");

  useEffect(() => {
    const savedLang = localStorage.getItem("dashboard_lang");
    if (savedLang) setLang(savedLang);

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (pathname !== "/admin/login") router.replace("/admin/login");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, market_code')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
        setUserMarket(profile.market_code);
        if (!savedLang) {
          const defaultLang = profile.market_code === 'ALL' ? 'SK' : profile.market_code;
          setLang(defaultLang);
        }
      }
      setLoading(false);
    }
    getProfile();
  }, [pathname, router]);

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("dashboard_lang", newLang);
    toast.success(`Language set to ${newLang}`, { duration: 1000 });
  };

  const t = translations[lang] || translations['SK'];
  const isActive = (path: string) => pathname === path;
  const isCEO = userRole === 'CEO';

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.replace("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;
  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex font-urbanist">
      <aside className="w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl flex flex-col sticky top-0 h-screen shrink-0 text-left">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-sky-500/20 text-xl italic">U</div>
            <span className="font-black tracking-tighter text-white uppercase italic text-xl">
              Ultimate<span className="text-sky-500">Drive</span>
            </span>
          </div>
          <div className="mt-4 px-1 py-0.5 border-l-2 border-sky-500/30 ml-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{t.access}</p>
            <p className="text-[10px] font-bold text-white uppercase italic tracking-tighter">
              {isCEO ? t.role_ceo : `${t.role_mgr} [${userMarket}]`}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 mt-2">{t.ops}</p>
          {isCEO && <MenuLink href="/admin" icon={<LayoutDashboard size={18}/>} label={t.dashboard} active={isActive('/admin')} />}
          <MenuLink href="/admin/bookings" icon={<CalendarRange size={18}/>} label={t.bookings} active={isActive('/admin/bookings')} />
          <MenuLink href="/admin/logistics" icon={<Globe size={18}/>} label={t.logistics} active={isActive('/admin/logistics')} />
          {/* NOVÝ MODUL */}
          <MenuLink href="/admin/inventory" icon={<Box size={18}/>} label={t.inventory} active={isActive('/admin/inventory')} />

          {isCEO && (
            <>
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 mt-8">{t.strategy}</p>
              <MenuLink href="/admin/cars" icon={<CarFront size={18}/>} label={t.fleet} active={isActive('/admin/cars')} />
              <MenuLink href="/admin/fleet-map" icon={<Map size={18}/>} label={t.tracking} active={isActive('/admin/fleet-map')} isLive={true} />
              <MenuLink href="/admin/revenue" icon={<Wallet size={18}/>} label={t.finance} active={isActive('/admin/revenue')} />
            </>
          )}
          
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 mt-8">{t.system}</p>
          <MenuLink href="/admin/settings" icon={<Settings size={18}/>} label={t.settings} active={isActive('/admin/settings')} />
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-slate-950 transition-all text-[10px] font-black uppercase tracking-widest">
            <LogOut size={16} /> {t.logout}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 bg-slate-950/20 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
            {['SK', 'HR', 'HU', 'EN'].map((l) => (
              <button key={l} onClick={() => changeLanguage(l)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === l ? 'bg-sky-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-black text-white uppercase italic leading-none tracking-tighter">UltimateDrive</p>
              <p className="text-[9px] font-bold text-sky-500 uppercase tracking-tighter">{isCEO ? 'Root Admin' : `${userMarket} Unit`}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 border border-white/10 shadow-lg shadow-sky-500/20 flex items-center justify-center font-black text-white italic text-xs uppercase">
              {lang}
            </div>
          </div>
        </header>

        <main className="p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function MenuLink({ href, icon, label, active, isLive }: { href: string, icon: any, label: string, active: boolean, isLive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
        active 
        ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20' 
        : 'hover:bg-white/5 text-slate-400'
      }`}
    >
      <div className="flex items-center gap-3 text-left">
        <span className={active ? 'text-slate-950' : 'group-hover:text-sky-500 transition-colors'}>
          {icon}
        </span>
        <span className="text-[11px] uppercase tracking-[0.15em] font-black italic">{label}</span>
      </div>
      {isLive && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${active ? 'bg-slate-900' : 'bg-sky-500'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-slate-900' : 'bg-sky-500'}`}></span>
        </span>
      )}
    </Link>
  );
}