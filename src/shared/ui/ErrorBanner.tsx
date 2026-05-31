import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ApiError, humanizeApiError } from "@/shared/api";

interface ErrorBannerProps {
  message?: string;
  error?: unknown;
  onRetry?: () => void;
}

function pickStatusFallback(error: unknown, t: (k: string) => string): string {
  if (error instanceof ApiError) {
    if (error.status === 404) return t("shared.errorBanner.notFound");
    if (error.status === 403) return t("shared.errorBanner.forbidden");
    if (error.status >= 500) return t("shared.errorBanner.serverError");
  }
  return t("shared.errorBanner.fallback");
}

export function ErrorBanner({ message, error, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();
  const fallback = pickStatusFallback(error, t);
  const text = message ?? humanizeApiError(error, fallback);
  return (
    <div className="bg-error-light border border-error/20 rounded-lg p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="text-15 text-error whitespace-pre-line">{text}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-error-light hover:bg-error/20 text-error rounded-md text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t("shared.errorBanner.retry")}
          </button>
        )}
      </div>
    </div>
  );
}
