import { supabase } from "@/lib/supabase"; // Tvoj univerzálny Supabase klient

// 1. Pridané is_active?: boolean do typu Car
export type PricingTier = {
  label: string;
  daysFrom: number;
  daysTo: number | null;
  dailyKmLimit: number;
  pricePerDay: number;
};

export type Car = {
  id: string;
  brand: string;
  name: string;
  year: number;
  color: string;
  imageUrl: string;
  transmission: "automat";
  fuel: "Benzín";
  drive: string;
  seats: number;
  pricing: PricingTier[];
  deposit: number;
  overLimitPerKm: number;
  minAge: number;
  minLicenseYears: number;
  power: string;
  consumption: string;
  tow: string;
  equipment: string[];
  bookedDates: string[];
  repairPriceBasic: number;
  repairPriceStandard: number;
  participationBasic: string;
  participationStandard: string;
  is_active?: boolean; // 🟢 Pridané sem, aby to frontend viděl
};

// 2. Pridané is_active: boolean do SupabaseCarResponse
export type SupabaseCarResponse = {
  id: string;
  brand: string;
  name: string;
  year: number;
  color: string;
  image_url: string;
  transmission: "automat";
  fuel: "Benzín";
  drive: string;
  seats: number;
  over_limit_per_km: number;
  min_age: number;
  min_license_years: number;
  power: string;
  consumption: string;
  tow: string;
  equipment: string[];
  booked_dates: string[];
  repair_price_basic: number;
  repair_price_standard: number;
  participation_basic: string;
  participation_standard: string;
  is_active: boolean; // 🟢 Pridané sem, aby sa prečítalo zo Supabase
  car_prices: {
    price_1_day: number;
    price_2_3_days: number;
    price_4_7_days: number;
    price_8_14_days: number;
    price_15_22_days: number;
    price_23_plus_days: number;
    km_limit_1_day: number;
    km_limit_2_3_days: number;
    km_limit_4_7_days: number;
    km_limit_8_14_days: number;
    km_limit_15_22_days: number;
    km_limit_23_plus_days: number;
    deposit: number;
    currency: string;
    market: string;
  }[];
};

// 3. Helper funkcia, ktorá premapuje dáta vrátane is_active
export function mapDbCarToFrontend(dbCar: SupabaseCarResponse): Car {
  const prices = dbCar.car_prices && dbCar.car_prices.length > 0 ? dbCar.car_prices[0] : undefined;

  const pricing: PricingTier[] = prices 
    ? [
        { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: prices.km_limit_1_day || 0, pricePerDay: prices.price_1_day || 0 },
        { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: prices.km_limit_2_3_days || 0, pricePerDay: prices.price_2_3_days || 0 },
        { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: prices.km_limit_4_7_days || 0, pricePerDay: prices.price_4_7_days || 0 },
        { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: prices.km_limit_8_14_days || 0, pricePerDay: prices.price_8_14_days || 0 },
        { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: prices.km_limit_15_22_days || 0, pricePerDay: prices.price_15_22_days || 0 },
        { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: prices.km_limit_23_plus_days || 0, pricePerDay: prices.price_23_plus_days || 0 }
      ]
    : [
        { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 0, pricePerDay: 0 },
        { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 0, pricePerDay: 0 },
        { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 0, pricePerDay: 0 },
        { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 0, pricePerDay: 0 },
        { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 0, pricePerDay: 0 },
        { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 0, pricePerDay: 0 }
      ];

  const cleanUrl = dbCar.image_url?.trim();
  const verifiedImageUrl = cleanUrl && cleanUrl !== "" 
    ? dbCar.image_url 
    : "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop"; 

  return {
    id: dbCar.id,
    brand: dbCar.brand || "—",
    name: dbCar.name || "Bez názvu",
    year: dbCar.year || 2024,
    color: dbCar.color || "—",
    imageUrl: verifiedImageUrl,
    transmission: dbCar.transmission || "automat",
    fuel: dbCar.fuel || "Benzín",
    drive: dbCar.drive || "—",
    seats: dbCar.seats || 4,
    deposit: prices ? (prices.deposit || 2500) : 2500,
    overLimitPerKm: dbCar.over_limit_per_km || 0,
    minAge: dbCar.min_age || 18,
    minLicenseYears: dbCar.min_license_years || 1,
    power: dbCar.power || "—",
    consumption: dbCar.consumption || "—",
    tow: dbCar.tow || "—",
    equipment: dbCar.equipment || [],
    bookedDates: dbCar.booked_dates || [],
    repairPriceBasic: dbCar.repair_price_basic || 0,
    repairPriceStandard: dbCar.repair_price_standard || 0,
    participationBasic: dbCar.participation_basic || "—",
    participationStandard: dbCar.participation_standard || "—",
    pricing: pricing,
    is_active: dbCar.is_active ?? true, // 🟢 Prenesieme stav is_active (ak je null/undefined, bereme ako true)
  };
}

// Funkcia pre hlavnú stránku a katalóg (Flotilu)
export async function getCarsFromDatabase(marketCode: string = "sk"): Promise<Car[]> {
  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      car_prices (*)
    `);

  if (error || !data) {
    console.error("Chyba pri načítaní áut zo Supabase:", error);
    return [];
  }

  return data
    .map((dbCar) => {
      const filteredPrices = dbCar.car_prices 
        ? dbCar.car_prices.filter((p: any) => p.market === marketCode) 
        : [];
      
      return mapDbCarToFrontend({
        ...dbCar,
        car_prices: filteredPrices
      } as unknown as SupabaseCarResponse);
    });
}

// Funkcia pre detail konkrétneho auta podľa jeho ID
export async function getCarById(id: string, marketCode: string = "sk"): Promise<Car | undefined> {
  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      car_prices (*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error(`Chyba pri načítaní auta s ID ${id}:`, error);
    return undefined;
  }

  const filteredPrices = data.car_prices 
    ? data.car_prices.filter((p: any) => p.market === marketCode) 
    : [];

  return mapDbCarToFrontend({
    ...data,
    car_prices: filteredPrices
  } as unknown as SupabaseCarResponse);
}