"use client";

import { Calendar } from "@/components/ui/calendar";
import { sk, enGB, bs } from "date-fns/locale";
import { useLang } from "@/context/LanguageContext";

type CarDateRangePickerProps = {
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  bookedDates: string[];
};

function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function CarDateRangePicker({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  bookedDates
}: CarDateRangePickerProps) {
  const { lang } = useLang(); 

  const calendarLocale = lang === 'en' ? enGB : lang === 'bs' ? bs : sk;
 
  const labelText = {
    sk: "Vyberte termín prenájmu",
    en: "Select rental period",
    bs: "Odaberite period najma"
  }[lang as 'sk' | 'en' | 'bs'] || "Vyberte termín prenájmu";

  const disabledDates = bookedDates.map(parseLocalDate);
  const selected = {
    from: from ? parseLocalDate(from) : undefined,
    to: to ? parseLocalDate(to) : undefined
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {labelText}
      </label>
      <div className="elite-calendar-wrapper rounded-xl border border-slate-700/60 bg-slate-900/80 p-4">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={(range) => {
            if (!range) {
              onChangeFrom("");
              onChangeTo("");
              return;
            }
            onChangeFrom(range.from ? toLocalDateString(range.from) : "");
            onChangeTo(range.to ? toLocalDateString(range.to) : "");
          }}
          disabled={disabledDates}
          excludeDisabled
          locale={calendarLocale}
          showOutsideDays={false}
          className="w-full"
          classNames={{
            months: "flex flex-col",
            month: "flex flex-col gap-4",
            month_caption: "flex justify-center",
            caption_label: "text-sm font-medium text-slate-200",
            nav: "flex items-center justify-between gap-1",
            button_previous:
              "h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md",
            button_next:
              "h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md",
            weekdays: "grid grid-cols-7",
            weekday: "text-center text-[11px] font-medium text-slate-500",
            weeks: "flex flex-col gap-0",
            week: "grid grid-cols-7",
            day: "relative p-0 text-center",
            range_start:
              "bg-sky-500 rounded-l-md [&>button]:!bg-sky-500 [&>button]:!text-white [&>button]:rounded-l-md",
            range_middle:
              "bg-sky-500 [&>button]:!bg-sky-500 [&>button]:!text-white [&>button]:rounded-none",
            range_end:
              "bg-sky-500 rounded-r-md [&>button]:!bg-sky-500 [&>button]:!text-white [&>button]:rounded-r-md",
            selected: "[&>button]:!bg-sky-500 [&>button]:!text-white",
            today: "[&>button]:text-sky-400 [&>button]:font-semibold",
            outside: "text-slate-600 opacity-50",
            disabled: "text-slate-600 opacity-40"
          }}
        />
      </div>
    </div>
  );
}