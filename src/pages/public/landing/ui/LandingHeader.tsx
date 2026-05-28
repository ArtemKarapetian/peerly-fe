import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { LandingContainer } from "./LandingContainer";
import { LandingCTAButton } from "./LandingCTAButton";

export function LandingHeader() {
  return (
    <div className="w-full bg-background border-b border-border">
      <LandingContainer className="h-16 flex items-center justify-between">
        <Link
          to={ROUTES.landing}
          className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          Peerly
        </Link>

        <div className="flex items-center gap-3">
          <LandingCTAButton size="compact" />
        </div>
      </LandingContainer>
    </div>
  );
}
