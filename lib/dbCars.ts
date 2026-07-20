// @/lib/dbCars.ts

import { supabase } from "@/lib/supabase";
import { mapDbCarToFrontend, type Car, type SupabaseCarResponse } from "./cars";

// Funkcia na načítanie všetkých áut pre konkrétny trh
export async function getCarsFromDatabase(marketCode: string = "sk"): Promise<Car[]> {
  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      car_prices (*)
    `)
    .eq("car_prices.market", marketCode);

  if (error || !data) {
    console.error("Chyba pri načítaní áut zo Supabase:", error);
    return [];
  }

  return data.map((dbCar) => mapDbCarToFrontend(dbCar as unknown as SupabaseCarResponse));
}

// Funkcia na načítanie jedného auta pre detail
export async function getCarById(id: string, marketCode: string = "sk"): Promise<Car | undefined> {
  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      car_prices (*)
    `)
    .eq("id", id)
    .eq("car_prices.market", marketCode)
    .single();

  if (error || !data) {
    console.error(`Chyba pri načítaní auta s ID ${id}:`, error);
    return undefined;
  }

  return mapDbCarToFrontend(data as unknown as SupabaseCarResponse);
}