import { describe, it, expect, beforeEach } from "vitest";

import {
  getAllUsers,
  userExists,
  authenticateUser,
  registerUser,
  getUserByIdentifier,
} from "./userStorage";

const STORAGE_KEY = "peerly_demo_users";

beforeEach(() => {
  localStorage.clear();
});

describe("getAllUsers", () => {
  it("returns built-in demo users when localStorage is empty", () => {
    const users = getAllUsers();
    expect(users.length).toBeGreaterThanOrEqual(2);

    const demo = users.find((u) => u.username === "demo");
    expect(demo).toBeDefined();
    expect(demo!.email).toBe("demo@example.com");

    const ivan = users.find((u) => u.username === "ivan.petrov");
    expect(ivan).toBeDefined();
    expect(ivan!.email).toBe("ivan.petrov@university.edu");
  });

  it("merges built-in users with custom users from localStorage", () => {
    const custom = [
      {
        id: "custom-1",
        username: "newuser",
        email: "new@example.com",
        password: "secret123",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));

    const users = getAllUsers();
    expect(users.find((u) => u.username === "demo")).toBeDefined();
    expect(users.find((u) => u.username === "ivan.petrov")).toBeDefined();
    expect(users.find((u) => u.username === "newuser")).toBeDefined();
    expect(users.length).toBeGreaterThanOrEqual(3);
  });
});

describe("userExists", () => {
  it("detects existing username (case-insensitive)", () => {
    const result = userExists("Demo", "unique@example.com");
    expect(result.exists).toBe(true);
    expect(result.field).toBe("username");
  });

  it("detects existing email (case-insensitive)", () => {
    const result = userExists("uniqueuser", "Demo@Example.Com");
    expect(result.exists).toBe(true);
    expect(result.field).toBe("email");
  });

  it("returns false for non-existing username and email", () => {
    const result = userExists("nonexistent", "nobody@nowhere.com");
    expect(result.exists).toBe(false);
    expect(result.field).toBeUndefined();
  });
});

describe("authenticateUser", () => {
  it("succeeds with username and correct password", () => {
    const user = authenticateUser("demo", "demo");
    expect(user).not.toBeNull();
    expect(user!.username).toBe("demo");
  });

  it("succeeds with email and correct password", () => {
    const user = authenticateUser("demo@example.com", "demo");
    expect(user).not.toBeNull();
    expect(user!.username).toBe("demo");
  });

  it("fails with wrong password", () => {
    const user = authenticateUser("demo", "wrongpassword");
    expect(user).toBeNull();
  });

  it("is case-insensitive for identifier and trims whitespace", () => {
    const user = authenticateUser("  Demo  ", "demo");
    expect(user).not.toBeNull();
    expect(user!.username).toBe("demo");
  });
});

describe("registerUser", () => {
  it("creates user and persists to localStorage", () => {
    const userData = {
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@example.com",
      password: "testpass123",
    };

    const created = registerUser(userData);

    expect(created.id).toBeDefined();
    expect(created.username).toBe("testuser");
    expect(created.email).toBe("test@example.com");
    expect(created.createdAt).toBeDefined();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as { username: string }[];
    expect(stored.length).toBe(1);
    expect(stored[0].username).toBe("testuser");
  });
});

describe("getUserByIdentifier", () => {
  it("finds user by username", () => {
    const user = getUserByIdentifier("demo");
    expect(user).not.toBeNull();
    expect(user!.email).toBe("demo@example.com");
  });

  it("finds user by email", () => {
    const user = getUserByIdentifier("ivan.petrov@university.edu");
    expect(user).not.toBeNull();
    expect(user!.username).toBe("ivan.petrov");
  });

  it("returns null for unknown identifier", () => {
    const user = getUserByIdentifier("nobody_here");
    expect(user).toBeNull();
  });
});
