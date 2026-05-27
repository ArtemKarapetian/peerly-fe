import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CreateGroupFormProps {
  onSubmit: (name: string) => void | Promise<void>;
  onCancel: () => void;
}

export function CreateGroupForm({ onSubmit, onCancel }: CreateGroupFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  return (
    <div className="mb-4 p-4 border-2 border-border rounded-md flex items-center gap-3">
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void onSubmit(name);
          if (e.key === "Escape") onCancel();
        }}
        placeholder={t("widget.groups.groupNamePlaceholder")}
        className="flex-1 px-4 py-2 border-2 border-border rounded-md text-15 focus:outline-none focus:border-brand-primary transition-colors"
      />
      <button
        onClick={() => void onSubmit(name)}
        disabled={!name.trim()}
        className="px-4 py-2 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
      >
        {t("common.create")}
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
      >
        {t("common.cancel")}
      </button>
    </div>
  );
}
