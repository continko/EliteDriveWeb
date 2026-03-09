"use client";

import { FileCheck, User, Info } from "lucide-react";
import type { Car } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarRentalConditionsCardProps = {
  car: Car;
};

export function CarRentalConditionsCard({ car }: CarRentalConditionsCardProps) {
  const { lang } = useLang();

  const ui = {
    sk: {
      rules: "Pravidlá",
      title: "Podmienky prenájmu",
      ageLabel: "Minimálny vek",
      ageValue: `${car.minAge} rokov`,
      ageDesc: `Vodič musí mať dovŕšených aspoň ${car.minAge} rokov.`,
      licenseLabel: "Prax vodiča",
      licenseValue: `min. ${car.minLicenseYears} rok${car.minLicenseYears > 1 ? "y" : ""}`,
      licenseDesc: `Držiteľ vodičského oprávnenia aspoň ${car.minLicenseYears} rok${car.minLicenseYears > 1 ? "y" : ""}.`,
      info: "Vozidlo je určené výhradne na bežnú cestnú premávku. Zákaz jázd na okruhu, driftovania a extrémneho zaťažovania."
    },
    en: {
      rules: "Rules",
      title: "Rental Conditions",
      ageLabel: "Minimum Age",
      ageValue: `${car.minAge} years`,
      ageDesc: `Driver must be at least ${car.minAge} years old.`,
      licenseLabel: "Experience",
      licenseValue: `min. ${car.minLicenseYears} year${car.minLicenseYears > 1 ? "s" : ""}`,
      licenseDesc: `Driving license holder for at least ${car.minLicenseYears} year${car.minLicenseYears > 1 ? "s" : ""}.`,
      info: "The vehicle is intended exclusively for normal road traffic. Racing, drifting, and extreme loading are prohibited."
    },
    bs: {
      rules: "Pravila",
      title: "Uslovi najma",
      ageLabel: "Minimalna starost",
      ageValue: `${car.minAge} godina`,
      ageDesc: `Vozač mora imati najmanje ${car.minAge} godina.`,
      licenseLabel: "Iskustvo vozača",
      licenseValue: `min. ${car.minLicenseYears} godin${car.minLicenseYears === 1 ? "u" : "e"}`,
      licenseDesc: `Vlasnik vozačke dozvole najmanje ${car.minLicenseYears} godin${car.minLicenseYears === 1 ? "u" : "e"}.`,
      info: "Vozilo je namijenjeno isključivo za uobičajeni cestovni saobraćaj. Zabranjena je vožnja na stazi, driftanje i ekstremno opterećenje."
    }
  }[lang as 'sk' | 'en' | 'bs'] || {};

  return (
    <section className="relative overflow-hidden space-y-6 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="relative space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">
          {ui.rules}
        </p>
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">{ui.title}</h2>
      </header>

      <div className="space-y-4">
        {/* Minimálny vek */}
        <div className="group flex items-start gap-5 rounded-[2rem] bg-slate-950/40 p-5 border border-white/5 transition-all hover:border-amber-400/30 hover:bg-slate-950/60">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-slate-950">
            <User className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">{ui.ageLabel}</p>
            <p className="text-lg font-black text-white">{ui.ageValue}</p>
            <p className="text-[11px] leading-relaxed text-slate-400">{ui.ageDesc}</p>
          </div>
        </div>

        {/* Držiteľ VP */}
        <div className="group flex items-start gap-5 rounded-[2rem] bg-slate-950/40 p-5 border border-white/5 transition-all hover:border-sky-500/30 hover:bg-slate-950/60">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-slate-950">
            <FileCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-400/80">{ui.licenseLabel}</p>
            <p className="text-lg font-black text-white">{ui.licenseValue}</p>
            <p className="text-[11px] leading-relaxed text-slate-400">{ui.licenseDesc}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex gap-4 rounded-[2rem] bg-sky-500/5 p-5 border border-sky-500/10 backdrop-blur-md">
          <Info className="h-5 w-5 shrink-0 text-sky-400 mt-0.5" />
          <p className="text-xs leading-relaxed text-slate-400 font-medium italic">
            {ui.info}
          </p>
        </div>
      </div>
    </section>
  );
}