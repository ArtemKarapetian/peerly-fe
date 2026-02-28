import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils.ts";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-sm)] px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand-primary-lighter)] text-[var(--brand-primary)]",
        success: "bg-[var(--success-light)] text-[var(--success)]",
        warning: "bg-[var(--warning-light)] text-[var(--warning)]",
        error: "bg-[var(--error-light)] text-[var(--error)]",
        info: "bg-[var(--info-light)] text-[var(--info)]",
        secondary:
          "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--surface-border)]",
        outline: "bg-transparent text-[var(--text-primary)] border border-[var(--surface-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
