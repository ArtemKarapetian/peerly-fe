import { useTranslation } from "react-i18next";

import { scrollToSection } from "../lib/scrollToSection";
import { SECTION_IDS } from "../model/sections";

export function TermsTableOfContents() {
  const { t } = useTranslation();
  return (
    <div className="bg-accent/50 border-2 border-border rounded-xl p-6 mb-8">
      <h2 className="text-lg font-medium text-foreground mb-4">{t("page.terms.toc")}</h2>
      <nav className="space-y-2">
        <TocLink targetId={SECTION_IDS.terms} labelKey="page.terms.tocTerms" />
        <TocLink targetId={SECTION_IDS.contact} labelKey="page.terms.tocContact" />
      </nav>
    </div>
  );
}

function TocLink({ targetId, labelKey }: { targetId: string; labelKey: string }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => scrollToSection(targetId)}
      className="block text-15 text-primary hover:underline text-left"
    >
      → {t(labelKey)}
    </button>
  );
}
