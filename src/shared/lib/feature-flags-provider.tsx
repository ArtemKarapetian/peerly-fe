import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants";

import { getFeatureFlags, setFeatureFlag as persistFlag, type FeatureFlags } from "./feature-flags";

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
}

const FeatureFlagsCtx = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(() => getFeatureFlags());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.featureFlags, JSON.stringify(flags));
  }, [flags]);

  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    persistFlag(key, value);
    setFlags((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FeatureFlagsCtx.Provider value={{ flags, updateFlag }}>{children}</FeatureFlagsCtx.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsCtx);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  return context;
}
