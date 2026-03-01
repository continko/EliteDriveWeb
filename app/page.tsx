import { ArrowRight, Car, HeadphonesIcon, ShieldCheck, ChevronRight, Calendar, Shield, CreditCard } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { cars } from "@/lib/cars";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";

export default function HomePage() {
  // VYBERIEME LEN PRVÉ 3 AUTÁ PRE HOMEPAGE
  const featuredCars = cars.slice(0, 3);

  return (
    /* GLOBÁLNE POZADIE */
    <main className="relative min-h-screen bg-[#020617] selection:bg-sky-500/30 overflow-hidden">
      
      {/* ATMOSFÉRICKÉ SVETLÁ NA POZADÍ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 h-[1000px] w-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_70%)] blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[600px] w-[600px] rounded-full bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-sky-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center pt-24 pb-32">
          <div className="flex max-w-5xl flex-col items-center space-y-12">
            <div className="space-y-8">
              
              
              <h1 className="text-balance text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl">
                Zážitok, na ktorý <br />
                <span className="bg-gradient-to-b from-sky-400 to-sky-600 bg-clip-text text-transparent">nezabudnete.</span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-400 sm:text-xl">
                Starostlivo vybraná kolekcia športových a luxusných vozidiel pre tých, 
                ktorí od jazdy očakávajú dokonalosť.
              </p>
            </div>

            

            <dl className="grid w-full gap-4 pt-12 sm:grid-cols-3">
              {[
                { label: "Zážitok", text: "Špičkové modely v bezchybnom stave.", color: "sky" },
                { label: "Flexibilita", text: "Krátkodobý aj dlhodobý prenájom.", color: "sky" },
                { label: "Prístup", text: "Individuálna starostlivosť 24/7.", color: "sky" }
              ].map((item, idx) => (
                <div key={idx} className="group rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-sky-500/30 hover:bg-slate-900/60">
                  <dt className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500/80">{item.label}</dt>
                  <dd className="mt-3 text-sm font-bold leading-relaxed text-slate-300">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 2. KATALÓG VOZIDIEL (SKRÁTENÝ NA 3 AUTÁ) */}
        <section id="katalog-aut" className="scroll-mt-32 space-y-16 pb-32">
          <header className="flex flex-col items-start justify-between gap-8 border-l-2 border-sky-500 pl-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-sky-500/80">Flotila</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-6xl">Výber z ponuky</h2>
            </div>
            <p className="max-w-xs text-xs font-bold leading-relaxed text-slate-500 uppercase tracking-wider italic">
              * Kompletnú ponuku nájdete v našom celom katalógu.
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
              Pozrieť celú flotilu
              <ChevronRight className="h-4 w-4 text-sky-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* 3. PROCES - 3 KROKY */}
        <section id="ako-to-funguje" className="scroll-mt-32 py-32 border-y border-white/5">
          <div className="text-center mb-24">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-sky-500/60 mb-3">Proces</p>
            <h2 className="text-5xl font-black text-white sm:text-7xl tracking-tighter">
              3 kroky k jazde
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
            {[
              { step: "01", title: "Výber vozidla", desc: "Zvoľte si model, ktorý vyhovuje vašim potrebám." },
              { step: "02", title: "Rezervácia", desc: "Zadajte dátum a odošlite nezáväzný dopyt." },
              { step: "03", title: "Prebratie", desc: "Auto vám pristavíme vyčistené a s plnou nádržou." }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="group relative p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:border-sky-500/30 hover:bg-white/[0.05]"
              >
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 font-black">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-400 italic">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FAQ SEKCOA */}
        <section id="podmienky" className="scroll-mt-32 py-32">
          <FAQSection />
          <div className="mt-12 text-center">
            <Link 
              href="/faq"
              className="text-sky-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors underline underline-offset-8"
            >
              Zobraziť všetky otázky a odpovede →
            </Link>
          </div>
        </section>

        {/* 5. KONTAKT */}
        <section id="kontakt" className="scroll-mt-32 py-32 bg-white/[0.01] border-t border-white/5 rounded-[4rem] mb-20 text-center">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tighter sm:text-7xl">Máte otázky?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto italic">Sme tu pre vás 24/7. Zavolajte nám alebo pošlite nezáväzný dopyt.</p>
          <a 
            href="tel:+4219XXXXXXXX" 
            className="inline-flex items-center gap-3 rounded-2xl bg-sky-500 px-12 py-6 text-sm font-black uppercase tracking-widest text-slate-950 hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105"
          >
            Kontaktovať podporu
          </a>
        </section>
      </div>
    </main>
  );
}