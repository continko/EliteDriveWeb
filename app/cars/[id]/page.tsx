import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type Car, getCarById } from "@/lib/cars";
import { getCarsFromDatabase } from "@/lib/dbCars";
import { CarDetailGrid } from "@/components/CarDetailGrid";

// Pomocná funkcia zostáva, neskôr ju môžeš celú vymazať, ak si výkon / zrýchlenie nahodíš priamo ako stĺpce v Supabase!
function getCarPowerSpecs(car: Car) {
  switch (car.id) {
    // Ak by si v DB naďalej testoval so starými ID, nechaj ich tu. Ak už mapuješ UUID, switch padne do defaultu (čo je v pohode, ak máš výkon v car.power)
    case "bmw-m5-f90-2023": return { power: "441 kW / 600 hp", zeroToHundred: "3,4 s" };
    case "bmw-m3-g80-2024": return { power: "375 kW / 510 hp", zeroToHundred: "3,9 s" };
    case "bmw-m3-g81-2024": return { power: "375 kW / 510 hp", zeroToHundred: "4,1 s" };
    case "bmw-m4-g82-2025": return { power: "390 kW / 530 hp", zeroToHundred: "3,7 s" };
    case "bmw-x5m-2025": return { power: "460 kW / 625 hp", zeroToHundred: "3,9 s" };
    case "audi-rs3-2024": return { power: "294 kW / 400 hp", zeroToHundred: "3,8 s" };
    case "audi-rs6-avant-2024": return { power: "463 kW / 630 hp", zeroToHundred: "3,4 s" };
    case "audi-rs7-2024": return { power: "463 kW / 630 hp", zeroToHundred: "3,4 s" };
    case "mercedes-c63-amg-2023": return { power: "350 kW / 476 hp", zeroToHundred: "4,0 s" };
    case "porsche-911-gt3": return { power: "375 kW / 510 hp", zeroToHundred: "3,4 s" };
    default: return { power: car.power || "—", zeroToHundred: "—" }; // Ak switch nenájde ID, použije hodnotu 'power' priamo z DB
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // ZMENENÉ: Zavoláme Supabase a vytiahneme konkrétne auto podľa ID z URL pre slovenský trh ('sk')
  const car = await getCarById(id, "sk");

  if (!car) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white font-black tracking-[0.3em] uppercase">
        Auto nenájdené
      </main>
    );
  }

  const { power, zeroToHundred } = getCarPowerSpecs(car);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] selection:bg-sky-500/30">

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 lg:gap-12 lg:px-8 lg:pb-32 lg:pt-12">
        
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 transition-all hover:text-sky-400"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-all group-hover:scale-110 group-hover:border-sky-500/50 group-hover:bg-sky-500/10">
                <ArrowLeft className="h-4 w-4" />
            </div>
            <span>Katalóg áut</span>
          </Link>
          
        </div>

        <CarDetailGrid car={car} power={power} zeroToHundred={zeroToHundred} />
      </div>
    </main>
  );
}