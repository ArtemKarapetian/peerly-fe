import * as Sentry from "@sentry/react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";

function FallbackUI() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-6xl">⚠</div>
      <h1 className="text-2xl font-semibold">{t("errors.unexpected", "Something went wrong")}</h1>
      <p className="max-w-md text-muted-foreground">
        {t(
          "errors.unexpectedDescription",
          "An unexpected error occurred. Please try refreshing the page.",
        )}
      </p>
      <Button onClick={() => window.location.reload()} variant="outline">
        {t("errors.reload", "Reload page")}
      </Button>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <Sentry.ErrorBoundary fallback={<FallbackUI />}>{children}</Sentry.ErrorBoundary>;
}
