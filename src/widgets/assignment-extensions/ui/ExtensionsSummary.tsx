import { useTranslation } from "react-i18next";

import { Extension } from "@/entities/extension";

type Props = {
  extensions: Extension[];
};

export function ExtensionsSummary({ extensions }: Props) {
  const { t } = useTranslation();
  const total = extensions.length;
  const requested = extensions.filter((e) => e.status === "requested").length;
  const approved = extensions.filter((e) => e.status === "approved").length;
  const manual = extensions.filter((e) => e.status === "manual").length;

  return (
    <div className="mt-6 grid grid-cols-2 tablet:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-[12px] p-4">
        <div className="text-2xl font-semibold text-foreground mb-1">{total}</div>
        <div className="text-sm text-muted-foreground">
          {t("widget.extensions.totalExtensions")}
        </div>
      </div>

      <div className="bg-card border border-border rounded-[12px] p-4">
        <div className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
          {requested}
        </div>
        <div className="text-sm text-muted-foreground">
          {t("widget.extensions.awaitingResponse")}
        </div>
      </div>

      <div className="bg-card border border-border rounded-[12px] p-4">
        <div className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-1">
          {approved}
        </div>
        <div className="text-sm text-muted-foreground">{t("widget.extensions.approved")}</div>
      </div>

      <div className="bg-card border border-border rounded-[12px] p-4">
        <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-1">{manual}</div>
        <div className="text-sm text-muted-foreground">{t("widget.extensions.manual")}</div>
      </div>
    </div>
  );
}
