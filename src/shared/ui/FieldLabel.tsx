import type { LabelHTMLAttributes, ReactNode } from "react";

import { cn } from "./utils.ts";

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function FieldLabel({ className, children, ...props }: FieldLabelProps) {
  return (
    <label
      className={cn(
        "block text-13 font-medium text-muted-foreground mb-2 uppercase tracking-wide",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
