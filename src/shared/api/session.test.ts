import { describe, it, expect, beforeEach } from "vitest";

import { STORAGE_KEYS } from "@/shared/config/constants";

import { getSession, setSession, clearSession, type Session } from "./session";

const sample: Session = {
  userId: "user-1",
  userName: "Alice",
  email: "alice@example.com",
  role: "Student",
};

describe("session", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getSession returns null when nothing stored", () => {
    expect(getSession()).toBeNull();
  });

  it("setSession persists JSON to localStorage under the session key", () => {
    setSession(sample);
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(sample);
  });

  it("getSession returns the stored session", () => {
    setSession(sample);
    expect(getSession()).toEqual(sample);
  });

  it("clearSession removes the stored session", () => {
    setSession(sample);
    clearSession();
    expect(getSession()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });

  it("getSession returns null when stored JSON is malformed", () => {
    localStorage.setItem(STORAGE_KEYS.session, "{not-json");
    expect(getSession()).toBeNull();
  });
});
