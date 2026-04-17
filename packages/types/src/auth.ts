export type UserRole = 'user' | 'admin';

export interface Credential {
  username: string;
  password: string;
  market: string;
  displayName: string;
  role: UserRole;
}

export interface SessionPayload {
  username: string;
  market: string;
  displayName: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
