import { Check, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatSaveTime } from "@/shared/lib/formatSaveTime.ts";

/**
 * SaveStatusIndicator - Shows save status with timestamp
 */

export type SaveStatus = "unsaved" | "saving" | "saved" | "error";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSavedTimestamp?: number;
}

export function SaveStatusIndicator({ status, lastSavedTimestamp }: SaveStatusIndicatorProps) {
  const { t } = useTranslation();

  const getStatusConfig = () => {
    switch (status) {
      case "unsaved":
        return {
          icon: AlertCircle,
          text: t("shared.saveStatus.unsaved"),
          color: "text-warning",
          bgColor: "bg-warning-light",
        };
      case "saving":
        return {
          icon: Loader2,
          text: t("shared.saveStatus.saving"),
          color: "text-info",
          bgColor: "bg-info-light",
          animate: true,
        };
      case "saved":
        return {
          icon: Check,
          text: lastSavedTimestamp
            ? t("shared.saveStatus.savedAt", { time: formatSaveTime(lastSavedTimestamp) })
            : t("shared.saveStatus.saved"),
          color: "text-success",
          bgColor: "bg-success-light",
        };
      case "error":
        return {
          icon: AlertCircle,
          text: t("shared.saveStatus.error"),
          color: "text-error",
          bgColor: "bg-error-light",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] ${config.bgColor}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.color} ${config.animate ? "animate-spin" : ""}`} />
      <span className={`text-[12px] font-medium ${config.color}`}>{config.text}</span>
    </div>
  );
}
