import { Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, Select } from "@/shared/ui";

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
    <Card className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-xl font-medium text-foreground">{t("widget.timezone.title")}</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{t("widget.timezone.subtitle")}</p>

      <Select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="max-w-[400px]"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </Select>
    </Card>
  );
}
