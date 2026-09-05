"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  FileText, ArrowDownToLine,
  Loader2, Upload as UploadIcon,
  Landmark, Fuel, Wrench, MoreHorizontal, Calendar, Trash2
} from "lucide-react";
import { toast } from "react-hot-toast";
import JSZip from "jszip";

export default function RevenuePage() {
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [zipping, setZipping] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [activeCategory, setActiveCategory] = useState("PHM");

  const lastMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().substring(0, 7);
  });

  const CATEGORIES = [
    { id: "PHM", label: "PHM (Bločky)", icon: <Fuel size={14} /> },
    { id: "FAKTÚRA", label: "Faktúry", icon: <FileText size={14} /> },
    { id: "SERVIS", label: "Servis", icon: <Wrench size={14} /> },
    { id: "VÝPIS", label: "Bankové Výpisy", icon: <Landmark size={14} /> },
    { id: "INÉ", label: "Iné", icon: <MoreHorizontal size={14} /> },
  ];

  async function fetchDocuments() {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Chyba pri načítavaní dokumentov");
    } else if (data) {
      setAllDocuments(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const filtered = allDocuments.filter(doc => doc.month === selectedMonth);
    setFilteredDocs(filtered);
  }, [selectedMonth, allDocuments]);

  // --- FUNKCIA NA GENEROVANIE ZIP ---
  const downloadAsZip = async () => {
    if (filteredDocs.length === 0) return;
    
    setZipping(true);
    const zip = new JSZip();
    
    try {
      const downloadPromises = filteredDocs.map(async (doc) => {
        const response = await fetch(doc.file_url);
        const blob = await response.blob();
        zip.file(`${doc.category}_${doc.name}`, blob);
      });

      await Promise.all(downloadPromises);
      
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `Podklady_${selectedMonth}.zip`;
      link.click();
      toast.success("ZIP archív bol úspešne stiahnutý");
    } catch (error) {
      console.error("Chyba pri vytváraní ZIP:", error);
      toast.error("Nepodarilo sa vytvoriť ZIP súbor.");
    } finally {
      setZipping(false);
    }
  };

  // --- VYMAZANIE DOKUMENTU ---
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Naozaj chcete vymazať dokument ${name}?`)) return;

    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      toast.error("Chyba pri mazaní: " + error.message);
    } else {
      toast.success("Dokument bol vymazaný");
      fetchDocuments();
    }
  };

  const handleUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('accounting')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('accounting')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('documents')
        .insert([{
          name: file.name,
          file_url: publicUrl,
          category: activeCategory,
          month: selectedMonth,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          format: fileExt.toUpperCase()
        }]);

      if (dbError) throw dbError;
      toast.success("Dokument úspešne pridaný");
      await fetchDocuments();

    } catch (error: any) {
      toast.error("Chyba: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 text-left font-urbanist text-white max-w-6xl mx-auto">
      
      {/* HLAVIČKA A VÝBER OBDOBIA */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] mb-1">Accounting Hub</p>
            <h1 className="text-3xl font-black italic uppercase tracking-wider text-white">Účtovné Podklady</h1>
            <p className="text-xs text-slate-400 mt-1">Správa bločkov, faktúr a výpisov pre účtovníctvo</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Účtovné obdobie:</p>
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/50 rounded-2xl border border-white/5 w-fit backdrop-blur-md">
              {lastMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedMonth === m 
                    ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 scale-105" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL PRE NAHRÁVANIE */}
        <div className="bg-slate-900/40 p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-xl flex flex-col gap-4 min-w-[320px]">
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl text-[10px] font-black transition-all ${
                  activeCategory === cat.id ? "bg-sky-500 text-slate-950 shadow-sky-500/20 shadow-lg" : "text-slate-400 hover:text-white bg-white/5 border border-white/5"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-sky-400 transition-all cursor-pointer shadow-lg shadow-white/5">
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <UploadIcon size={16} />}
            {uploading ? "Nahrávam..." : `Nahrať pre: ${activeCategory}`}
            <input type="file" onChange={handleUpload} disabled={uploading} accept="image/*,application/pdf" className="hidden" />
          </label>
        </div>
      </div>

      {/* ZOZNAM DOKUMENTOV */}
      <div className="p-6 md:p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Calendar size={15} className="text-sky-400" /> Obdobie: <span className="text-white font-mono">{selectedMonth}</span>
          </div>
          
          {filteredDocs.length > 0 && (
            <button 
              onClick={downloadAsZip}
              disabled={zipping}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-slate-950 transition-all disabled:opacity-50"
            >
              {zipping ? <Loader2 className="animate-spin" size={14} /> : <ArrowDownToLine size={14} />}
              {zipping ? "Balím súbory..." : "Stiahnuť všetko (.zip)"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">Načítavam účtovné podklady...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
            <FileText size={32} className="text-slate-600 mb-1" />
            V mesiaci {selectedMonth} nie sú žiadne nahraté podklady.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 hover:bg-white/[0.02] transition-all gap-4 px-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 text-sky-400 border border-white/5">
                    {doc.category === 'PHM' ? <Fuel size={18} /> : 
                     doc.category === 'VÝPIS' ? <Landmark size={18} /> : 
                     doc.category === 'SERVIS' ? <Wrench size={18} /> : <FileText size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white truncate max-w-[280px] md:max-w-md">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-lg uppercase tracking-wider font-semibold">
                        {doc.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{doc.size} • {doc.format}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <a 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-sky-500 hover:text-slate-950 transition-all text-xs font-bold text-slate-300 border border-white/5"
                    title="Stiahnuť súbor"
                  >
                    <ArrowDownToLine size={16} /> Stiahnuť
                  </a>
                  <button 
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500 hover:text-white transition-all text-slate-400 border border-white/5"
                    title="Vymazať dokument"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}