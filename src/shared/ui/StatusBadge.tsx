import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "./badge.tsx";

type Variant = "default" | "success" | "warning" | "error" | "info" | "secondary" | "outline";

interface StatusBadgeProps {
  variant?: Variant;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({
  variant = "default",
  icon: Icon,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <Badge variant={variant} className={className}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </Badge>
  );
}
