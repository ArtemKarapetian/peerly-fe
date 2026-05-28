import { useTranslation } from "react-i18next";

import imgHero from "@/shared/assets/1316612187f4274840308d8544bb1f10cdcc9818.png";

import { LandingContainer } from "./LandingContainer";
import { LandingCTAButton } from "./LandingCTAButton";

export function LandingHero() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-brand-primary-lighter rounded-bl-[20px] rounded-br-[20px]">
      <LandingContainer className="py-16 tablet:py-20 desktop:py-24">
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-16 items-center">
          <div className="space-y-6 tablet:space-y-8">
            <h1 className="text-5xl tablet:text-6xl desktop:text-7xl font-semibold text-foreground leading-[1.1]">
              {t("page.landing.heroTitle")}
            </h1>

            <p className="text-base tablet:text-lg text-foreground/80">
              {t("page.landing.heroDescription")}
            </p>

            <div className="flex flex-col tablet:flex-row items-start tablet:items-center gap-3">
              <LandingCTAButton size="large" />
            </div>
          </div>

          <div className="flex justify-center desktop:justify-end">
            <div className="w-full max-w-[400px] desktop:max-w-[450px]">
              <img src={imgHero} alt="Peer-review illustration" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
