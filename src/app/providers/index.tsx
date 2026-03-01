import { ReactNode } from "react";

import { FeatureFlagsProvider } from "@/shared/lib/feature-flags-provider";

import { AuthProvider, RoleProvider } from "@/entities/user";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <RoleProvider>
        <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
      </RoleProvider>
    </AuthProvider>
  );
};
