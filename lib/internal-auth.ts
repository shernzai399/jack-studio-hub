import type { Role } from "@/lib/types";

const sessionKey = "jack-studio-service-session";
const usersKey = "jack-studio-service-users";
const superAdminId = "shern98";
const superAdminPassword = "980703";

export type InternalSession = {
  userId: string;
  displayName: string;
  role: Role;
};

type InternalUser = InternalSession & {
  passwordHash: string;
  createdAt: string;
};

const roleLabels: Record<Role, string> = {
  store_staff: "Store Staff",
  store_manager: "Store Manager",
  service_admin: "Hub Admin",
  inventory_admin: "Inventory Admin",
  super_admin: "Super Admin"
};

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const hash = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getRegisteredUsers(): InternalUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = window.localStorage.getItem(usersKey);
  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as InternalUser[];
  } catch {
    window.localStorage.removeItem(usersKey);
    return [];
  }
}

function saveRegisteredUsers(users: InternalUser[]) {
  window.localStorage.setItem(usersKey, JSON.stringify(users));
}

function saveSession(session: InternalSession) {
  window.sessionStorage.setItem(sessionKey, JSON.stringify(session));
}

export async function signInInternal(userId: string, password: string) {
  const cleanUserId = userId.trim();

  if (cleanUserId === superAdminId && password === superAdminPassword) {
    const session: InternalSession = {
      userId: superAdminId,
      displayName: "Super Admin",
      role: "super_admin"
    };

    saveSession(session);
    return session;
  }

  const user = getRegisteredUsers().find((registeredUser) => registeredUser.userId === cleanUserId);
  const passwordHash = await hashPassword(password);

  if (!user || user.passwordHash !== passwordHash) {
    throw new Error("Invalid ID or password.");
  }

  const session: InternalSession = {
    userId: user.userId,
    displayName: user.displayName,
    role: user.role
  };

  saveSession(session);
  return session;
}

export async function registerInternalUser(input: {
  userId: string;
  displayName: string;
  password: string;
  role: Role;
}) {
  const userId = input.userId.trim();
  const displayName = input.displayName.trim();

  if (!userId || !displayName || !input.password) {
    throw new Error("ID, name, and password are required.");
  }

  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  if (userId === superAdminId) {
    throw new Error("This ID is already reserved for the main Super Admin.");
  }

  const users = getRegisteredUsers();
  if (users.some((user) => user.userId === userId)) {
    throw new Error("This ID is already registered.");
  }

  users.push({
    userId,
    displayName,
    role: input.role,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString()
  });
  saveRegisteredUsers(users);

  return {
    userId,
    displayName,
    role: input.role,
    roleLabel: roleLabels[input.role]
  };
}

export function getInternalSession(): InternalSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.sessionStorage.getItem(sessionKey);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as InternalSession;
  } catch {
    window.sessionStorage.removeItem(sessionKey);
    return null;
  }
}

export function signOutInternal() {
  window.sessionStorage.removeItem(sessionKey);
}

export { roleLabels };
