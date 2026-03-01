"use client";

import { Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-[#020617] pt-40 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* INFO STRANA */}
          <div>
            <h1 className="text-7xl font-black tracking-tighter mb-8 text-white">{t.contact_page_title}</h1>
            <p className="text-slate-400 text-lg mb-12 max-w-md italic leading-relaxed">
              {t.contact_page_subtitle}
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <Phone className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t.contact_card_phone}</p>
                <a href="tel:+421910666949" className="text-xl font-bold hover:text-sky-400 transition-colors">+421 910 666 949</a>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <MessageSquare className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t.contact_card_whatsapp}</p>
                <a href="https://wa.me/421910666949" className="text-xl font-bold hover:text-sky-400 transition-colors">{t.contact_card_chat}</a>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <Clock className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t.contact_card_availability}</p>
                <p className="text-xl font-bold text-white">24/7</p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                <MapPin className="text-sky-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t.contact_card_location}</p>
                <p className="text-xl font-bold text-white">Žilina / Dolný Kubín</p>
              </div>
            </div>
          </div>

          {/* FORMULÁR STRANA */}
          <div className="relative p-12 rounded-[4rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">{t.contact_form_title}</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">{t.contact_form_name}</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" placeholder={t.contact_form_placeholder_name} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">{t.contact_form_contact}</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" placeholder={t.contact_form_placeholder_contact} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">{t.contact_form_message}</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all" placeholder={t.contact_form_placeholder_message} />
              </div>
              <button className="w-full bg-sky-500 text-slate-950 font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-sky-400 transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)]">
                {t.contact_form_send}
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}