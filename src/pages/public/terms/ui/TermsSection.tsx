import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SECTION_IDS, TERMS_SUBSECTIONS } from "../model/sections";

import { AnchoredSection } from "./AnchoredSection";
import { TextSubsection } from "./TextSubsection";

export function TermsSection() {
  const { t } = useTranslation();
  return (
    <AnchoredSection
      id={SECTION_IDS.terms}
      icon={FileText}
      title={t("page.terms.termsTitle")}
      className="mb-6"
    >
      <div className="space-y-6">
        {TERMS_SUBSECTIONS.map((section) => (
          <TextSubsection
            key={section.titleKey}
            titleKey={section.titleKey}
            textKey={section.textKey}
            bulletKeys={"bulletKeys" in section ? section.bulletKeys : undefined}
          />
        ))}
      </div>
    </AnchoredSection>
  );
}
