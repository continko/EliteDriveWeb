import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#020617] pt-40 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* INFO STRANA */}
          <div>
            <h1 className="text-7xl font-black tracking-tighter mb-8 text-stroke-white">Kontakt</h1>
            <p className="text-slate-400 text-lg mb-12 max-w-md italic leading-relaxed">
              Máte špeciálnu požiadavku alebo sa chcete poradiť o výbere vozidla? Sme vám k dispozícii non-stop.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <Phone className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Zavolajte nám</p>
                <a href="tel:+421910666949" className="text-xl font-bold hover:text-sky-400 transition-colors">+421 9XX XXX XXX</a>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <MessageSquare className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">WhatsApp</p>
                <a href="https://wa.me/4219xxxxxxxx" className="text-xl font-bold hover:text-sky-400 transition-colors">Chatovať teraz</a>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <Clock className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Dostupnosť</p>
                <p className="text-xl font-bold text-white">   24/7</p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <MapPin className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Lokalita</p>
                <p className="text-xl font-bold text-white">Žilina / Dolný Kubín</p>
              </div>
            </div>
          </div>

          {/* FORMULÁR STRANA */}
          <div className="relative p-12 rounded-[4rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Napíšte nám</h3>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Meno</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" placeholder="Vaše meno" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email / Telefón</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" placeholder="Kontakt na vás" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Správa</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" placeholder="Váš dotaz" />
              </div>
              <button className="w-full bg-sky-500 text-slate-950 font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-sky-400 transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)]">
                Odoslať 
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}