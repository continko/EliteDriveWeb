"use client";

import React, { useState, useEffect } from 'react';
import { User, MapPin, ArrowRight, Building2, CreditCard, ShieldCheck, Loader2, Users, Check, ChevronLeft, Gauge, Camera, FileText, Wallet, Calendar, Lock, MessageCircle, HelpCircle, X } from 'lucide-react';
import { useLang } from "@/context/LanguageContext";
import { parseISO, format } from 'date-fns';
import { toast } from 'react-hot-toast';

const FormInput = ({ name, value, onChange, placeholder, type = "text", className = "", isLoading = false }: { 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  placeholder: string, 
  type?: string,
  className?: string,
  isLoading?: boolean
}) => (
  <div className={`relative ${className}`}>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-slate-950 border border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all text-white placeholder:text-slate-600`}
    />
    {isLoading && (
      <div className="absolute right-3 top-3.5 animate-spin text-sky-500">
        <Loader2 size={18} />
      </div>
    )}
  </div>
);

export default function CheckoutPage() {
  const { lang } = useLang();
  const [step, setStep] = useState(2);
  const [res, setRes] = useState<any>(null);
  const [isCompany, setIsCompany] = useState(false);
  const [isLoadingFinstat, setIsLoadingFinstat] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'cash' | 'crypto'>('card');
  
  const [insuranceType, setInsuranceType] = useState<'basic' | 'standard'>('basic');
  const [useFlexiDeposit, setUseFlexiDeposit] = useState(false);
  const [hasSecondDriver, setHasSecondDriver] = useState(false);
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [opFile, setOpFile] = useState<File | null>(null);
  const [vpFile, setVpFile] = useState<File | null>(null);

  // Stavy pre modálne okná
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completedReservationData, setCompletedReservationData] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', zip: '',
    compName: '', compIco: '', compDic: '', compIcdph: '',
    opNumber: '', birthNumber: '', vpNumber: ''
  });

  useEffect(() => {
    const data = sessionStorage.getItem('pendingReservation');
    if (data) {
      setRes(JSON.parse(data));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'compIco' && value.length === 8 && lang === 'sk') {
      fetchFinstatData(value);
    }
  };

  const fetchFinstatData = async (ico: string) => {
    setIsLoadingFinstat(true);
    try {
      const response = await fetch(`/api/finstat?ico=${ico}`);
      const data = await response.json();
      if (data && !data.error) {
        setFormData(prev => ({
          ...prev,
          compName: data.Name || '',
          compDic: data.Dic || '',
          compIcdph: data.IcDPH || '',
          street: `${data.Street || ''} ${data.StreetNumber || ''}`.trim(),
          city: data.City || '',
          zip: data.ZipCode || ''
        }));
        toast.success(ui.toastFinstat);
      }
    } catch (err) { console.error(err); } finally { setIsLoadingFinstat(false); }
  };

  const ui = {
    sk: { 
      step2: "Poistenie a služby", step3: "Osobné údaje", next: "Pokračovať", finish: "Záväzne rezervovať", 
      address: "Kontaktná adresa", company: "Firemné údaje", idData: "Identifikačné údaje",
      insBasic: "Základné", insStandard: "Štandard", insIncluded: "V cene",
      flexiTitle: "Flexi Depozit", flexiDesc: "Zníženie depozitu na fixných 800 €",
      secondDriver: "Druhý vodič",
      participation: "Spoluúčasť", repairDays: "Počas opravy",
      rent: "Prenájom vozidla", payment: "Spôsob platby",
      details: "Detaily prenájmu", pickup: "Vyzdvihnutie", return: "Vrátenie", limit: "Celkový limit: ",
      docs: "Doklady (OP a VP)", isCompLabel: "Objednávam na firmu", privatePerson: "Súkromná osoba", companyPerson: "Firma / Živnosť",
      methods: { card: "Kartou", transfer: "Prevodom", cash: "Hotovosť", crypto: "Krypto (-10%)" },
      placeholders: {
        firstName: "Meno *", lastName: "Priezvisko *", email: "Email *", phone: "Telefón *",
        street: "Ulica a číslo *", zip: "PSČ *", city: "Mesto *", opNumber: "Číslo OP *",
        vpNumber: "Číslo VP *", birthNumber: "Rodné číslo *", compIco: "IČO *",
        compName: "Obchodné meno *", compDic: "DIČ *", compIcdph: "IČ DPH"
      },
      labels: { firstName: 'Meno', lastName: 'Priezvisko', email: 'Email', phone: 'Telefón', street: 'Ulica', city: 'Mesto', zip: 'PSČ', opNumber: 'Číslo OP', vpNumber: 'Číslo VP', birthNumber: 'Rodné číslo', compIco: 'IČO', compName: 'Obchodné meno' },
      toastFinstat: "Údaje firmy načítané", submitting: "Odosielam...", success: "Rezervácia úspešná!", error: "Chyba pri odosielaní.", fillField: "Vyplňte",
      config: "Tvoja konfigurácia", total: "Celková suma", vat: "vč. DPH", back: "Späť", days: "dní", uploadOp: "Fotka OP", uploadVp: "Fotka VP", uploadLimit: "PNG, JPG do 5MB",
      termsError: "Musíte súhlasiť s obchodnými podmienkami.",
      termsText: "Súhlasím so Všeobecnými obchodnými podmienkami a Zásadami ochrany osobných údajov.",
      depositModalTitle: "Ako funguje depozit?",
      depositModalText: "Depozit (kaucia) slúži ako zábezpeka pre prípad poškodenia vozidla. Pri platbe kartou sa suma iba autorizuje (zablokuje), peniaze vám neodchádzajú z účtu. Ihneď po ukončení prenájmu a bezproblémovej kontrole vozidla blokáciu okamžite uvoľňujeme (zvyčajne do 1–3 pracovných dní)."
    },
    en: { 
      step2: "Insurance & Services", step3: "Personal Details", next: "Continue", finish: "Book Now", 
      address: "Contact Address", company: "Company Details", idData: "Identification",
      insBasic: "Basic", insStandard: "Standard", insIncluded: "Included",
      flexiTitle: "Flexi Deposit", flexiDesc: "Reduce deposit to fixed 800 €",
      secondDriver: "Second Driver",
      participation: "Deductible", repairDays: "During repair",
      rent: "Car Rental", payment: "Payment Method",
      details: "Rental Details", pickup: "Pickup", return: "Return", limit: "Total KM Limit",
      docs: "Documents", isCompLabel: "Order for company", privatePerson: "Private Person", companyPerson: "Company",
      methods: { card: "Card", transfer: "Transfer", cash: "Cash", crypto: "Crypto (-10%)" },
      placeholders: { firstName: "First Name *", lastName: "Last Name *", email: "Email *", phone: "Phone *", street: "Street *", zip: "ZIP *", city: "City *", opNumber: "ID Number *", vpNumber: "DL Number *", birthNumber: "Birth Number *", compIco: "IČO *", compName: "Company Name *" },
      labels: { firstName: 'First Name', lastName: 'Last Name', email: 'Email', phone: 'Phone', street: 'Street', city: 'City', zip: 'ZIP', opNumber: 'ID Number', vpNumber: 'DL Number', birthNumber: 'Birth Number', compIco: 'IČO', compName: 'Company Name' },
      toastFinstat: "Company data loaded", submitting: "Submitting...", success: "Reservation sent!", error: "Error occurred.", fillField: "Fill",
      config: "Configuration", total: "Total Price", vat: "incl. VAT", back: "Back", days: "days", uploadOp: "ID Photo", uploadVp: "DL Photo", uploadLimit: "5MB max",
      termsError: "You must agree to the Terms & Conditions.",
      termsText: "I agree to the Terms & Conditions and Privacy Policy.",
      depositModalTitle: "How does the deposit work?",
      depositModalText: "The deposit acts as a security guarantee. When paid by card, the amount is only authorized (held), money does not leave your account. Immediately after the rental and successful vehicle inspection, the hold is released (typically within 1-3 business days)."
    }
  }[lang as 'sk'|'en'] || ({} as any);

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'zip', 'opNumber', 'vpNumber', 'birthNumber'];
    if (isCompany) requiredFields.push('compIco', 'compName');
    const missing = requiredFields.find(field => !formData[field as keyof typeof formData]);
    if (missing) {
      toast.error(`${ui.fillField}: ${ui.labels[missing as keyof typeof ui.labels] || missing}`);
      return false;
    }
    if (!agreedToTerms) {
      toast.error(ui.termsError);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const loadingToast = toast.loading(ui.submitting);
    setIsSubmitting(true);
    
    // --- SEM PRIDAJ TENTO RIADOK NA GENEROVANIE VS ---
    const generatedVS = Math.floor(100000 + Math.random() * 900000).toString();

    const payload = { 
      reservation: res, 
      customer: formData, 
      isCompany, 
      paymentMethod, 
      extras: { insuranceType, useFlexiDeposit, hasSecondDriver }, 
      finalPrice, 
      displayDeposit,
      variableSymbol: generatedVS, // <--- PRIDANÉ DO PAYLOADU (odošle sa na API/backend)
      hasOpFile: !!opFile,
      hasVpFile: !!vpFile
    };

    try {
      const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (response.ok) {
        toast.dismiss(loadingToast);
        setCompletedReservationData({
          variableSymbol: generatedVS, // <--- TU SA POUŽIJE RONAKÝ VS PRE MODÁLNE OKNO
          finalPrice,
          paymentMethod
        });
        setIsSuccessModalOpen(true);
      } else throw new Error();
    } catch { toast.error(ui.error, { id: loadingToast }); } finally { setIsSubmitting(false); }
  };

  if (!res) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white italic">Loading...</div>;

  const daysCount = res.rentalDays || 1;
  const basePrice = Number(res.totalPrice) || 0;
  const insurancePrice = insuranceType === 'standard' ? daysCount * 18 : 0;
  const flexiPrice = useFlexiDeposit ? daysCount * 25 : 0;
  const driverPrice = hasSecondDriver ? 20 : 0;
  
  const subTotal = basePrice + insurancePrice + flexiPrice + driverPrice;
  const cryptoDiscount = paymentMethod === 'crypto' ? subTotal * 0.1 : 0;
  const finalPrice = subTotal - cryptoDiscount;
  const kmLimit = res.totalKmLimit || (daysCount * 200);
  const displayDeposit = useFlexiDeposit ? 800 : (res.deposit || 3000);

  const repairPriceBasic = res.repairPriceBasic || 97;
  const repairPriceStandard = res.repairPriceStandard || 48;
  const participationBasic = res.participationBasic || "10% (min. 1 000 €)";
  const participationStandard = res.participationStandard || "5% (min. 500 €)";

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 pb-28 md:pb-12 px-4 md:px-8 relative">
      
      {/* WHATSAPP FLOAT BUTTON */}
      <a 
        href="https://wa.me/421900000000" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-emerald-500 text-slate-950 p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 font-black uppercase text-xs"
        title="Potrebujete poradit? Napíšte nám na WhatsApp"
      >
        <MessageCircle size={24} />
      </a>

      {/* MODAL OKNO PRE DEPOZIT */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowDepositModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 text-sky-400">
              <HelpCircle size={24} />
              <h3 className="text-xl font-black italic uppercase">{ui.depositModalTitle}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">{ui.depositModalText}</p>
            <button onClick={() => setShowDepositModal(false)} className="w-full py-3.5 bg-sky-500 text-slate-950 rounded-xl font-black uppercase tracking-wider text-xs cursor-pointer">
              Rozumiem
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL PO ÚSPEŠNEJ REZERVÁCII S REÁLNYMI ÚDAJMI */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-lg w-full relative space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase text-white">Rezervácia bola úspešná!</h3>
              <p className="text-xs text-slate-400">Potvrdenie a detailné pokyny sme vám odoslali na email ({formData.email}).</p>
            </div>

            {/* AK ZVOLIL PREVOD - TU SI UPRAV TVOJ REÁLNY IBAN */}
            {completedReservationData?.paymentMethod === 'transfer' && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-xs font-black uppercase text-sky-400 tracking-wider">Údaje pre bankový prevod</h4>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-slate-500">IBAN:</span>
                  <span className="font-bold text-white font-mono">SK31 1111 0000 0012 3456 7890</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-slate-500">BIC / SWIFT:</span>
                  <span className="font-bold text-white font-mono">SUBASKBX</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-slate-500">Variabilný symbol:</span>
                  <span className="font-bold text-white font-mono">{completedReservationData.variableSymbol}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">Suma na úhradu:</span>
                  <span className="font-bold text-emerald-400">{completedReservationData.finalPrice.toLocaleString()} €</span>
                </div>
              </div>
            )}

            {/* AK ZVOLIL CRYPTO - TU SI UPRAV TVOJU REÁLNU CRYPTO ADRESU */}
            {completedReservationData?.paymentMethod === 'crypto' && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Platba v kryptomene (USDC / USDT)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pošlite presnú sumu <strong className="text-white">{completedReservationData.finalPrice.toLocaleString()} €</strong> ekvivalent v USDC/USDT (zohľadnená 10% zľava) na nasledovnú sieť Polygon / Arbitrum:
                </p>
                
                <div className="bg-slate-900 p-4 rounded-xl border border-white/5 text-center space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-black">Krypto adresa peňaženky:</p>
                  <p className="text-xs font-mono text-sky-400 break-all bg-slate-950 p-2 rounded-lg border border-white/5">
                    0xTvojaSkutocnaAdresaPeniazenkySem...
                  </p>
                </div>
              </div>
            )}

            {/* AK ZVOLIL KARTOU ALEBO HOTOVOSŤ */}
            {(completedReservationData?.paymentMethod === 'card' || completedReservationData?.paymentMethod === 'cash') && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 text-center space-y-2">
                <p className="text-xs text-slate-300">Platba prebehne pri preberaní vozidla, prípadne vás budeme kontaktovať pre dokončenie.</p>
              </div>
            )}

            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full py-4 bg-sky-500 text-slate-950 rounded-xl font-black uppercase tracking-wider text-xs hover:bg-sky-400 transition-all cursor-pointer"
            >
              Späť na hlavnú stránku
            </button>

          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          {/* Progress bar */}
          <div className="flex gap-3 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-sky-500' : 'bg-white/10'}`} />
            ))}
          </div>

          {/* STEP 2 - INSURANCE */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-sky-400">{ui.step2}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BASIC */}
                <div onClick={() => setInsuranceType('basic')} 
                  className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden ${insuranceType === 'basic' ? "border-sky-500 bg-sky-500/5" : "border-white/5 bg-slate-900/40"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${insuranceType === 'basic' ? "bg-sky-500 text-slate-950" : "bg-white/5 text-slate-500"}`}><ShieldCheck size={24} /></div>
                    <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full">{ui.insIncluded}</span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase">{ui.insBasic}</h3>
                  <div className="space-y-2 mt-4">
                    <p className="text-[11px] text-slate-400 flex items-center gap-2"><Check size={12} className="text-sky-500"/> {ui.participation}: {participationBasic}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2"><Check size={12} className="text-sky-500"/> PZP poistenie</p>
                    <p className="text-[11px] text-rose-400/80 flex items-center gap-2 font-bold italic ">{ui.repairDays}: +{repairPriceBasic} € / deň</p>
                  </div>
                </div>

                {/* STANDARD */}
                <div onClick={() => setInsuranceType('standard')} 
                  className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden ${insuranceType === 'standard' ? "border-sky-500 bg-sky-500/5 shadow-lg shadow-sky-500/10" : "border-white/5 bg-slate-900/40"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${insuranceType === 'standard' ? "bg-sky-500 text-slate-950" : "bg-white/5 text-slate-500"}`}><ShieldCheck size={24} /></div>
                    <span className="text-lg font-black italic text-sky-400">+18 €<span className="text-[10px] text-slate-500 ml-1">/ deň</span></span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase">{ui.insStandard}</h3>
                  <div className="space-y-2 mt-4">
                    <p className="text-[11px] text-sky-400 font-bold flex items-center gap-2"><Check size={12} /> {ui.participation}: {participationStandard}</p>
                    <p className="text-[11px] text-sky-400 font-bold flex items-center gap-2"><Check size={12} /> Asistenčná služba 24/7</p>
                    <p className="text-[11px] text-amber-400 flex items-center gap-2 font-bold italic">{ui.repairDays}: +{repairPriceStandard} € / deň</p>
                  </div>
                </div>
              </div>

              {/* Flexi Deposit Toggle */}
              <div onClick={() => setUseFlexiDeposit(!useFlexiDeposit)} 
                className={`p-8 rounded-[3rem] border-2 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center gap-6 ${useFlexiDeposit ? "border-emerald-500 bg-emerald-500/5" : "border-white/5 bg-slate-900/20"}`}>
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[2rem] transition-all ${useFlexiDeposit ? "bg-emerald-500 text-slate-950 rotate-6" : "bg-white/5 text-slate-500"}`}><Wallet size={32} /></div>
                  <div>
                    <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${useFlexiDeposit ? "text-emerald-500" : "text-white"}`}>{ui.flexiTitle}</h3>
                    <p className="text-xs text-slate-500 italic">{ui.flexiDesc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-2xl font-black italic">+25 €<span className="text-[10px] text-slate-500 ml-1">/ deň</span></p>
                  <div className={`w-14 h-8 rounded-full p-1 transition-all ${useFlexiDeposit ? "bg-emerald-500" : "bg-slate-800"}`}>
                    <div className={`w-6 h-6 bg-white rounded-full transition-all transform ${useFlexiDeposit ? "translate-x-6" : "translate-x-0"}`} />
                  </div>
                </div>
              </div>

              <div onClick={() => setHasSecondDriver(!hasSecondDriver)} 
                className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex justify-between items-center group ${hasSecondDriver ? "border-amber-500 bg-amber-500/10" : "border-white/5 bg-slate-900/50 hover:border-white/20"}`}>
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${hasSecondDriver ? "bg-amber-500 text-slate-950" : "bg-white/5 text-slate-500"}`}><Users size={20} /></div>
                    <p className={`font-black italic uppercase text-sm ${hasSecondDriver ? "text-amber-500" : ""}`}>{ui.secondDriver}</p>
                 </div>
                 <p className="font-black italic text-lg">+20€</p>
              </div>
            </div>
          )}

          {/* STEP 3 - DATA */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
              <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                <button onClick={() => setIsCompany(false)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase italic transition-all cursor-pointer ${!isCompany ? "bg-sky-500 text-slate-950" : "text-slate-500 hover:text-white"}`}>{ui.privatePerson}</button>
                <button onClick={() => setIsCompany(true)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase italic transition-all cursor-pointer ${isCompany ? "bg-sky-500 text-slate-950" : "text-slate-500 hover:text-white"}`}>{ui.companyPerson}</button>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3"><User className="text-sky-500" size={24} /><h3 className="text-xl font-black italic uppercase tracking-tight">{ui.step3}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput name="firstName" placeholder={ui.placeholders.firstName} value={formData.firstName} onChange={handleInputChange} />
                  <FormInput name="lastName" placeholder={ui.placeholders.lastName} value={formData.lastName} onChange={handleInputChange} />
                  <FormInput name="email" type="email" placeholder={ui.placeholders.email} value={formData.email} onChange={handleInputChange} />
                  <FormInput name="phone" type="tel" placeholder={ui.placeholders.phone} value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>

              {isCompany && (
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-3"><Building2 className="text-sky-500" size={24} /><h3 className="text-xl font-black italic uppercase tracking-tight">{ui.company}</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="compIco" placeholder={ui.placeholders.compIco} value={formData.compIco} onChange={handleInputChange} isLoading={isLoadingFinstat} />
                    <FormInput name="compName" placeholder={ui.placeholders.compName} value={formData.compName} onChange={handleInputChange} />
                    <FormInput name="compDic" placeholder={ui.placeholders.compDic} value={formData.compDic} onChange={handleInputChange} />
                    <FormInput name="compIcdph" placeholder={ui.placeholders.compIcdph} value={formData.compIcdph} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3"><MapPin className="text-sky-500" size={24} /><h3 className="text-xl font-black italic uppercase tracking-tight">{ui.address}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput className="md:col-span-2" name="street" placeholder={ui.placeholders.street} value={formData.street} onChange={handleInputChange} />
                  <FormInput name="zip" placeholder={ui.placeholders.zip} value={formData.zip} onChange={handleInputChange} />
                  <FormInput className="md:col-span-3" name="city" placeholder={ui.placeholders.city} value={formData.city} onChange={handleInputChange} />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3"><FileText className="text-sky-500" size={24} /><h3 className="text-xl font-black italic uppercase tracking-tight">{ui.docs}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput name="opNumber" placeholder={ui.placeholders.opNumber} value={formData.opNumber} onChange={handleInputChange} />
                  <FormInput name="vpNumber" placeholder={ui.placeholders.vpNumber} value={formData.vpNumber} onChange={handleInputChange} />
                  <FormInput name="birthNumber" placeholder={ui.placeholders.birthNumber} value={formData.birthNumber} onChange={handleInputChange} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className={`group relative border-2 border-dashed rounded-3xl p-6 transition-all flex flex-col items-center gap-2 cursor-pointer ${opFile ? 'border-sky-500 bg-sky-500/10' : 'border-white/10 hover:border-sky-500/50 hover:bg-sky-500/5'}`}>
                    <Camera className={opFile ? "text-sky-400" : "text-slate-600 group-hover:text-sky-500"} size={28} />
                    <div className="text-center">
                      <p className="text-xs font-black uppercase italic">{opFile ? opFile.name : ui.uploadOp}</p>
                      <span className="text-[10px] text-slate-500">{opFile ? "Úspešne nahraté" : ui.uploadLimit}</span>
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*" 
                      onChange={(e) => { if(e.target.files?.[0]) setOpFile(e.target.files[0]); }} 
                    />
                  </div>

                  <div className={`group relative border-2 border-dashed rounded-3xl p-6 transition-all flex flex-col items-center gap-2 cursor-pointer ${vpFile ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5'}`}>
                    <Camera className={vpFile ? "text-amber-400" : "text-slate-600 group-hover:text-amber-500"} size={28} />
                    <div className="text-center">
                      <p className="text-xs font-black uppercase italic">{vpFile ? vpFile.name : ui.uploadVp}</p>
                      <span className="text-[10px] text-slate-500">{vpFile ? "Úspešne nahraté" : ui.uploadLimit}</span>
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*" 
                      onChange={(e) => { if(e.target.files?.[0]) setVpFile(e.target.files[0]); }} 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3"><CreditCard className="text-sky-500" size={24} /><h3 className="text-xl font-black italic uppercase tracking-tight">{ui.payment}</h3></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['card', 'transfer', 'cash', 'crypto'].map((m) => (
                    <button key={m} onClick={() => setPaymentMethod(m as any)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative cursor-pointer ${paymentMethod === m ? "border-sky-500 bg-sky-500/10" : "border-white/5 bg-slate-950 hover:border-white/25"}`}>
                      {m === 'crypto' && <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow"> -10% </span>}
                      <span className="text-[10px] font-black uppercase italic">{ui.methods[m as keyof typeof ui.methods]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-start gap-3 cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                <input 
                  type="checkbox" 
                  checked={agreedToTerms} 
                  onChange={() => setAgreedToTerms(!agreedToTerms)} 
                  className="mt-1 accent-sky-500 w-4 h-4 cursor-pointer"
                />
                <label className="text-xs text-slate-400 select-none cursor-pointer leading-relaxed">
                  {ui.termsText}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR SUMÁR */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-slate-900 border border-white/10 rounded-[3rem] p-8 space-y-6 shadow-2xl">
            <img src={res.image} alt={res.name} className="w-full aspect-video object-contain bg-slate-950 rounded-[2rem] p-4 border border-white/5" />
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">{res.brand} <span className="text-white/30">{res.name}</span></h2>
              
              <div className={`p-4 rounded-2xl border flex justify-between items-center ${useFlexiDeposit ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5 bg-white/5"}`}>
                <div className="flex items-center gap-2">
                   <Wallet size={14} className={useFlexiDeposit ? "text-emerald-500" : "text-slate-500"} />
                   <span className="text-[10px] font-black uppercase text-slate-500">Depozit</span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-black italic block ${useFlexiDeposit ? "text-emerald-500" : "text-white"}`}>{displayDeposit.toLocaleString()} €</span>
                  <button onClick={() => setShowDepositModal(true)} className="text-[10px] text-sky-400 underline hover:text-sky-300 transition-colors cursor-pointer">
                    Ako funguje depozit?
                  </button>
                </div>
              </div>

              {/* Detaily prenájmu */}
              <div className="space-y-3 p-5 rounded-[2rem] bg-white/5 border border-white/5">
                <div className="flex gap-3 items-start border-b border-white/5 pb-3">
                  <div className="p-1.5 bg-sky-500/20 rounded-lg text-sky-500"><MapPin size={14} /></div>
                  <div>
                    <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider mb-0.5">{ui.pickup}</p>
                    <p className="text-[12px] font-black text-white italic">{res.pickupLoc}</p>
                    <p className="text-[11px] font-bold text-sky-400/80">{format(parseISO(res.from), 'dd.MM.yyyy')} o {res.pickupTime}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start border-b border-white/5 pb-3">
                  <div className="p-1.5 bg-rose-500/20 rounded-lg text-rose-500"><Calendar size={14} /></div>
                  <div>
                    <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider mb-0.5">{ui.return}</p>
                    <p className="text-[12px] font-black text-white italic">{res.returnLoc || res.pickupLoc}</p>
                    <p className="text-[11px] font-bold text-rose-400/80">{format(parseISO(res.to), 'dd.MM.yyyy')} o {res.returnTime || res.pickupTime}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-500"><Gauge size={14} /></div>
                  <div><p className="text-[12px] font-black text-white italic">{ui.limit}{kmLimit}KM</p></div>
                </div>
              </div>
            </div>

            <div className="py-4 border-b border-white/5 space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wide"><span>{ui.rent} ({daysCount} {ui.days})</span><span>{basePrice.toLocaleString()} €</span></div>
              {insuranceType === 'standard' && <div className="flex justify-between text-xs font-bold uppercase text-sky-400"><span>Poistenie Štandard</span><span>+{insurancePrice} €</span></div>}
              {useFlexiDeposit && <div className="flex justify-between text-xs font-bold uppercase text-emerald-500"><span>Flexi Depozit</span><span>+{flexiPrice} €</span></div>}
              {hasSecondDriver && <div className="flex justify-between text-xs font-bold uppercase text-amber-500"><span>{ui.secondDriver}</span><span>+20 €</span></div>}
              {paymentMethod === 'crypto' && <div className="flex justify-between text-[10px] font-black uppercase text-emerald-500"><span>Zľava Crypto 10%</span><span>-{cryptoDiscount.toLocaleString()} €</span></div>}
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase mb-[-4px]">{ui.total}</span><span className="text-5xl font-black italic tracking-tighter text-sky-400">{finalPrice.toLocaleString()} €</span></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase pb-2">{ui.vat}</span>
            </div>

            <button disabled={isSubmitting} onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()} 
              className={`w-full py-6 rounded-[1.5rem] font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer ${isSubmitting ? 'bg-slate-800 text-slate-500' : 'bg-sky-500 text-slate-950 hover:bg-sky-400'}`}>
              {isSubmitting ? <Loader2 className="animate-spin" size={22} /> : <>{step < 3 ? ui.next : ui.finish} <ArrowRight size={22} /></>}
            </button>
            
            <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              <span className="flex items-center gap-1"><Lock size={12} className="text-sky-500" /> SSL Secure</span>
              <span>•</span>
              <span>24/7 Support</span>
              <span>•</span>
              <span>Verified Fleet</span>
            </div>

            {step > 2 && !isSubmitting && (<button onClick={() => setStep(step - 1)} className="w-full py-2 text-[10px] font-black uppercase text-slate-500 flex items-center justify-center gap-2 hover:text-white transition-colors cursor-pointer"><ChevronLeft size={14} /> {ui.back}</button>)}
          </div>
        </div>
      </div>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-4 flex items-center justify-between lg:hidden z-30 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">{ui.total} ({ui.vat})</span>
          <span className="text-2xl font-black italic text-sky-400">{finalPrice.toLocaleString()} €</span>
        </div>
        <button disabled={isSubmitting} onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()} 
          className="px-6 py-3.5 bg-sky-500 text-slate-950 rounded-xl font-black uppercase italic tracking-wider text-xs flex items-center gap-2 cursor-pointer">
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <>{step < 3 ? ui.next : ui.finish} <ArrowRight size={16} /></>}
        </button>
      </div>

    </div>
  );
}