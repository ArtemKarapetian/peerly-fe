import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button.tsx";

import { defaultRouteForRole, useAuth } from "@/entities/user";

import { ProfileDropdown } from "@/widgets/navigation";

/**
 * PublicTopBar - Минималистичный topbar для публичных страниц
 * Показывает либо кнопку "Войти", либо Profile dropdown
 */

interface PublicTopBarProps {
  showAuthControls?: boolean;
}

export function PublicTopBar({ showAuthControls = true }: PublicTopBarProps) {
  const { isAuthenticated, session } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const ctaTarget = isAuthenticated ? defaultRouteForRole(session?.role) : ROUTES.register;
  const ctaLabel = isAuthenticated ? t("page.landing.openDashboard") : t("page.landing.getStarted");

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12 h-16 flex items-center justify-between">
        <Link
          to={ROUTES.landing}
          className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          Peerly
        </Link>

        {showAuthControls && (
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Button variant="primary" size="sm" onClick={() => void navigate(ctaTarget)}>
                {ctaLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * PublicLayout - Layout для публичных страниц
 * Чистый, современный дизайн без sidebar
 */

interface PublicLayoutProps {
  children: ReactNode;
  showTopBar?: boolean;
  showLoginButton?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PublicLayout({
  children,
  showTopBar = true,
  showLoginButton = true,
  maxWidth = "full",
}: PublicLayoutProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const maxWidthClasses = {
    sm: "max-w-[640px]",
    md: "max-w-[768px]",
    lg: "max-w-[1024px]",
    xl: "max-w-[1200px]",
    full: "max-w-none",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showTopBar && <PublicTopBar showAuthControls={showLoginButton} />}

      <main
        className={`flex-1 w-full ${maxWidthClasses[maxWidth]} ${maxWidth !== "full" ? "mx-auto" : ""}`}
      >
        {children}
      </main>

      <footer className="w-full border-t border-border bg-background py-6">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12">
          <div className="flex flex-col tablet:flex-row justify-between items-center gap-4">
            <nav className="flex items-center gap-4">
              <Link
                to={ROUTES.help}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("widget.publicLayout.help")}
              </Link>
              <Link
                to={ROUTES.terms}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("widget.publicLayout.terms")}
              </Link>
            </nav>

            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Peerly</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
