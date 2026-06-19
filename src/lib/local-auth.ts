export type LocalAccount = { name: string; email: string; passwordHash: string };

const ACCOUNT_KEY = "ecopulse-local-account";

export async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function getLocalAccount(): LocalAccount | null {
  try {
    const value = localStorage.getItem(ACCOUNT_KEY);
    return value ? (JSON.parse(value) as LocalAccount) : null;
  } catch {
    return null;
  }
}

export function saveLocalAccount(account: LocalAccount) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

export function startLocalSession() {
  document.cookie = "ecopulse-local=true; path=/; max-age=2592000; samesite=lax";
  document.cookie = "ecopulse-demo=; path=/; max-age=0";
}

export function endLocalSession() {
  document.cookie = "ecopulse-local=; path=/; max-age=0";
}
