import { Clock } from "lucide-react";
import { useState } from "react";

const TIMEZONES = [
  { value: "auto", label: "Автоматически" },
  { value: "Europe/Moscow", label: "Москва (UTC+3)" },
  { value: "Europe/London", label: "Лондон (UTC+0)" },
  { value: "America/New_York", label: "Нью-Йорк (UTC-5)" },
  { value: "America/Los_Angeles", label: "Лос-Анджелес (UTC-8)" },
  { value: "Asia/Tokyo", label: "Токио (UTC+9)" },
];

export function TimezoneCard() {
  const [timezone, setTimezone] = useState("auto");

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-[20px] font-medium text-foreground">Часовой пояс</h2>
      </div>

      <p className="text-[14px] text-muted-foreground mb-4">
        Выберите часовой пояс для отображения времени
      </p>

      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="w-full max-w-[400px] px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
}
