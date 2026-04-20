import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload, Credential } from '@product-portal/types';
import { SESSION_MAX_AGE, JWT_SECRET_ENV_KEY } from '@product-portal/constants';

// Each app uses a unique cookie name to avoid conflicts when running on the same domain
const SESSION_COOKIE_NAME = 'pp_session_a';
import credentials from '@product-portal/constants/credentials.json';

function getSecret(): Uint8Array {
  const secret = process.env[JWT_SECRET_ENV_KEY];
  if (!secret) throw new Error(`Missing env var: ${JWT_SECRET_ENV_KEY}`);
  return new TextEncoder().encode(secret);
}

export async function signSession(
  payload: Omit<SessionPayload, 'iat' | 'exp'>,
): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function findCredential(username: string, password: string): Credential | null {
  return (
    (credentials as Credential[]).find((c) => c.username === username && c.password === password) ?? null
  );
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE };
