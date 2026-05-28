import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PickerHeaderProps {
  rubricName: string;
  onClose: () => void;
}

export function PickerHeader({ rubricName, onClose }: PickerHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between p-6 border-b-2 border-border">
      <div>
        <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px]">
          {t("feature.assignmentPicker.title")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("feature.assignmentPicker.rubricLabel")}:{" "}
          <span className="font-medium text-foreground">{rubricName}</span>
        </p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-sm transition-colors">
        <X className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
