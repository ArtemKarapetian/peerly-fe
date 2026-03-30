import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { queryClient } from "@/shared/api/queryClient";
import { FeatureFlagsProvider } from "@/shared/lib/feature-flags-provider";

import { AuthProvider, RoleProvider } from "@/entities/user";

import { ThemeProvider } from "./theme";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
