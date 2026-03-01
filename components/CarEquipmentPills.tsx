import { Bluetooth, Car, Lightbulb, Settings2, Snowflake, Wifi, Speaker, Camera, Wind, Disc, Music } from "lucide-react";
import type { Car as CarType } from "@/lib/cars";

// Rozšírené ikony pre lepší vizuálny detail
const EQUIPMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  default: Car,
  klimatizácia: Snowflake,
  bluetooth: Bluetooth,
  led: Lightbulb,
  laser: Lightbulb,
  matrix: Lightbulb,
  svetlá: Lightbulb,
  kamera: Camera,
  panoráma: Wind,
  harman: Music,
  bang: Speaker,
  brzdy: Disc,
  karbón: Settings2,
  výfuk: Settings2,
  soft: Settings2,
  odvetrané: Snowflake,
  chrono: Settings2,
  m: Car,
  rs: Car,
  amg: Car
};

function getIconForEquipment(label: string) {
  const lower = label.toLowerCase();
  for (const [key, Icon] of Object.entries(EQUIPMENT_ICONS)) {
    if (key !== "default" && lower.includes(key)) return Icon;
  }
  return EQUIPMENT_ICONS.default;
}

type CarEquipmentPillsProps = {
  car: CarType;
};

export function CarEquipmentPills({ car }: CarEquipmentPillsProps) {
  if (!car.equipment?.length) return null;

  return (
    /* HLAVNÝ KONTAJNER: Zahustené sklo bg-slate-900/60 a silný blur pre Icy Blue setup */
    <section className="relative overflow-hidden space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
      {/* Vnútorný odlesk pre hĺbku */}
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <div className="flex items-center gap-4 px-1">
        <div className="h-6 w-1 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">Prémiová výbava</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {car.equipment.map((item) => {
          const Icon = getIconForEquipment(item);
          return (
            <span
              key={item}
              /* PILLS: Tmavšie pozadie bg-slate-950/40 pre lepší kontrast na skle */
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-400 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
            >
              <Icon className="h-4 w-4 text-sky-400/80 transition-transform group-hover:scale-110 group-hover:text-sky-400" />
              {item}
            </span>
          );
        })}
      </div>
    </section>
  );
}