"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { DollarSign, ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("operator"); // operator, finance, management, fleet
  const [country, setCountry] = useState("ALL");
  const [stats, setStats] = useState({ health: 100, totalCars: 0 });
  const [loading, setLoading] = useState(true);
  const [currencyView, setCurrencyView] = useState("USD");
  const [hideDeleted, setHideDeleted] = useState(true);

  // Operátorské metriky pre reálne dáta
  const [operatorMetrics, setOperatorMetrics] = useState({
    todayPickups: 0,
    todayReturns: 0,
    currentlyRented: 0,
    pendingBookings: 0,
    completedBookings: 0
  });

  // Stavy pre reálne dáta (ostatné záložky)
  const [fleetWinsData, setFleetWinsData] = useState({
    utilizationRate: 0,
    totalCarsCount: 0,
    topEarnerName: "Zatiaľ žiadne autá",
    topEarnerRevenue: 0,
    topEarnerDaysRented: 0,
    totalBusinessRevenue: 0,
    mostBookedCar: "—",
    mostBookedCount: 0,
    largestBookingAmount: 0,
    weekRevenue: 0,
    weekRentalsCount: 0,
    weekNewCustomersCount: 0,
    averageBookingRevenue: 0,
    unbookedCars: [] as string[]
  });

  const chartData = [
    { name: '21.8.', revenue: 0 },
    { name: '23.8.', revenue: 0 },
    { name: '25.8.', revenue: 0 },
    { name: '27.8.', revenue: 0 },
  ];

  useEffect(() => {
    async function analyzeDashboardData() {
      try {
        // 1. Načítame autá
        const { data: cars } = await supabase.from("cars").select(`*, car_details(*)`);
        const totalCars = cars ? cars.length : 0;

        // 2. Načítame rezervácie
        const { data: bookings } = await supabase.from("bookings").select("*");
        const allBookings = bookings || [];

        // Pomocné premenné pre operátora
        const todayStr = new Date().toISOString().split('T')[0];
        let todayPickupsCount = 0;
        let todayReturnsCount = 0;
        let activeRentedCount = 0;
        let pendingCount = 0;
        let completedCount = 0;

        // --- FILTROVANIE A VÝPOČTY ---
        let totalRevenue = 0;
        let maxBooking = 0;
        let validBookingsCount = 0;
        let carRevenueMap: { [key: string]: { revenue: number, count: number } } = {};
        let carBookingCountMap: { [key: string]: number } = {};
        const bookedCarNames = new Set<string>();

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let weekRev = 0;
        let weekRentals = 0;
        const uniqueWeekCustomers = new Set();

        allBookings.forEach((b: any) => {
          const status = b.status?.toLowerCase() || "";
          
          if (status === "pending") {
            pendingCount += 1;
          }
          if (status === "completed" || status === "returned") {
            completedCount += 1;
          }
          if (status === "active" || status === "rented" || status === "ongoing") {
            activeRentedCount += 1;
          }

          const startDate = (b.start_date || b.pickup_date || "").split('T')[0];
          const endDate = (b.end_date || b.return_date || "").split('T')[0];

          if (startDate === todayStr) {
            todayPickupsCount += 1;
          }
          if (endDate === todayStr) {
            todayReturnsCount += 1;
          }

          const ignoredStatuses = ["pending", "cancelled", "canceled", "deleted", "storno", "rejected"];
          if (ignoredStatuses.includes(status)) {
            return;
          }

          validBookingsCount += 1;
          const amount = Number(b.total_price || b.price || b.amount || 0);
          totalRevenue += amount;

          if (amount > maxBooking) {
            maxBooking = amount;
          }

          const carName = b.car_name || b.car || "Neznáme auto";
          bookedCarNames.add(carName);

          if (!carRevenueMap[carName]) carRevenueMap[carName] = { revenue: 0, count: 0 };
          carRevenueMap[carName].revenue += amount;
          carRevenueMap[carName].count += 1;

          if (!carBookingCountMap[carName]) carBookingCountMap[carName] = 0;
          carBookingCountMap[carName] += 1;

          const bookingDate = new Date(b.created_at);
          if (bookingDate >= oneWeekAgo) {
            weekRev += amount;
            weekRentals += 1;
            if (b.customer_email || b.customer_name) {
              uniqueWeekCustomers.add(b.customer_email || b.customer_name);
            }
          }
        });

        // Top zarábajúce auto
        let topCar = "Zatiaľ bez prenájmov";
        let topCarRev = 0;
        let topCarCount = 0;
        Object.entries(carRevenueMap).forEach(([car, data]: [string, any]) => {
          if (data.revenue > topCarRev) {
            topCarRev = data.revenue;
            topCar = car;
            topCarCount = data.count;
          }
        });

        // Najčastejšie rezervované auto
        let mostBooked = "—";
        let maxCount = 0;
        Object.entries(carBookingCountMap).forEach(([car, count]: [string, any]) => {
          if (count > maxCount) {
            maxCount = count;
            mostBooked = car;
          }
        });

        // Autá bez rezervácií
        const unbooked: string[] = [];
        if (cars) {
          cars.forEach((car: any) => {
            const name = car.name || car.car_name || "Neznáme vozidlo";
            if (!bookedCarNames.has(name)) {
              unbooked.push(name);
            }
          });
        }

        const avgBookingRev = validBookingsCount > 0 ? totalRevenue / validBookingsCount : 0;

        setStats({ totalCars, health: 100 });
        setOperatorMetrics({
          todayPickups: todayPickupsCount,
          todayReturns: todayReturnsCount,
          currentlyRented: activeRentedCount,
          pendingBookings: pendingCount,
          completedBookings: completedCount
        });

        setFleetWinsData({
          utilizationRate: totalCars > 0 ? Math.min(100, Math.round((validBookingsCount / totalCars) * 100)) : 0,
          totalCarsCount: totalCars,
          topEarnerName: topCar,
          topEarnerRevenue: topCarRev,
          topEarnerDaysRented: topCarCount * 3,
          totalBusinessRevenue: totalRevenue,
          mostBookedCar: mostBooked,
          mostBookedCount: maxCount,
          largestBookingAmount: maxBooking,
          weekRevenue: weekRev,
          weekRentalsCount: weekRentals,
          weekNewCustomersCount: uniqueWeekCustomers.size,
          averageBookingRevenue: avgBookingRev,
          unbookedCars: unbooked
        });

      } catch (err) {
        console.error("Chyba pri analýze štatistík:", err);
      } finally {
        setLoading(false);
      }
    }

    analyzeDashboardData();
  }, []);

  const currentMonthName = new Date().toLocaleString('sk-SK', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-20 text-left font-urbanist text-white">
      
      {/* VRCHNÉ ZÁLOŽKY */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-8">
          {[
            { id: "operator", label: "Prehľad operátora" },
            { id: "finance", label: "Financie" },
            { id: "management", label: "Manažment" },
            { id: "fleet", label: "Fleet Wins" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold transition-all relative pb-4 -mb-4 ${
                activeTab === tab.id 
                ? "text-sky-400 border-b-2 border-sky-400" 
                : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filtrácia trhu */}
        <div className="flex gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-white/5">
          {["ALL", "SK", "HR", "HU", "BA", "ME"].map((c) => (
            <button 
              key={c}
              onClick={() => setCountry(c)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                country === c ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* OBSAH PODĽA ZÁLOŽIEK */}
      {activeTab === "operator" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Dnešné vyzdvihnutia (Modrý akcent) */}
            <div className="bg-gradient-to-br from-sky-500/10 via-slate-900/40 to-slate-900/80 border border-sky-500/20 rounded-3xl p-6 flex flex-col justify-between">
              <p className="text-[11px] font-semibold text-sky-400">Dnešné vyzdvihnutia</p>
              <p className="text-3xl font-black text-white mt-4 tracking-tight">{operatorMetrics.todayPickups}</p>
            </div>

            {/* Dnešné vrátenia (Azúrový akcent) */}
            <div className="bg-gradient-to-br from-purple-500/10 via-slate-900/40 to-slate-900/80 border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between">
              <p className="text-[11px] font-semibold text-purple-400">Dnešné vrátenia</p>
              <p className="text-3xl font-black text-white mt-4 tracking-tight">{operatorMetrics.todayReturns}</p>
            </div>

            {/* Práve v prenájme (Emeraldový/Zelený akcent) */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-between">
              <p className="text-[11px] font-semibold text-emerald-400">Práve v prenájme</p>
              <p className="text-3xl font-black text-white mt-4 tracking-tight">{operatorMetrics.currentlyRented}</p>
            </div>

            {/* Čakajúce (Žltý / Jantárový akcent) */}
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-slate-900/80 border border-amber-500/20 rounded-3xl p-6 flex flex-col justify-between">
              <p className="text-[11px] font-semibold text-amber-400">Čakajúce</p>
              <p className="text-3xl font-black text-white mt-4 tracking-tight">{operatorMetrics.pendingBookings}</p>
            </div>

            {/* Vrátené (Fialový akcent) */}
            <div className="bg-gradient-to-br from-cyan-500/10 via-slate-900/40 to-slate-900/80 border border-cyan-500/20 rounded-3xl p-6 flex flex-col justify-between">
              <p className="text-[11px] font-semibold text-cyan-400">Vrátené</p>
              <p className="text-3xl font-black text-white mt-4 tracking-tight">{operatorMetrics.completedBookings}</p>
            </div>

            {/* Počasie / Info karta */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
              <p className="text-[11px] text-slate-400 font-medium leading-tight">Pridajte mesto v nastaveniach pre zobrazenie počasia</p>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black uppercase italic tracking-wider text-sm text-white">Celkový obrat</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-black tracking-tight text-white">€{fleetWinsData.totalBusinessRevenue.toLocaleString()}</span>
                    <span className="text-xs font-bold text-emerald-400">+0.0% toto obdobie</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select value={currencyView} onChange={(e) => setCurrencyView(e.target.value)} className="bg-slate-900 border border-white/10 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none">
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between items-center text-center">
              <div className="w-full text-left">
                <h3 className="font-black uppercase italic tracking-wider text-sm text-white">Stav flotily</h3>
              </div>
              <div className="my-auto py-6 flex flex-col items-center justify-center">
                <div className="h-32 w-32 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                  <span className="text-2xl font-black text-white">{stats.totalCars}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-3">{stats.totalCars === 0 ? "Žiadne vozidlá" : "Aktívne vozidlá"}</p>
              </div>
              <p className="text-xs text-slate-400">Pridajte vozidlá pre zobrazenie stavu flotily.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "finance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black uppercase italic tracking-wider text-sm text-white">Revenue Trend Comparison</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Current</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span> Previous</span>
                </div>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#fbbf24" strokeWidth={2} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white mb-4">Revenue by Rental Type</h3>
              <div className="flex flex-col items-center justify-center my-auto py-4">
                <div className="h-32 w-32 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                  <span className="text-xl font-black text-white">€{fleetWinsData.totalBusinessRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2.5 border-t border-white/5 pt-4 text-xs">
                <div className="flex justify-between items-center"><span className="text-slate-400">Hourly (0%)</span><span className="font-bold text-white">€0</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400">Daily (0%)</span><span className="font-bold text-white">€0</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400">Weekly (0%)</span><span className="font-bold text-white">€0</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400">Monthly (0%)</span><span className="font-bold text-white">€0</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[200px]">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white">Total Add-on Revenue</h3>
              <h2 className="text-3xl font-black text-white tracking-tight">€0,00</h2>
              <p className="text-xs text-slate-500 border-t border-white/5 pt-3 text-center">No add-ons in this period.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[200px]">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white">Top Earning Rentals</h3>
              <p className="text-xs text-slate-500 text-center">{fleetWinsData.topEarnerName !== "Zatiaľ žiadne autá" ? `${fleetWinsData.topEarnerName} (€${fleetWinsData.topEarnerRevenue.toLocaleString()})` : "No revenue yet."}</p>
              <span className="text-[11px] text-slate-500 border-t border-white/5 pt-3">Top performer</span>
            </div>
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/30">
                <h3 className="font-black uppercase italic tracking-wider text-xs text-white mb-3">Captured vs Released Deposits</h3>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-amber-400">0% (€0 Captured)</span>
                  <span className="text-emerald-400">0% (€0 Released)</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex"><div className="bg-amber-400 w-0"></div><div className="bg-emerald-400 w-0"></div></div>
              </div>
              <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/30">
                <h3 className="font-black uppercase italic tracking-wider text-xs text-white mb-2">Average Revenue Per Reservation</h3>
                <h2 className="text-2xl font-black text-white tracking-tight">€{fleetWinsData.averageBookingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "management" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between min-h-[340px]">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white">Total Expenses by Category</h3>
              <div className="flex flex-col items-center justify-center my-auto py-4">
                <div className="h-32 w-32 rounded-full border-8 border-white/5 flex flex-col items-center justify-center relative">
                  <span className="text-xl font-black text-white">€0</span>
                  <span className="text-[10px] text-slate-500">No expenses</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center border-t border-white/5 pt-4">No expenses logged.</p>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between min-h-[340px]">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white">Top Utilized Rentals</h3>
              <div className="my-auto text-center py-6">
                <p className="text-xs text-slate-500 font-medium">
                  {fleetWinsData.topEarnerName !== "Zatiaľ žiadne autá" ? fleetWinsData.topEarnerName : "No rentals yet."}
                </p>
              </div>
              <div className="border-t border-white/5 pt-4">
                <span className="text-[11px] text-slate-500">Utilization rankings</span>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white mb-4">Revenue Breakdown</h3>
              <div className="flex flex-col items-center justify-center my-auto py-2">
                <div className="h-28 w-28 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                  <span className="text-lg font-black text-white">€{fleetWinsData.totalBusinessRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2.5 border-t border-white/5 pt-4 text-xs">
                <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Hourly (0%)</span><span className="font-bold text-white">€0</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Daily (0%)</span><span className="font-bold text-white">€0</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Weekly (0%)</span><span className="font-bold text-white">€0</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Monthly (0%)</span><span className="font-bold text-white">€0</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white mb-6">Profit & Loss Summary</h3>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400"><ArrowDownRight size={18} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Revenue</p>
                    <p className="text-lg font-black text-white">€{fleetWinsData.totalBusinessRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400"><ArrowUpRight size={18} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Expenses</p>
                    <p className="text-lg font-black text-white">€0</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><TrendingUp size={18} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Net Profit</p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-black text-white">€{fleetWinsData.totalBusinessRevenue.toLocaleString()}</p>
                      <span className="text-[10px] text-emerald-400 font-bold">▲ 0.0%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[20px] w-full"></div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between">
              <h3 className="font-black uppercase italic tracking-wider text-sm text-white mb-4">Vehicles With No Bookings</h3>
              <div className="my-auto text-center py-6">
                <p className="text-xs text-slate-500 font-medium">
                  {fleetWinsData.unbookedCars.length > 0 ? fleetWinsData.unbookedCars.join(", ") : "No inventory yet — add items to track this."}
                </p>
              </div>
              <div className="border-t border-white/5 pt-4">
                <span className="text-[11px] text-slate-500">Unbooked fleet analysis</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "fleet" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[280px]">
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vyťaženosť flotily</p></div>
            <div className="text-center my-auto">
              <h2 className="text-5xl font-black text-white tracking-tight">{fleetWinsData.utilizationRate}%</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">dosiahnutá miera vyťaženia</p>
            </div>
            <div className="text-xs text-slate-500 flex justify-between items-center border-t border-white/5 pt-3">
              <span>Veľkosť flotily: {fleetWinsData.totalCarsCount}</span>
              <span className="uppercase">{currentMonthName}</span>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-slate-900/50 to-slate-900/80 flex flex-col justify-between h-[280px]">
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Najziskovejšie vozidlo zarobilo</p>
              <h2 className="text-4xl font-black text-white tracking-tight mt-1">€{fleetWinsData.topEarnerRevenue.toLocaleString()}</h2>
              <p className="text-[11px] text-slate-400">za posledných 30 dní</p>
            </div>
            <div className="text-center py-2">
              <span className="text-2xl">🚗</span>
              <p className="text-sm font-black text-white uppercase tracking-wide mt-1 truncate">{fleetWinsData.topEarnerName}</p>
            </div>
            <div className="text-[11px] text-amber-400/80 font-semibold flex justify-between items-center border-t border-amber-500/10 pt-3">
              <span>Top model</span>
              <span>{fleetWinsData.topEarnerDaysRented} dní v prenájme</span>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-slate-900/80 flex flex-col justify-between h-[280px]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Celkové zárobky</p>
              <DollarSign size={20} className="text-emerald-400" />
            </div>
            <div className="text-center my-auto">
              <h2 className="text-4xl font-black text-white tracking-tight">€{fleetWinsData.totalBusinessRevenue.toLocaleString()}</h2>
              <p className="text-xs text-slate-400 mt-2">Zarobené od spustenia biznisu</p>
            </div>
            <div className="text-[11px] text-emerald-400/80 font-semibold border-t border-emerald-500/10 pt-3 text-center">
              <span>Overený obrat (iba schválené)</span>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[280px]">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Najčastejšie rezervované auto</p>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1 truncate">{fleetWinsData.mostBookedCar}</h2>
            </div>
            <div className="text-center py-4"><span className="text-3xl">🚙</span></div>
            <div className="text-xs text-slate-400 flex justify-between items-center border-t border-white/5 pt-3">
              <span className="font-bold text-white">{fleetWinsData.mostBookedCount} rezervácií</span>
              <span>schválených</span>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[280px]">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Najväčšia rezervácia histórie</p>
              <h2 className="text-4xl font-black text-white tracking-tight mt-1">€{fleetWinsData.largestBookingAmount.toLocaleString()}</h2>
            </div>
            <div className="text-center py-4"><span className="text-3xl">🏆</span></div>
            <div className="text-xs text-slate-400 border-t border-white/5 pt-3 text-center">
              <span>Najvyššia schválená transakcia</span>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[280px]">
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Štatistiky tento týždeň</p></div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl text-xs">
                <span className="text-slate-400">Obrat</span><span className="font-black text-white">€{fleetWinsData.weekRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl text-xs">
                <span className="text-slate-400">Prenájmy</span><span className="font-black text-white">{fleetWinsData.weekRentalsCount}</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl text-xs">
                <span className="text-slate-400">Noví zákazníci</span><span className="font-black text-white">{fleetWinsData.weekNewCustomersCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}