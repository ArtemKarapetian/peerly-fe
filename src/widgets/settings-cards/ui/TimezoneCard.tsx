import { Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function TimezoneCard() {
  const { t } = useTranslation();
  const [timezone, setTimezone] = useState("auto");

  const TIMEZONES = [
    { value: "auto", label: t("widget.timezone.auto") },
    { value: "Europe/Moscow", label: t("widget.timezone.moscow") },
    { value: "Europe/London", label: t("widget.timezone.london") },
    { value: "America/New_York", label: t("widget.timezone.newYork") },
    { value: "America/Los_Angeles", label: t("widget.timezone.losAngeles") },
    { value: "Asia/Tokyo", label: t("widget.timezone.tokyo") },
  ];

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-[20px] font-medium text-foreground">{t("widget.timezone.title")}</h2>
      </div>

      <p className="text-[14px] text-muted-foreground mb-4">{t("widget.timezone.subtitle")}</p>

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
