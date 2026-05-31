import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FAQ_ITEMS, type FAQCategory, type FAQEntry } from "./faq";

type Sections = Record<FAQCategory, FAQEntry[]>;

export function useFAQSearch() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const entries = useMemo<FAQEntry[]>(
    () =>
      FAQ_ITEMS.map((item) => ({
        ...item,
        question: t(item.questionKey),
        answer: t(item.answerKey),
      })),
    [t],
  );

  const filtered = useMemo<FAQEntry[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter(
      (item) =>
        item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
    );
  }, [entries, searchQuery]);

  const sections = useMemo<Sections>(
    () => ({
      "getting-started": filtered.filter((i) => i.category === "getting-started"),
      troubleshooting: filtered.filter((i) => i.category === "troubleshooting"),
    }),
    [filtered],
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredCount: filtered.length,
    sections,
  };
}
