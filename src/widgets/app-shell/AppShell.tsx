import { useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { SideNav } from "../navigation/SideNavRoleAware.tsx";
import { TopBar } from "../navigation/TopBar.tsx";

/**
 * AppShell - Главный layout-компонент приложения Peerly
 *
 * Responsive архитектура:
 *
 * Desktop (≥1200px):
 * ┌─────────────┬──────────────────────────┐
 * │ SideNav     │ Content Area             │
 * │ 260px       │ max-w-[1200px] centered  │
 * │ expanded    │ with 40px gutters        │
 * │             │ Grid: 1fr + 360-420px    │
 * └─────────────┴──────────────────────────┘
 *
 * Tablet (800-1199px):
 * ┌────┬──────────────────────────────────┐
 * │Side│ Content Area                     │
 * │80px│ max-w-[1200px] centered          │
 * │col.│ single column, 24px gutters      │
 * └────┴──────────────────────────────────┘
 *
 * Mobile (<800px):
 * ┌──────────────────────────────────────┐
 * │ TopBar + Drawer                      │
 * │ Content: max-w-[1200px], 24px gutters│
 * └──────────────────────────────────────┘
 *
 * Брейкпоинты:
 * - Desktop: ≥1200px — expanded sidebar (260px)
 * - Tablet: 800-1199px — collapsed sidebar (80px)
 * - Mobile: <800px — drawer navigation
 *
 * Content Container:
 * - Unified max-width: 1200px across all breakpoints
 * - Centered with margin: auto
 * - Responsive gutters: Desktop 40px, Tablet/Mobile 24px
 *
 * Grid System:
 * - Desktop Task Layout: 1fr (main) + minmax(360px, 420px) (right rail)
 * - Right rail is sticky within viewport on desktop
 * - Mobile/Tablet: Single column (1fr)
 */

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

// Get initial sidebar state based on window width
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

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      // Update sidebar collapsed state together with width
      setIsSidebarCollapsed(newWidth >= 800 && newWidth < 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update browser tab title
  useEffect(() => {
    document.title = title ? `${title} — Peerly` : "Peerly";
  }, [title]);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
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

  // Determine which variant to show
  const getSideNavVariant = () => {
    if (windowWidth < 800) {
      return "mobile-drawer";
    } else if (windowWidth < 1200) {
      // Tablet: use collapsed/expanded based on state
      return isSidebarCollapsed ? "tablet-collapsed" : "tablet-expanded";
    } else {
      // Desktop: use collapsed/expanded based on state
      return isSidebarCollapsed ? "desktop-collapsed" : "desktop-expanded";
    }
  };

  const variant = getSideNavVariant();
  const isMobile = windowWidth < 800;
  const isDesktopOrTablet = windowWidth >= 800;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation - Always rendered for Desktop/Tablet */}
      {isDesktopOrTablet && (
        <SideNav
          variant={variant}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <SideNav
            variant="mobile-drawer"
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </>
      )}

      {/* Content Area - FILL container */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar - только для mobile */}
        {isMobile && <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} title={title} />}

        {/* Main Content with max-width container */}
        <main className="flex-1 overflow-y-auto">
          {/* Global content container: max-width 1200px, responsive gutters */}
          <div className="w-full max-w-[1200px] mx-auto px-6 py-6 tablet:px-6 desktop:px-10 min-h-full">
            {children}
          </div>

          {/* Footer - Authenticated Pages */}
          <footer className="w-full border-t border-border bg-background mt-auto">
            <div className="w-full max-w-[1200px] mx-auto px-6 py-4 tablet:px-6 desktop:px-10">
              <div className="flex flex-col tablet:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
                <nav className="flex items-center gap-4">
                  <a href="#/help" className="hover:text-foreground transition-colors">
                    {t("footer.help")}
                  </a>
                  <a href="#/status" className="hover:text-foreground transition-colors">
                    {t("footer.status")}
                  </a>
                  <a href="#/terms" className="hover:text-foreground transition-colors">
                    {t("footer.terms")}
                  </a>
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
