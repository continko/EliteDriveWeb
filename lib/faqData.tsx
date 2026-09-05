import React from 'react';
import { Car, Wallet, ShieldCheck, AlertCircle, Fuel, Clock } from "lucide-react";

export const faqTranslations: any = {
  sk: {
    title: "Často kladené otázky",
    subtitle: "Prečítajte si kompletné informácie o prenájme. Transparentnosť je základom našej služby.",
    contact_title: "Stále máte nejasnosti?",
    contact_subtitle: "Náš tím je pripravený vám odpovedať na čokoľvek cez WhatsApp alebo telefonicky.",
    categories: [
      {
        category: "Základy a Rezervácia",
        icon: <Car className="h-4 w-4 text-sky-400" />,
        items: [
          { q: "Aké sú požiadavky na prenájom vozidla?", a: "Pre prenájom vozidla potrebujete: minimálny vek 18 rokov, platný vodičský preukaz skupiny B, platný občiansky preukaz alebo cestovný pas a platobnú kartu na úhradu zábezpeky. Na rozdiel od iných autopožičovní nepožadujeme minimálne 2 roky vodičskej praxe ani vek 21+." },
          { q: "Ako si môžem rezervovať vozidlo?", a: "Rezervácia je jednoduchá a trvá len 3 minúty: vyberte si vozidlo z našej ponuky, zvoľte dátumy a miesto prevzatia, vyplňte kontaktné údaje a potvrďte rezerváciu. Potvrdenie dostanete okamžite na e-mail. Rezervácia je platná 2 hodiny od dohodnutého času prevzatia." },
          { q: "Musím platiť zálohu pri rezervácii?", a: "Nie, pri rezervácii neplatíte nič. Celkovú cenu prenájmu a zábezpeku uhradíte až pri prevzatí vozidla – prostredníctvom platobnej brány online, bankovým prevodom vopred alebo v hotovosti (len cena prenájmu, nie zábezpeka)." },
          { q: "Aké sú storno podmienky?", a: "Storno je ZADARMO! Rezerváciu môžete zrušiť kedykoľvek bez storno poplatku. Upozornenie: Pri opakovanom účelovom rušení rezervácií si vyhradzujeme právo odmietnuť budúce prenájmy." },
          { q: "Môže s vozidlom jazdiť aj iná osoba?", a: "Áno, ale musí byť vopred nahlásená a schválená. Dodatočný vodič musí spĺňať rovnaké podmienky (18+, platný VP), bude uvedený v zmluve a za každého vodiča sa účtuje jednorazový poplatok. Dôležité: Ak vozidlo vedie osoba, ktorá nie je uvedená v zmluve, poistenie neplatí!" },
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
          { q: "Kto je prevádzkovateľ UltimateDrive?", a: "Bude upresnené čoskoro." }
        ]
      }
    ]
  },
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Read complete information about rentals. Transparency is the core of our service.",
    contact_title: "Still have questions?",
    contact_subtitle: "Our team is ready to answer anything via WhatsApp or phone.",
    categories: [
      {
        category: "Basics & Booking",
        icon: <Car className="h-4 w-4 text-sky-400" />,
        items: [
          { q: "What are the requirements for car rental?", a: "To rent a vehicle you need: minimum age of 18, valid driving license (category B), valid ID or passport, and a payment card for the security deposit. Unlike other rentals, we do not require 2 years of experience or 21+ age." },
          { q: "How can I book a vehicle?", a: "Booking is simple and takes only 3 minutes: select a vehicle from our fleet, choose dates and pickup location, fill in contact details and confirm. You will receive an e-mail confirmation immediately. The reservation is valid for 2 hours from the agreed pickup time." },
          { q: "Do I have to pay a deposit during booking?", a: "No, you don't pay anything during booking. The total rental price and security deposit are paid upon pickup - via online gateway, bank transfer in advance, or cash (rental price only, not the deposit)." },
          { q: "What is the cancellation policy?", a: "Cancellation is FREE! You can cancel your reservation anytime without a fee. Note: We reserve the right to refuse future rentals in case of repeated intentional cancellations." },
          { q: "Can another person drive the vehicle?", a: "Yes, but they must be registered and approved in advance. Additional drivers must meet the same requirements (18+, valid license), will be listed in the contract, and a one-time fee applies per driver. Important: If an unregistered person drives, the insurance is void!" },
          { q: "How do gift vouchers work?", a: "A gift voucher is the perfect gift! Validity: 12 months, values: from €50 to your custom amount. Delivery: instant via e-mail in PDF format." }
        ]
      },
      {
        category: "Finance & Payments",
        icon: <Wallet className="h-4 w-4 text-emerald-400" />,
        items: [
          { q: "What is the security deposit and how does it work?", a: "The deposit is a refundable guarantee blocked on your payment card. Amount depends on the vehicle category: Mid-class €300-500, SUV/Luxury €500-1000, Sport/Premium €1000-3000. It is released within 7 days after returning the vehicle without damage." },
          { q: "What payment methods do you accept?", a: "For the rental: payment gateway (Visa, Mastercard), bank transfer in advance, or cash upon pickup. For the security deposit: only payment card (pre-authorization). We offer deferred payment for companies." },
          { q: "Can I combine a voucher with a discount?", a: "Yes, vouchers can be combined with long-term rental discounts and seasonal promotions. Vouchers cannot be combined with other gift vouchers." },
          { q: "What benefits do you offer for corporate customers?", a: "For companies we offer: individual corporate pricing, deferred payment invoicing, fleet management, and a dedicated account manager." }
        ]
      },
      {
        category: "Insurance & Safety",
        icon: <ShieldCheck className="h-4 w-4 text-sky-400" />,
        items: [
          { q: "What is included in the rental price?", a: "Price includes: Liability insurance (PZP), Hull insurance with 10% deductible (min. €400), Slovak highway vignette, winter tires, regular maintenance, and 24/7 support. Fuel is not included." },
          { q: "What insurance is included?", a: "Every vehicle has liability and hull insurance (covering damage to the vehicle). The deductible is 10% of the damage, minimum €400. We also offer supplementary insurance with reduced deductible." },
          { q: "What does the insurance not cover?", a: "Damage caused by: driving under influence of alcohol/drugs (tenant pays 100%), unauthorized driver, driving in prohibited countries, racing, drifting, or gross negligence." },
          { q: "What is the deductible for vehicle damage?", a: "Standard deductible: 10% of the damage, minimum €400. Example: damage €2000 → you pay €400 (minimum), damage €8000 → you pay €800 (10%)." },
          { q: "Do you track vehicle location via GPS?", a: "Yes, vehicles are equipped with a tracking system for safety, insurance claim resolution, and roadside assistance." }
        ]
      },
      {
        category: "Rules & Travel",
        icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
        items: [
          { q: "To which countries can I travel?", a: "ALLOWED: SK, CZ, AT, HU, PL, DE, SI, HR, IT and EU countries by agreement. PROHIBITED: Ukraine, Russia, Belarus, Moldova, Romania, Albania, Serbia, Bosnia, Montenegro, Baltics. Insurance is void in prohibited countries!" },
          { q: "Do vehicles have a highway vignette?", a: "The Slovak highway vignette is included. Foreign vignettes must be purchased by the tenant (e.g., edalnice.cz, asfinag.at)." },
          { q: "Is smoking allowed in the vehicle?", a: "STRICTLY PROHIBITED! Including electronic cigarettes. Violation fine: €200." },
          { q: "Can I tow a trailer?", a: "NO. Towing any trailer or another vehicle is strictly prohibited." },
          { q: "Can I use the vehicle for racing or drifting?", a: "PROHIBITED! In case of violation, insurance is void and you bear full responsibility for all damages." },
          { q: "Are pets allowed in the vehicle?", a: "Possible only by prior agreement. The animal must be in a carrier. Cleaning fee for pollution: €30-200." }
        ]
      },
      {
        category: "Condition & Return",
        icon: <Fuel className="h-4 w-4 text-sky-400" />,
        items: [
          { q: "In what condition will I receive the vehicle?", a: "You receive the vehicle: washed, cleaned, with a full tank, technically inspected, with all documents and required safety equipment." },
          { q: "How should the vehicle look upon return?", a: "Return with a FULL tank, clean, with all documents and keys. Fees: missing fuel €2/liter + €20 handling fee, dirty interior/exterior €30-200." },
          { q: "What if I return the car late?", a: "There is a 30-minute tolerance. Over 30 minutes results in an extra full day charge. Non-return without agreement has criminal consequences!" },
          { q: "What if I lose keys or documents?", a: "You pay all costs: new keys/documents and loss of profit (40% of daily rate during downtime)." },
          { q: "What if I get a fine?", a: "You are responsible for all fines. The tenant is obliged to pay the fine amount plus an administrative handling fee." }
        ]
      },
      {
        category: "Accidents & Other",
        icon: <Clock className="h-4 w-4 text-red-400" />,
        items: [
          { q: "What do I do in case of an accident?", a: "1. Call police (if damage >€3990), 2. Get participant contacts, 3. Fill accident report, 4. Contact us within 24h at +421 910 666 949, 5. Photo documentation. Do not admit fault on site!" },
          { q: "Can I pick up/return outside office hours?", a: "Yes, for a fee. Standard: Mon-Fri 8:00-17:00 free. Outside hours and weekends according to the price list." },
          { q: "Do you offer long-term rentals?", a: "Yes! 7-13 days (-10%), 14-29 days (-15%), 30+ days (-20-30% discount)." },
          { q: "Do you provide a replacement vehicle?", a: "Yes, we cooperate with insurance companies when resolving claims and delivering the vehicle to service." },
          { q: "Who operates UltimateDrive?", a: "To be specified soon." }
        ]
      }
    ]
  },
};