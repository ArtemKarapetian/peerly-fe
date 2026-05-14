import { Eye, EyeOff } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useId, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, helperText, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
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
        <input
          ref={ref}
          id={inputId}
          className={`
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
            ${error ? "border-[var(--error)] focus:ring-[var(--error)]/30 focus:border-[var(--error)]" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[var(--error)]">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = "", error, label, helperText, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;

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
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={`
              w-full px-4 py-2.5 pr-12
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
              ${error ? "border-[var(--error)] focus:ring-[var(--error)]/30 focus:border-[var(--error)]" : ""}
              ${className}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-[var(--error)]">{error}</p>}
        {helperText && <p className="mt-1.5 text-xs text-[var(--text-tertiary)]">{helperText}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
