"use client";

import { useEffect } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

export default function CookieBanner() {
  useEffect(() => {
    if (!document.querySelector('#cc-main')) {
      CookieConsent.run({
        categories: {
          necessary: {
            enabled: true,
            readOnly: true
          },
          analytics: {
            enabled: false,
          }
        },
        language: {
          default: 'sk',
          translations: {
            sk: {
              consentModal: {
                title: "Používame cookies",
                description: "Aby sme vám zabezpečili ten najlepší zážitok z UltimateDriveDrive, používame cookies na analýzu návštevnosti a fungovanie stránky.",
                acceptAllBtn: "Prijať všetko",
                acceptNecessaryBtn: "Len nevyhnutné",
                showPreferencesBtn: "Nastavenia"
              },
              preferencesModal: {
                title: "Nastavenie cookies",
                acceptAllBtn: "Prijať všetko",
                acceptNecessaryBtn: "Len nevyhnutné",
                savePreferencesBtn: "Uložiť nastavenia",
                closeIconLabel: "Zatvoriť",
                sections: [
                  {
                    title: "Nevyhnutné cookies",
                    description: "Tieto súbory cookie sú nutné pre správne fungovanie webu a nie je možné ich vypnúť.",
                    linkedCategory: 'necessary'
                  },
                  {
                    title: "Analytické cookies",
                    description: "Pomáhajú nám pochopiť, ako návštevníci používajú stránku, aby sme ju mohli zlepšovať.",
                    linkedCategory: 'analytics'
                  }
                ]
              }
            }
          }
        }
      });
    }
  }, []);

  return null;
}