import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteSuccessScreenProps {
  onGoToLanding: () => void;
}

export function DeleteSuccessScreen({ onGoToLanding }: DeleteSuccessScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {t("widget.deleteAccount.successTitle")}
          </h1>
          <p className="text-muted-foreground">{t("widget.deleteAccount.successDesc")}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-left">
          <p className="text-sm text-muted-foreground">{t("widget.deleteAccount.successNote")}</p>
        </div>

        <button
          onClick={onGoToLanding}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          {t("widget.deleteAccount.goToLanding")}
        </button>
      </div>
    </div>
  );
}
