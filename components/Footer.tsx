"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin, CarFront, MessageCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export function Footer() {
  const { lang } = useLang();
  const currentYear = new Date().getFullYear();

  const footerTexts = {
    sk: {
      about: "Prémiová požičovňa vozidiel, ktorá prináša zážitok z jazdy priamo k vám. Kvalita a štýl bez kompromisov pod značkou UltimateDrive.",
      contactTitle: "Kontakt",
      callUs: "Zavolajte nám",
      writeUs: "Napíšte nám",
      locationTitle: "Kde nás nájdete",
      locationCountry: "Slovenská republika",
      locationDesc: "Pôsobíme v mestách Žilina, Dolný Kubín, Bratislava a po dohode celá SR.",
      rights: "Všetky práva vyhradené.",
      privacy: "Ochrana údajov",
      terms: "Obchodné podmienky",
      complaints: "Reklamačný poriadok"
    },
    en: {
      about: "Premium car rental service bringing the driving experience directly to you. Quality and style without compromise under the UltimateDrive brand.",
      contactTitle: "Contact",
      callUs: "Call us",
      writeUs: "Email us",
      locationTitle: "Find us",
      locationCountry: "Slovak Republic",
      locationDesc: "We operate in Žilina, Dolný Kubín, Bratislava, and across the whole country upon agreement.",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      complaints: "Refund Policy"
    }
  };

  const ui = footerTexts[lang as keyof typeof footerTexts] || footerTexts.sk;

  return (
    <footer className="relative bg-[#020617] border-t border-white/5 pt-16 md:pt-24 pb-8 overflow-hidden">
      {/* Horná linka s glow efektom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] bg-sky-500/10 blur-[80px] md:blur-[120px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
          
          {/* LOGO & O NÁS */}
          <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <CarFront className="h-6 w-6 text-slate-950" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                ELITE<span className="text-sky-500">Drive</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs mx-auto md:mx-0 font-medium">
              {ui.about}
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { icon: Instagram, href: "https://instagram.com/ultimatedrive" },
                { icon: Facebook, href: "https://facebook.com/ultimatedrive" },
                { icon: MessageCircle, href: "https://wa.me/421910666949" }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all hover:-translate-y-1">
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden lg:block"></div>

          {/* KONTAKTY */}
          <div className="space-y-6 text-center md:text-left">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-sky-500/80">{ui.contactTitle}</h4>
            <div className="space-y-4">
              <a href="tel:+4219XXXXXXXX" className="group flex items-center md:items-start gap-4 justify-center md:justify-start">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-sky-400 transition-colors group-hover:bg-sky-500 group-hover:text-slate-950">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="hidden md:block text-[9px] font-black text-slate-500 uppercase tracking-widest">{ui.callUs}</span>
                  <span className="text-sm font-bold text-slate-200">+421 9XX XXX XXX</span>
                </div>
              </a>
              <a href="mailto:info@ultimatedrive.sk" className="group flex items-center md:items-start gap-4 justify-center md:justify-start">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-sky-400 transition-colors group-hover:bg-sky-500 group-hover:text-slate-950">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="hidden md:block text-[9px] font-black text-slate-500 uppercase tracking-widest">{ui.writeUs}</span>
                  <span className="text-sm font-bold text-slate-200">info@ultimatedrive.sk</span>
                </div>
              </a>
            </div>
          </div>

          {/* LOKALITA */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-sky-500/80 text-center md:text-left">{ui.locationTitle}</h4>
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 space-y-4 text-center md:text-left backdrop-blur-sm">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MapPin className="text-sky-500" size={18} />
                <span className="text-sm font-black text-white uppercase tracking-tight">{ui.locationCountry}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic uppercase tracking-wider">
                {ui.locationDesc}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-8 border-t border-white/5 flex flex-col-reverse md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black text-slate-500 tracking-[0.2em] text-center uppercase">
            © {currentYear} <span className="text-white">UltimateDrive</span>. {ui.rights}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: ui.privacy, href: "/privacy" },
              { label: ui.terms, href: "/terms" },
              { label: ui.complaints, href: "/complaints" }
            ].map((link, i) => (
              <Link key={i} href={link.href} className="text-[9px] font-black text-slate-500 hover:text-sky-400 uppercase tracking-[0.2em] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}