import { useTranslation } from "react-i18next";

import type { FAQEntry } from "../model/faq";

import { ContactInstructorBanner } from "./ContactInstructorBanner";
import { FAQItemRow } from "./FAQItemRow";

interface ContactSectionProps {
  contactFAQs: FAQEntry[];
  openItems: Set<string>;
  onToggle: (id: string) => void;
}

export function ContactSection({ contactFAQs, openItems, onToggle }: ContactSectionProps) {
  const { t } = useTranslation();
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        {t("page.help.contactSupport")}
      </h2>

      {contactFAQs.length > 0 && (
        <div className="space-y-3 mb-6">
          {contactFAQs.map((item) => (
            <FAQItemRow
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(item.id)}
              onToggle={() => onToggle(item.id)}
            />
          ))}
        </div>
      )}

      <ContactInstructorBanner />
    </section>
  );
}
