import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* LOGO & INFO */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <span className="text-2xl font-black tracking-tighter text-white">
              ELITE<span className="text-sky-500">DRIVE</span>
            </span>
            <p className="text-sm text-slate-500 leading-relaxed">
              Prémiová autopožičovňa pre náročných. Zážitok z jazdy, ktorý prekoná vaše očakávania.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-sky-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-sky-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* RÝCHLE ODKAZY */}
          <div>
            <h4 className="text-white font-bold mb-6">Navigácia</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-white transition-colors">Flotila áut</Link></li>
              <li><Link href="#vyhody" className="hover:text-white transition-colors">O nás</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Podmienky prenájmu</Link></li>
            </ul>
          </div>

          {/* KONTAKT */}
          <div>
            <h4 className="text-white font-bold mb-6">Kontakt</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-sky-500" /> +421 9xx xxx xxx</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-sky-500" /> info@elitedrive.sk</li>
            </ul>
          </div>

          {/* OTVÁRACIE HODINY */}
          <div>
            <h4 className="text-white font-bold mb-6">Dostupnosť</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Rezervácie online: 24/7<br />
              Pristavenie vozidiel: Podľa dohody (SR/AT/CZ)
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © {new Date().getFullYear()} EliteDrive. Všetky práva vyhradené.
          </p>
        </div>
      </div>
    </footer>
  );
}