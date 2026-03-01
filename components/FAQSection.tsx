"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { faqTranslations } from "@/lib/faqData";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { lang } = useLang();

  // Vyberieme dáta podľa jazyka, ak nie sú, dáme SK
  const content = faqTranslations[lang as keyof typeof faqTranslations] || faqTranslations.sk;

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-24 text-center">
        <h2 className="text-5xl font-black tracking-tighter text-white sm:text-7xl">
          {content.title}
        </h2>
        <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* Grid s kategóriami */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {content.categories.map((cat: any, catIdx: number) => (
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
              {cat.items.map((item: any, itemIdx: number) => {
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

      {/* Bottom Contact Box */}
      <div className="max-w-3xl mx-auto mt-20 p-10 rounded-[3rem] border border-dashed border-white/10 text-center">
        <h3 className="text-2xl font-black text-white mb-4">{content.contact_title}</h3>
        <p className="text-slate-500 mb-8">{content.contact_subtitle}</p>
        <a href="tel:+4219XXXXXXXX" className="text-sky-400 font-black uppercase tracking-widest hover:text-white transition-colors">
          +421 9XX XXX XXX
        </a>
      </div>
    </div>
  );
}