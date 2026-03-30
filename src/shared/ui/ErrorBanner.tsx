import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-error-light border border-error/20 rounded-[16px] p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="text-[15px] text-error">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-error-light hover:bg-error/20 text-error rounded-[12px] text-[14px] font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t("shared.errorBanner.retry")}
          </button>
        )}
      </div>
    </div>
  );
}
