import { InputHTMLAttributes, forwardRef } from "react";

/**
 * TextField - Переиспользуемый компонент текстового поля с валидацией
 */

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full max-w-[280px]">
        {label && (
          <label className="block text-[13px] font-['Work_Sans:Medium',sans-serif] text-foreground mb-2">
            {label}
          </label>
        )}

        <input
          ref={ref}
          type="text"
          className={`
            w-full px-5 py-3 border-2 rounded-[100px] 
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

TextField.displayName = "TextField";
