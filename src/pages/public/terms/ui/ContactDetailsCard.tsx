import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

export function ContactDetailsCard() {
  const { t } = useTranslation();
  return (
    <div className="bg-accent/50 border border-border rounded-lg p-4 space-y-3">
      <ContactRow label={t("page.terms.contactSupport")}>
        <ExternalLink href="mailto:peerly.edu@mail.ru">peerly.edu@mail.ru</ExternalLink>
      </ContactRow>
      <ContactRow label={t("page.terms.contactReference")}>
        <InternalLink to={ROUTES.help}>{t("page.terms.contactHelpCenter")}</InternalLink>
      </ContactRow>
    </div>
  );
}

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-13 text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      {children}
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-15 text-primary hover:underline font-medium">
      {children}
    </a>
  );
}

function InternalLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-15 text-primary hover:underline font-medium">
      {children}
    </Link>
  );
}
