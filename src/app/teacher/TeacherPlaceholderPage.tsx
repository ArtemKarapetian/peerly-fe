import { AppShell } from "@/app/components/AppShell";
import { BreadcrumbItem, Breadcrumbs } from "@/app/components/Breadcrumbs";
import { LucideIcon } from "lucide-react";
import { ROUTES } from "@/app/routes.ts";

/**
 * TeacherPlaceholderPage - Шаблон для страниц преподавателя
 */

interface TeacherPlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  breadcrumbs?: BreadcrumbItem[];
  primaryAction?: {
    label: string;
    href: string;
  };
}

export function TeacherPlaceholderPage({
  title,
  description,
  icon: Icon,
  breadcrumbs = [
    {
      label: "Дашборд преподавателя",
      href: ROUTES.teacherDashboard,
    },
  ],
  primaryAction,
}: TeacherPlaceholderPageProps) {
  return (
    <AppShell title={title}>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6">
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-8 text-center max-w-[600px] mx-auto">
          <div className="w-16 h-16 bg-[#e9f5ff] rounded-[16px] flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-[#5b8def]" />
          </div>
          <h1 className="text-[28px] font-medium text-[#21214f] tracking-[-0.5px] mb-3">{title}</h1>
          <p className="text-[16px] text-[#767692] leading-[1.6] mb-6">{description}</p>

          {primaryAction && (
            <div className="mb-6">
              <a
                href={primaryAction.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors font-medium"
              >
                {primaryAction.label}
              </a>
            </div>
          )}

          <div className="bg-[#f9f9f9] border border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[14px] text-[#767692]">
              <strong>Демо-режим:</strong> Эта страница будет содержать функционал управления для
              преподавателей.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
