import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFilterProps {
  options: DropdownOption[];
  selectedValue: string;
  selectedLabel: string;
  width?: string;
  onSelect: (value: string) => void;
}

export function DropdownFilter({
  options,
  selectedValue,
  selectedLabel,
  width = "280px",
  onSelect,
}: DropdownFilterProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-sm text-sm text-foreground hover:border-brand-primary transition-colors"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 bg-card border-2 border-border rounded-md shadow-lg z-10 overflow-hidden"
          style={{ width }}
        >
          {options.map((option) => {
            const selected = option.value === selectedValue;
            const stateClass = selected
              ? "bg-brand-primary-light text-brand-primary font-medium"
              : "text-foreground";
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors ${stateClass}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
