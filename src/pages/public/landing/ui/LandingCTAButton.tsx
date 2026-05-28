import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { defaultRouteForRole, useAuth } from "@/entities/user";

interface LandingCTAButtonProps {
  size?: "compact" | "large";
}

const SIZE_CLASSES: Record<NonNullable<LandingCTAButtonProps["size"]>, string> = {
  compact: "px-5 py-2 text-sm rounded-[var(--radius-md)]",
  large:
    "px-6 py-3 rounded-[var(--radius-md)] shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
};

export function LandingCTAButton({ size = "compact" }: LandingCTAButtonProps) {
  const { t } = useTranslation();
  const { isAuthenticated, session } = useAuth();
  const navigate = useNavigate();

  const target = isAuthenticated ? defaultRouteForRole(session?.role) : ROUTES.register;
  const label = isAuthenticated ? t("page.landing.openDashboard") : t("page.landing.getStarted");

  return (
    <button
      onClick={() => void navigate(target)}
      className={`inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground font-medium transition-all ${SIZE_CLASSES[size]}`}
    >
      {label}
    </button>
  );
}
