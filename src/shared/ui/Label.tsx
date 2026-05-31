import type { LabelHTMLAttributes, ReactNode } from "react";

import { cn } from "./utils.ts";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cn("block text-sm font-medium text-foreground mb-2", className)} {...props}>
      {children}
    </label>
  );
}
