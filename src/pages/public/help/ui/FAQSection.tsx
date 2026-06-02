import { Card } from "@/shared/ui";

import type { FAQEntry } from "../model/faq";

import { FAQItemRow } from "./FAQItemRow";

interface FAQSectionProps {
  title: string;
  items: FAQEntry[];
  openItems: Set<string>;
  onToggle: (id: string) => void;
}

export function FAQSection({ title, items, openItems, onToggle }: FAQSectionProps) {
  return (
    <section>
      <h2 className="text-xl tablet:text-2xl font-semibold text-foreground mb-4 tablet:mb-6">
        {title}
      </h2>
      <Card variant="section" className="p-0 divide-y divide-border overflow-hidden">
        {items.map((item) => (
          <FAQItemRow
            key={item.id}
            question={item.question}
            answer={item.answer}
            isOpen={openItems.has(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </Card>
    </section>
  );
}
