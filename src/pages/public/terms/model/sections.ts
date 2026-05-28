export const SECTION_IDS = {
  terms: "terms-of-use",
  contact: "contact",
} as const;

export const TERMS_SUBSECTIONS = [
  { titleKey: "page.terms.terms1Title", textKey: "page.terms.terms1Text" },
  {
    titleKey: "page.terms.terms2Title",
    textKey: "page.terms.terms2Text",
    bulletKeys: [
      "page.terms.terms2Item1",
      "page.terms.terms2Item2",
      "page.terms.terms2Item3",
      "page.terms.terms2Item4",
      "page.terms.terms2Item5",
    ],
  },
  { titleKey: "page.terms.terms3Title", textKey: "page.terms.terms3Text" },
  { titleKey: "page.terms.terms4Title", textKey: "page.terms.terms4Text" },
  { titleKey: "page.terms.terms5Title", textKey: "page.terms.terms5Text" },
  { titleKey: "page.terms.terms6Title", textKey: "page.terms.terms6Text" },
] as const;

export type TermsSubsection = (typeof TERMS_SUBSECTIONS)[number];
