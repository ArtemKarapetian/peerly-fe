import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "./utils.ts";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: ReactNode;
  message: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      {Icon && <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />}
      {title && <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>}
      <p className="text-15 text-muted-foreground">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
