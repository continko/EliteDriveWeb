"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, CarFront, Clock, Info, MapPin } from "lucide-react";
import type { Car } from "@/lib/cars";
import { supabase } from "@/lib/supabase"; // Predpokladám, že tu máš inicializovaného klienta
import { format } from "date-fns";

type ReservationFormProps = {
  cars: Car[];
};

type ReservationState = {
  from: string;
  to: string;
  carId: string;
};

export function ReservationForm({ cars }: ReservationFormProps) {
  const [form, setForm] = useState<ReservationState>({
    from: "",
    to: "",
    carId: cars[0]?.id ?? ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCar = useMemo(
    () => cars.find((c) => c.id === form.carId) ?? cars[0],
    [cars, form.carId]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Odoslanie dát do tabuľky 'bookings', ktorú si v SQL úspešne vytvoril
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            car_id: form.carId,
            car_name: `${selectedCar.brand} ${selectedCar.name}`,
            start_date: form.from,
            end_date: form.to,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      // Reset formulára po úspechu
      setForm({
        from: "",
        to: "",
        carId: cars[0]?.id ?? ""
      });
    } catch (error: any) {
      console.error("Chyba pri ukladaní do DB:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="rezervacia"
      className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 p-[1px] shadow-glow-blue"
    >
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative grid gap-10 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-300 ring-1 ring-sky-500/40">
            <CarFront className="h-3.5 w-3.5" />
            <span>Rýchla nezáväzná rezervácia</span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
            Rezervujte si auto na presný termín
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
            Vyberte si dátum vyzdvihnutia a vrátenia vozidla a zvoľte typ auta, ktorý najviac vyhovuje vášmu štýlu jazdy.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="from" className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-300">
                  <CalendarDays className="h-4 w-4 text-sky-400" />
                  <span>Od</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-2.5 text-sm shadow-inner shadow-slate-950 focus-within:border-sky-500/70 focus-within:ring-1 focus-within:ring-sky-500/60">
                  <input
                    id="from"
                    type="date"
                    value={form.from}
                    onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value }))}
                    className="h-9 w-full bg-transparent text-sm text-slate-100 outline-none color-scheme-dark"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="to" className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-300">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <span>Do</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-2.5 text-sm shadow-inner shadow-slate-950 focus-within:border-sky-500/70 focus-within:ring-1 focus-within:ring-sky-500/60">
                  <input
                    id="to"
                    type="date"
                    value={form.to}
                    onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))}
                    className="h-9 w-full bg-transparent text-sm text-slate-100 outline-none color-scheme-dark"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="car" className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-300">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span>Vyberte vozidlo</span>
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-2.5 text-sm shadow-inner shadow-slate-950 focus-within:border-sky-500/70 focus-within:ring-1 focus-within:ring-sky-500/60">
                <select
                  id="car"
                  value={form.carId}
                  onChange={(e) => setForm((prev) => ({ ...prev, carId: e.target.value }))}
                  className="h-9 w-full bg-transparent text-sm text-slate-100 outline-none"
                >
                  {cars.map((car) => (
                    <option key={car.id} value={car.id} className="bg-slate-900 text-slate-100">
                      {car.brand} {car.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-glow-blue transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:w-auto sm:px-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Spracúvam...' : 'Rezervovať teraz'}
            </button>

            {errorMessage && (
              <p className="text-xs text-red-400 mt-2">Chyba: {errorMessage}</p>
            )}
          </form>
        </div>

        <aside className="space-y-6 rounded-2xl border border-sky-500/30 bg-slate-950/70 p-5 shadow-glow-blue sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100 sm:text-base">
            <Info className="h-4 w-4 text-sky-400" />
            <span>Detaily vozidla</span>
          </h3>

          {selectedCar && (
            <div className="space-y-2 rounded-xl bg-slate-900/80 p-4 text-sm text-slate-200">
              <p className="font-medium">
                {selectedCar.brand} {selectedCar.name}
              </p>
              <p className="text-xs text-slate-400">
                Palivo: {selectedCar.fuel} • Prevodovka: {selectedCar.transmission} • Pohon: {selectedCar.drive}
              </p>
            </div>
          )}

          {submitted && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-100 animate-in fade-in duration-500">
              <p className="font-semibold">Rezervácia bola úspešne uložená!</p>
              <p className="mt-1 text-[11px] text-emerald-100/90">
                Vašu požiadavku sme prijali do systému. Budeme vás čoskoro kontaktovať.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}