// src/domains/identity/application/contracts/login-result.ts

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
