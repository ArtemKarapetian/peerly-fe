import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" storageKey={STORAGE_KEYS.theme}>
      {children}
    </NextThemesProvider>
  );
}
