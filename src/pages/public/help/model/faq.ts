export type FAQCategory = "getting-started" | "troubleshooting" | "contact";

export interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
  category: FAQCategory;
}

export interface FAQEntry extends FAQItem {
  question: string;
  answer: string;
}

const PREFIX_BY_CATEGORY: Record<FAQCategory, string> = {
  "getting-started": "gs",
  troubleshooting: "ts",
  contact: "cs",
};

const COUNTS: Record<FAQCategory, number> = {
  "getting-started": 6,
  troubleshooting: 6,
  contact: 2,
};

function generateForCategory(category: FAQCategory): FAQItem[] {
  const prefix = PREFIX_BY_CATEGORY[category];
  return Array.from({ length: COUNTS[category] }, (_, i) => {
    const n = i + 1;
    return {
      id: `${prefix}-${n}`,
      questionKey: `page.help.faq.${prefix}${n}q`,
      answerKey: `page.help.faq.${prefix}${n}a`,
      category,
    };
  });
}

export const FAQ_ITEMS: FAQItem[] = [
  ...generateForCategory("getting-started"),
  ...generateForCategory("troubleshooting"),
  ...generateForCategory("contact"),
];
