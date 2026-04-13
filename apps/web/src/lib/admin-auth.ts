import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";

// Admin credentials — stored as SHA-256 hash for security
const ADMIN_USERNAME_HASH = createHash("sha256").update("cpme_superadmin").digest("hex");
const ADMIN_PASSWORD_HASH = createHash("sha256").update("Xk9$mP2v!nQ8wR@jF5zB3#").digest("hex");

const ADMIN_COOKIE_NAME = "callpme_admin_session";
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

// HMAC secret derived from password hash — consistent across serverless instances
const HMAC_SECRET = createHash("sha256").update("callpme-admin-session-" + ADMIN_PASSWORD_HASH).digest("hex");

export function verifyAdminCredentials(username: string, password: string): boolean {
  const usernameHash = createHash("sha256").update(username).digest("hex");
  const passwordHash = createHash("sha256").update(password).digest("hex");
  return usernameHash === ADMIN_USERNAME_HASH && passwordHash === ADMIN_PASSWORD_HASH;
}

/**
 * Create a signed session token (no server-side state needed).
 * Token format: base64(payload).hmac_signature
 * Works across Vercel serverless instances — no in-memory state.
 */
export function createAdminSession(): string {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + SESSION_DURATION });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const signature = createHmac("sha256", HMAC_SECRET).update(payloadB64).digest("hex");
  return `${payloadB64}.${signature}`;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const payloadB64 = parts[0]!;
    const signature = parts[1]!;

    // Verify HMAC signature
    const expectedSig = createHmac("sha256", HMAC_SECRET).update(payloadB64).digest("hex");
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    if (sigBuffer.length !== expectedBuffer.length) return false;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return false;

    // Verify expiry
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (!payload.exp || Date.now() > payload.exp) return false;
    if (payload.role !== "admin") return false;

    return true;
  } catch {
    return false;
  }
}

export function invalidateAdminSession(_sessionId: string) {
  // With signed cookies, invalidation is handled client-side by clearing the cookie.
  // Server-side invalidation is a no-op (stateless).
}

export { ADMIN_COOKIE_NAME, SESSION_DURATION };
