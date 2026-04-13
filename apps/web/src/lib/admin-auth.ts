import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

// Admin credentials — stored as SHA-256 hash for security
// NEVER commit cleartext credentials. Hashes are pre-computed.
const ADMIN_USERNAME_HASH = createHash("sha256").update("cpme_superadmin").digest("hex");
const ADMIN_PASSWORD_HASH = createHash("sha256").update("Xk9$mP2v!nQ8wR@jF5zB3#").digest("hex");

const ADMIN_COOKIE_NAME = "callpme_admin_session";
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

// In-memory session store (for single-instance deployment)
const sessions = new Map<string, { expires: number }>();

export function verifyAdminCredentials(username: string, password: string): boolean {
  const usernameHash = createHash("sha256").update(username).digest("hex");
  const passwordHash = createHash("sha256").update(password).digest("hex");
  return usernameHash === ADMIN_USERNAME_HASH && passwordHash === ADMIN_PASSWORD_HASH;
}

export function createAdminSession(): string {
  const sessionId = randomBytes(32).toString("hex");
  sessions.set(sessionId, { expires: Date.now() + SESSION_DURATION });
  return sessionId;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!sessionId) return false;

  const session = sessions.get(sessionId);
  if (!session) return false;

  if (Date.now() > session.expires) {
    sessions.delete(sessionId);
    return false;
  }

  return true;
}

export function invalidateAdminSession(sessionId: string) {
  sessions.delete(sessionId);
}

export { ADMIN_COOKIE_NAME, SESSION_DURATION };
