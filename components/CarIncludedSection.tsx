"use client";

import {
  CheckCircle2,
  Car,
  CalendarClock,
  Receipt,
  Shield,
  Truck,
  Headphones
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export function CarIncludedSection() {
  const { lang } = useLang();

  const INCLUDED_ITEMS = [
    {
      icon: Car,
      title: { sk: "Kompletná údržba", en: "Complete maintenance", bs: "Održavanje" },
      desc: { 
        sk: "Všetky vozidlá sú pravidelne servisované v autorizovaných servisoch.", 
        en: "All vehicles are regularly serviced in authorized centers.",
        bs: "Sva vozila se redovno servisiraju u ovlaštenim centrima."
      }
    },
    {
      icon: CalendarClock,
      title: { sk: "Flexibilné zmeny", en: "Flexible booking", bs: "Fleksibilna rezervacija" },
      desc: { 
        sk: "Bezplatná zmena termínu až 48 hodín pred začiatkom prenájmu.", 
        en: "Free change of date up to 48 hours before the rental starts.",
        bs: "Besplatna promjena termina do 48 sati prije početka najma."
      }
    },
    {
      icon: Receipt,
      title: { sk: "Diaľničná známka", en: "Slovak highway toll", bs: "Slovačka vinjeta" },
      desc: { 
        sk: "Slovenská diaľničná známka je automaticky zahrnutá v cene.", 
        en: "Slovak highway toll is automatically included in the price.",
        bs: "Slovačka vinjeta je automatski uključena u cijenu."
      }
    },
    {
      icon: Shield,
      title: { sk: "Poistenie vozidla", en: "Vehicle insurance", bs: "Osiguranje vozila" },
      desc: { 
        sk: "Havarijné aj zákonné poistenie (PZP) je súčasťou prenájmu.", 
        en: "Collision damage waiver and liability insurance included.",
        bs: "Kasko i obavezno osiguranje su uključeni u cijenu."
      }
    },
    {
      icon: Truck,
      title: { sk: "Asistencia 24/7", en: "Assistance 24/7", bs: "Asistencija 24/7" },
      desc: { 
        sk: "Okamžité riešenie problémov a odtahová služba v rámci EU.", 
        en: "Immediate problem solving and towing service within the EU.",
        bs: "Hitno rješavanje problema i šlep služba unutar EU."
      }
    },
    {
      icon: Headphones,
      title: { sk: "Support", en: "Technical support", bs: "Podrška" },
      desc: { 
        sk: "Osobný prístup a technická podpora počas celej doby nájmu.", 
        en: "Personal approach and technical support throughout the rental.",
        bs: "Lični pristup i tehnička podrška tokom cijelog najma."
      }
    }
  ];

  const labels = {
    sk: { top: "Elite Services", title: "V cene je zahrnuté" },
    en: { top: "Elite Services", title: "Included in price" },
    bs: { top: "Elite Services", title: "Uključeno u cijenu" }
  }[lang as 'sk' | 'en' | 'bs'] || { top: "Elite Services", title: "V cene je zahrnuté" };

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
      <header className="flex items-center gap-5 mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <CheckCircle2 size={28} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-1">{labels.top}</p>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">{labels.title}</h2>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INCLUDED_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group relative flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-950/40 p-6 transition-all duration-500 hover:border-sky-500/40 hover:bg-slate-950/80"
            >
              {/* Ikona s efektom */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-white/5 text-sky-400 transition-all duration-500 group-hover:scale-110 group-hover:border-sky-500/50 group-hover:bg-sky-500/10 group-hover:text-sky-300">
                <Icon size={24} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-100 group-hover:text-white transition-colors">
                  {item.title[lang as 'sk' | 'en' | 'bs'] || item.title.sk}
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-500 group-hover:text-slate-300 transition-colors">
                  {item.desc[lang as 'sk' | 'en' | 'bs'] || item.desc.sk}
                </p>
              </div>

              {/* Jemný hover glow v rohu karty */}
              <div className="absolute -right-4 -bottom-4 h-16 w-16 bg-sky-500/0 blur-2xl transition-all duration-500 group-hover:bg-sky-500/10 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
}