"use client";

import { useState, useEffect } from "react";
import { 
  ChevronDown, Calendar, Clock, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Car } from "@/lib/cars";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";
import DatePicker, { registerLocale } from "react-datepicker";
import { sk, enGB } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { startOfDay, format, differenceInDays } from "date-fns";
import { CarPricingCalculator } from "./CarPricingCalculator";

registerLocale("sk", sk);
registerLocale("en", enGB);

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
  { id: "vie", name: { sk: "Schwechat - Letisko", en: "Vienna Airport" }, price: 150 },
  { id: "bud", name: { sk: "Budapešť", en: "Budapest" }, price: 183 },
  { id: "ke", name: { sk: "Košice", en: "Kosice" }, price: 260 },
];

type CarDetailReservationFormProps = {
  car: Car;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  onPickupChange?: (price: number) => void;
  onReturnChange?: (price: number) => void;
  onPickupTimeChange?: (time: string) => void;
  onReturnTimeChange?: (time: string) => void;
  onTotalPriceChange?: (price: number | null) => void;
  totalPrice: number | null;
};

export function CarDetailReservationForm({
  car, from, to, onChangeFrom, onChangeTo,
  onPickupChange, onReturnChange,
  onPickupTimeChange, onReturnTimeChange,
  onTotalPriceChange,
  totalPrice 
}: CarDetailReservationFormProps) {
  const { lang } = useLang();
  const router = useRouter();
  
  const [pickupLoc, setPickupLoc] = useState(LOCATIONS[0]);
  const [returnLoc, setReturnLoc] = useState(LOCATIONS[0]);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [openDropdown, setOpenDropdown] = useState<'pickup' | 'return' | null>(null);
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
  }, [car]);

  const uiTexts = {
    sk: {
      title: "Rezervácia vozidla",
      pickup: "Miesto vyzdvihnutia",
      return: "Miesto vrátenia",
      free: "ZDARMA",
      continue: "Pokračovať v objednávke",
      selectDateFirst: "Vyberte termín v kalendári",
      selectDate: "Vyberte termín prenájmu",
      pickupTime: "Čas prevzatia",
      returnTime: "Čas vrátenia",
      footerNote: "Pre pokračovanie označte začiatok a koniec prenájmu"
    },
    en: {
      title: "Vehicle Reservation",
      pickup: "Pickup Location",
      return: "Return Location",
      free: "FREE",
      continue: "Continue to booking",
      selectDateFirst: "Select dates in calendar",
      selectDate: "Select Rental Dates",
      pickupTime: "Pickup Time",
      returnTime: "Return Time",
      footerNote: "Please select start and end date to continue"
    },
  }[lang as 'sk' | 'en' ] || {};

  const getLocName = (loc: any) => {
    if (typeof loc.name === 'string') return loc.name;
    return loc.name[lang as 'sk' | 'en' ] || loc.name.sk;
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onChangeFrom(start ? format(start, "yyyy-MM-dd") : "");
    onChangeTo(end ? format(end, "yyyy-MM-dd") : "");
  };

  const handleContinue = () => {
    if (!from || !to) return;

    // 1. PRESNÝ VÝPOČET DNÍ
    const startDate = new Date(`${from}T${pickupTime}`);
    const endDate = new Date(`${to}T${returnTime}`);
    const diffMs = endDate.getTime() - startDate.getTime();
    const rentalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // 2. ZÍSKANIE TIERU A VÝPOČET KM LIMITU
    const pricingArray = car.pricing as any[];
    const tier = pricingArray.find(t => 
      rentalDays >= t.daysFrom && (t.daysTo === null || t.daysTo === undefined || rentalDays <= t.daysTo)
    ) || pricingArray[0];

    const dailyKmLimit = tier?.dailyKmLimit || 200; 
    const totalKmLimit = rentalDays * dailyKmLimit;

    // 3. ZÍSKANIE CENY
    let finalPrice = totalPrice;
    
    if (!finalPrice || finalPrice <= 0) {
      const dailyPrice = tier ? (tier.pricePerDay || tier.price || tier.basePrice || 0) : 0;
      finalPrice = (rentalDays * dailyPrice) + pickupLoc.price + returnLoc.price;
    }

    // 4. KONŠTRUKCIA DÁT PRE SESSION STORAGE
    const reservationData = {
      carId: car.id,
      brand: car.brand,
      name: car.name,
      from,
      to,
      pickupTime,
      returnTime,
      pickupLoc: getLocName(pickupLoc),
      returnLoc: getLocName(returnLoc),
      pickupPrice: pickupLoc.price,
      returnPrice: returnLoc.price,
      totalPrice: finalPrice,
      rentalDays: rentalDays,
      totalKmLimit: totalKmLimit,
      image: car.imageUrl,
      deposit: car.deposit,
      // --- TIETO RIADKY SI TAM NEMAL A SÚ KĽÚČOVÉ ---
      repairPriceBasic: car.repairPriceBasic,         // NOVÉ
      repairPriceStandard: car.repairPriceStandard,   // NOVÉ
      participationBasic: car.participationBasic,     // NOVÉ
      participationStandard: car.participationStandard // NOVÉ
    };

    console.log("DEBUG: Odosielam dáta:", reservationData);
    sessionStorage.setItem('pendingReservation', JSON.stringify(reservationData));
    router.push('/checkout');
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
          className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-4 transition-all hover:bg-slate-950/60"
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
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${openDropdown === type ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {openDropdown === type && (
          <div className="absolute z-[60] mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 backdrop-blur-2xl shadow-2xl max-h-60 overflow-y-auto text-left">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id} type="button"
                onClick={() => { 
                  if (type === 'pickup') { 
                    setPickupLoc(loc); 
                    onPickupChange?.(loc.price); 
                  } else { 
                    setReturnLoc(loc); 
                    onReturnChange?.(loc.price); 
                  }
                  setOpenDropdown(null); 
                }}
                className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-white/5"
              >
                <span className="text-sm font-medium text-slate-300">{getLocName(loc)}</span>
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

  const hasDates = from && to;

  return (
    <div className="relative space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      <header>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">{uiTexts.title}</h2>
      </header>

      <div className="space-y-6">
        <div className="space-y-4 rounded-3xl border border-white/5 bg-slate-950/20 p-6">
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
            <Calendar size={12} className="text-sky-500" /> {uiTexts.selectDate}
          </label>
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 text-left">
                <Clock size={12} className="text-sky-500" /> {uiTexts.pickupTime}
              </label>
              <select 
                value={pickupTime}
                onChange={e => { 
                  setPickupTime(e.target.value); 
                  onPickupTimeChange?.(e.target.value); 
                }}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none appearance-none cursor-pointer"
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 text-left">
                <Clock size={12} className="text-amber-500" /> {uiTexts.returnTime}
              </label>
              <select 
                value={returnTime}
                onChange={e => { 
                  setReturnTime(e.target.value); 
                  onReturnTimeChange?.(e.target.value); 
                }}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none appearance-none cursor-pointer"
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-left">
          <LocationSelect label={uiTexts.pickup} current={pickupLoc} type="pickup" />
          <LocationSelect label={uiTexts.return} current={returnLoc} type="return" />
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
            hasSecondDriver={false}
            discountMultiplier={1} 
            onTotalChange={onTotalPriceChange}
          />
        </div>

        <div className="pt-2">
          <button 
            onClick={handleContinue}
            disabled={!hasDates} 
            className={`group w-full font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 uppercase italic
              ${!hasDates 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5" 
                : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_30px_rgba(14,165,233,0.3)]"
              }`}
          >
            {!hasDates ? (
              <>
                <Calendar size={16} className="text-slate-600" />
                {uiTexts.selectDateFirst}
              </>
            ) : (
              <>
                {uiTexts.continue} 
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}