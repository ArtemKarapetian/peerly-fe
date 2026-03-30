import { ReactNode } from "react";

import { FeatureFlagsProvider } from "@/shared/lib/feature-flags-provider";

import { AuthProvider, RoleProvider } from "@/entities/user";

import { ThemeProvider } from "./theme";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
