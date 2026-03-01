"use client";

import { FAQSection } from "@/components/FAQSection";
import { useLang } from "@/context/LanguageContext";

export default function FAQPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-[#020617] pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter sm:text-6xl">
          {t.nav_faq}
        </h1>
      </div>
      {/* Tu sa deje všetka mágia */}
      <FAQSection />
    </main>
  );
}