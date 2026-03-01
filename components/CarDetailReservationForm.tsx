"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, User, Send } from "lucide-react";
import toast from "react-hot-toast";
import type { Car } from "@/lib/cars";
import { supabase } from "@/lib/supabase";
import { CarDateRangePicker } from "@/components/CarDateRangePicker";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CarDetailReservationFormProps = {
  car: Car;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
};

type CarDetailReservationState = {
  name: string;
  phone: string;
  email: string;
};

export function CarDetailReservationForm({
  car,
  from,
  to,
  onChangeFrom,
  onChangeTo
}: CarDetailReservationFormProps) {
  const [form, setForm] = useState<CarDetailReservationState>({
    name: "",
    phone: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      setEmailError("E-mail je povinný.");
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError("Zadajte platnú e-mailovú adresu.");
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
                 `*Telefón:* ${bookingData.customer_phone}\n` +
                 `*Od:* ${bookingData.start_date}\n` +
                 `*Do:* ${bookingData.end_date}\n` +
                 `*Status:* Čaká na potvrdenie`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
    } catch (e) {
      console.error("Telegram notify error:", e);
    }
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
        status: 'pending'
      });

      if (error) throw error;

      const bookingForTelegram = {
        car_name: `${car.brand} ${car.name}`,
        customer_name: form.name,
        customer_phone: form.phone,
        start_date: from,
        end_date: to
      };

      await sendTelegramMessage(bookingForTelegram);

      setSubmitted(true);
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sky-400">Rezervácia odoslaná!</span>
          <span className="text-xs text-slate-300">
            Čoskoro vás budeme kontaktovať.
          </span>
        </div>
      );
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Chyba pri odosielaní.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // UPRAVENÉ: Tmavšie a hutnejšie pozadie inputov pre "Ice Blue" kontrast
  const inputContainerStyles = "flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-1 transition-all focus-within:border-sky-500/50 focus-within:bg-slate-950/60 focus-within:ring-1 focus-within:ring-sky-500/30 backdrop-blur-sm";
  const labelStyles = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1";

  return (
    /* HLAVNÁ SEKCOIA: Zmena z bg-slate-950/90 na slate-900/60 + backdrop-blur-xl */
    <section className="relative overflow-hidden space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      {/* Vnútorný odlesk pre prémiový pocit */}
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="relative space-y-2">
        <div className="inline-flex items-center gap-2 rounded-lg bg-sky-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-400 ring-1 ring-sky-500/20">
          Rezervácia
        </div>
        <h2 className="text-xl font-bold text-slate-50 sm:text-2xl tracking-tight">Máte záujem?</h2>
        <p className="text-xs leading-relaxed text-slate-400">
          Zanechajte nám vaše údaje a my vám pripravíme ponuku na mieru.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className={labelStyles}>
            <User className="h-3.5 w-3.5 text-sky-500" />
            <span>Meno a priezvisko</span>
          </label>
          <div className={inputContainerStyles}>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="h-11 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
              placeholder="Ján Novák"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className={labelStyles}>
            <Phone className="h-3.5 w-3.5 text-sky-500" />
            <span>Telefón</span>
          </label>
          <div className={inputContainerStyles}>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="h-11 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
              placeholder="+421 9xx xxx xxx"
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
              placeholder="meno@domena.sk"
              required
            />
          </div>
          {emailError && <p className="ml-1 text-[10px] font-medium text-amber-400">{emailError}</p>}
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
              Odosielam...
            </span>
          ) : (
            <>
              <span>Odoslať dopyt</span>
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
      </form>

      {submitted && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-center">
          <p className="text-sm font-bold text-sky-400">Požiadavka bola prijatá!</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Skontrolujte si e-mail, čoskoro sa ozveme.
          </p>
        </div>
      )}
    </section>
  );
}