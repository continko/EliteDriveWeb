import { Calendar, ShieldCheck, Key, CheckCircle2 } from "lucide-react";

export default function ProcessPage() {
  const steps = [
    { 
      id: "01", 
      title: "Výber a rezervácia", 
      desc: "Prezrite si našu flotilu a vyberte si vozidlo. Rezerváciu môžete urobiť online, cez WhatsApp alebo telefonicky. Potrebujeme len základné údaje.",
      details: ["Platný vodičský preukaz (sk. B)", "Občiansky preukaz alebo pas", "Vek minimálne 18 rokov"]
    },
    { 
      id: "02", 
      title: "Zmluva a Depozit", 
      desc: "Pripravíme nájomnú zmluvu, ktorú podpíšete pri prevzatí. V tomto kroku sa hradí nájomné a vratný depozit (v hotovosti alebo kartou).",
      details: ["Jasná zmluva bez skrytých bodov", "Transparentný depozit", "Kompletné poistenie v cene"]
    },
    { 
      id: "03", 
      title: "Odovzdanie kľúčov", 
      desc: "Vozidlo vám pristavíme na dohodnuté miesto (Trenčín, letisko, alebo k vám domov). Následuje krátka inštruktáž a môžete vyraziť.",
      details: ["Vždy čisté vozidlo", "Plná nádrž", "Technická podpora 24/7"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#020617] pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black text-white tracking-tighter sm:text-8xl mb-6">
            Cesta k <span className="text-sky-500">jazde</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">
            Nájomný proces sme zjednodušili na minimum. Žiadne zbytočné papierovačky, len čistá radosť z jazdy.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative grid md:grid-cols-2 gap-12 items-center p-12 rounded-[4rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all hover:border-sky-500/20">
              <div className="absolute -top-10 -left-10 text-[12rem] font-black text-white/[0.02] pointer-events-none group-hover:text-sky-500/5 transition-colors">
                {step.id}
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-slate-950 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                  {idx === 0 ? <Calendar size={32} /> : idx === 1 ? <ShieldCheck size={32} /> : <Key size={32} />}
                </div>
                <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{step.title}</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">{step.desc}</p>
              </div>

              <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5">
                
                <ul className="space-y-4">
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-3 text-white font-bold">
                      <CheckCircle2 className="text-sky-500 h-5 w-5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}