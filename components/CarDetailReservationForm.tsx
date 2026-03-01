"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, User, Send, ChevronDown, CheckCircle2, Check } from "lucide-react";
import toast from "react-hot-toast";
import type { Car } from "@/lib/cars";
import { supabase } from "@/lib/supabase";
import { CarDateRangePicker } from "@/components/CarDateRangePicker";
import { useLang } from "@/context/LanguageContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LOCATIONS = [
  { id: "tn", name: "Trenčín", price: 0 },
  { id: "za", name: "Žilina", price: 48 },
  { id: "nr", name: "Nitra", price: 80 },
  { id: "ba", name: "Bratislava", price: 104 },
  { id: "bud", name: "Budapešť", price: 183 },
];

type CarDetailReservationFormProps = {
  car: Car;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  // Pridané props pre komunikáciu s CDC.tsx a kalkulačkou
  onPickupChange?: (id: string) => void;
  onReturnChange?: (id: string) => void;
  onSecondDriverChange?: (active: boolean) => void;
};

type CarDetailReservationState = {
  name: string;
  phone: string;
  email: string;
  hasSecondDriver: boolean;
};

export function CarDetailReservationForm({
  car,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onPickupChange,
  onReturnChange,
  onSecondDriverChange
}: CarDetailReservationFormProps) {
  const { lang } = useLang();
  const [form, setForm] = useState<CarDetailReservationState>({
    name: "",
    phone: "",
    email: "",
    hasSecondDriver: false,
  });
  
  const [pickupLoc, setPickupLoc] = useState(LOCATIONS[0]);
  const [returnLoc, setReturnLoc] = useState(LOCATIONS[0]);
  const [openDropdown, setOpenDropdown] = useState<'pickup' | 'return' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const uiTexts = {
    sk: {
      emailRequired: "E-mail je povinný.",
      emailInvalid: "Zadajte platnú e-mailovú adresu.",
      toastSuccessTitle: "Rezervácia odoslaná!",
      toastSuccessDesc: "Čoskoro vás budeme kontaktovať.",
      toastError: "Chyba pri odosielaní.",
      sending: "Odosielam...",
      sendBtn: "Odoslať dopyt",
      pickup: "Miesto vyzdvihnutia",
      return: "Miesto vrátenia",
      free: "ZDARMA",
      secondDriver: "Druhý vodič",
      secondDriverDesc: "Oprávnenie pre ďalšiu osobu"
    },
    en: {
      emailRequired: "Email is required.",
      emailInvalid: "Enter a valid email address.",
      toastSuccessTitle: "Reservation sent!",
      toastSuccessDesc: "We will contact you soon.",
      toastError: "Sending error.",
      sending: "Sending...",
      sendBtn: "Send request",
      pickup: "Pickup Location",
      return: "Return Location",
      free: "FREE",
      secondDriver: "Second Driver",
      secondDriverDesc: "Authorization for another person"
    },
    bs: {
      emailRequired: "Email je obavezan.",
      emailInvalid: "Unesite važeću email adresu.",
      toastSuccessTitle: "Rezervacija poslana!",
      toastSuccessDesc: "Uskoro ćemo vas kontaktirati.",
      toastError: "Greška pri slanju.",
      sending: "Slanje...",
      sendBtn: "Pošalji upit",
      pickup: "Mjesto preuzimanja",
      return: "Mjesto povrata",
      free: "BESPLATNO",
      secondDriver: "Drugi vozač",
      secondDriverDesc: "Ovlaštenje za drugu osobu"
    }
  }[lang as 'sk' | 'en' | 'bs'] || {};

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      setEmailError(uiTexts.emailRequired);
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError(uiTexts.emailInvalid);
      return false;
    }
    setEmailError("");
    return true;
  }

  const sendTelegramMessage = async (bookingData: any) => {
    const token = '8542236541:AAF-Aqux4lhxd-Sosb6bqEF71UH-v8GQjrU';
    const chatId = '7979398003';
    
    const text = `🏎️ *Nová rezervácia!*\n\n` +
             `*Auto:* ${bookingData.car_name}\n` +
             `*Zákazník:* ${bookingData.customer_name}\n` +
             `*Telefón:* ${form.phone}\n` +
             `*E-mail:* ${form.email}\n` +
             `*Druhý vodič:* ${form.hasSecondDriver ? "✅ ÁNO" : "❌ NIE"}\n\n` +
             `*Od:* ${bookingData.start_date}\n` +
             `*Do:* ${bookingData.end_date}\n` +
             `*Miesto:* ${pickupLoc.name} ➡️ ${returnLoc.name}\n\n` +
             `*Status:* ⏳ Čaká na potvrdenie`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
      });
    } catch (e) { console.error("Telegram notify error:", e); }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateEmail(form.email)) return;
    if (!from || !to) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        car_name: `${car.brand} ${car.name}`,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        start_date: from,
        end_date: to,
        pickup_location: pickupLoc.name,
        return_location: returnLoc.name,
        second_driver: form.hasSecondDriver,
        status: 'pending'
      });

      if (error) throw error;
      await sendTelegramMessage({
        car_name: `${car.brand} ${car.name}`,
        customer_name: form.name,
        customer_phone: form.phone,
        start_date: from,
        end_date: to
      });

      setSubmitted(true);
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sky-400">{uiTexts.toastSuccessTitle}</span>
          <span className="text-xs text-slate-300">{uiTexts.toastSuccessDesc}</span>
        </div>
      );
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(uiTexts.toastError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputContainerStyles = "flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-1 transition-all focus-within:border-sky-500/50 focus-within:bg-slate-950/60 focus-within:ring-1 focus-within:ring-sky-500/30 backdrop-blur-sm";
  const labelStyles = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1";

  const LocationSelect = ({ label, current, type }: any) => (
  <div className="flex-1 space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
      {label}
    </label>
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenDropdown(openDropdown === type ? null : type)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-4 transition-all hover:bg-slate-950/60 focus:ring-1 focus:ring-sky-500/50"
      >
        <span className="text-sm font-medium text-slate-200">{current.name}</span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md min-w-[65px] text-center ${
            current.price === 0 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>
            {current.price === 0 ? uiTexts.free : `+${current.price}€`}
          </span>
          <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${openDropdown === type ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {/* Dropdown menu - pridaj z-index a krajšie zaoblenie */}
      {openDropdown === type && (
        <div className="absolute z-[60] mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id} type="button"
              onClick={() => { 
                if (type === 'pickup') { setPickupLoc(loc); onPickupChange?.(loc.id); } 
                else { setReturnLoc(loc); onReturnChange?.(loc.id); }
                setOpenDropdown(null); 
              }}
              className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-white/5 transition-all group"
            >
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">{loc.name}</span>
              <span className={`text-[10px] font-bold ${loc.price === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {loc.price === 0 ? uiTexts.free : `+${loc.price}€`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

  return (
    <section className="relative overflow-hidden space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="relative space-y-2">
        <div className="inline-flex items-center gap-2 rounded-lg bg-sky-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-400 ring-1 ring-sky-500/20">
          {lang === 'sk' ? 'Rezervácia' : lang === 'en' ? 'Reservation' : 'Rezervacija'}
        </div>
        <h2 className="text-xl font-bold text-slate-50 sm:text-2xl tracking-tight">
          {lang === 'sk' ? 'Máte záujem?' : lang === 'en' ? 'Interested?' : 'Zanimanje?'}
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className={labelStyles}>
            <User className="h-3.5 w-3.5 text-sky-500" />
            <span>{lang === 'sk' ? 'Meno a priezvisko' : lang === 'en' ? 'Full Name' : 'Ime i prezime'}</span>
          </label>
          <div className={inputContainerStyles}>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="h-11 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
              placeholder={lang === 'sk' ? 'Ján Novák' : 'John Doe'}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone" className={labelStyles}>
              <Phone className="h-3.5 w-3.5 text-sky-500" />
              <span>{lang === 'sk' ? 'Telefón' : lang === 'en' ? 'Phone' : 'Telefon'}</span>
            </label>
            <div className={inputContainerStyles}>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="h-11 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
                placeholder="+421 xxx xxx xxx"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className={labelStyles}>
              <Mail className="h-3.5 w-3.5 text-sky-500" />
              <span>E-mail</span>
            </label>
            <div className={`${inputContainerStyles} ${emailError ? "border-amber-500/50" : ""}`}>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, email: e.target.value }));
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => form.email && validateEmail(form.email)}
                className="h-11 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
                placeholder="name@domain.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Výber miest */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <LocationSelect label={uiTexts.pickup} current={pickupLoc} type="pickup" />
          <LocationSelect label={uiTexts.return} current={returnLoc} type="return" />
        </div>

        {/* CHECKBOX: DRUHÝ VODIČ */}
        <div 
  onClick={() => {
    const newValue = !form.hasSecondDriver;
    setForm(prev => ({ ...prev, hasSecondDriver: newValue }));
    onSecondDriverChange?.(newValue);
  }}
  className={`group relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
    form.hasSecondDriver 
      ? "border-amber-500/40 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.05)]" 
      : "border-white/10 bg-slate-950/20 hover:border-white/20 hover:bg-slate-950/40"
  }`}
>
  <div className="flex items-center gap-4">
    {/* Ikona Checkmarku v štvorci */}
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
      form.hasSecondDriver 
        ? "bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
        : "bg-slate-800/50 border-white/10 text-slate-600 group-hover:border-white/20"
    }`}>
      {/* Vymenená ikona na Check */}
      <Check className={`h-5 w-5 transition-transform duration-300 ${form.hasSecondDriver ? 'scale-110' : 'scale-100'}`} />
    </div>
    
    <div className="flex flex-col">
      <span className="text-sm font-bold text-slate-100 tracking-tight">
        {uiTexts.secondDriver}
      </span>
      <span className="text-[11px] text-slate-500 font-medium">
        {uiTexts.secondDriverDesc}
      </span>
    </div>
  </div>

  {/* Cena v badge štýle */}
  <div className={`text-sm font-bold px-3 py-1 rounded-full transition-colors ${
    form.hasSecondDriver ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-400'
  }`}>
    +20 €
  </div>
</div>

        <div className="pt-2">
          <CarDateRangePicker
            from={from}
            to={to}
            onChangeFrom={onChangeFrom}
            onChangeTo={onChangeTo}
            bookedDates={car.bookedDates ?? []}
          />
        </div>

        <button
          type="submit"
          disabled={!from || !to || isSubmitting}
          className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-sky-500 px-6 py-4 text-sm font-bold text-slate-950 transition-all hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] bg-[0%_0%] transition-all group-hover:animate-[shimmer_2s_infinite]" />
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              {uiTexts.sending}
            </span>
          ) : (
            <>
              <span>{uiTexts.sendBtn}</span>
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
      </form>
    </section>
  );
}