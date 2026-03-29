import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  title?: string;
  description?: string;
  onAdd: () => void;
};

export function ExtensionsHeader({ title, description, onAdd }: Props) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("widget.extensions.deadlineExtensions");
  const resolvedDescription = description ?? t("widget.extensions.addOrWait");
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {resolvedTitle}
        </h1>
        <p className="text-muted-foreground">{resolvedDescription}</p>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        <Plus className="w-5 h-5" />
        {t("widget.extensions.addExtension")}
      </button>
    </div>
  );
}
