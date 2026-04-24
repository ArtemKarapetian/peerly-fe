import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { STORAGE_KEYS } from "@/shared/config/constants";

import i18n from "./i18n/config";

const STORAGE_KEY = STORAGE_KEYS.demoToolsVisible;

function readStored(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === null ? true : v === "true";
  } catch {
    return true;
  }
}

let visible = readStored();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): boolean {
  return visible;
}

export function setDemoToolsVisible(next: boolean): void {
  if (visible === next) return;
  visible = next;
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // ignore storage errors
  }
  emit();
}

export function toggleDemoToolsVisibility(): void {
  setDemoToolsVisible(!visible);
}

export function useDemoToolsVisible(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Mounts a global Alt+Shift+D listener that toggles demo widgets
 * (role switcher, dev error panel, etc) on/off.
 */
export function useDemoToolsHotkey(): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey || !e.shiftKey || e.ctrlKey || e.metaKey) return;
      if (e.code !== "KeyD" && e.key.toLowerCase() !== "d") return;
      e.preventDefault();
      toggleDemoToolsVisibility();
      toast(visible ? i18n.t("demoTools.shown") : i18n.t("demoTools.hidden"), {
        duration: 1500,
      });
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
}
