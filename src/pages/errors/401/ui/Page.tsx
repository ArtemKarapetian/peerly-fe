import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Error401Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        {/* Error code */}
        <div className="space-y-2">
          <h1 className="text-6xl font-semibold text-foreground/40">401</h1>
          <h2 className="text-2xl font-semibold text-foreground">{t("errors.authRequired")}</h2>
        </div>

        {/* Explanation */}
        <p className="text-muted-foreground">{t("errors.authRequiredDesc")}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => void navigate("/login")}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            {t("auth.signIn")}
          </button>
          <button
            onClick={() => void navigate("/")}
            className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            {t("errors.toHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
