import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram credentials not configured.");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const data = await req.json();
    // 1. Vytiahli sme aj variableSymbol z prichádzajúcich dát
    const { reservation, customer, extras, finalPrice, displayDeposit, paymentMethod, isCompany, variableSymbol } = data;

    // 2. ZÁPIS DO SUPABASE (Zosynchronizované s novou SQL schémou)
    const { error: dbError } = await supabase
      .from("bookings")
      .insert([{
        car_name: `${reservation?.brand} ${reservation?.name}`,
        customer_name: `${customer?.firstName} ${customer?.lastName}`,
        customer_email: customer?.email,
        customer_phone: customer?.phone,
        start_date: reservation?.from,
        end_date: reservation?.to,
        pickup_location: reservation?.pickupLoc,
        return_location: reservation?.returnLoc || reservation?.pickupLoc,
        total_price: finalPrice,
        deposit_amount: displayDeposit,
        payment_method: paymentMethod,
        variable_symbol: variableSymbol, // <--- PRIDANÉ: Uloženie VS do databázy
        
        // Adresa a osobné údaje
        street: customer?.street,
        city: customer?.city,
        zip: customer?.zip,
        op_number: customer?.opNumber,
        vp_number: customer?.vpNumber,
        birth_number: customer?.birthNumber,
        
        // Firemné údaje
        is_company: isCompany,
        comp_name: customer?.compName,
        comp_ico: customer?.compIco,
        comp_dic: customer?.compDic,
        comp_icdph: customer?.compIcdph,
        
        // Služby a extra (Nové polia)
        insurance_type: extras?.insuranceType, // 'basic' | 'standard'
        use_flexi_deposit: extras?.useFlexiDeposit,
        second_driver: extras?.hasSecondDriver,
        km_limit: `${reservation?.totalKmLimit || '200'} KM`,
        status: 'pending'
      }]);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }

    const companyLabel = isCompany ? `🏢 *Firma:* ${customer?.compName}` : "👤 Súkromná osoba";

    const telegramMessage = `
🏎️ *NOVÁ REZERVÁCIA* 🏎️
--------------------------------
*Auto:* ${reservation?.brand} ${reservation?.name}
*Zákazník:* ${customer?.firstName} ${customer?.lastName}
${companyLabel}

📅 *Termín:* ${reservation?.from} — ${reservation?.to}
📍 *Miesto:* ${reservation?.pickupLoc}

--------------------------------
💳 *Platba:* ${paymentMethod?.toUpperCase()}
🔢 *VS:* ${variableSymbol || 'N/A'}
💵 *Suma:* ${finalPrice} €
--------------------------------
_Všetky doklady a detaily nájdeš v Admin Paneli._
    `.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "Markdown",
        }),
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}