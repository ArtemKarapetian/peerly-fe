import { InputHTMLAttributes, forwardRef } from 'react';

/**
 * TextField - Переиспользуемый компонент текстового поля с валидацией
 */

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full max-w-[280px]">
        {label && (
          <label className="block text-[13px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-2">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          type="text"
          className={`
            w-full px-5 py-3 border-2 rounded-[100px] 
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

TextField.displayName = 'TextField';
