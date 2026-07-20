"use client";

import { useState, useEffect } from "react";
import { Plus, X, Save, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Žilina");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Brzdy", unit: "ks", initialStock: 0 });

  const warehouses = ["Žilina", "Bratislava", "Budapešť", "Split", "Zágreb", "Dubrovník", "Sarajevo", "Banja Luka", "Atény", "Milano", "Nice", "Lisabon", "Bukurešť", "Belgicko", "Luxembursko", "Zurich", "Ženeva"];

  const categories = {
    "Brzdový systém": ["Brzdy", "Platničky", "Doštičky", "Kotúče", "Strmene", "Kvapaliny"],
    "Prevádzkové kvapaliny": ["Oleje", "Chémie", "Aditíva", "Chladiace zmesi"],
    "Podvozok a kolesá": ["Pneumatiky", "Disky", "Čapy", "Tlmiče"],
    "Motor": ["Filtre", "Sviečky", "Rozvody", "Remene"],
    "Ostatné": ["Doplnky", "Náradie"]
  };

  const fetchInventory = async () => {
    setLoading(true);
    const { data } = await supabase.from('inventory_items').select(`*, stock_levels(quantity, warehouses(name))`);
    if (data) setInventory(data);
    setLoading(false);
  };

  useEffect(() => { fetchInventory(); }, []);

  const updateStock = async (itemId: string, newQuantity: number) => {
    const { data: wh } = await supabase.from('warehouses').select('id').eq('name', selectedWarehouse);
    if (!wh || wh.length === 0) return toast.error("Sklad nenájdený");
    
    const { error } = await supabase.from('stock_levels').upsert({
      item_id: itemId,
      warehouse_id: wh[0].id,
      quantity: newQuantity
    }, { onConflict: 'item_id, warehouse_id' });

    if (error) toast.error("Chyba: " + error.message);
    else { toast.success("Sklad aktualizovaný"); fetchInventory(); }
  };

  const handleAddItem = async () => {
    const { data: product, error: prodErr } = await supabase
      .from('inventory_items')
      .insert([{ name: newItem.name, category: newItem.category, unit: newItem.unit }])
      .select().single();

    if (prodErr) return toast.error("Chyba produktu");

    const { data: wh } = await supabase.from('warehouses').select('id').eq('name', 'Žilina');
    if (wh && wh.length > 0) {
      await supabase.from('stock_levels').insert([{ item_id: product.id, warehouse_id: wh[0].id, quantity: newItem.initialStock }]);
    }
    
    setIsModalOpen(false);
    toast.success("Produkt pridaný");
    fetchInventory();
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-white max-w-6xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Sklad Zásob</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-sky-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-400">
          <Plus size={18} /> Pridať položku
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input className="w-full bg-slate-900 p-3 pl-10 rounded-xl border border-white/10" placeholder="Hľadať produkt..." onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="bg-slate-900 p-3 rounded-xl border border-white/10" value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}>
          {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      <div className="bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
        {filteredInventory.map((item: any) => {
          const stock = item.stock_levels?.find((s: any) => s.warehouses?.name === selectedWarehouse)?.quantity || 0;
          return (
            <div key={item.id} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{item.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-mono font-bold text-lg">{stock} {item.unit}</span>
                <input type="number" defaultValue={stock} className="bg-black w-20 p-2 rounded border border-white/10" onChange={(e) => item.tempQty = parseInt(e.target.value)} />
                <button onClick={() => updateStock(item.id, item.tempQty ?? stock)} className="bg-white/10 p-2 rounded hover:bg-sky-500"><Save size={18} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 p-8 rounded-3xl w-full max-w-sm space-y-4 border border-white/10">
            <h2 className="font-black uppercase">Nová položka</h2>
            <input className="w-full bg-slate-900 p-3 rounded-xl" placeholder="Názov produktu" onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
            <input type="number" className="w-full bg-slate-900 p-3 rounded-xl" placeholder="Množstvo (Žilina)" onChange={(e) => setNewItem({...newItem, initialStock: parseInt(e.target.value) || 0})} />
            <select className="w-full bg-slate-900 p-3 rounded-xl" onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
              {Object.entries(categories).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map(i => <option key={i} value={i}>{i}</option>)}
                </optgroup>
              ))}
            </select>
            <button onClick={handleAddItem} className="w-full py-3 bg-sky-500 rounded-xl font-bold">Uložiť</button>
            <button onClick={() => setIsModalOpen(false)} className="w-full text-slate-500 text-xs uppercase">Zrušiť</button>
          </div>
        </div>
      )}
    </div>
  );
}