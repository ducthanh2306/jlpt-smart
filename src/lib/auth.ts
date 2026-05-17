import type { UserRole } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "jlpt_session";

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production");
  }

  return "dev-only-auth-secret-change-me";
}

function getAuthSecretKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecretKey());
}

export async function verifySessionToken(token?: string | null): Promise<SessionUser | null> {
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getAuthSecretKey(), {
      algorithms: ["HS256"],
    });

    const sub = verified.payload.sub;
    const role = verified.payload.role;
    const name = verified.payload.name;
    const email = verified.payload.email;

    if (
      typeof sub !== "string" ||
      typeof role !== "string" ||
      typeof name !== "string" ||
      typeof email !== "string"
    ) {
      return null;
    }

    if (role !== "USER" && role !== "ADMIN") {
      return null;
    }

    return {
      userId: sub,
      role,
      name,
      email,
    };
  } catch {
    return null;
  }
}

export async function readSessionUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
