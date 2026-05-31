import { useTranslation } from "react-i18next";

import { LandingContainer } from "./LandingContainer";

interface RoleCardProps {
  title: string;
  subtitle: string;
  description: string;
}

function RoleCard({ title, subtitle, description }: RoleCardProps) {
  return (
    <div className="border-l-2 border-foreground pl-6 tablet:pl-8 space-y-4">
      <div className="space-y-2">
        <h3 className="text-2xl tablet:text-3xl font-semibold text-foreground">{title}</h3>
        <p className="text-base font-medium text-foreground/80">{subtitle}</p>
      </div>
      <p className="text-base text-foreground/70">{description}</p>
    </div>
  );
}

export function LandingRoles() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-card py-16 tablet:py-20 desktop:py-24">
      <LandingContainer>
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 mb-12 tablet:mb-16 desktop:mb-20">
          <h2 className="text-4xl tablet:text-5xl desktop:text-6xl font-semibold text-foreground leading-[1.1]">
            {t("page.landing.rolesTitle")}
          </h2>
          <p className="text-base text-foreground/70 desktop:pt-4">{t("page.landing.rolesDesc")}</p>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8">
          <RoleCard
            title={t("page.landing.roleStudentsTitle")}
            subtitle={t("page.landing.roleStudentsSubtitle")}
            description={t("page.landing.roleStudentsDesc")}
          />
          <RoleCard
            title={t("page.landing.roleTeachersTitle")}
            subtitle={t("page.landing.roleTeachersSubtitle")}
            description={t("page.landing.roleTeachersDesc")}
          />
          <RoleCard
            title={t("page.landing.roleAdminTitle")}
            subtitle={t("page.landing.roleAdminSubtitle")}
            description={t("page.landing.roleAdminDesc")}
          />
        </div>
      </LandingContainer>
    </section>
  );
}
