import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/shared/ui";

import { PublicLayout } from "@/widgets/public-layout";

import { useFAQSearch } from "../model/useFAQSearch";

import { ContactSection } from "./ContactSection";
import { FAQSection } from "./FAQSection";
import { HelpHero } from "./HelpHero";
import { HelpSearch } from "./HelpSearch";

export default function HelpPage() {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery, filteredCount, sections } = useFAQSearch();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <PublicLayout showTopBar={true} showLoginButton={true} maxWidth="lg">
      <div className="py-12 px-6">
        <HelpHero />
        <HelpSearch value={searchQuery} onChange={setSearchQuery} />

        <div className="max-w-[800px] mx-auto space-y-12 tablet:space-y-16">
          {sections["getting-started"].length > 0 && (
            <FAQSection
              title={t("page.help.gettingStarted")}
              items={sections["getting-started"]}
              openItems={openItems}
              onToggle={toggleItem}
            />
          )}
          {sections.troubleshooting.length > 0 && (
            <FAQSection
              title={t("page.help.troubleshooting")}
              items={sections.troubleshooting}
              openItems={openItems}
              onToggle={toggleItem}
            />
          )}

          {searchQuery && filteredCount === 0 ? (
            <EmptyState
              title={t("page.help.notFoundQuery", { query: searchQuery })}
              message={t("page.help.tryChangingSearch")}
            />
          ) : (
            <ContactSection />
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
