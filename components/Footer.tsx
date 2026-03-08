import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020617] border-t border-white/5 pt-16 md:pt-24 pb-8 overflow-hidden">
      {/* Dekoratívne svetlo v pozadí */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] bg-sky-500/10 blur-[80px] md:blur-[120px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
          
          {/* LOGO & O NÁS - EliteDrive */}
          <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <span className="text-slate-950 font-black text-2xl">E</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">EliteDrive</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs mx-auto md:mx-0">
              Prémiová požičovňa vozidiel, ktorá prináša zážitok z jazdy priamo k vám. Kvalita a štýl bez kompromisov pod značkou EliteDrive.
            </p>
            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook].map((Icon, i) => (
                <Link key={i} href="#" className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all active:scale-95">
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* RÝCHLE ODKAZY */}
          <div className="space-y-6 text-center md:text-left">
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-sky-500">Navigácia</h4>
            <ul className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-4">
              {['Vozový park', 'Cenník', 'O nás', 'Kontakt'].map((link) => (
                <li key={link}>
                  <Link href="#" className="group flex items-center justify-center md:justify-start text-sm font-medium text-slate-300 hover:text-white transition-colors py-2 md:py-0">
                    {link}
                    <ArrowUpRight size={14} className="ml-1 opacity-40 md:opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 text-sky-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KONTAKTY */}
          <div className="space-y-6 text-center md:text-left">
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-sky-500">Kontakt</h4>
            <div className="space-y-4 md:space-y-6">
              <Link href="tel:+421900000000" className="flex items-center md:items-start gap-4 p-4 md:p-0 rounded-2xl border border-white/5 md:border-none bg-white/5 md:bg-transparent justify-center md:justify-start">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-sky-400 shrink-0">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="hidden md:block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Zavolajte nám</span>
                  <span className="text-sm font-bold text-slate-200">+421 900 000 000</span>
                </div>
              </Link>
              <Link href="mailto:info@elitedrive.sk" className="flex items-center md:items-start gap-4 p-4 md:p-0 rounded-2xl border border-white/5 md:border-none bg-white/5 md:bg-transparent justify-center md:justify-start">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-sky-400 shrink-0">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="hidden md:block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Napíšte nám</span>
                  <span className="text-sm font-bold text-slate-200">info@elitedrive.sk</span>
                </div>
              </Link>
            </div>
          </div>

          {/* LOKALITA */}
          <div className="space-y-6">
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-sky-500 text-center md:text-left">Kde nás nájdete</h4>
            <div className="rounded-[2rem] border border-white/5 bg-slate-950/40 p-6 space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MapPin className="text-sky-500" size={18} />
                <span className="text-sm font-bold text-white">Slovenská republika</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Pôsobíme v mestách Žilina, Dolný Kubín, Bratislava a po dohode celá SR.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col-reverse md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-medium text-slate-500 tracking-wide text-center">
            © {currentYear} <span className="text-white font-bold">EliteDrive</span>. Všetky práva vyhradené.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="/ochrana-osobnych-udajov" className="text-[9px] font-black text-slate-500 hover:text-sky-500 uppercase tracking-[0.2em] transition-all">
              Ochrana údajov
            </Link>
            <Link href="/obchodne-podmienky" className="text-[9px] font-black text-slate-500 hover:text-sky-500 uppercase tracking-[0.2em] transition-all">
              Obchodné podmienky
            </Link>
            <Link href="/reklamacny-poriadok" className="text-[9px] font-black text-slate-500 hover:text-sky-500 uppercase tracking-[0.2em] transition-all">
              Reklamačný poriadok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
