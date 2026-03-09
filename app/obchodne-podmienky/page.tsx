import React from 'react';
import { ArrowLeft, Scale, ShieldCheck, Gavel, Car, Fuel, AlertOctagon, FileText, Ban, Gauge, CreditCard, Clock, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function VOPPage() {
  return (
    <main className="min-h-screen bg-[#020512] text-slate-400 font-sans pb-32 selection:bg-sky-500/30 italic">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full h-20 border-b border-white/5 bg-[#020512]/95 backdrop-blur-xl px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-sky-500 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">EliteDrive System</span>
        </Link>
        <div className="flex items-center gap-3">
          <Scale className="w-4 h-4 text-sky-500" />
          <span className="text-white font-black italic tracking-tighter uppercase text-sm">Zmluvné Podmienky (VOP)</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 italic">
        
        {/* HEADER */}
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-sky-500" />
            <span className="text-sky-500 text-[10px] font-black uppercase tracking-[0.4em]">Právna Dokumentácia v3.1</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-8 italic">
            Zmluvný <br /> <span className="text-sky-500">Kódex</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          <div className="lg:col-span-8 space-y-24 text-xs md:text-sm leading-relaxed border-l border-white/5 pl-8 md:pl-12">

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">01.</span> Úvodné ustanovenia a definície
              </h2>
              <div className="space-y-4">
                <p>1.1. Tieto Všeobecné obchodné podmienky (ďalej len „VOP“) upravujú právne vzťahy medzi spoločnosťou <span className="text-white font-bold">EliteDrive s. r. o.</span> (ďalej len „Prenajímateľ“) a Nájomcom pri prenájme motorových vozidiel.</p>
                <p>1.2. Nájomca je každá fyzická alebo právnická osoba, ktorá uzatvorí s Prenajímateľom Nájomnú zmluvu (ďalej len „NZ“).</p>
                <p>1.3. NZ nadobúda platnosť momentom podpisu oboma zmluvnými stranami. Tieto VOP tvoria neoddeliteľnú súčasť NZ.</p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">02.</span> Podmienky pre Nájomcu
              </h2>
              <div className="space-y-4">
                <p>2.1. Nájomca musí byť držiteľom platného vodičského oprávnenia (VP) skupiny B po dobu minimálne 2 rokov.</p>
                <p>2.2. Minimálny vek vodiča je 21 rokov. Pri vybraných modeloch (Supercars) je stanovený vek 25 rokov a overenie bonity.</p>
                <p>2.3. Nájomca je povinný predložiť originál OP/Pasu a VP. Prenajímateľ je oprávnený vyhotoviť si kópie týchto dokladov v súlade s GDPR.</p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">03.</span> Rezervácia a Storno podmienky
              </h2>
              <div className="space-y-4">
                <p>3.1. Rezervácia je záväzná až po uhradení rezervačného poplatku alebo potvrdzujúcom e-maile Prenajímateľa.</p>
                <p>3.2. <span className="text-white font-bold">Storno poplatky:</span> 
                  <br />• Viac ako 7 dní pred nájmom: 0 % 
                  <br />• 48h - 7 dní: 50 % z ceny nájmu 
                  <br />• Menej ako 48h / No-show: 100 % z ceny nájmu.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">04.</span> Nájomné a Finančná zábezpeka
              </h2>
              <div className="space-y-4">
                <p>4.1. Nájomné sa platí vopred. V cene je zahrnuté: zákonné poistenie (PZP), havarijné poistenie so spoluúčasťou a diaľničná známka SR.</p>
                <p>4.2. <span className="text-white font-bold">Depozit:</span> Slúži na krytie spoluúčasti pri nehode, poškodení interiéru, diskov alebo straty kľúčov. Depozit sa blokuje na karte alebo skladá v hotovosti.</p>
                <p>4.3. Limit kilometrov je štandardne 200 km/deň. Nadlimitný kilometer sa účtuje sadzbou 0,50 € – 2,00 € podľa typu vozidla.</p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">05.</span> Protokol o odovzdaní a vrátení
              </h2>
              <div className="space-y-4">
                <p>5.1. Vozidlo sa odovzdáva s plnou nádržou a čisté. V takom istom stave sa musí vrátiť.</p>
                <p>5.2. Akékoľvek poškodenie zistené pri vrátení, ktoré nie je v odovzdávacom protokole, ide na vrub Nájomcu.</p>
                <p>5.3. <span className="text-white font-bold">Meškanie:</span> Oneskorenie vrátenia o viac ako 59 minút zakladá nárok na účtovanie ďalšieho dňa nájmu.</p>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">06.</span> Povinnosti a Zákazy
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-4">
                  <h4 className="text-red-500 font-black uppercase text-[10px] flex items-center gap-2 italic">
                    <Ban className="w-4 h-4" /> Prísne zakázané
                  </h4>
                  <ul className="text-[11px] space-y-2 list-disc list-inside">
                    <li>Fajčenie (aj e-cigarety) - pokuta 250 €</li>
                    <li>Vypnutie GPS sledovania - pokuta 3 000 €</li>
                    <li>Jazda na okruhoch / Drifting - pokuta 5 000 €</li>
                    <li>Prenechanie tretej osobe - pokuta 1 000 €</li>
                    <li>Jazda pod vplyvom - plná zodpovednosť</li>
                  </ul>
                </div>
                <div className="p-6 rounded-3xl bg-sky-500/5 border border-sky-500/10 space-y-4">
                  <h4 className="text-sky-500 font-black uppercase text-[10px] flex items-center gap-2 italic">
                    <ShieldCheck className="w-4 h-4" /> Povinnosti
                  </h4>
                  <ul className="text-[11px] space-y-2 list-disc list-inside">
                    <li>Hlásenie každej nehody polícii</li>
                    <li>Kontrola prevádzkových kvapalín</li>
                    <li>Parkovanie na bezpečných miestach</li>
                    <li>Tankovanie určeného paliva (98/100 oct)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">07.</span> GPS Monitorovanie a telemetria
              </h2>
              <p>7.1. Vozidlá sú vybavené GPS systémom monitorujúcim polohu, rýchlosť a preťaženie (G-force). Nájomca vyjadruje súhlas s týmto monitorovaním.</p>
              <p>7.2. Pri zistení hrubého zaobchádzania (opakované prekračovanie rýchlosti, jazda v obmedzovači) má Prenajímateľ právo vypovedať zmluvu a vozidlo okamžite odobrať bez nároku na vrátenie nájomného.</p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">08.</span> Sadzobník pokút a poplatkov
              </h2>
              <div className="overflow-hidden rounded-3xl border border-white/10 italic">
                {[
                  { l: "Vrátenie so znečisteným interiérom", v: "150 €" },
                  { l: "Vrátenie so silne znečisteným exteriérom", v: "50 €" },
                  { l: "Strata kľúčov od vozidla", v: "500 € + náklady" },
                  { l: "Strata dokumentov od vozidla", v: "300 €" },
                  { l: "Nedotankovanie paliva", v: "2,50 € / liter" },
                  { l: "Poškodenie disku kolesa (škrabanec)", v: "od 200 € / ks" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between p-4 border-t border-white/5 hover:bg-white/5 transition-colors italic">
                    <span>{item.l}</span>
                    <span className="text-white font-bold">{item.v}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6 italic">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="text-sky-500">09.</span> Dopravné priestupky
              </h2>
              <p>9.1. Nájomca v plnom rozsahu zodpovedá za všetky dopravné priestupky spáchané počas doby nájmu.</p>
              <p>9.2. V prípade doručenia pokuty po ukončení nájmu (objektívna zodpovednosť), Prenajímateľ prefaktúruje pokutu Nájomcovi spolu s manipulačným poplatkom 20 € za spracovanie každej pokuty.</p>
            </section>

            <section className="pt-20 border-t border-white/10 italic">
              <p className="text-[10px] text-slate-600 leading-relaxed italic">
                Právne vzťahy neupravené touto zmluvou sa riadia Obchodným zákonníkom SR. Nájomca vyhlasuje, že zmluvu uzatvára slobodne a vážne. Miestne príslušným súdom pre všetky spory je Okresný súd v sídle Prenajímateľa.
              </p>
            </section>

          </div>

          <aside className="lg:col-span-4 italic">
            <div className="sticky top-32 space-y-6">
              <div className="p-8 rounded-[3rem] bg-sky-500 text-black">
                <Gavel className="w-10 h-10 mb-6" />
                <h3 className="text-xl font-black uppercase leading-tight mb-4 italic">Právna <br /> Integrita</h3>
                <p className="text-xs font-bold italic">Tieto podmienky sú navrhnuté tak, aby chránili obe strany a zabezpečili férový prenájom prémiových vozidiel.</p>
              </div>

              <div className="p-8 rounded-[3rem] border border-white/5 bg-white/[0.02]">
                <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-6 italic">Kľúčové limity</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center italic">
                    <span className="text-xs">Denný limit</span>
                    <span className="text-white font-black italic">200 KM</span>
                  </div>
                  <div className="flex justify-between items-center italic">
                    <span className="text-xs">Minimálny vek</span>
                    <span className="text-white font-black italic">21 ROKOV</span>
                  </div>
                  <div className="flex justify-between items-center italic">
                    <span className="text-xs">Spoluúčasť</span>
                    <span className="text-white font-black italic">DEPOZIT</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}