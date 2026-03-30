import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * PasswordField - Поле пароля с возможностью показать/скрыть
 */

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full max-w-[280px]">
        {label && (
          <label className="block text-[13px] font-['Work_Sans:Medium',sans-serif] text-foreground mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`
              w-full px-5 py-3 pr-12 border-2 rounded-[100px] 
              text-[14px] font-['Work_Sans:Medium',sans-serif] text-foreground
              placeholder:text-text-tertiary
              focus:outline-none focus:ring-2 transition-all
              ${
                error
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-foreground focus:border-foreground focus:ring-foreground/20"
              }
              ${className}
            `}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            aria-label={
              showPassword ? t("feature.auth.hidePassword") : t("feature.auth.showPassword")
            }
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <p className="mt-1.5 text-[12px] font-['Work_Sans:Regular',sans-serif] text-destructive px-2">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-[12px] font-['Work_Sans:Regular',sans-serif] text-muted-foreground px-2">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";
