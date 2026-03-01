import { Gauge, Shield } from "lucide-react";
import type { Car, PricingTier } from "@/lib/cars";

type CarPricingTableCardProps = {
  car: Car;
  pricing: PricingTier[];
};

function formatOverLimit(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €/km`;
}

export function CarPricingTableCard({ car, pricing }: CarPricingTableCardProps) {
  return (
    /* ZMENA: bg-slate-900/60 pre hustejšie sklo a backdrop-blur-xl pre lepšiu separáciu od svetlého pozadia */
    <section className="relative overflow-hidden space-y-6 rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all hover:border-sky-500/30">
      
      <header className="relative space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-slate-50 sm:text-xl">Cenník prenájmu</h2>
        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
          Transparentné sadzby
        </p>
      </header>

      {/* Tabuľka - mierne tmavšie pozadie pre čitateľnosť textu */}
      <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40">
        <table className="min-w-full divide-y divide-white/5 text-xs text-slate-300 sm:text-sm">
          <thead className="bg-white/[0.05]">
            <tr>
              <th scope="col" className="px-5 py-3 text-left font-bold uppercase tracking-widest text-slate-500 text-[10px]">
                Doba
              </th>
              <th scope="col" className="px-5 py-3 text-left font-bold uppercase tracking-widest text-slate-500 text-[10px]">
                Denný limit
              </th>
              <th scope="col" className="px-5 py-3 text-left font-bold uppercase tracking-widest text-slate-500 text-[10px]">
                Cena / deň
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pricing.map((tier) => (
              <tr key={tier.label} className="transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-4 font-medium text-slate-200">{tier.label}</td>
                <td className="px-5 py-4 text-slate-400">
                  {tier.dailyKmLimit.toLocaleString("sk-SK")} km
                </td>
                <td className="px-5 py-4 font-bold text-sky-400">
                  {tier.pricePerDay.toLocaleString("sk-SK")} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Info boxy - zvýšená opacita bg-slate-950/60 */}
        <div className="group flex items-center gap-4 rounded-3xl bg-slate-950/60 p-4 ring-1 ring-slate-800/50 transition-all hover:ring-amber-400/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80">Vratný depozit</p>
            <p className="text-base font-bold text-slate-50">
              {car.deposit.toLocaleString("sk-SK")} €
            </p>
          </div>
        </div>

        <div className="group flex items-center gap-4 rounded-3xl bg-slate-950/60 p-4 ring-1 ring-slate-800/50 transition-all hover:ring-sky-500/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
            <Gauge className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400/80">Nadlimit</p>
            <p className="text-base font-bold text-slate-50">{formatOverLimit(car.overLimitPerKm)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}