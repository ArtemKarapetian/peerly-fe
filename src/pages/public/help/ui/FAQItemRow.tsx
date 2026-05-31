import { ChevronDown } from "lucide-react";

interface FAQItemRowProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQItemRow({ question, answer, isOpen, onToggle }: FAQItemRowProps) {
  return (
    <div className="border border-border rounded-md overflow-hidden bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors text-left"
      >
        <span className="font-medium text-foreground pr-4">{question}</span>
        <ChevronDown
          className={`size-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="px-4 pb-4 pt-0 text-muted-foreground">{answer}</div>}
    </div>
  );
}
