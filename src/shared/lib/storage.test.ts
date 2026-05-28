import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { STORAGE_KEYS } from "@/shared/config/constants";

import { storage } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("setJSON + getJSON round-trip the typed value for a known key", () => {
    const value = {
      userId: "u-1",
      userName: "Alice",
      email: "a@x",
      role: "Student" as const,
    };
    storage.setJSON(STORAGE_KEYS.session, value);
    expect(storage.getJSON(STORAGE_KEYS.session)).toEqual(value);
  });

  it("getJSON returns null when nothing stored", () => {
    expect(storage.getJSON(STORAGE_KEYS.session)).toBeNull();
  });

  it("getJSON tolerates malformed JSON by returning null", () => {
    localStorage.setItem(STORAGE_KEYS.session, "{broken");
    expect(storage.getJSON(STORAGE_KEYS.session)).toBeNull();
  });

  it("get returns the raw string value", () => {
    storage.set(STORAGE_KEYS.language, "ru");
    expect(storage.get(STORAGE_KEYS.language)).toBe("ru");
  });

  it("remove deletes the stored key", () => {
    storage.set(STORAGE_KEYS.theme, "dark");
    storage.remove(STORAGE_KEYS.theme);
    expect(storage.get(STORAGE_KEYS.theme)).toBeNull();
  });

  it("set tolerates throwing setItem (quota exceeded) silently", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => {
      storage.set(STORAGE_KEYS.theme, "dark");
    }).not.toThrow();
  });

  it("get tolerates throwing getItem silently and returns null", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(storage.get(STORAGE_KEYS.theme)).toBeNull();
  });

  it("remove tolerates throwing removeItem silently", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => {
      storage.remove(STORAGE_KEYS.theme);
    }).not.toThrow();
  });
});
