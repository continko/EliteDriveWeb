"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'sk' | 'en' | 'bs'>('sk');

  // Načítanie uloženého jazyka z prehliadača (voliteľné)
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as any;
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLang = (newLang: 'sk' | 'en' | 'bs') => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);