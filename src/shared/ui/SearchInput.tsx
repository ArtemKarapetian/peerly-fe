import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-card py-2.5 pl-9 pr-4 text-sm leading-[1.4] text-foreground outline-none transition-colors placeholder:text-text-tertiary focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
    </div>
  );
}
