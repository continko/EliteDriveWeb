"use client";

import { useEffect, useState } from "react";
import { Search, Users, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomersFromBookings() {
      try {
        // Stiahneme potrebné stĺpce vrátane city, street a zip
        const { data, error } = await supabase
          .from("bookings")
          .select("customer_name, customer_email, customer_phone, street, city, zip, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Chyba pri načítaní zákazníkov z bookings:", error);
        } else if (data) {
          const uniqueMap = new Map();
          data.forEach((booking: any) => {
            const key = booking.customer_email || booking.customer_name;
            if (key && !uniqueMap.has(key)) {
              uniqueMap.set(key, booking);
            }
          });

          setCustomers(Array.from(uniqueMap.values()));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomersFromBookings();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const fullAddress = `${c.street || ""} ${c.city || ""} ${c.zip || ""}`.toLowerCase();
    return (
      c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_phone?.toLowerCase().includes(search.toLowerCase()) ||
      fullAddress.includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 font-urbanist text-left text-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Customers</h1>
          <p className="text-xs text-slate-400 mt-1">Everyone who rents from you — extracted automatically from bookings.</p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300">
          Unikátni zákazníci: <span className="text-sky-400">{customers.length}</span>
        </div>
      </div>

      {/* Vyhľadávanie */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search by name, phone, email, or address..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900/60 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-all"
        />
      </div>

      {/* Zoznam pod sebou */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 mb-4">
            <Users size={24} />
          </div>
          <p className="text-xs font-medium text-slate-400">
            {search ? "Žiadni zákazníci nevyhovujú vyhľadávaniu." : "No customers found in bookings yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((customer, index) => {
            // Zostavenie adresy (Street, City Zip)
            const addressParts = [customer.street, customer.city, customer.zip].filter(Boolean);
            const formattedAddress = addressParts.length > 0 ? addressParts.join(", ") : "Nezadaná adresa";

            return (
              <div 
                key={index} 
                className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all"
              >
                {/* Meno a avatar */}
                <div className="flex items-center gap-3.5 min-w-[220px]">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 font-black flex items-center justify-center text-xs uppercase shrink-0">
                    {customer.customer_name ? customer.customer_name.slice(0, 2) : "C"}
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white">{customer.customer_name || "Neznámy zákazník"}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Z rezervácií</p>
                  </div>
                </div>

                {/* Kontaktné údaje a adresa pod sebou */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Mail size={14} className="text-sky-500 shrink-0" />
                    <span className="truncate">{customer.customer_email || "Nezadaný email"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone size={14} className="text-sky-500 shrink-0" />
                    <span>{customer.customer_phone || "Nezadaný telefón"}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <MapPin size={14} className="text-sky-500 shrink-0" />
                    <span className="truncate" title={formattedAddress}>{formattedAddress}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}