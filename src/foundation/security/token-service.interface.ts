// src/foundation/security/token-service.interface.ts

export interface TokenPayload {
  /**
   * Internal database UUID.
   */
  readonly sub: string;

  /**
   * Public identity id.
   */
  readonly publicId: string;

  /**
   * Email at token issuance.
   */
  readonly email: string;

  /**
   * Identity type.
   */
  readonly type: string;

  /**
   * Identity status.
   */
  readonly status: string;

  readonly roles?: readonly string[];

  readonly permissions?: readonly string[];

  readonly correlationId?: string;
}

export interface TokenService {
  generateAccessToken(payload: TokenPayload): Promise<string>;

  generateRefreshToken(payload: TokenPayload): Promise<string>;

  verifyToken<T = TokenPayload>(token: string): Promise<T>;
}
