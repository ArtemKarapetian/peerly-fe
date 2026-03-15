import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mt-6 mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">{title}</h1>
        {subtitle && <p className="text-[16px] text-[#767692]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 pt-2">{action}</div>}
    </div>
  );
}
