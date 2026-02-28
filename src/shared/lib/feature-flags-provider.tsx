import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FeatureFlags {
  commentsEnabled: boolean;
  supportChat: boolean;
  twoFactor: boolean;
  enableEmailConfirmation: boolean;
  enablePasswordReset: boolean;
  deleteAccount: boolean;
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
}

const defaultFlags: FeatureFlags = {
  commentsEnabled: false,
  supportChat: false,
  twoFactor: false,
  enableEmailConfirmation: false,
  enablePasswordReset: false,
  deleteAccount: false,
};

const FeatureFlags = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    const stored = localStorage.getItem("peerly_feature_flags");
    if (stored) {
      try {
        return { ...defaultFlags, ...JSON.parse(stored) };
      } catch {
        return defaultFlags;
      }
    }
    return defaultFlags;
  });

  useEffect(() => {
    localStorage.setItem("peerly_feature_flags", JSON.stringify(flags));
  }, [flags]);

  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: value }));
  };

  return <FeatureFlags.Provider value={{ flags, updateFlag }}>{children}</FeatureFlags.Provider>;
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlags);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  return context;
}
