/**
 * Client-side session record.
 *
 * The gateway keeps the access + refresh tokens in httpOnly cookies — the
 * browser JS can't read them. We still need a small, non-sensitive record
 * of "who is logged in" so the UI can render the correct shell and pick
 * the right role-scoped endpoints. That record lives here.
 */

import { STORAGE_KEYS } from "@/shared/config/constants";
import { storage } from "@/shared/lib/storage";

import type { Id, Role } from "./types";

export interface Session {
  userId: Id;
  userName: string;
  email: string;
  role: Role;
}

export function getSession(): Session | null {
  return storage.getJSON<Session>(STORAGE_KEYS.session);
}

export function setSession(session: Session): void {
  storage.setJSON(STORAGE_KEYS.session, session);
}

export function clearSession(): void {
  storage.remove(STORAGE_KEYS.session);
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
