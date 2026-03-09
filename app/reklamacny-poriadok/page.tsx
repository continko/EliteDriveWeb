import React from 'react';
import { ArrowLeft, ShieldAlert, Scale, Gavel, ClipboardCheck, Info, Mail, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ReklamacnyPoriadok() {
  return (
    <main className="min-h-screen bg-[#020512] text-slate-400 font-sans pb-32 selection:bg-sky-500/30 italic">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full h-20 border-b border-white/5 bg-[#020512]/95 backdrop-blur-xl px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-sky-500 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">EliteDrive Base</span>
        </Link>
        <div className="flex items-center gap-3">
          <Scale className="w-4 h-4 text-sky-500" />
          <span className="text-white font-black italic tracking-tighter uppercase text-sm">Reklamačný Protokol</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-24">
        
        {/* HEADER */}
        <header className="mb-24 border-l-4 border-sky-500 pl-10">
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-8">
            Reklamačný <br /> <span className="text-sky-500 italic">Poriadok</span>
          </h1>
          <p className="max-w-2xl text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 leading-relaxed">
            Vypracovaný v súlade so zákonom č. 40/1964 Zb. Občiansky zákonník a zákonom č. 250/2007 Z. z. o ochrane spotrebiteľa.
          </p>
        </header>

        <div className="space-y-16 text-xs md:text-sm leading-relaxed text-slate-400">

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="text-sky-500">I.</span> Úvodné ustanovenia
            </h2>
            <div className="space-y-4 border-l border-white/10 pl-8 italic">
              <p>1.1. Spoločnosť <span className="text-white font-bold">EliteDrive s. r. o.</span>, so sídlom [DOPLŇ SÍDLO], IČO: [DOPLŇ], (ďalej len „Prenajímateľ“), vydáva tento Reklamačný poriadok, ktorý upravuje podmienky a postup pri uplatňovaní práv zo zodpovednosti za vady služieb (ďalej len „reklamácia“).</p>
              <p>1.2. Tento Reklamačný poriadok je zverejnený v sídle Prenajímateľa a na webovom sídle www.elitedrive.sk.</p>
              <p>1.3. Zákazníkom sa na účely tohto poriadku rozumie každá fyzická alebo právnická osoba, ktorej Prenajímateľ poskytuje služby na základe Nájomnej zmluvy.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="text-sky-500">II.</span> Zodpovednosť za vady
            </h2>
            <div className="space-y-4 border-l border-white/10 pl-8 italic">
              <p>2.1. Prenajímateľ zodpovedá za to, že motorové vozidlo je pri odovzdaní Nájomcovi v stave spôsobilom na riadne užívanie a spĺňa všetky podmienky stanovené v Nájomnej zmluve.</p>
              <p>2.2. Prenajímateľ nezodpovedá za vady, o ktorých Nájomca v čase uzatvorenia zmluvy vedel alebo s prihliadnutím na okolnosti vedieť musel, najmä tie, ktoré sú uvedené v odovzdávacom protokole.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="text-sky-500">III.</span> Postup uplatnenia reklamácie
            </h2>
            <div className="space-y-4 border-l border-white/10 pl-8 italic">
              <p>3.1. Nájomca je povinný uplatniť reklamáciu <span className="text-white font-bold">bezodkladne</span> po tom, čo vadu zistil, najneskôr však do konca doby nájmu, ak ide o vady technického stavu vozidla.</p>
              <p>3.2. Reklamáciu je možné uplatniť:
                <br />• <span className="text-white">Písomne</span> na adresu sídla Prenajímateľa.
                <br />• <span className="text-white">E-mailom</span> na adresu: info@elitedrive.sk.
              </p>
              <p>3.3. Pri reklamácii je Nájomca povinný predložiť Nájomnú zmluvu, odovzdávací protokol a presne špecifikovať, v čom vada spočíva a aké právo si uplatňuje.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="text-sky-500">IV.</span> Vybavenie reklamácie
            </h2>
            <div className="space-y-4 border-l border-white/10 pl-8 italic">
              <p>4.1. Prenajímateľ je povinný vydať Nájomcovi potvrdenie o uplatnení reklamácie. Ak je reklamácia uplatnená e-mailom, potvrdenie musí byť doručené ihneď.</p>
              <p>4.2. O opodstatnenosti reklamácie rozhodne Prenajímateľ ihneď, v zložitých prípadoch do 3 pracovných dní. Vybavenie reklamácie však nesmie trvať dlhšie ako <span className="text-white font-bold">30 dní</span> odo dňa jej uplatnenia.</p>
              <p>4.3. Ak je reklamácia opodstatnená, Nájomca má právo na bezplatné odstránenie vady, primeranú zľavu z ceny nájmu, alebo v prípade neodstrániteľnej vady brániacej užívaniu, na náhradné vozidlo alebo odstúpenie od zmluvy.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="text-sky-500">V.</span> Alternatívne riešenie sporov (ARS)
            </h2>
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 italic">
              <p>5.1. V prípade, že Nájomca – spotrebiteľ nie je spokojný so spôsobom, ktorým Prenajímateľ vybavil jeho reklamáciu, má právo obrátiť sa na Prenajímateľa so žiadosťou o nápravu.</p>
              <p>5.2. Ak Prenajímateľ na túto žiadosť odpovie zamietavo alebo na ňu neodpovie do 30 dní, spotrebiteľ má právo podať návrh na začatie alternatívneho riešenia sporu podľa zákona č. 391/2015 Z. z.</p>
              <p>5.3. Príslušným subjektom na alternatívne riešenie spotrebiteľských sporov je:
                <br /><span className="text-white font-bold">Slovenská obchodná inšpekcia (SOI)</span>, Ústredný inšpektorát, Odbor pre medzinárodné vzťahy a alternatívne riešenie spotrebiteľských sporov, Bajkalská 21/A, 827 99 Bratislava 27, www.soi.sk.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="text-sky-500">VI.</span> Záverečné ustanovenia
            </h2>
            <p className="border-l border-white/10 pl-8 italic">
              6.1. Tento Reklamačný poriadok nadobúda platnosť a účinnosť dňom 01.01.2024. Prenajímateľ si vyhradzuje právo na zmeny bez predchádzajúceho upozornenia.
            </p>
          </section>

        </div>

        {/* CONTACT FOOTER */}
        <div className="mt-32 p-12 rounded-[3.5rem] bg-sky-500 text-black italic">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-3xl font-black uppercase italic leading-none">Máte sťažnosť?</h3>
              <p className="text-sm font-bold opacity-80">Náš tím podpory je tu, aby vyriešil akýkoľvek problém s vaším prenájmom.</p>
            </div>
            <div className="flex gap-4">
              <a href="mailto:info@elitedrive.sk" className="p-4 bg-black text-white rounded-full hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </a>
              <a href="tel:+421000000" className="p-4 bg-black text-white rounded-full hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

      </div>

      <footer className="mt-40 py-10 text-center border-t border-white/5 italic">
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] italic">
          EliteDrive s.r.o. &copy; 2026 Legal Infrastructure
        </p>
      </footer>
    </main>
  );
}