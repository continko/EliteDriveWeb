"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Search, Package2, Layers } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Žilina");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Brzdy", unit: "ks", initialStock: 0 });
  const [tempQuantities, setTempQuantities] = useState<{ [key: string]: number }>({});

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
    const { data, error } = await supabase.from('inventory_items').select(`*, stock_levels(quantity, warehouses(name))`);
    if (error) {
      toast.error("Chyba pri načítavaní skladu");
    } else if (data) {
      setInventory(data);
    }
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
    else { 
      toast.success("Sklad bol aktualizovaný"); 
      fetchInventory(); 
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return toast.error("Zadajte názov produktu");

    const { data: product, error: prodErr } = await supabase
      .from('inventory_items')
      .insert([{ name: newItem.name, category: newItem.category, unit: newItem.unit }])
      .select().single();

    if (prodErr) return toast.error("Chyba pri vytváraní produktu");

    const { data: wh } = await supabase.from('warehouses').select('id').eq('name', 'Žilina');
    if (wh && wh.length > 0 && product) {
      await supabase.from('stock_levels').insert([{ item_id: product.id, warehouse_id: wh[0].id, quantity: newItem.initialStock }]);
    }
    
    setIsModalOpen(false);
    setNewItem({ name: "", category: "Brzdy", unit: "ks", initialStock: 0 });
    toast.success("Produkt úspešne pridaný");
    fetchInventory();
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20 text-left font-urbanist text-white max-w-6xl mx-auto">
      
      {/* HLAVIČKA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-wider text-white">Sklad Zásob</h1>
          <p className="text-xs text-slate-400 mt-1">Správa náhradných dielov a inventáru naprieč pobočkami</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
        >
          <Plus size={16} /> Pridať položku
        </button>
      </div>

      {/* VYHĽADÁVANIE A VÝBER SKLADU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
          <input 
            className="w-full bg-slate-900/50 p-3.5 pl-12 rounded-2xl border border-white/5 text-xs text-white focus:outline-none focus:border-sky-500/50 transition-all" 
            placeholder="Hľadať produkt podľa názvu alebo kategórie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 px-4">
          <Layers size={16} className="text-sky-400" />
          <select 
            className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer py-2" 
            value={selectedWarehouse} 
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {warehouses.map(w => <option key={w} value={w} className="bg-slate-900 text-white">{w}</option>)}
          </select>
        </div>
      </div>

      {/* FILTROVANIE KATEGÓRIÍ */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button 
          onClick={() => setSelectedCategory("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === "ALL" ? "bg-sky-500 text-slate-950" : "bg-slate-900/40 text-slate-400 hover:text-white border border-white/5"
          }`}
        >
          Všetky kategórie
        </button>
        {Object.values(categories).flat().map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat ? "bg-sky-500 text-slate-950" : "bg-slate-900/40 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ZOZNAM POLOŽIEK */}
      <div className="bg-slate-900/30 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Načítavam skladové zásoby...</div>
        ) : filteredInventory.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
            <Package2 size={32} className="text-slate-600 mb-1" />
            Nenašli sa žiadne položky pre vybraný sklad alebo filter.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredInventory.map((item: any) => {
              const stock = item.stock_levels?.find((s: any) => s.warehouses?.name === selectedWarehouse)?.quantity || 0;
              const currentTempQty = tempQuantities[item.id] !== undefined ? tempQuantities[item.id] : stock;

              return (
                <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 hover:bg-white/[0.02] transition-all gap-4">
                  <div>
                    <p className="font-bold text-sm text-white">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-lg uppercase tracking-wider font-semibold">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Sklad: {selectedWarehouse}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-emerald-400 font-mono font-black text-base">{stock}</span>
                      <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={currentTempQty} 
                        className="bg-slate-950 w-20 p-2 text-center rounded-xl border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-sky-500" 
                        onChange={(e) => setTempQuantities({ ...tempQuantities, [item.id]: parseInt(e.target.value) || 0 })} 
                      />
                      <button 
                        onClick={() => updateStock(item.id, currentTempQty)} 
                        className="bg-white/5 hover:bg-sky-500 hover:text-slate-950 p-2.5 rounded-xl border border-white/10 transition-all text-slate-300"
                        title="Uložiť nové množstvo"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODÁLNE OKNO PRE PRIDANIE POLOŽKY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md space-y-5 shadow-2xl">
            <div>
              <h2 className="text-lg font-black uppercase italic tracking-wider text-white">Nová položka skladu</h2>
              <p className="text-xs text-slate-400 mt-0.5">Pridajte nový náhradný diel do inventáru</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Názov produktu</label>
                <input 
                  className="w-full bg-slate-950 p-3.5 rounded-2xl border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500" 
                  placeholder="napr. Brzdové platničky Brembo" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Počiatočné množstvo (pre Žilina)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-950 p-3.5 rounded-2xl border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500 font-mono" 
                  value={newItem.initialStock}
                  onChange={(e) => setNewItem({...newItem, initialStock: parseInt(e.target.value) || 0})} 
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Kategória</label>
                <select 
                  className="w-full bg-slate-950 p-3.5 rounded-2xl border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer" 
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  {Object.entries(categories).map(([group, items]) => (
                    <optgroup key={group} label={group} className="bg-slate-950 text-slate-400">
                      {items.map(i => <option key={i} value={i} className="bg-slate-900 text-white">{i}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Jednotka</label>
                <select 
                  className="w-full bg-slate-950 p-3.5 rounded-2xl border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer" 
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                >
                  <option value="ks">ks (Kusy)</option>
                  <option value="l">l (Litre)</option>
                  <option value="sada">sada (Sada)</option>
                  <option value="bal">bal (Balenie)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleAddItem} 
                className="flex-1 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20"
              >
                Uložiť položku
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border border-white/5"
              >
                Zrušiť
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}