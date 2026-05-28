import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, Field, TextField } from "@/shared/ui";

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

  const canSubmit = passwordData.current && passwordData.new && passwordData.confirm;

  return (
    <>
      {showSuccess && (
        <div className="mb-6 p-4 bg-accent rounded-md flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-accent-foreground" />
          <p className="text-sm text-accent-foreground font-medium">
            {t("widget.changePassword.successMessage")}
          </p>
        </div>
      )}

      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
            <Lock className="w-5 h-5 text-accent-foreground" />
          </div>
          <h2 className="text-xl font-medium text-foreground">
            {t("widget.changePassword.title")}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{t("widget.changePassword.subtitle")}</p>

        {passwordErrors.length > 0 && <ValidationErrors errors={passwordErrors} />}

        <div className="space-y-4">
          <PasswordField
            label={t("widget.changePassword.currentPassword")}
            placeholder={t("widget.changePassword.currentPasswordPlaceholder")}
            value={passwordData.current}
            visible={showPasswords.current}
            onChange={(v) => setPasswordData({ ...passwordData, current: v })}
            onToggleVisibility={() => togglePasswordVisibility("current")}
          />

          <PasswordField
            label={t("widget.changePassword.newPassword")}
            placeholder={t("widget.changePassword.newPasswordPlaceholder")}
            value={passwordData.new}
            visible={showPasswords.new}
            hint={t("widget.changePassword.passwordHint")}
            onChange={(v) => setPasswordData({ ...passwordData, new: v })}
            onToggleVisibility={() => togglePasswordVisibility("new")}
          />

          <PasswordField
            label={t("widget.changePassword.confirmPassword")}
            placeholder={t("widget.changePassword.confirmPasswordPlaceholder")}
            value={passwordData.confirm}
            visible={showPasswords.confirm}
            onChange={(v) => setPasswordData({ ...passwordData, confirm: v })}
            onToggleVisibility={() => togglePasswordVisibility("confirm")}
          />
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          <button
            onClick={handleChangePassword}
            disabled={!canSubmit}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors text-15 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("widget.changePassword.changePasswordButton")}
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 border-2 border-border text-foreground rounded-md hover:bg-muted/50 transition-colors text-15 font-medium"
          >
            {t("widget.changePassword.cancel")}
          </button>
        </div>
      </Card>
    </>
  );
}

function ValidationErrors({ errors }: { errors: string[] }) {
  const { t } = useTranslation();
  return (
    <div className="mb-4 p-4 bg-destructive/10 border-2 border-destructive rounded-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive mb-2">
            {t("widget.changePassword.validationErrors")}
          </p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-13 text-destructive">
                {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  hint?: string;
  onChange: (v: string) => void;
  onToggleVisibility: () => void;
}

function PasswordField({
  label,
  placeholder,
  value,
  visible,
  hint,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <Field label={label}>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <TextField
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </Field>
  );
}
