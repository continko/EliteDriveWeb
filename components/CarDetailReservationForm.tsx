"use client";

import { useState, FormEvent, useEffect } from "react";
import { 
  Mail, Phone, User, Send, ChevronDown, Check, Calendar, Clock,
  CreditCard, Landmark, Banknote, Bitcoin 
} from "lucide-react";
import toast from "react-hot-toast";
import type { Car } from "@/lib/cars";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";
import DatePicker, { registerLocale } from "react-datepicker";
import { sk, enGB, bs } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { startOfDay, format } from "date-fns";
import { CarPricingCalculator } from "./CarPricingCalculator";

// Registrácia lokalít pre kalendár
registerLocale("sk", sk);
registerLocale("en", enGB);
registerLocale("bs", bs);

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
  { id: "vie", name: { sk: "Schwechat - Letisko", en: "Vienna Airport", bs: "Beč - Aerodrom" }, price: 150 },
  { id: "bud", name: { sk: "Budapešť", en: "Budapest", bs: "Budimpešta" }, price: 183 },
  { id: "ke", name: { sk: "Košice", en: "Kosice", bs: "Košice" }, price: 260 },
];

const PAYMENT_METHODS = [
  { id: 'card', label: { sk: 'Kartou', en: 'Card', bs: 'Karticom' }, icon: CreditCard, discount: 0 },
  { id: 'transfer', label: { sk: 'Prevod', en: 'Transfer', bs: 'Uplata' }, icon: Landmark, discount: 0 },
  { id: 'cash', label: { sk: 'Hotovosť', en: 'Cash', bs: 'Gotovina' }, icon: Banknote, discount: 0 },
  { id: 'crypto', label: { sk: 'Crypto', en: 'Crypto', bs: 'Kripto' }, icon: Bitcoin, discount: 0.10 },
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
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    hasSecondDriver: false,
    paymentMethod: "card" 
  });
  
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
        .from("bookings")
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
      nameLabel: "Meno a priezvisko",
      phoneLabel: "Telefón",
      emailLabel: "E-mail",
      pickup: "Miesto vyzdvihnutia",
      return: "Miesto vrátenia",
      free: "ZDARMA",
      secondDriver: "Druhý vodič",
      secondDriverDesc: "Oprávnenie pre ďalšiu osobu",
      payment: "Spôsob platby",
      send: "Odoslať dopyt",
      sending: "Odosielam...",
      selectDateFirst: "Vyberte termín v kalendári",
      selectDate: "Vyberte termín prenájmu",
      pickupTime: "Čas prevzatia",
      returnTime: "Čas vrátenia",
      cryptoDiscount: "Zľava 10%",
      success: "Dopyt bol odoslaný!",
      error: "Chyba pri odosielaní.",
      footerNote: "Pre pokračovanie označte začiatok a koniec prenájmu"
    },
    en: {
      title: "Vehicle Reservation",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      emailLabel: "E-mail",
      pickup: "Pickup Location",
      return: "Return Location",
      free: "FREE",
      secondDriver: "Second Driver",
      secondDriverDesc: "Authorization for another person",
      payment: "Payment Method",
      send: "Send Request",
      sending: "Sending...",
      selectDateFirst: "Select dates in calendar",
      selectDate: "Select Rental Dates",
      pickupTime: "Pickup Time",
      returnTime: "Return Time",
      cryptoDiscount: "10% Discount",
      success: "Request sent successfully!",
      error: "Error sending request.",
      footerNote: "Please select start and end date to continue"
    },
    bs: {
      title: "Rezervacija vozila",
      nameLabel: "Ime i prezime",
      phoneLabel: "Telefon",
      emailLabel: "E-mail",
      pickup: "Mjesto preuzimanja",
      return: "Mjesto povratka",
      free: "BESPLATNO",
      secondDriver: "Drugi vozač",
      secondDriverDesc: "Ovlaštenje za drugu osobu",
      payment: "Način plaćanja",
      send: "Pošalji upit",
      sending: "Slanje...",
      selectDateFirst: "Odaberite termin na kalendaru",
      selectDate: "Odaberite termin najma",
      pickupTime: "Vrijeme preuzimanja",
      returnTime: "Vrijeme povratka",
      cryptoDiscount: "Popust 10%",
      success: "Upit je uspješno poslan!",
      error: "Greška prilikom slanja.",
      footerNote: "Za nastavak označite početak i kraj najma"
    }
  }[lang as 'sk' | 'en' | 'bs'] || {};

  const getLocName = (loc: any) => {
    if (typeof loc.name === 'string') return loc.name;
    return loc.name[lang as 'sk' | 'en' | 'bs'] || loc.name.sk;
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onChangeFrom(start ? format(start, "yyyy-MM-dd") : "");
    onChangeTo(end ? format(end, "yyyy-MM-dd") : "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!from || !to) {
      toast.error(uiTexts.selectDateFirst);
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
        pickup_location: getLocName(pickupLoc),
        return_location: getLocName(returnLoc),
        second_driver: form.hasSecondDriver,
        payment_method: form.paymentMethod,
        total_price: finalPrice,
        status: 'pending'
      });

      if (error) throw error;

      // Telegram / API Notifikácia (nechávame v SK/EN pre admina)
      const msg = [
        `🏎️ *REZERVÁCIA: ${car.brand} ${car.name}*`,
        ``,
        `👤 *Zákazník:* ${form.name}`,
        `📞 *Telefón:* ${form.phone}`,
        `✉️ *Email:* ${form.email}`,
        `💳 *Platba:* ${form.paymentMethod.toUpperCase()}`,
        ``,
        `📍 *OD:* ${from}, ${pickupTime} (${getLocName(pickupLoc)})`,
        `📍 *DO:* ${to}, ${returnTime} (${getLocName(returnLoc)})`,
        ``,
        `💰 *CENA:* ${finalPrice ? `${finalPrice} €` : "Nezadaná"}`,
        `👤 *Druhý vodič:* ${form.hasSecondDriver ? "Áno ✅" : "Nie ❌"}`
      ].join('\n');
      
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg }),
      });

      toast.success(uiTexts.success);
      setForm(p => ({ ...p, name: "", phone: "", email: "", hasSecondDriver: false }));

    } catch (err: any) {
      console.error("ERROR:", err);
      toast.error(uiTexts.error);
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
          <span className="text-sm font-medium text-slate-200">{getLocName(current)}</span>
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
          <div className="absolute z-[60] mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto">
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
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">{getLocName(loc)}</span>
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
  const hasDates = from && to;

  const currentDiscount = PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.discount || 0;

  return (
    <div className="relative space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">{uiTexts.title}</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}><User size={12} className="text-sky-500" /> {uiTexts.nameLabel}</label>
            <input className={inputClass} type="text" placeholder={lang === 'sk' ? "Ján Novák" : "John Doe"} required
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}><Phone size={12} className="text-sky-500" /> {uiTexts.phoneLabel}</label>
              <input className={inputClass} type="tel" placeholder="+421..." required
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}><Mail size={12} className="text-sky-500" /> {uiTexts.emailLabel}</label>
              <input className={inputClass} type="email" placeholder="email@example.com" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
        </div>

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
              locale={lang === 'bs' ? 'bs' : lang === 'en' ? 'en' : 'sk'}
              inline
              calendarClassName="elite-calendar"
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

        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
            {uiTexts.payment}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.map((method) => {
              const isActive = form.paymentMethod === method.id;
              const methodLabel = method.label[lang as 'sk' | 'en' | 'bs'] || method.label.sk;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setForm(p => ({ ...p, paymentMethod: method.id }));
                  }}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                    isActive 
                      ? "border-sky-500 bg-sky-500/10 text-white shadow-[0_0_15px_rgba(14,165,233,0.1)]" 
                      : "border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/20"
                  }`}
                >
                  <method.icon className={`h-4 w-4 transition-colors ${isActive ? "text-sky-400" : "text-slate-600"}`} />
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    {methodLabel}
                  </span>
                  
                  {method.id === 'crypto' && (
                    <span className="ml-1 text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md border border-amber-500/20 font-black mt-1 animate-pulse">
                      -10%
                    </span>
                  )}

                  {isActive && (
                    <Check className="ml-auto h-3 w-3 text-sky-400 animate-in zoom-in duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div 
          onClick={() => { 
            const newValue = !form.hasSecondDriver;
            setForm(p => ({ ...p, hasSecondDriver: newValue })); 
            onSecondDriverChange?.(newValue); 
          }}
          className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${form.hasSecondDriver ? "border-amber-500/40 bg-amber-500/5" : "border-white/10 bg-slate-950/20 hover:border-white/20"}`}
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
            discountMultiplier={1 - currentDiscount} 
            onTotalChange={(total) => {
                setLocalPrice(total);
                onTotalPriceChange?.(total);
            }}
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting || !hasDates} 
            className={`group relative w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 uppercase italic
              ${!hasDates 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5" 
                : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_30px_rgba(14,165,233,0.3)]"
              }`}
          >
            {isSubmitting ? (
              uiTexts.sending
            ) : !hasDates ? (
              <>
                <Calendar size={16} className="text-slate-600" />
                {uiTexts.selectDateFirst}
              </>
            ) : (
              <>
                {uiTexts.send} 
                <Send size={16} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
          
          {!hasDates && (
            <p className="text-center mt-3 text-[10px] text-slate-500 font-medium animate-pulse uppercase tracking-wider">
              {uiTexts.footerNote}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}