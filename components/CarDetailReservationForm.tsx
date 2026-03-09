"use client";

import { useState, FormEvent, useEffect } from "react";
import { Mail, Phone, User, Send, ChevronDown, Check, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import type { Car } from "@/lib/cars";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";
import DatePicker, { registerLocale } from "react-datepicker";
import { sk } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { startOfDay, format } from "date-fns";
import { CarPricingCalculator } from "./CarPricingCalculator";

registerLocale("sk", sk);

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, '0')}:00`;
});

export const LOCATIONS = [
  { id: "za", name: "Žilina", price: 0 },
  { id: "dk", name: "Dolný Kubín", price: 0 },
  { id: "tn", name: "Trenčín", price: 48 },
  { id: "nr", name: "Nitra", price: 80 },
  { id: "bb", name: "Banská Bystrica", price: 0 },
  { id: "ba", name: "Bratislava", price: 104 },
  { id: "vie", name: "Schwechat - Letisko", price: 150 },
  { id: "bud", name: "Budapešť", price: 183 },
  { id: "ke", name: "Košice", price: 260 },
];

type CarDetailReservationFormProps = {
  car: Car;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  onPickupChange?: (price: number) => void;
  onReturnChange?: (price: number) => void;
  onSecondDriverChange?: (active: boolean) => void;
  onPickupTimeChange?: (time: string) => void;
  onReturnTimeChange?: (time: string) => void;
  onTotalPriceChange?: (price: number | null) => void;
  totalPrice: number | null;
};

export function CarDetailReservationForm({
  car, from, to, onChangeFrom, onChangeTo,
  onPickupChange, onReturnChange, onSecondDriverChange,
  onPickupTimeChange, onReturnTimeChange,
  onTotalPriceChange,
  totalPrice 
}: CarDetailReservationFormProps) {
  const { lang } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", hasSecondDriver: false });
  const [pickupLoc, setPickupLoc] = useState(LOCATIONS[0]);
  const [returnLoc, setReturnLoc] = useState(LOCATIONS[0]);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [openDropdown, setOpenDropdown] = useState<'pickup' | 'return' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localPrice, setLocalPrice] = useState<number | null>(null);
  
  const [bookedIntervals, setBookedIntervals] = useState<{ start: Date; end: Date }[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const fullCarName = `${car.brand} ${car.name}`;
      const { data } = await supabase
        .from("public_bookings")
        .select("start_date, end_date")
        .eq("car_name", fullCarName);

      if (data) {
        const intervals = data.map((b) => ({
          start: startOfDay(new Date(b.start_date)),
          end: startOfDay(new Date(b.end_date)),
        }));
        setBookedIntervals(intervals);
      }
    };

    fetchBookings();
    
    onPickupChange?.(pickupLoc.price);
    onReturnChange?.(returnLoc.price);
    onSecondDriverChange?.(form.hasSecondDriver);
    onPickupTimeChange?.(pickupTime);
    onReturnTimeChange?.(returnTime);
  }, [car, pickupLoc.price, returnLoc.price, form.hasSecondDriver, pickupTime, returnTime]);

  const uiTexts = {
    sk: {
      title: "Rezervácia vozidla",
      pickup: "Miesto vyzdvihnutia",
      return: "Miesto vrátenia",
      free: "ZDARMA",
      secondDriver: "Druhý vodič",
      secondDriverDesc: "Oprávnenie pre ďalšiu osobu",
      send: "Odoslať dopyt",
      sending: "Odosielam...",
      selectDate: "Vyberte termín prenájmu",
      pickupTime: "Čas prevzatia",
      returnTime: "Čas vrátenia"
    },
    en: {
      title: "Vehicle Reservation",
      pickup: "Pickup Location",
      return: "Return Location",
      free: "FREE",
      secondDriver: "Second Driver",
      secondDriverDesc: "Authorization for another person",
      send: "Send Request",
      sending: "Sending...",
      selectDate: "Select Rental Dates",
      pickupTime: "Pickup Time",
      returnTime: "Return Time"
    }
  }[lang as 'sk' | 'en'] || {};

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onChangeFrom(start ? format(start, "yyyy-MM-dd") : "");
    onChangeTo(end ? format(end, "yyyy-MM-dd") : "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!from || !to) {
      toast.error(lang === 'sk' ? "Vyberte prosím termín v kalendári." : "Please select dates.");
      return;
    }
    setIsSubmitting(true);

    const finalPrice = localPrice || totalPrice;

    try {
      const { error } = await supabase.from("bookings").insert({
        car_name: `${car.brand} ${car.name}`,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        start_date: `${from} ${pickupTime}`,
        end_date: `${to} ${returnTime}`,
        pickup_location: pickupLoc.name,
        return_location: returnLoc.name,
        second_driver: form.hasSecondDriver,
        total_price: finalPrice,
        status: 'pending'
      });

      if (error) throw error;

      const msg = [
        `🏎️ *REZERVÁCIA: ${car.brand} ${car.name}*`,
        ``,
        `👤 *Zákazník:* ${form.name}`,
        `📞 *Telefón:* ${form.phone}`,
        `📧 *Email:* ${form.email}`,
        ``,
        `📍 *OD:* ${from}, ${pickupTime} (${pickupLoc.name})`,
        `📍 *DO:* ${to}, ${returnTime} (${returnLoc.name})`,
        ``,
        `💰 *CENA:* ${finalPrice ? `${finalPrice} €` : "Nezadaná"}`,
        ``,
        `*DOPLNKOVÉ SLUŽBY:*`,
        `Vodič navyše: ${form.hasSecondDriver ? "Áno ✅" : "Nie ❌"}`
      ].join('\n');
      
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg }),
      });

      toast.success(lang === 'sk' ? "Dopyt bol odoslaný!" : "Request sent!");
      setForm(p => ({ ...p, name: "", phone: "", email: "" }));

    } catch (err: any) {
      console.error("REZERVACIA ERROR:", JSON.stringify(err));
      toast.error(lang === 'sk' ? "Chyba pri odosielaní." : "Error sending request.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        {openDropdown === type && (
          <div className="absolute z-[60] mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id} type="button"
                onClick={() => { 
                  if (type === 'pickup') { setPickupLoc(loc); onPickupChange?.(loc.price); }
                  else { setReturnLoc(loc); onReturnChange?.(loc.price); }
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

  const inputClass = "w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-600";
  const labelClass = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1";

  return (
    <div className="relative space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tight">{uiTexts.title}</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SEKCIA: OSOBNÉ ÚDAJE */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}><User size={12} className="text-sky-500" /> Meno a priezvisko</label>
            <input className={inputClass} type="text" placeholder="Ján Novák" required
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}><Phone size={12} className="text-sky-500" /> Telefón</label>
              <input className={inputClass} type="tel" placeholder="+421..." required
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}><Mail size={12} className="text-sky-500" /> E-mail</label>
              <input className={inputClass} type="email" placeholder="email@example.com" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* SEKCIA: KALENDÁR */}
        <div className="space-y-4 rounded-3xl border border-white/5 bg-slate-950/20 p-6">
          <label className={labelClass}><Calendar size={12} className="text-sky-500" /> {uiTexts.selectDate}</label>
          
          <div className="elite-datepicker-wrapper">
            <DatePicker
              selected={from ? new Date(from) : null}
              onChange={handleDateChange}
              startDate={from ? new Date(from) : null}
              endDate={to ? new Date(to) : null}
              selectsRange
              minDate={new Date()}
              excludeDateIntervals={bookedIntervals}
              locale="sk"
              inline
              disabledKeyboardNavigation
              focusSelectedMonth={false}
              calendarClassName="elite-calendar"
              dayClassName={(date) => {
                const isBooked = bookedIntervals.some(interval => 
                  date >= interval.start && date <= interval.end
                );
                return isBooked ? "booked-day" : "";
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                <Clock size={12} className="text-sky-500" /> {uiTexts.pickupTime}
              </label>
              <div className="relative">
                <select 
                  value={pickupTime}
                  onChange={e => { setPickupTime(e.target.value); onPickupTimeChange?.(e.target.value); }}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white appearance-none outline-none focus:border-sky-500/50 cursor-pointer"
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                <Clock size={12} className="text-amber-500" /> {uiTexts.returnTime}
              </label>
              <div className="relative">
                <select 
                  value={returnTime}
                  onChange={e => { setReturnTime(e.target.value); onReturnTimeChange?.(e.target.value); }}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white appearance-none outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LocationSelect label={uiTexts.pickup} current={pickupLoc} type="pickup" />
          <LocationSelect label={uiTexts.return} current={returnLoc} type="return" />
        </div>

        {/* DOPLNKOVÉ SLUŽBY */}
        <div 
          onClick={() => { 
            const newValue = !form.hasSecondDriver;
            setForm(p => ({ ...p, hasSecondDriver: newValue })); 
            onSecondDriverChange?.(newValue); 
          }}
          className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${form.hasSecondDriver ? "border-amber-500/40 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.05)]" : "border-white/10 bg-slate-950/20 hover:border-white/20"}`}
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${form.hasSecondDriver ? "bg-amber-500 border-amber-400 text-slate-950" : "bg-slate-800 border-white/10 text-slate-600"}`}>
              <Check className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100">{uiTexts.secondDriver}</span>
              <span className="text-[11px] text-slate-500">{uiTexts.secondDriverDesc}</span>
            </div>
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full ${form.hasSecondDriver ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-400'}`}>+20 €</div>
        </div>

        {/* KALKULAČKA CENY */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <CarPricingCalculator 
            pricing={car.pricing}
            from={from}
            to={to}
            pickupTime={pickupTime}
            returnTime={returnTime}
            pickupPrice={pickupLoc.price}
            returnPrice={returnLoc.price}
            hasSecondDriver={form.hasSecondDriver}
            onTotalChange={(total) => {
                setLocalPrice(total);
                onTotalPriceChange?.(total);
            }}
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="group relative w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? uiTexts.sending : <>{uiTexts.send} <Send size={16} className="transition-transform group-hover:translate-x-1" /></>}
          </button>
        </div>
      </form>
    </div>
  );
}