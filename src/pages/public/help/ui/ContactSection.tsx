import { Bug, Mail, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

const SUPPORT_EMAIL = "peerly.edu@mail.ru";

export function ContactSection() {
  const { t } = useTranslation();
  return (
    <section>
      <h2 className="text-xl tablet:text-2xl font-semibold text-foreground mb-4 tablet:mb-6">
        {t("page.help.contactSupport")}
      </h2>
      <div className="grid gap-4 tablet:grid-cols-2">
        <ContactMethodCard
          icon={Mail}
          title={t("page.help.instructor.title")}
          description={t("page.help.instructor.description")}
        />
        <ContactMethodCard
          icon={Bug}
          title={t("page.help.bugReport.title")}
          description={t("page.help.bugReport.description")}
          actionLabel={SUPPORT_EMAIL}
          actionHref={`mailto:${SUPPORT_EMAIL}`}
        />
      </div>
    </section>
  );
}

interface ContactMethodCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

function ContactMethodCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: ContactMethodCardProps) {
  return (
    <Card variant="section" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-lg bg-brand-primary-lighter text-brand-primary">
          <Icon className="size-5" aria-hidden />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-foreground/70 leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-flex items-center self-start text-sm font-medium text-brand-primary hover:underline"
        >
          {actionLabel}
        </a>
      )}
    </Card>
  );
}
