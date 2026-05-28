import type { ReactNode } from "react";

interface LandingContainerProps {
  children: ReactNode;
  className?: string;
}

export function LandingContainer({ children, className = "" }: LandingContainerProps) {
  return (
    <div className={`max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12 ${className}`}>
      {children}
    </div>
  );
}
