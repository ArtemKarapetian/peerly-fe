import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs, BreadcrumbItem } from "@/shared/ui/Breadcrumbs.tsx";
import { LucideIcon } from "lucide-react";
import { ROUTES } from "@/shared/config/routes.ts";

/**
 * AdminPlaceholderPage - Шаблон для страниц администратора
 */

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  breadcrumbs?: BreadcrumbItem[];
}

export function AdminPlaceholderPage({
  title,
  description,
  icon: Icon,
  breadcrumbs = [{ label: "Admin", href: ROUTES.adminOverview }],
}: AdminPlaceholderPageProps) {
  return (
    <AppShell title={title}>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6">
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-8 text-center max-w-[600px] mx-auto">
          <div className="w-16 h-16 bg-[#f3e5f5] rounded-[16px] flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-[#8e24aa]" />
          </div>
          <h1 className="text-[28px] font-medium text-[#21214f] tracking-[-0.5px] mb-3">{title}</h1>
          <p className="text-[16px] text-[#767692] leading-[1.6] mb-6">{description}</p>
          <div className="bg-[#f9f9f9] border border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[14px] text-[#767692]">
              <strong>Демо-режим:</strong> Эта страница будет содержать административные функции
              системы.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
