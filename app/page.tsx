"use client";

import { ChevronRight, Phone } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { cars } from "@/lib/cars";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLang();
  const featuredCars = cars.slice(0, 3);

  return (
    <main className="relative min-h-screen bg-[#020617] selection:bg-sky-500/30 overflow-hidden">
      
      {/* ATMOSFÉRICKÉ SVETLÁ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 h-[1000px] w-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_70%)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center pt-24 pb-32">
          <div className="flex max-w-5xl flex-col items-center space-y-12">
            <div className="space-y-8">
              <h1 className="text-balance text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl">
                {t.hero_title} <br />
                <span className="bg-gradient-to-b from-sky-400 to-sky-600 bg-clip-text text-transparent">{t.hero_title_span}</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-400 sm:text-xl">
                {t.hero_subtitle}
              </p>
            </div>

            <dl className="grid w-full gap-4 pt-12 sm:grid-cols-3">
              {[
                { label: t.benefit_1_label, text: t.benefit_1_text },
                { label: t.benefit_2_label, text: t.benefit_2_text },
                { label: t.benefit_3_label, text: t.benefit_3_text }
              ].map((item, idx) => (
                <div key={idx} className="group rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-sky-500/30">
                  <dt className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500/80">{item.label}</dt>
                  <dd className="mt-3 text-sm font-bold leading-relaxed text-slate-300">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 2. KATALÓG */}
        <section id="katalog-aut" className="scroll-mt-32 space-y-16 pb-32">
          <header className="flex flex-col items-start justify-between gap-8 border-l-2 border-sky-500 pl-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-sky-500/80">{t.cat_badge}</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-6xl">{t.cat_title}</h2>
            </div>
            <p className="max-w-xs text-xs font-bold leading-relaxed text-slate-500 uppercase tracking-wider italic">
              {t.cat_info}
            </p>
          </header>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/flotila" 
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:border-sky-500/50 hover:bg-sky-500/5"
            >
              {t.cat_btn}
              <ChevronRight className="h-4 w-4 text-sky-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* 3. PROCES */}
        <section id="ako-to-funguje" className="scroll-mt-32 py-32 border-y border-white/5">
          <div className="text-center mb-24">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-sky-500/60 mb-3">{t.proc_badge}</p>
            <h2 className="text-5xl font-black text-white sm:text-7xl tracking-tighter">{t.proc_title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
            {[
              { step: "01", title: t.step1_title, desc: t.step1_desc },
              { step: "02", title: t.step2_title, desc: t.step2_desc },
              { step: "03", title: t.step3_title, desc: t.step3_desc }
            ].map((item, idx) => (
              <div key={idx} className="group relative p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all hover:border-sky-500/30">
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 font-black">{item.step}</div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">{item.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-400 italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FAQ */}
        <section id="podmienky" className="scroll-mt-32 py-32">
          <FAQSection />
          <div className="mt-12 text-center">
            <Link href="/faq" className="text-sky-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors underline underline-offset-8">
              {t.faq_all_link}
            </Link>
          </div>
        </section>

        {/* 5. KONTAKT */}
        <section id="kontakt" className="scroll-mt-32 py-32 bg-white/[0.01] border-t border-white/5 rounded-[4rem] mb-20 text-center">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tighter sm:text-7xl">{t.contact_title}</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto italic">{t.contact_subtitle}</p>
          <a href="tel:+421910666949" className="inline-flex items-center gap-3 rounded-2xl bg-sky-500 px-12 py-6 text-sm font-black uppercase tracking-widest text-slate-950 hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105">
            {t.contact_btn}
          </a>
        </section>
      </div>
    </main>
  );
}