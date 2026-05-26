import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants";

import { getDemoFlags, setDemoFlag as persistFlag, type DemoFlags } from "./demo-flags";

interface DemoFlagsContextType {
  flags: DemoFlags;
  updateFlag: (key: keyof DemoFlags, value: boolean) => void;
}

const DemoFlagsCtx = createContext<DemoFlagsContextType | undefined>(undefined);

export function DemoFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<DemoFlags>(() => getDemoFlags());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.demoFlags, JSON.stringify(flags));
  }, [flags]);

  const updateFlag = (key: keyof DemoFlags, value: boolean) => {
    persistFlag(key, value);
    setFlags((prev) => ({ ...prev, [key]: value }));
  };

  return <DemoFlagsCtx.Provider value={{ flags, updateFlag }}>{children}</DemoFlagsCtx.Provider>;
}

export function useDemoFlags() {
  const context = useContext(DemoFlagsCtx);
  if (context === undefined) {
    throw new Error("useDemoFlags must be used within a DemoFlagsProvider");
  }
  return context;
}
