import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-red-50 border border-red-200 rounded-[16px] p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-[15px] text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-[12px] text-[14px] font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t("shared.errorBanner.retry")}
          </button>
        )}
      </div>
    </div>
  );
}
