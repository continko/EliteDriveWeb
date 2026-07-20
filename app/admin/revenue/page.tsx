"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  FileText, Receipt, ArrowDownToLine,
  CheckCircle2, Loader2, Upload as UploadIcon,
  Landmark, Fuel, Wrench, MoreHorizontal, Calendar
} from "lucide-react";
import JSZip from "jszip"; // Importujeme knižnicu

export default function RevenuePage() {
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [zipping, setZipping] = useState(false); // State pre sťahovanie ZIPu
  
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

    if (!error && data) setAllDocuments(data);
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
        // Pridáme súbor do ZIPu (Kategória_Názov)
        zip.file(`${doc.category}_${doc.name}`, blob);
      });

      await Promise.all(downloadPromises);
      
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `Podklady_${selectedMonth}.zip`;
      link.click();
    } catch (error) {
      console.error("Chyba pri vytváraní ZIP:", error);
      alert("Nepodarilo sa vytvoriť ZIP súbor.");
    } finally {
      setZipping(false);
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
      await fetchDocuments();

    } catch (error: any) {
      alert("Chyba: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 text-left font-urbanist text-white">
      
      {/* HEADER + UPLOAD UI */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em] mb-2">Accounting Hub</p>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Podklady</h1>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Účtovné obdobie:</p>
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 w-fit backdrop-blur-md">
              {lastMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${
                    selectedMonth === m 
                    ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 scale-105" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-[2.5rem] border border-white/5 backdrop-blur-md flex flex-col gap-4 min-w-[340px]">
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-[10px] font-black transition-all ${
                  activeCategory === cat.id ? "bg-sky-500 text-slate-950 shadow-sky-500/20 shadow-lg" : "text-slate-400 hover:text-white bg-white/5"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center justify-center gap-3 px-6 py-5 bg-white text-slate-950 rounded-[1.5rem] text-[11px] font-black uppercase hover:bg-sky-400 transition-all cursor-pointer">
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <UploadIcon size={16} />}
            {uploading ? "Nahrávam..." : `Nahrať pre: ${activeCategory}`}
            <input type="file" onChange={handleUpload} disabled={uploading} accept="image/*,application/pdf" className="hidden" />
          </label>
        </div>
      </div>

      {/* ZOZNAM DOKUMENTOV */}
      <div className="p-8 rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-4">
          <h3 className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2 tracking-widest">
            <Calendar size={14} className="text-sky-500" /> Obdobie: <span className="text-white italic">{selectedMonth}</span>
          </h3>
          
          {/* TLAČIDLO PRE ZIP */}
          {filteredDocs.length > 0 && (
            <button 
              onClick={downloadAsZip}
              disabled={zipping}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
            >
              {zipping ? <Loader2 className="animate-spin" size={12} /> : <ArrowDownToLine size={12} />}
              {zipping ? "Balím súbory..." : "Stiahnuť všetko (.zip)"}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-600 border-b border-white/5">
                <th className="pb-6 text-left pl-4">Dokument</th>
                <th className="pb-6 text-left">Kategória</th>
                <th className="pb-6 text-right pr-4 italic text-sky-500">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="py-5 pl-4 flex items-center gap-4 text-left">
                    <div className="p-2.5 rounded-xl bg-white/5 text-sky-500 group-hover:bg-white group-hover:text-black transition-all">
                      {doc.category === 'PHM' ? <Fuel size={16} /> : 
                       doc.category === 'VÝPIS' ? <Landmark size={16} /> : 
                       doc.category === 'SERVIS' ? <Wrench size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold uppercase tracking-tight truncate max-w-[220px]">{doc.name}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">{doc.size} • {doc.format}</span>
                    </div>
                  </td>
                  <td className="py-5 text-left">
                    <span className="text-[9px] font-black uppercase px-3 py-1 bg-white/5 rounded-lg text-slate-400 border border-white/5 text-nowrap">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-5 text-right pr-4">
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-sky-500 hover:text-slate-950 transition-all">
                      <ArrowDownToLine size={18} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDocs.length === 0 && !loading && (
            <div className="py-24 text-center text-[10px] font-black uppercase opacity-20 tracking-[0.4em]">
              V mesiaci {selectedMonth} nie sú žiadne podklady
            </div>
          )}
        </div>
      </div>
    </div>
  );
}