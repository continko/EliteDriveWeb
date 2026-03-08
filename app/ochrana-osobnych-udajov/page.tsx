import React from 'react';
import { Shield, ArrowLeft, ChevronRight, Scale, Lock, Eye, Database, Globe, FileText, AlertCircle, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OchranaOsobnychUdajov() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 selection:bg-sky-500/30 font-sans pb-24 italic">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full h-20 border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl px-6 md:px-12 flex items-center justify-between italic">
        <Link href="/" className="flex items-center gap-2 group italic">
          <ArrowLeft className="w-4 h-4 text-sky-500 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Base Operations</span>
        </Link>
        <div className="flex items-center gap-2 italic">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-white font-black italic tracking-tighter uppercase text-sm">Legal Protocol</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20">
        
        {/* HERO SECTION */}
        <header className="mb-24 italic">
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-8">
            Privacy <br /> <span className="text-sky-500">Policy</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500 italic">
            <span className="flex items-center gap-2"><Scale className="w-4 h-4 text-sky-500" /> GDPR / EU 2016/679</span>
            <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-sky-500" /> Šifrované spracúvanie</span>
            <span className="text-sky-500/50 italic">Posledná aktualizácia: 01. 01. 2024</span>
          </div>
        </header>

        {/* FULL LEGAL TEXT INFRASTRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 italic">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-20 italic text-slate-400">
            
            {/* 1. ÚVOD A IDENTIFIKÁCIA */}
            <section id="uvod" className="space-y-6 italic">
              <h2 className="text-2xl font-black text-white uppercase italic italic flex items-center gap-4 italic">
                <span className="text-sky-500 italic">01.</span> Identifikačné údaje
              </h2>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 italic">
                <p>Prevádzkovateľom vašich osobných údajov je spoločnosť:</p>
                <div className="space-y-2 text-white font-bold italic">
                  <p className="text-xl">EliteDrive s. r. o.</p>
                  <p>Sídlo: [DOPLŇ ULICU, MESTO]</p>
                  <p>IČO: [DOPLŇ IČO]</p>
                  <p>DIČ: [DOPLŇ DIČ]</p>
                  <p className="text-sky-500 underline underline-offset-4">E-mail: info@elitedrive.sk</p>
                </div>
                <p className="text-xs italic leading-relaxed pt-4 border-t border-white/5 italic">
                  Prevádzkovateľ spracúva osobné údaje v súlade s Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 o ochrane fyzických osôb pri spracúvaní osobných údajov a o voľnom pohybe takýchto údajov (ďalej len „GDPR“) a zákonom č. 18/2018 Z. z. o ochrane osobných údajov.
                </p>
              </div>
            </section>

            {/* 2. ROZSAH A KATEGÓRIE */}
            <section className="space-y-6 italic">
              <h2 className="text-2xl font-black text-white uppercase italic italic flex items-center gap-4 italic">
                <span className="text-sky-500 italic">02.</span> Rozsah spracúvaných údajov
              </h2>
              <div className="space-y-4 italic">
                <p>Prevádzkovateľ spracúva osobné údaje v rozsahu nevyhnutnom na dosiahnutie nižšie uvedených účelov:</p>
                <div className="grid gap-4 italic">
                  {[
                    { t: "Základné údaje", d: "Meno, priezvisko, titul, dátum narodenia." },
                    { t: "Kontaktné údaje", d: "Trvalé bydlisko, e-mail, telefónne číslo." },
                    { t: "Dokladové údaje", d: "Číslo OP, číslo VP, dátumy platnosti a skeny (na základe osobitného súhlasu)." },
                    { t: "Lokalizačné údaje", d: "GPS súradnice, história pohybu, rýchlosť vozidla a prevádzkové parametre." },
                    { t: "Fakturačné údaje", d: "Číslo bankového účtu, údaje o platbách, IČO/DIČ pri firmách." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border-l-2 border-sky-500/20 bg-white/[0.01] italic">
                      <ChevronRight className="w-4 h-4 text-sky-500 mt-1 italic" />
                      <div>
                        <p className="text-white font-bold italic">{item.t}</p>
                        <p className="text-xs italic">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. ÚČELY A PRÁVNY ZÁKLAD */}
            <section className="space-y-6 italic">
              <h2 className="text-2xl font-black text-white uppercase italic italic flex items-center gap-4 italic">
                <span className="text-sky-500 italic">03.</span> Účely a právny základ
              </h2>
              <div className="space-y-4 italic">
                <div className="overflow-hidden rounded-3xl border border-white/5 italic">
                  <table className="w-full text-left text-xs italic">
                    <thead className="bg-white/5 text-sky-500 uppercase font-black italic">
                      <tr>
                        <th className="p-4 italic">Účel spracúvania</th>
                        <th className="p-4 italic">Právny základ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 italic">
                      <tr>
                        <td className="p-4 italic">Uzatvorenie a plnenie nájomnej zmluvy</td>
                        <td className="p-4 italic text-white">Čl. 6 ods. 1 písm. b) GDPR</td>
                      </tr>
                      <tr>
                        <td className="p-4 italic">Vedenie účtovnej a daňovej agendy</td>
                        <td className="p-4 italic text-white italic">Čl. 6 ods. 1 písm. c) GDPR</td>
                      </tr>
                      <tr>
                        <td className="p-4 italic italic">GPS Monitoring (ochrana majetku)</td>
                        <td className="p-4 italic text-white italic italic">Čl. 6 ods. 1 písm. f) GDPR</td>
                      </tr>
                      <tr>
                        <td className="p-4 italic italic italic">Marketingová komunikácia</td>
                        <td className="p-4 italic text-white italic italic italic">Čl. 6 ods. 1 písm. a) GDPR</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 4. GPS MONITOROVANIE - DETAILNÁ INFRA */}
            <section className="space-y-6 italic">
              <div className="p-8 rounded-[2rem] bg-sky-500 text-black italic">
                <h2 className="text-2xl font-black uppercase italic italic mb-4 italic italic">04. GPS Monitoring</h2>
                <p className="text-sm font-bold leading-relaxed italic italic">
                  Vozidlá Prevádzkovateľa sú monitorované systémom GPS za účelom ochrany majetku Prevádzkovateľa, prevencie krádeží a zabezpečenia pomoci v núdzi.
                </p>
                <div className="mt-6 grid md:grid-cols-2 gap-4 italic italic">
                  <div className="p-4 bg-black/5 rounded-2xl italic italic">
                    <p className="font-black text-[10px] uppercase italic">Doba uchovávania</p>
                    <p className="text-xs italic italic">30 kalendárnych dní</p>
                  </div>
                  <div className="p-4 bg-black/5 rounded-2xl italic italic">
                    <p className="font-black text-[10px] uppercase italic">Prístup k dátam</p>
                    <p className="text-xs italic italic italic">Výhradne autorizovaní správcovia</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. PRÍJEMCOVIA A PRENOSY */}
            <section className="space-y-6 italic">
              <h2 className="text-2xl font-black text-white uppercase italic italic flex items-center gap-4 italic">
                <span className="text-sky-500 italic">05.</span> Príjemcovia údajov
              </h2>
              <p className="text-sm italic">
                Osobné údaje môžu byť poskytnuté nasledujúcim subjektom: poskytovatelia IT služieb (Vercel, Railway), poskytovatelia účtovných služieb, advokátske kancelárie, poisťovne a orgány verejnej moci (Polícia SR pri dopravných priestupkoch).
              </p>
              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-4 items-start italic">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 italic" />
                <p className="text-[11px] italic text-red-400 italic font-medium italic">
                  Údaje nie sú prenášané do tretích krajín mimo EHP, s výnimkou služieb Google a Meta, ktoré využívajú mechanizmy v zmysle Art. 45 GDPR (Data Privacy Framework).
                </p>
              </div>
            </section>

            {/* 6. VAŠE PRÁVA */}
            <section className="space-y-8 italic">
              <h2 className="text-2xl font-black text-white uppercase italic italic flex items-center gap-4 italic">
                <span className="text-sky-500 italic">06.</span> Práva dotknutej osoby
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 italic italic">
                {[
                  { t: "Právo na prístup", d: "Získať potvrdenie o spracúvaní a kópiu údajov." },
                  { t: "Právo na opravu", d: "Oprava nesprávnych alebo neúplných údajov." },
                  { t: "Právo na výmaz", d: "„Právo na zabudnutie“, ak pominul účel spracúvania." },
                  { t: "Právo na obmedzenie", d: "Dočasné pozastavenie spracúvania v sporných prípadoch." },
                  { t: "Právo namietať", d: "Proti spracúvaniu na základe oprávneného záujmu." },
                  { t: "Sťažnosť", d: "Právo podať podnet na ÚOOÚ SR (statny.dozor@pdp.gov.sk)." }
                ].map((p, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl italic italic italic">
                    <p className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-2 italic">{p.t}</p>
                    <p className="text-xs italic italic">{p.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. ZÁVEREČNÉ USTANOVENIA */}
            <section className="space-y-6 italic">
              <h2 className="text-2xl font-black text-white uppercase italic italic italic">07. Záverečné ustanovenia</h2>
              <p className="text-xs leading-relaxed italic italic">
                Tieto zásady nadobúdajú platnosť a účinnosť dňom 01. 01. 2024. Prevádzkovateľ si vyhradzuje právo kedykoľvek tieto zásady aktualizovať. Aktuálna verzia je vždy zverejnená na tejto webovej stránke.
              </p>
            </section>

          </div>

          {/* SIDEBAR NAVIGATION / INFO BOX */}
          <aside className="lg:col-span-4 italic">
            <div className="sticky top-32 space-y-6 italic">
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 italic">
                <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-6 italic italic">Rýchly kontakt</h4>
                <div className="space-y-4 italic italic">
                  <div className="flex items-center gap-3 italic italic italic">
                    <Mail className="w-4 h-4 text-slate-500 italic" />
                    <span className="text-xs font-bold italic italic italic italic">info@elitedrive.sk</span>
                  </div>
                  <div className="flex items-center gap-3 italic italic italic italic italic">
                    <MapPin className="w-4 h-4 text-slate-500 italic italic" />
                    <span className="text-xs font-bold italic italic italic italic italic italic">Slovenská republika</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 rounded-[2rem] border border-sky-500/10 bg-sky-500/[0.02] italic italic">
                <p className="text-[10px] leading-relaxed italic italic italic italic italic">
                  Všetky dáta sú šifrované podľa priemyselného štandardu AES-256 a prístupné len cez bezpečné rozhranie.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>

      <footer className="mt-40 py-10 text-center italic italic italic italic">
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] italic italic italic italic">
          &copy; 2024 EliteDrive s.r.o. | Legal Integrity Layer
        </p>
      </footer>
    </main>
  );
}