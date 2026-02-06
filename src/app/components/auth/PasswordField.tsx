import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordField - Поле пароля с возможностью показать/скрыть
 */

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full max-w-[280px]">
        {label && (
          <label className="block text-[13px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`
              w-full px-5 py-3 pr-12 border-2 rounded-[100px] 
              text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] 
              placeholder:text-[#767692] 
              focus:outline-none focus:ring-2 transition-all
              ${error 
                ? 'border-[#d4183d] focus:border-[#d4183d] focus:ring-[#d4183d]/20' 
                : 'border-[#21214f] focus:border-[#21214f] focus:ring-[#21214f]/20'
              }
              ${className}
            `}
            {...props}
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767692] hover:text-[#21214f] transition-colors focus:outline-none"
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {error && (
          <p className="mt-1.5 text-[12px] font-['Work_Sans:Regular',sans-serif] text-[#d4183d] px-2">
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p className="mt-1.5 text-[12px] font-['Work_Sans:Regular',sans-serif] text-[#767692] px-2">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
