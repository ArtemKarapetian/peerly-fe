import { useEffect } from "react";

import { PublicLayout } from "@/widgets/public-layout";

import { LandingCTASection } from "./LandingCTASection";
import { LandingFeatures } from "./LandingFeatures";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { LandingHero } from "./LandingHero";
import { LandingIntro } from "./LandingIntro";
import { LandingRoles } from "./LandingRoles";

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout showTopBar={false} showLoginButton={false} showFooter={false}>
      <LandingHeader />
      <LandingHero />
      <LandingIntro />
      <LandingFeatures />
      <LandingRoles />
      <LandingCTASection />
      <LandingFooter />
    </PublicLayout>
  );
}
