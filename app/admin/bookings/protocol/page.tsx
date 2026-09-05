"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Gauge, Fuel, ShieldAlert, CheckCircle2, FileText, ArrowLeft, RefreshCw 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

// Definícia rozhrania pre auto a jeho detaily, aby TypeScript neprotestoval
interface CarDetail {
  license_plate?: string | null;
  mileage?: number | string | null;
}

interface Car {
  id: string;
  brand: string;
  name: string;
  car_details?: CarDetail | CarDetail[] | null;
}

export default function VehicleProtocolPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Zistenie parametrov z URL (ak prichádzame z rezervácií)
  const carIdFromUrl = searchParams.get("carId") || "";
  const bookingIdFromUrl = searchParams.get("bookingId") || "";

  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  
  const [selectedCarId, setSelectedCarId] = useState(carIdFromUrl);
  const [protocolType, setProtocolType] = useState<"CHECK_OUT" | "CHECK_IN">("CHECK_OUT");
  const [mileage, setMileage] = useState("");
  const [fuelLevel, setFuelLevel] = useState("100");
  const [notes, setNotes] = useState(bookingIdFromUrl ? `Prepojené s rezerváciou ID: ${bookingIdFromUrl}` : "");
  const [damages, setDamages] = useState<string[]>([]);
  const [clientName, setClientName] = useState("");

  const damageAreas = [
    "Predný nárazník", "Zadný nárazník", "Ľavý predný blatník", 
    "Ľavé predné dvere", "Ľavé zadné dvere", "Ľavý zadný blatník",
    "Pravý predný blatník", "Pravé predné dvere", "Pravé zadné dvere", 
    "Pravý zadný blatník", "Kapota", "Strecha", "Disky kolies / Pneumatiky", "Čelné sklo"
  ];

  useEffect(() => {
    async function fetchCars() {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select(`
            id,
            brand,
            name,
            car_details (
              license_plate,
              mileage
            )
          `);
          
        if (error) {
          console.warn("Nepodarilo sa načítať autá:", error.message);
          toast.error("Chyba pri načítaní áut z flotily");
        } else if (data) {
          setCars(data);
          
          // Ak bolo ID auta v URL, nastavíme ho a skúsime predvyplniť tachometer
          if (carIdFromUrl) {
            setSelectedCarId(carIdFromUrl);
            const preselectedCar = data.find((c) => c.id === carIdFromUrl);
            const details = Array.isArray(preselectedCar?.car_details) 
              ? preselectedCar?.car_details[0] 
              : preselectedCar?.car_details;
              
            // OPRAVENÉ: Bezpečný prístup cez type assertion / optional chaining
            if (details && typeof details === 'object' && 'mileage' in details && details.mileage) {
              setMileage(details.mileage.toString());
            }
          }
        }
      } catch (err) {
        console.error("Chyba:", err);
      }
    }
    fetchCars();
  }, [carIdFromUrl]);

  const toggleDamage = (area: string) => {
    if (damages.includes(area)) {
      setDamages(damages.filter(d => d !== area));
    } else {
      setDamages([...damages, area]);
    }
  };

  const handleSaveProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !mileage || !clientName) {
      toast.error("Vyplňte povinné polia (Auto, Tachometer, Meno klienta)");
      return;
    }

    setLoading(true);

    try {
      const { error: protocolError } = await supabase
        .from("vehicle_protocols")
        .insert([{
          car_id: selectedCarId,
          booking_id: bookingIdFromUrl || null,
          type: protocolType,
          mileage: parseInt(mileage),
          fuel_level: parseInt(fuelLevel),
          damages: damages,
          notes: notes,
          client_name: clientName,
          created_at: new Date().toISOString()
        }]);

      if (protocolError) {
        throw new Error(protocolError.message);
      }

      toast.success("Digitálny protokol úspešne uložený!");
      if (bookingIdFromUrl) {
        router.push("/admin/bookings");
      } else {
        router.push("/admin/logistics");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Chyba: Tabuľka 'vehicle_protocols' zrejme neexistuje alebo nastal problém pri zápise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 text-left font-urbanist text-white max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest bg-slate-900/50 px-4 py-2.5 rounded-xl border border-white/5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Späť
        </button>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
          <button 
            type="button"
            onClick={() => setProtocolType("CHECK_OUT")}
            className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${protocolType === "CHECK_OUT" ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20" : "text-slate-500 hover:text-white"}`}
          >
            Výdaj vozidla (Check-Out)
          </button>
          <button 
            type="button"
            onClick={() => setProtocolType("CHECK_IN")}
            className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${protocolType === "CHECK_IN" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"}`}
          >
            Príjem vozidla (Check-In)
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tight">Digitálny preberací protokol</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Záznam o stave vozidla, poškodeniach a tachometri</p>
          </div>
        </div>

        <form onSubmit={handleSaveProtocol} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Vybrať vozidlo *</label>
              <select 
                value={selectedCarId}
                onChange={(e) => {
                  const carId = e.target.value;
                  setSelectedCarId(carId);

                  const chosenCar = cars.find(c => c.id === carId);
                  const details = Array.isArray(chosenCar?.car_details) 
                    ? chosenCar?.car_details[0] 
                    : chosenCar?.car_details;
                    
                  if (details && typeof details === 'object' && 'mileage' in details && details.mileage) {
                    setMileage(details.mileage.toString());
                  }
                }}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
                required
              >
                <option value="">-- Vyberte vozidlo z flotily --</option>
                {cars.map(car => {
                  const details = Array.isArray(car.car_details) ? car.car_details[0] : car.car_details;
                  const plate = details?.license_plate || "Bez ŠPZ";

                  return (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.name} [{plate}]
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Meno klienta / vodiča *</label>
              <input 
                type="text"
                placeholder="napr. Ján Mrkvička"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-sky-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                <Gauge size={14} className="text-sky-400" /> Stav tachometra (km) *
              </label>
              <input 
                type="number"
                placeholder="napr. 45200"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-sky-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                <Fuel size={14} className="text-sky-400" /> Stav paliva / batérie (%)
              </label>
              <select 
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
              >
                <option value="100">100% (Plná nádrž)</option>
                <option value="75">75%</option>
                <option value="50">50% (Polovica)</option>
                <option value="25">25%</option>
                <option value="10">10% (Rezerva)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-400" /> Označte existujúce poškodenia karosérie (kliknutím):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {damageAreas.map(area => {
                const isSelected = damages.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleDamage(area)}
                    className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400' 
                        : 'bg-slate-950/50 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span>{area}</span>
                    <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-800'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Poznámky / Špecifické detaily</label>
            <textarea 
              rows={3}
              placeholder="Zadajte poznámky k stavu interiéru..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-sky-500 transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
            {loading ? "Ukladá sa protokol..." : "Uložiť a potvrdiť protokol"}
          </button>
        </form>
      </div>
    </div>
  );
}