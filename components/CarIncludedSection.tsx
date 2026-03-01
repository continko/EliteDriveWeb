import {
  CheckCircle2,
  Car,
  CalendarClock,
  Receipt,
  Shield,
  Truck,
  Headphones
} from "lucide-react";

const INCLUDED_ITEMS = [
  {
    icon: Car,
    title: "Kompletná údržba vozidla",
    description: "Všetky vozidlá pravidelne kontrolované a servisované."
  },
  {
    icon: CalendarClock,
    title: "Flexibilné zmeny rezervácie",
    description: "Bezplatná zmena termínu až 48 hodín pred začiatkom."
  },
  {
    icon: Receipt,
    title: "Slovenská diaľničná známka",
    description: "Automaticky zahrnutá v cene pre každé vozidlo."
  },
  {
    icon: Shield,
    title: "Poistenie vozidla",
    description: "Komplexné poistenie zahrnuté v cene."
  },
  {
    icon: Truck,
    title: "Náhradné vozidlo 24/7",
    description: "Okamžitá výmena v prípade poruchy."
  },
  {
    icon: Headphones,
    title: "Technická podpora",
    description: "Non-stop asistenčná služba."
  }
];

export function CarIncludedSection() {
  return (
    /* HLAVNÝ KONTAJNER: Zladený s CarPricingTableCard a CarEquipmentPills */
    <section className="relative overflow-hidden space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
      {/* Vnútorný odlesk pre hĺbku */}
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="flex items-center gap-4 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80 mb-0.5">All Inclusive</p>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">V cene je zahrnuté</h2>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INCLUDED_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              /* POLOŽKY: Tmavšie vnútro (bg-slate-950/40) pre čistejší text */
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