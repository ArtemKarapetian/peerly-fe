import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useChangePassword } from "@/features/security/change-password";

export function ChangePasswordCard() {
  const { t } = useTranslation();
  const {
    passwordData,
    setPasswordData,
    showPasswords,
    togglePasswordVisibility,
    passwordErrors,
    showSuccess,
    handleChangePassword,
    handleCancel,
  } = useChangePassword();

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-accent rounded-[12px] flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-accent-foreground" />
          <p className="text-[14px] text-accent-foreground font-medium">
            {t("widget.changePassword.successMessage")}
          </p>
        </div>
      )}

      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
            <Lock className="w-5 h-5 text-accent-foreground" />
          </div>
          <h2 className="text-[20px] font-medium text-foreground">
            {t("widget.changePassword.title")}
          </h2>
        </div>

        <p className="text-[14px] text-muted-foreground mb-6">
          {t("widget.changePassword.subtitle")}
        </p>

        {/* Password Errors */}
        {passwordErrors.length > 0 && (
          <div className="mb-4 p-4 bg-destructive/10 border-2 border-destructive rounded-[12px]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[14px] font-medium text-destructive mb-2">
                  {t("widget.changePassword.validationErrors")}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {passwordErrors.map((error, idx) => (
                    <li key={idx} className="text-[13px] text-destructive">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("widget.changePassword.currentPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
                placeholder={t("widget.changePassword.currentPasswordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("widget.changePassword.newPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
                placeholder={t("widget.changePassword.newPasswordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-2 text-[12px] text-muted-foreground">
              {t("widget.changePassword.passwordHint")}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("widget.changePassword.confirmPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
                placeholder={t("widget.changePassword.confirmPasswordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          <button
            onClick={handleChangePassword}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
          >
            {t("widget.changePassword.changePasswordButton")}
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
          >
            {t("widget.changePassword.cancel")}
          </button>
        </div>
      </div>
    </>
  );
}
