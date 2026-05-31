import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ImportModalHeaderProps {
  onClose: () => void;
}

export function ImportModalHeader({ onClose }: ImportModalHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between p-6 border-b-2 border-border">
      <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px]">
        {t("feature.participantImport.title")}
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-surface-hover rounded-sm transition-colors"
        aria-label={t("feature.participantImport.close")}
      >
        <X className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
