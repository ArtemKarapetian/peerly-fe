import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SECTION_IDS } from "../model/sections";

import { AnchoredSection } from "./AnchoredSection";
import { ContactDetailsCard } from "./ContactDetailsCard";

export function ContactSection() {
  const { t } = useTranslation();
  return (
    <AnchoredSection id={SECTION_IDS.contact} icon={Mail} title={t("page.terms.contactTitle")}>
      <div className="space-y-4">
        <p className="text-15 text-muted-foreground leading-relaxed">
          {t("page.terms.contactText")}
        </p>
        <ContactDetailsCard />
        <p className="text-13 text-muted-foreground pt-4 border-t border-border">
          {t("page.terms.contactResponseTime")}
        </p>
      </div>
    </AnchoredSection>
  );
}
