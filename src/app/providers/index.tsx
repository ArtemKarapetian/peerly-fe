import { ReactNode } from "react";

import { AuthProvider, RoleProvider } from "@/entities/user";
import { FeatureFlagsProvider } from "@/shared/lib/feature-flags-provider";

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
