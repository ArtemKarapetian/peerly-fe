import { useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { SideNav } from "../navigation/SideNavRoleAware.tsx";
import { TopBar } from "../navigation/TopBar.tsx";

// Главный layout: sidebar на десктопе/планшете, drawer на мобиле
// Брейкпоинты — desktop 1200+, tablet 800-1199, mobile <800

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

const getInitialCollapsed = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 800 && window.innerWidth < 1200;
};

export function AppShell({ children, title }: AppShellProps) {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(getInitialCollapsed);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setIsSidebarCollapsed(newWidth >= 800 && newWidth < 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.title = title ? `${title} — Peerly` : "Peerly";
  }, [title]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const getSideNavVariant = () => {
    if (windowWidth < 800) return "mobile-drawer";
    if (windowWidth < 1200) return isSidebarCollapsed ? "tablet-collapsed" : "tablet-expanded";
    return isSidebarCollapsed ? "desktop-collapsed" : "desktop-expanded";
  };

  const variant = getSideNavVariant();
  const isMobile = windowWidth < 800;
  const isDesktopOrTablet = windowWidth >= 800;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-text-inverse focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {t("common.skipToContent", "Skip to content")}
      </a>

      {isDesktopOrTablet && (
        <SideNav
          variant={variant}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      {isMobile && (
        <>
          <SideNav
            variant="mobile-drawer"
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {isMobile && <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} title={title} />}

        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          <div className="w-full max-w-[1200px] mx-auto px-6 py-6 tablet:px-6 desktop:px-10 min-h-full">
            {children}
          </div>

          <footer className="w-full border-t border-border bg-background mt-auto">
            <div className="w-full max-w-[1200px] mx-auto px-6 py-4 tablet:px-6 desktop:px-10">
              <div className="flex flex-col tablet:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
                <nav className="flex items-center gap-4">
                  <Link to="/help" className="hover:text-foreground transition-colors">
                    {t("footer.help")}
                  </Link>
                  <Link to="/status" className="hover:text-foreground transition-colors">
                    {t("footer.status")}
                  </Link>
                  <Link to="/terms" className="hover:text-foreground transition-colors">
                    {t("footer.terms")}
                  </Link>
                </nav>
                <p className="text-sm">© {new Date().getFullYear()} Peerly</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
