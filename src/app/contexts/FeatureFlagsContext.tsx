import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * FeatureFlagsContext - Управление feature flags с localStorage персистентностью
 */

interface FeatureFlags {
  commentsEnabled: boolean;
  // Добавьте другие флаги здесь
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  toggleFlag: (key: keyof FeatureFlags) => void;
}

const defaultFlags: FeatureFlags = {
  commentsEnabled: false, // Off by default
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    const stored = localStorage.getItem('peerly_feature_flags');
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
    localStorage.setItem('peerly_feature_flags', JSON.stringify(flags));
  }, [flags]);

  const toggleFlag = (key: keyof FeatureFlags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, toggleFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}
