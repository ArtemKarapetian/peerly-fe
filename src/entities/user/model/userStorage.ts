/**
 * User Storage Utility
 *
 * Mock user storage for demo authentication
 * Stores registered users in localStorage
 */

export interface StoredUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string; // In real app, this would be hashed server-side
  createdAt: string;
}

const STORAGE_KEY = "peerly_demo_users";

// Demo built-in users
const BUILT_IN_USERS: StoredUser[] = [
  {
    id: "demo-1",
    firstName: "Demo",
    lastName: "User",
    username: "demo",
    email: "demo@example.com",
    password: "demo",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "demo-2",
    firstName: "Ivan",
    lastName: "Petrov",
    username: "ivan.petrov",
    email: "ivan.petrov@university.edu",
    password: "password123",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

/**
 * Get all stored users (built-in + registered)
 */
export function getAllUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const customUsers = stored ? JSON.parse(stored) : [];
    return [...BUILT_IN_USERS, ...customUsers];
  } catch (e) {
    console.error("Failed to load users:", e);
    return BUILT_IN_USERS;
  }
}

/**
 * Check if username or email already exists
 */
export function userExists(
  username: string,
  email: string,
): { exists: boolean; field?: "username" | "email" } {
  const users = getAllUsers();

  const usernameExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  if (usernameExists) {
    return { exists: true, field: "username" };
  }

  const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return { exists: true, field: "email" };
  }

  return { exists: false };
}

/**
 * Authenticate user with identifier (username or email) and password
 */
export function authenticateUser(identifier: string, password: string): StoredUser | null {
  const users = getAllUsers();
  const normalizedIdentifier = identifier.toLowerCase().trim();

  const user = users.find(
    (u) =>
      (u.username.toLowerCase() === normalizedIdentifier ||
        u.email.toLowerCase() === normalizedIdentifier) &&
      u.password === password,
  );

  return user || null;
}

/**
 * Register a new user
 */
export function registerUser(userData: Omit<StoredUser, "id" | "createdAt">): StoredUser {
  const users = getAllUsers().filter((u) => !BUILT_IN_USERS.includes(u)); // Get only custom users

  const newUser: StoredUser = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  return newUser;
}

/**
 * Get user by username or email
 */
export function getUserByIdentifier(identifier: string): StoredUser | null {
  const users = getAllUsers();
  const normalizedIdentifier = identifier.toLowerCase().trim();

  return (
    users.find(
      (u) =>
        u.username.toLowerCase() === normalizedIdentifier ||
        u.email.toLowerCase() === normalizedIdentifier,
    ) || null
  );
}
