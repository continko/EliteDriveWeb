"use client";

import { Calendar, ShieldCheck, Key, CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { processTranslations } from "@/lib/processData";

export default function ProcessPage() {
  const { lang } = useLang();
  
  // Výber správneho prekladu podľa aktuálneho jazyka
  const content = processTranslations[lang as keyof typeof processTranslations] || processTranslations.sk;

  // Mapa ikoniek pre jednotlivé kroky
  const icons = [<Calendar size={32} />, <ShieldCheck size={32} />, <Key size={32} />];

  return (
    <main className="min-h-screen bg-[#020617] pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black text-white tracking-tighter sm:text-8xl mb-6">
            {content.title}<span className="text-sky-500">{content.title_span}</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">
            {content.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {content.steps.map((step: any, idx: number) => (
            <div key={idx} className="group relative grid md:grid-cols-2 gap-12 items-center p-12 rounded-[4rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all hover:border-sky-500/20">
              {/* Veľké číslo v pozadí */}
              <div className="absolute -top-10 -left-10 text-[12rem] font-black text-white/[0.02] pointer-events-none group-hover:text-sky-500/5 transition-colors">
                {step.id}
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-slate-950 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                  {icons[idx]}
                </div>
                <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{step.title}</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">{step.desc}</p>
              </div>

              {/* Box s detailmi (Checklist) */}
              <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5">
                <ul className="space-y-4">
                  {step.details.map((detail: string, dIdx: number) => (
                    <li key={dIdx} className="flex items-center gap-3 text-white font-bold">
                      <CheckCircle2 className="text-sky-400 h-5 w-5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}