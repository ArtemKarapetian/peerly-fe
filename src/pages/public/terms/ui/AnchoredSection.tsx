import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/ui/utils.ts";

interface AnchoredSectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

export function AnchoredSection({
  id,
  icon: Icon,
  title,
  children,
  className,
}: AnchoredSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "bg-card border-2 border-border rounded-xl p-6 tablet:p-8 scroll-mt-4",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className="size-6 text-primary" />
        <h2 className="text-[28px] font-medium text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}
