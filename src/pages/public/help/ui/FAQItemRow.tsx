import { ChevronDown } from "lucide-react";

interface FAQItemRowProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQItemRow({ question, answer, isOpen, onToggle }: FAQItemRowProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 tablet:px-6 tablet:py-5 hover:bg-surface-hover transition-colors text-left"
      >
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown
          className={`size-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 tablet:px-6 tablet:pb-6 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
