import { useTranslation } from "react-i18next";

import imgTeacher from "@/shared/assets/7177166acba64f35340faa0b6f56005880826629.png";
import imgSettings from "@/shared/assets/8a7431ce52feae07a5df11170b187a4a3d8ac9c2.png";
import imgPlatform from "@/shared/assets/eb9aaf49f5066472e938555cd5aa00e6418c7a26.png";

import { LandingContainer } from "./LandingContainer";

interface FeatureCardProps {
  image: string;
  imageMaxWidth: string;
  title: string;
  description: string;
  imageOnLeft: boolean;
}

function FeatureCard({ image, imageMaxWidth, title, description, imageOnLeft }: FeatureCardProps) {
  const imageOrder = imageOnLeft ? "order-2 desktop:order-1" : "";
  const textOrder = imageOnLeft ? "order-1 desktop:order-2" : "";

  return (
    <div className="bg-brand-primary-lighter rounded-xl p-6 tablet:p-10 desktop:p-12">
      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-center">
        <div className={`${imageOrder} flex justify-center`}>
          <img src={image} alt={title} className={`w-full ${imageMaxWidth} h-auto`} />
        </div>
        <div className={`${textOrder} space-y-4 tablet:space-y-6`}>
          <h3 className="text-3xl tablet:text-4xl font-semibold text-foreground leading-[1.1]">
            {title}
          </h3>
          <p className="text-base text-foreground/80">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-muted pb-16 tablet:pb-20 desktop:pb-24">
      <LandingContainer className="space-y-8">
        <FeatureCard
          image={imgPlatform}
          imageMaxWidth="max-w-[320px] tablet:max-w-[400px]"
          title={t("page.landing.feature1Title")}
          description={t("page.landing.feature1Desc")}
          imageOnLeft={true}
        />
        <FeatureCard
          image={imgTeacher}
          imageMaxWidth="max-w-[360px] tablet:max-w-[440px]"
          title={t("page.landing.feature2Title")}
          description={t("page.landing.feature2Desc")}
          imageOnLeft={false}
        />
        <FeatureCard
          image={imgSettings}
          imageMaxWidth="max-w-[280px] tablet:max-w-[360px]"
          title={t("page.landing.feature3Title")}
          description={t("page.landing.feature3Desc")}
          imageOnLeft={true}
        />
      </LandingContainer>
    </section>
  );
}
