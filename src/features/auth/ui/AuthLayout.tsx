import { ReactNode } from "react";

/**
 * AuthLayout - Layout-компонент для страниц аутентификации
 * Центрирует контент вертикально и горизонтально
 */

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-white py-12 tablet:py-16 desktop:py-20 px-4">
      <div className="w-full max-w-[400px] flex flex-col gap-6 items-center">{children}</div>
    </div>
  );
}
