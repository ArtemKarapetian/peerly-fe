import { Eye, EyeOff } from "lucide-react";
import { forwardRef, InputHTMLAttributes, ReactNode, useId, useState } from "react";
import { useTranslation } from "react-i18next";

const INPUT_BASE_CLASSES = `
  w-full px-4 py-2.5
  bg-[var(--surface)]
  border border-[var(--surface-border)]
  rounded-[var(--radius-md)]
  text-[var(--text-primary)]
  placeholder:text-[var(--text-tertiary)]
  focus:outline-none
  focus:ring-2
  focus:ring-[var(--brand-primary)]/30
  focus:border-[var(--brand-primary)]
  disabled:opacity-50
  disabled:cursor-not-allowed
  transition-all
`;

const INPUT_ERROR_CLASSES =
  "border-[var(--error)] focus:ring-[var(--error)]/30 focus:border-[var(--error)]";

interface BaseFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

interface InputProps extends BaseFieldProps {
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, helperText, id, endAdornment, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        className={`${INPUT_BASE_CLASSES} ${endAdornment ? "pr-12" : ""} ${error ? INPUT_ERROR_CLASSES : ""} ${className}`}
        {...props}
      />
    );
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-2"
          >
            {label}
          </label>
        )}
        {endAdornment ? (
          <div className="relative">
            {inputElement}
            {endAdornment}
          </div>
        ) : (
          inputElement
        )}
        {error && <p className="mt-1.5 text-xs text-[var(--error)]">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export const PasswordInput = forwardRef<HTMLInputElement, BaseFieldProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  return (
    <Input
      ref={ref}
      type={showPassword ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={t(showPassword ? "feature.auth.hidePassword" : "feature.auth.showPassword")}
          aria-pressed={showPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      }
      {...props}
    />
  );
});

// eslint-disable-next-line sonarjs/no-hardcoded-passwords
PasswordInput.displayName = "PasswordInput";
