import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

/**
 * Alert - Компонент для отображения уведомлений и ошибок
 */

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  error: {
    container: 'bg-[#fef2f2] border-[#d4183d]',
    text: 'text-[#d4183d]',
    icon: AlertCircle,
  },
  success: {
    container: 'bg-[#f0fdf4] border-[#16a34a]',
    text: 'text-[#16a34a]',
    icon: CheckCircle,
  },
  info: {
    container: 'bg-[#eff6ff] border-[#3b82f6]',
    text: 'text-[#3b82f6]',
    icon: Info,
  },
};

export function Alert({ variant = 'error', children, onClose, className = '' }: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      className={`
        w-full max-w-[280px] px-4 py-3 border-2 rounded-[12px]
        flex items-start gap-3
        ${styles.container}
        ${className}
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.text}`} />
      
      <div className={`flex-1 text-[13px] font-['Work_Sans:Regular',sans-serif] ${styles.text}`}>
        {children}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className={`shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
