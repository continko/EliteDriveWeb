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

  // Definícia položiek vovnútri komponentu pre prístup k prekladom
  const INCLUDED_ITEMS = [
    {
      icon: Car,
      title: lang === 'sk' ? "Kompletná údržba vozidla" : lang === 'en' ? "Complete maintenance" : "Kompletno održavanje",
      description: lang === 'sk' ? "Všetky vozidlá pravidelne kontrolované a servisované." : 
                   lang === 'en' ? "All vehicles are regularly inspected and serviced." : 
                   "Sva vozila se redovno pregledavaju i servisiraju."
    },
    {
      icon: CalendarClock,
      title: lang === 'sk' ? "Flexibilné zmeny rezervácie" : lang === 'en' ? "Flexible booking" : "Fleksibilna rezervacija",
      description: lang === 'sk' ? "Bezplatná zmena termínu až 48 hodín pred začiatkom." : 
                   lang === 'en' ? "Free change of date up to 48 hours before the start." : 
                   "Besplatna promjena termina do 48 sati prije početka."
    },
    {
      icon: Receipt,
      title: lang === 'sk' ? "Slovenská diaľničná známka" : lang === 'en' ? "Slovak highway toll" : "Slovačka vinjeta",
      description: lang === 'sk' ? "Automaticky zahrnutá v cene pre každé vozidlo." : 
                   lang === 'en' ? "Automatically included in the price for every vehicle." : 
                   "Automatski uključeno u cijenu za svako vozilo."
    },
    {
      icon: Shield,
      title: lang === 'sk' ? "Poistenie vozidla" : lang === 'en' ? "Vehicle insurance" : "Osiguranje vozila",
      description: lang === 'sk' ? "Komplexné poistenie zahrnuté v cene." : 
                   lang === 'en' ? "Comprehensive insurance included in the price." : 
                   "Sveobuhvatno osiguranje uključeno u cijenu."
    },
    {
      icon: Truck,
      title: lang === 'sk' ? "Náhradné vozidlo 24/7" : lang === 'en' ? "Replacement car 24/7" : "Zamjensko vozilo 24/7",
      description: lang === 'sk' ? "Okamžitá výmena v prípade poruchy." : 
                   lang === 'en' ? "Immediate replacement in case of breakdown." : 
                   "Trenutna zamjena u slučaju kvara."
    },
    {
      icon: Headphones,
      title: lang === 'sk' ? "Technická podpora" : lang === 'en' ? "Technical support" : "Tehnička podrška",
      description: lang === 'sk' ? "Non-stop asistenčná služba." : 
                   lang === 'en' ? "Non-stop assistance service." : 
                   "Asistencija dostupna 24/7."
    }
  ];

  const sectionTitle = lang === 'sk' ? "V cene je zahrnuté" : lang === 'en' ? "Included in price" : "Uključeno u cijenu";

  return (
    <section className="relative overflow-hidden space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="flex items-center gap-4 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80 mb-0.5">All Inclusive</p>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">{sectionTitle}</h2>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INCLUDED_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group flex flex-col gap-4 rounded-[2rem] border border-white/5 bg-slate-950/40 p-5 transition-all duration-300 hover:border-sky-500/30 hover:bg-slate-950/70"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-slate-100 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}