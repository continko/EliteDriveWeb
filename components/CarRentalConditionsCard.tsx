import { FileCheck, User, Info } from "lucide-react";
import type { Car } from "@/lib/cars";

type CarRentalConditionsCardProps = {
  car: Car;
};

export function CarRentalConditionsCard({ car }: CarRentalConditionsCardProps) {
  return (
    /* ZMENA: bg-slate-900/60 a backdrop-blur-xl pre konzistenciu s ostatnými kartami */
    <section className="relative overflow-hidden space-y-6 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      {/* Vnútorný odlesk pre hĺbku */}
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="relative space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">
          Pravidlá
        </p>
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">Podmienky prenájmu</h2>
      </header>

      <div className="space-y-4">
        {/* Minimálny vek */}
        <div className="group flex items-start gap-5 rounded-[2rem] bg-slate-950/40 p-5 border border-white/5 transition-all hover:border-amber-400/30 hover:bg-slate-950/60">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-slate-950">
            <User className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">Minimálny vek</p>
            <p className="text-lg font-black text-white">{car.minAge} rokov</p>
            <p className="text-[11px] leading-relaxed text-slate-400">Vodič musí mať dovŕšených aspoň {car.minAge} rokov.</p>
          </div>
        </div>

        {/* Držiteľ VP */}
        <div className="group flex items-start gap-5 rounded-[2rem] bg-slate-950/40 p-5 border border-white/5 transition-all hover:border-sky-500/30 hover:bg-slate-950/60">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-slate-950">
            <FileCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-400/80">Prax vodiča</p>
            <p className="text-lg font-black text-white">
              min. {car.minLicenseYears} rok{car.minLicenseYears > 1 ? "y" : ""}
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Držiteľ vodičského oprávnenia aspoň {car.minLicenseYears} rok{car.minLicenseYears > 1 ? "y" : ""}.
            </p>
          </div>
        </div>

        {/* Info Box - Icy Look */}
        <div className="flex gap-4 rounded-[2rem] bg-sky-500/5 p-5 border border-sky-500/10 backdrop-blur-md">
          <Info className="h-5 w-5 shrink-0 text-sky-400 mt-0.5" />
          <p className="text-xs leading-relaxed text-slate-400 font-medium italic">
            Vozidlo je určené výhradne na bežnú cestnú premávku. Zákaz jázd na okruhu, driftovania a extrémneho zaťažovania.
          </p>
        </div>
      </div>
    </section>
  );
}