import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./utils.ts";

type Variant = "default" | "section";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-card border-2 border-border rounded-xl p-6",
  section: "bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div ref={ref} className={cn(VARIANT_CLASSES[variant], className)} {...props} />
  ),
);
Card.displayName = "Card";
