import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { LandingContainer } from "./LandingContainer";

export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <LandingContainer>
        <div className="flex flex-col tablet:flex-row justify-between items-center gap-4">
          <nav className="flex items-center gap-6">
            <Link
              to={ROUTES.help}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("page.landing.footerHelp")}
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Peerly</p>
        </div>
      </LandingContainer>
    </footer>
  );
}
