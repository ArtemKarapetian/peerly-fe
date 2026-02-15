import { ReactNode } from "react";

import { AuthProvider } from "@/app/providers/auth";
import { RoleProvider } from "@/app/providers/role";
import { FeatureFlagsProvider } from "@/app/providers/feature-flags";

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
