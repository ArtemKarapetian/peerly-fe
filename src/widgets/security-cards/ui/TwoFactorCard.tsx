import { Shield, Smartphone, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useFeatureFlags } from "@/shared/lib/feature-flags-provider";

export function TwoFactorCard() {
  const { t } = useTranslation();
  const { flags } = useFeatureFlags();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const handleComplete = () => {
    setTwoFactorEnabled(true);
    setShowSetup(false);
  };

  const handleDisable = () => {
    if (confirm(t("widget.twoFactor.confirmDisable"))) {
      setTwoFactorEnabled(false);
    }
  };

  if (!flags.twoFactor) {
    return (
      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-muted rounded-[8px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-muted-foreground" />
          </div>
          <h2 className="text-[20px] font-medium text-foreground">{t("widget.twoFactor.title")}</h2>
        </div>
        <div className="flex items-start gap-3 p-4 bg-muted rounded-[12px]">
          <AlertTriangle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[14px] text-foreground mb-1">
              {t("widget.twoFactor.notEnabledInOrg")}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {t("widget.twoFactor.contactAdmin")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-[20px] font-medium text-foreground">{t("widget.twoFactor.title")}</h2>
      </div>

      <p className="text-[14px] text-muted-foreground mb-6">{t("widget.twoFactor.subtitle")}</p>

      {!twoFactorEnabled && !showSetup && (
        <div>
          <div className="flex items-start gap-3 p-4 bg-muted rounded-[12px] mb-4">
            <Smartphone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[14px] text-foreground mb-1 font-medium">
                {t("widget.twoFactor.notConfigured")}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {t("widget.twoFactor.useAuthenticatorApp")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
          >
            {t("widget.twoFactor.setup2FA")}
          </button>
        </div>
      )}

      {showSetup && !twoFactorEnabled && (
        <div>
          <div className="bg-muted rounded-[12px] p-6 mb-4">
            <h3 className="text-[16px] font-medium text-foreground mb-4">
              {t("widget.twoFactor.step1Title")}
            </h3>
            <div className="bg-card border-2 border-border rounded-[12px] w-[200px] h-[200px] mx-auto flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-32 h-32 bg-muted rounded-[8px] mb-2 mx-auto" />
                <p className="text-[12px] text-muted-foreground">
                  {t("widget.twoFactor.qrCodeDemo")}
                </p>
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground text-center mb-4">
              {t("widget.twoFactor.useGoogleAuth")}
            </p>
            <p className="text-[12px] text-muted-foreground text-center font-mono bg-card px-3 py-2 rounded-[8px]">
              {t("widget.twoFactor.keyLabel")}: DEMO KEY ABCD 1234 EFGH 5678
            </p>
          </div>

          <div className="bg-muted rounded-[12px] p-6 mb-6">
            <h3 className="text-[16px] font-medium text-foreground mb-4">
              {t("widget.twoFactor.step2Title")}
            </h3>
            <div className="bg-card border-2 border-border rounded-[12px] p-4 mb-4">
              <div className="grid grid-cols-2 gap-3">
                {["1234-5678", "9012-3456", "7890-1234", "4567-8901", "2345-6789", "6789-0123"].map(
                  (code, idx) => (
                    <div
                      key={idx}
                      className="text-[13px] font-mono text-foreground bg-muted px-3 py-2 rounded-[8px] text-center"
                    >
                      {code}
                    </div>
                  ),
                )}
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">
              {t("widget.twoFactor.saveCodesNote")}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
            >
              {t("widget.twoFactor.completeSetup")}
            </button>
            <button
              onClick={() => setShowSetup(false)}
              className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
            >
              {t("widget.twoFactor.cancel")}
            </button>
          </div>
        </div>
      )}

      {twoFactorEnabled && (
        <div>
          <div className="flex items-start gap-3 p-4 bg-accent/20 border-2 border-accent rounded-[12px] mb-4">
            <CheckCircle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[14px] text-foreground mb-1 font-medium">
                {t("widget.twoFactor.enabled")}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {t("widget.twoFactor.accountProtected")}
              </p>
            </div>
          </div>
          <button
            onClick={handleDisable}
            className="px-6 py-3 border-2 border-destructive text-destructive rounded-[12px] hover:bg-destructive/10 transition-colors text-[15px] font-medium"
          >
            {t("widget.twoFactor.disable2FA")}
          </button>
        </div>
      )}
    </div>
  );
}
