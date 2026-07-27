import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ADMIN } from "./admin-config";

const COOKIE = "pogeun_admin_session";

function jwtSecret(): Uint8Array {
  const raw =
    process.env.ADMIN_JWT_SECRET?.trim() ||
    "pogeun-shelter-admin-secret-2026";
  return new TextEncoder().encode(raw);
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN.username && password === ADMIN.password;
}

export async function createSession(): Promise<string> {
  return new SignJWT({ role: "admin", user: ADMIN.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(jwtSecret());
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, jwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  return verifySession(token);
}

/** 로그인 응답에 세션 쿠키를 붙일 때 사용 */
export function sessionCookieOptions(req?: Request) {
  const proto =
    req?.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: proto === "https",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export { COOKIE as ADMIN_COOKIE };
