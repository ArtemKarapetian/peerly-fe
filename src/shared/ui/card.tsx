import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./utils.ts";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bg-card border-2 border-border rounded-xl p-6", className)}
    {...props}
  />
));
Card.displayName = "Card";
