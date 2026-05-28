import type { ReactNode } from "react";

import { PublicLayout } from "@/widgets/public-layout";

interface VerifyShellProps {
  children: ReactNode;
}

export function VerifyShell({ children }: VerifyShellProps) {
  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8 text-center space-y-4">
          {children}
        </div>
      </div>
    </PublicLayout>
  );
}
