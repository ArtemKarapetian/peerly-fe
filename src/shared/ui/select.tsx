import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "./utils.ts";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      {...props}
      className={cn(
        "appearance-none w-full px-4 py-3 pr-10 border-2 border-border rounded-md text-15 bg-card",
        "focus:outline-none focus:border-brand-primary transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    />
    <ChevronDown
      strokeWidth={2.5}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
    />
  </div>
));
Select.displayName = "Select";
