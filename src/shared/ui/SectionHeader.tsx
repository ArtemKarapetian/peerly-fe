import type { ReactNode } from "react";

import { cn } from "./utils.ts";

interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3";
}

export function SectionHeader({ children, className, as: Tag = "h2" }: SectionHeaderProps) {
  return (
    <Tag className={cn("text-lg font-medium text-foreground mb-4", className)}>{children}</Tag>
  );
}
