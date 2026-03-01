import { ReactNode } from "react";

import { Button } from "@/shared/ui/button.tsx";

import { useAuth } from "@/entities/user";

import { ProfileDropdown } from "@/widgets/navigation/ProfileDropdown.tsx";

/**
 * PublicTopBar - Минималистичный topbar для публичных страниц
 * Показывает либо кнопку "Войти", либо Profile dropdown
 */

interface PublicTopBarProps {
  showAuthControls?: boolean;
}

export function PublicTopBar({ showAuthControls = true }: PublicTopBarProps) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-4 tablet:px-6 desktop:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#/"
          className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          Peerly
        </a>

        {/* Navigation & Actions */}
        {showAuthControls && (
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <ProfileDropdown userName="Пользователь" />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => (window.location.hash = "/login")}
              >
                Войти
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
  showFooter?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PublicLayout({
  children,
  showTopBar = true,
  showLoginButton = true,
  showFooter = true,
  maxWidth = "full",
}: PublicLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-[640px]",
    md: "max-w-[768px]",
    lg: "max-w-[1024px]",
    xl: "max-w-[1200px]",
    full: "max-w-none",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar */}
      {showTopBar && <PublicTopBar showAuthControls={showLoginButton} />}

      {/* Main Content */}
      <main
        className={`flex-1 w-full ${maxWidthClasses[maxWidth]} ${maxWidth !== "full" ? "mx-auto" : ""}`}
      >
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="w-full border-t border-border bg-background py-6">
          <div className="max-w-[1200px] mx-auto px-4 tablet:px-6 desktop:px-8">
            <div className="flex flex-col tablet:flex-row justify-between items-center gap-4">
              {/* Links */}
              <nav className="flex items-center gap-4">
                <a
                  href="#/help"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Помощь
                </a>
                <a
                  href="#/status"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Статус
                </a>
                <a
                  href="#/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Условия
                </a>
              </nav>

              {/* Copyright */}
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Peerly</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
