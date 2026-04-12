import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminSession,
  ADMIN_COOKIE_NAME,
  SESSION_DURATION,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Identifiants requis" },
        { status: 400 }
      );
    }

    if (!verifyAdminCredentials(username, password)) {
      // Add a small delay to prevent brute force
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const sessionId = createAdminSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION / 1000,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
