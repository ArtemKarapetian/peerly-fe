import { ReactNode } from "react";

/**
 * AuthCard - Карточка для формы аутентификации
 */

interface AuthCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <>
      {/* Title */}
      <h1 className="text-[32px] tablet:text-[40px] leading-[1.05] tracking-[-1.8px] text-[#21214f] font-['Work_Sans:Regular',sans-serif] text-center">
        {title}
      </h1>

      {/* Form Content */}
      {children}

      {/* Footer (Sign up link, etc) */}
      {footer && footer}
    </>
  );
}
