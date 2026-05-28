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
      <h2 className="text-2xl font-semibold text-foreground mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <FAQItemRow
            key={item.id}
            question={item.question}
            answer={item.answer}
            isOpen={openItems.has(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
