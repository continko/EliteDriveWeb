"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Car, ShieldCheck, Wallet, AlertCircle, Fuel, Clock } from "lucide-react";

const faqData = [
  {
    category: "Základy a Rezervácia",
    icon: <Car className="h-4 w-4 text-sky-400" />,
    items: [
      { q: "Aké sú požiadavky na prenájom vozidla?", a: "Pre prenájom vozidla potrebujete: minimálny vek 18 rokov, platný vodičský preukaz skupiny B, platný občiansky preukaz alebo cestovný pas a platobnú kartu na úhradu zábezpeky. Na rozdiel od iných autopožičovní nepožadujeme minimálne 2 roky vodičskej praxe ani vek 21+." },
      { q: "Ako si môžem rezervovať vozidlo?", a: "Rezervácia je jednoduchá a trvá len 3 minúty: vyberte si vozidlo z našej ponuky, zvoľte dátumy a miesto prevzatia, vyplňte kontaktné údaje a potvrďte rezerváciu. Potvrdenie dostanete okamžite na e-mail. Rezervácia je platná 2 hodiny od dohodnutého času prevzatia." },
      { q: "Musím platiť zálohu pri rezervácii?", a: "Nie, pri rezervácii neplatíte nič. Celkovú cenu prenájmu a zábezpeku uhradíte až pri prevzatí vozidla – prostredníctvom platobnej brány online, bankovým prevodom vopred alebo v hotovosti (len cena prenájmu, nie zábezpeka)." },
      { q: "Aké sú storno podmienky?", a: "Storno je ZADARMO! Rezerváciu môžete zrušiť kedykoľvek bez storno poplatku. Upozornenie: Pri opakovanom účelovom rušení rezervácií si vyhradzujeme právo odmietnuť budúce prenájmy." },
      { q: "Môže s vozidlom jazdiť aj iná osoba?", a: "Áno, ale musí byť vopred nahlásená a schválená. Dodatočný vodič musí spĺňať rovnaké podmienky (18+, platný VP), bude uvedený v zmluve a za každého vodiča sa účtuje jednorazový poplatok. Dôležité: Ak vozidlo vedie osoba, ktorá nie je uvedená v zmluve, poistenie neplatí!" },
      { q: "Ako fungujú darčekové poukážky?", a: "Darčeková poukážka je ideálny darček! Platnosť: 12 mesiacov, hodnoty: od 50€ po vlastnú sumu. Doručenie: okamžite na e-mail v PDF." }
    ]
  },
  {
    category: "Financie a Platby",
    icon: <Wallet className="h-4 w-4 text-emerald-400" />,
    items: [
      { q: "Aká je zábezpeka (depozit) a ako funguje?", a: "Zábezpeka je vratná záloha blokovaná na vašej platobnej karte. Výška závisí od kategórie vozidla: stredná trieda 300-500€, SUV/luxusné 500-1000€, športové/premium 1000-3000€. Zábezpeka je vrátená do 7 dní po vrátení vozidla bez závad." },
      { q: "Aké platobné metódy akceptujete?", a: "Za prenájom akceptujeme: platobnú bránu (Visa, Mastercard), bankový prevod vopred alebo hotovosť pri prevzatí. Za zábezpeku len platobnú kartu (blokovanie). Pre firmy ponúkame fakturáciu s odloženou splatnosťou." },
      { q: "Môžem poukážku kombinovať so zľavou?", a: "Možné kombinovať so zľavami za dlhodobý prenájom a sezónnymi akciami. Nie je možné kombinovať s inými darčekovými poukážkami." },
      { q: "Aké výhody máte pre firemných zákazníkov?", a: "Pre firmy ponúkame: individuálne firemné ceny, fakturáciu s odloženou splatnosťou, fleet management a dedikovaného account managera." }
    ]
  },
  {
    category: "Poistenie a Bezpečnosť",
    icon: <ShieldCheck className="h-4 w-4 text-sky-400" />,
    items: [
      { q: "Čo je zahrnuté v cene prenájmu?", a: "V cene prenájmu je zahrnuté: PZP, havarijné poistenie so spoluúčasťou 10% (min. 400€), diaľničná známka SR, zimné pneumatiky, pravidelný servis a zákaznícka podpora 24/7. Nie sú zahrnuté pohonné hmoty." },
      { q: "Aké poistenie je zahrnuté v prenájme?", a: "Každé vozidlo má: PZP a havarijné poistenie (krytie škôd na vozidle). Spoluúčasť je 10% z výšky škody, minimálne 400€. Ponúkame aj doplnkové poistenie so zníženou spoluúčasťou." },
      { q: "Čo poistenie nekryje?", a: "Škody spôsobené: jazdou pod vplyvom alkoholu/drog (nájomca platí 100%), neautorizovanou osobou za volantom, jazdou v zakázaných krajinách, pretekmi, driftovaním, hrubou nedbanlivosťou." },
      { q: "Aká je spoluúčasť pri poškodení vozidla?", a: "Štandardná spoluúčasť: 10% z výšky škody, minimálne 400€. Príklad: škoda 2000€ → platíte 400€ (minimum), škoda 8000€ → platíte 800€ (10%)." },
      { q: "Sledujete polohu vozidla cez GPS?", a: "Áno, vozidlá sú vybavené sledovacím systémom pre bezpečnosť, riešenie poistných udalostí a pomoc pri poruche/nehode." }
    ]
  },
  {
    category: "Pravidlá a Cesty",
    icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
    items: [
      { q: "Do ktorých krajín môžem vycestovať?", a: "POVOLENÉ: SR, ČR, AT, HU, PL, DE, SI, HR, IT a krajiny EÚ po dohode. ZAKÁZANÉ: Ukrajina, Rusko, Bielorusko, Moldavsko, Rumunsko, Albánsko, Srbsko, Bosna, Čierna Hora, Pobaltie. Pri jazde do zakázanej krajiny poistenie neplatí!" },
      { q: "Majú vozidlá diaľničnú známku?", a: "Slovenská diaľničná známka je zahrnutá v cene. Zahraničné známky si musíte zabezpečiť sami (napr. edalnice.cz, asfinag.at)." },
      { q: "Je vo vozidle povolené fajčenie?", a: "PRÍSNY ZÁKAZ! Vrátane elektronických cigariet. Pokuta za porušenie: 200€." },
      { q: "Môžem s vozidlom ťahať príves?", a: "NIE. Ťahanie akéhokoľvek prívesu alebo iného vozidla je zakázané." },
      { q: "Môžem použiť vozidlo na preteky alebo driftovanie?", a: "ZAKÁZANÉ! Pri porušení poistenie neplatí a nesiete plnú zodpovednosť za škody." },
      { q: "Je možná preprava zvierat vo vozidle?", a: "Možná po predchádzajúcej dohode. Zviera musí byť v prepravke. Poplatok za čistenie pri znečistení: 30-200€." }
    ]
  },
  {
    category: "Stav a Vrátenie vozidla",
    icon: <Fuel className="h-4 w-4 text-sky-400" />,
    items: [
      { q: "V akom stave dostávam vozidlo?", a: "Vozidlo dostávate: umyté, vyčistené, s plnou nádržou, technicky skontrolované, s dokladmi (OEV, zelená karta) a povinnou výbavou." },
      { q: "Ako má vozidlo vyzerať pri vrátení?", a: "Vráťte s PLNOU nádržou, v čistom stave, so všetkými dokladmi a kľúčmi. Poplatky: chýbajúce palivo 2€/liter + 20€ manipulačný, znečistený interiér/exteriér 30-200€." },
      { q: "Čo ak nestihneme vrátiť vozidlo včas?", a: "Tolerancia je 30 minút. Nad 30 min sa účtuje ďalší celý deň. Nevrátenie bez dohody = trestnoprávne dôsledky!" },
      { q: "Čo ak stratím kľúče alebo doklady?", a: "Hradíte všetky náklady: nové kľúče/doklady a stratu zisku (40% dennej sadzby počas odstávky)." },
      { q: "Čo ak dostanem pokutu?", a: "Pokuty znášate vy. Nájomca je povinný uhradiť výšku pokuty a administratívny poplatok za vybavenie." }
    ]
  },
  {
    category: "Nehody a Ostatné",
    icon: <Clock className="h-4 w-4 text-red-400" />,
    items: [
      { q: "Čo robím v prípade nehody?", a: "1. Políca (nad 3990€), 2. Kontakty účastníkov, 3. Záznam o nehode, 4. Kontaktovať nás do 24h na +421 910 666 949, 5. Foto dokumentácia. Neuznávajte vinu na mieste!" },
      { q: "Môžem prevziať/vrátiť vozidlo mimo hodín?", a: "Áno, za príplatok. Štandardne: Po-Pia 8:00-17:00 bez príplatku. Mimo hodín a víkendy podľa sadzobníka." },
      { q: "Ponúkate dlhodobý prenájom?", a: "Áno! 7-13 dní (-10%), 14-29 dní (-15%), 30+ dní (-20-30% zľava)." },
      { q: "Ponúkate náhradné vozidlo?", a: "Áno, spolupracujeme s poisťovňami pri riešení poistných udalostí a doručení vozidla do servisu." },
      { q: "Kto je prevádzkovateľ EliteDrive?", a: "Bude upresnené čoskoro." }
    ]
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-24 text-center">
        
        <h2 className="text-5xl font-black tracking-tighter text-white sm:text-7xl">
          Často kladené otázky
        </h2>
        <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
          Prečítajte si kompletné informácie o prenájme. Transparentnosť je základom našej služby.
        </p>
      </div>

      {/* Grid s kategóriami */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {faqData.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                {cat.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white/90">
                {cat.category}
              </h3>
            </div>

            <div className="space-y-3">
              {cat.items.map((item, itemIdx) => {
                const id = `${catIdx}-${itemIdx}`;
                const isOpen = openId === id;
                return (
                  <div
                    key={id}
                    className={`group rounded-[2rem] border transition-all duration-300 ${
                      isOpen 
                        ? "border-sky-500/30 bg-white/[0.04] ring-1 ring-sky-500/20" 
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : id)}
                      className="flex w-full items-center justify-between p-6 text-left outline-none"
                    >
                      <span className={`pr-4 text-sm font-bold tracking-tight transition-colors duration-300 ${isOpen ? "text-sky-400" : "text-slate-300 group-hover:text-white"}`}>
                        {item.q}
                      </span>
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isOpen ? "border-sky-500 bg-sky-500 text-slate-950 rotate-180" : "border-white/10 text-slate-500 group-hover:border-white/30"}`}>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </button>
                    
                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 text-[13px] leading-relaxed text-slate-400 border-t border-white/5 pt-4">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-3xl mx-auto mt-20 p-10 rounded-[3rem] border border-dashed border-white/10 text-center">
        <h3 className="text-2xl font-black text-white mb-4">Stále máte nejasnosti?</h3>
        <p className="text-slate-500 mb-8">Náš tím je pripravený vám odpovedať na čokoľvek cez WhatsApp alebo telefonicky.</p>
        <a href="tel:+421..." className="text-sky-400 font-black uppercase tracking-widest hover:text-white transition-colors">
          +421 9XX XXX XXX
        </a>
      </div>
    </div>
  );
}