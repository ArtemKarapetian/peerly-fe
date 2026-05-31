import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export function SummaryCard({ icon: Icon, title, children }: SummaryCardProps) {
  return (
    <div className="bg-card border-2 border-border rounded-lg p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-brand-primary-light rounded-sm flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-primary" />
        </div>
        <h3 className="text-base font-medium text-foreground">{title}</h3>
      </div>
      <div className="ml-13 pl-5 border-l-2 border-border space-y-3">{children}</div>
    </div>
  );
}

export function SummaryField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="text-sm text-foreground font-medium">{children}</div>
    </div>
  );
}
