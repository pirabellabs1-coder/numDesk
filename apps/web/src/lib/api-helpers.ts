import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import type { ZodType } from "zod";

export async function withAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError("Non autorisé");
  }

  return { supabase, user };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      data,
      meta: {
        requestId: randomUUID(),
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      error: { code, message },
    },
    { status }
  );
}

export async function validateBody<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? "Données invalides");
  }
  return result.data;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return apiError("UNAUTHORIZED", error.message, 401);
  }
  if (error instanceof ValidationError) {
    return apiError("VALIDATION_ERROR", error.message, 422);
  }
  console.error("API Error:", error);
  return apiError("INTERNAL_ERROR", "Erreur interne du serveur", 500);
}
