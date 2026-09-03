// -----------------------------------------------------------------------------
// Infrastructure — Security — JWT Token Service
// -----------------------------------------------------------------------------
//
// Concrete infrastructure implementation of the Foundation
// JwtTokenService abstraction.
//
// Responsibilities:
//
// - sign short-lived JWT access tokens;
// - cryptographically verify JWT access tokens;
// - decode JWTs for non-authentication purposes;
// - enforce JWT issuer;
// - enforce JWT audience;
// - enforce HS256;
// - validate application-specific access-token claims.
//
// JWTs are NOT used as refresh tokens.
//
// Refresh tokens remain opaque cryptographically random credentials and are
// handled independently by the Session / authentication workflow.
//
// IMPORTANT:
//
// - JWT secrets remain inside Infrastructure.
// - JwtService remains an Infrastructure concern.
// - This service does not access Prisma.
// - This service does not load Identity.
// - This service does not load Session.
// - This service does not determine whether a Session is revoked.
// - This service does not determine whether an Identity is active.
// - This service does not perform authorization.
// - decodeAccessToken() NEVER authenticates a request.
//
// Required environment variables:
//
//     JWT_ACCESS_SECRET
//     JWT_ISSUER
//     JWT_AUDIENCE
//
// Optional:
//
//     JWT_ACCESS_EXPIRES_IN
//
// Default:
//
//     15m
//
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import {
  JwtService,
  type JwtSignOptions,
  type JwtVerifyOptions,
} from '@nestjs/jwt';
import type { StringValue } from 'ms';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type {
  AccessTokenClaims,
  JwtTokenService as JwtTokenServiceContract,
  TokenPayload,
} from '../../foundation/security/jwt-token-service.interface';

// =============================================================================
// Infrastructure JWT Token Service
// =============================================================================

@Injectable()
export class JwtTokenService implements JwtTokenServiceContract {
  // ===========================================================================
  // Configuration
  // ===========================================================================

  /**
   * Default short-lived access-token lifetime.
   */
  private static readonly DEFAULT_ACCESS_EXPIRES_IN: StringValue = '15m';

  /**
   * Only HS256 is accepted.
   *
   * The JwtModule configuration must use the same algorithm.
   */
  private static readonly ALGORITHM = 'HS256';

  // ===========================================================================
  // State
  // ===========================================================================

  private readonly issuer: string;

  private readonly audience: string;

  /**
   * Resolved and validated access-token lifetime.
   *
   * Always contains a valid duration.
   */
  private readonly expiresIn: NonNullable<JwtSignOptions['expiresIn']>;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly jwtService: JwtService) {
    this.issuer = JwtTokenService.requiredEnv('JWT_ISSUER');

    this.audience = JwtTokenService.requiredEnv('JWT_AUDIENCE');

    this.expiresIn = JwtTokenService.resolveExpiresIn(
      process.env.JWT_ACCESS_EXPIRES_IN,
    );
  }

  // ===========================================================================
  // Sign Access Token
  // ===========================================================================

  /**
   * Signs a short-lived JWT access token.
   *
   * The application supplies application-level claims.
   *
   * Infrastructure creates JWT-specific claims:
   *
   * - sub;
   * - sid;
   * - jti;
   * - typ;
   * - ver.
   *
   * Authorization snapshots may contain:
   *
   * - roles;
   * - permissions.
   */
  public signAccessToken(claims: AccessTokenClaims): string {
    JwtTokenService.validateClaims(claims);

    const payload: TokenPayload = {
      sub: claims.identityPublicId,
      sid: claims.sessionPublicId,
      jti: randomUUID(),
      typ: 'access',
      ver: claims.authenticationVersion,

      // -----------------------------------------------------------------------
      // Role Authorization Snapshot
      // -----------------------------------------------------------------------

      ...(claims.roles !== undefined
        ? {
            roles: [...claims.roles],
          }
        : {}),

      // -----------------------------------------------------------------------
      // Permission Authorization Snapshot
      // -----------------------------------------------------------------------

      ...(claims.permissions !== undefined
        ? {
            permissions: [...claims.permissions],
          }
        : {}),
    };

    const options: JwtSignOptions = {
      issuer: this.issuer,
      audience: this.audience,
      expiresIn: this.expiresIn,
      subject: claims.identityPublicId,
      algorithm: JwtTokenService.ALGORITHM,
    };

    return this.jwtService.sign(payload, options);
  }

  // ===========================================================================
  // Verify Access Token
  // ===========================================================================

  /**
   * Cryptographically verifies and validates an access token.
   *
   * Verification includes:
   *
   * 1. signature verification;
   * 2. algorithm enforcement;
   * 3. issuer validation;
   * 4. audience validation;
   * 5. expiration validation;
   * 6. application payload validation.
   *
   * This method does NOT:
   *
   * - load Identity;
   * - load Session;
   * - check SessionStatus;
   * - check IdentityStatus;
   * - check AuthenticationStatus;
   * - perform authorization.
   */
  public verifyAccessToken(token: string): TokenPayload {
    if (typeof token !== 'string' || token.trim().length === 0) {
      throw new Error('Access token must be a non-empty string.');
    }

    const options: JwtVerifyOptions = {
      issuer: this.issuer,
      audience: this.audience,
      algorithms: [JwtTokenService.ALGORITHM],
      ignoreExpiration: false,
    };

    const payload = this.jwtService.verify<TokenPayload>(token, options);

    JwtTokenService.validatePayload(payload);

    return payload;
  }

  // ===========================================================================
  // Decode Access Token
  // ===========================================================================

  /**
   * Decodes a JWT WITHOUT authenticating it.
   *
   * SECURITY WARNING:
   *
   * decode() does NOT verify:
   *
   * - signature;
   * - issuer;
   * - audience;
   * - expiration;
   * - algorithm.
   *
   * Therefore the returned value MUST be treated as untrusted data.
   *
   * This method MUST NOT be used by JwtAuthGuard or any authentication
   * mechanism to establish identity.
   */
  public decodeAccessToken(token: string): TokenPayload | null {
    if (typeof token !== 'string' || token.trim().length === 0) {
      return null;
    }

    const payload = this.jwtService.decode<TokenPayload>(token);

    if (payload === null || typeof payload !== 'object') {
      return null;
    }

    return payload;
  }

  // ===========================================================================
  // Validate JWT Payload
  // ===========================================================================

  /**
   * Validates application-specific JWT claims after cryptographic
   * verification.
   *
   * Standard JWT claims such as:
   *
   * - exp;
   * - iat;
   * - iss;
   * - aud;
   *
   * are validated by JwtService.
   *
   * This method validates the application's custom claims.
   */
  private static validatePayload(payload: TokenPayload): void {
    if (payload === null || typeof payload !== 'object') {
      throw new Error('Invalid JWT payload.');
    }

    // -------------------------------------------------------------------------
    // Identity Subject
    // -------------------------------------------------------------------------

    if (typeof payload.sub !== 'string' || payload.sub.trim().length === 0) {
      throw new Error('JWT identity subject is missing.');
    }

    // -------------------------------------------------------------------------
    // Session Identifier
    // -------------------------------------------------------------------------

    if (typeof payload.sid !== 'string' || payload.sid.trim().length === 0) {
      throw new Error('JWT session identifier is missing.');
    }

    // -------------------------------------------------------------------------
    // JWT Identifier
    // -------------------------------------------------------------------------

    if (typeof payload.jti !== 'string' || payload.jti.trim().length === 0) {
      throw new Error('JWT identifier is missing.');
    }

    // -------------------------------------------------------------------------
    // Token Type
    // -------------------------------------------------------------------------

    if (payload.typ !== 'access') {
      throw new Error('Invalid JWT token type.');
    }

    // -------------------------------------------------------------------------
    // Authentication Version
    // -------------------------------------------------------------------------

    if (
      typeof payload.ver !== 'number' ||
      !Number.isSafeInteger(payload.ver) ||
      payload.ver < 1
    ) {
      throw new Error('Invalid authentication version.');
    }

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------

    if (payload.roles !== undefined) {
      if (!Array.isArray(payload.roles)) {
        throw new Error('Invalid JWT roles claim.');
      }

      for (const role of payload.roles) {
        if (typeof role !== 'string' || role.trim().length === 0) {
          throw new Error('Invalid JWT role.');
        }
      }
    }

    // -------------------------------------------------------------------------
    // Permissions
    // -------------------------------------------------------------------------

    if (payload.permissions !== undefined) {
      if (!Array.isArray(payload.permissions)) {
        throw new Error('Invalid JWT permissions claim.');
      }

      for (const permission of payload.permissions) {
        if (typeof permission !== 'string' || permission.trim().length === 0) {
          throw new Error('Invalid JWT permission.');
        }
      }
    }
  }

  // ===========================================================================
  // Validate Application Claims
  // ===========================================================================

  /**
   * Validates claims supplied by the application before token creation.
   */
  private static validateClaims(claims: AccessTokenClaims): void {
    if (claims === null || typeof claims !== 'object') {
      throw new TypeError('Access token claims are required.');
    }

    // -------------------------------------------------------------------------
    // Identity Public ID
    // -------------------------------------------------------------------------

    if (
      typeof claims.identityPublicId !== 'string' ||
      claims.identityPublicId.trim().length === 0
    ) {
      throw new Error('Identity public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Session Public ID
    // -------------------------------------------------------------------------

    if (
      typeof claims.sessionPublicId !== 'string' ||
      claims.sessionPublicId.trim().length === 0
    ) {
      throw new Error('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Authentication Version
    // -------------------------------------------------------------------------

    if (
      !Number.isSafeInteger(claims.authenticationVersion) ||
      claims.authenticationVersion < 1
    ) {
      throw new Error(
        'Authentication version must be a positive safe integer.',
      );
    }

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------

    if (claims.roles !== undefined) {
      if (!Array.isArray(claims.roles)) {
        throw new Error('Access token roles must be an array.');
      }

      for (const role of claims.roles) {
        if (typeof role !== 'string' || role.trim().length === 0) {
          throw new Error('Access token roles must contain non-empty strings.');
        }
      }
    }

    // -------------------------------------------------------------------------
    // Permissions
    // -------------------------------------------------------------------------

    if (claims.permissions !== undefined) {
      if (!Array.isArray(claims.permissions)) {
        throw new Error('Access token permissions must be an array.');
      }

      for (const permission of claims.permissions) {
        if (typeof permission !== 'string' || permission.trim().length === 0) {
          throw new Error(
            'Access token permissions must contain non-empty strings.',
          );
        }
      }
    }
  }

  // ===========================================================================
  // Resolve JWT Expiration
  // ===========================================================================

  /**
   * Resolves and validates JWT_ACCESS_EXPIRES_IN.
   *
   * Supported duration examples:
   *
   *     1ms
   *     15s
   *     15m
   *     1h
   *     1d
   *     1w
   *     1y
   *
   * Zero and malformed values are rejected.
   */
  private static resolveExpiresIn(
    value: string | undefined,
  ): NonNullable<JwtSignOptions['expiresIn']> {
    // -------------------------------------------------------------------------
    // Default
    // -------------------------------------------------------------------------

    if (value === undefined || value.trim().length === 0) {
      return JwtTokenService.DEFAULT_ACCESS_EXPIRES_IN;
    }

    const normalized = value.trim();

    // -------------------------------------------------------------------------
    // Duration Validation
    // -------------------------------------------------------------------------

    if (!/^[1-9]\d*(?:ms|s|m|h|d|w|y)$/.test(normalized)) {
      throw new Error(
        'JWT_ACCESS_EXPIRES_IN must be a valid positive duration such as 15m, 1h, or 1d.',
      );
    }

    /**
     * Runtime validation above establishes that the value conforms to the
     * supported StringValue duration format.
     */
    return normalized as StringValue;
  }

  // ===========================================================================
  // Required Environment Variable
  // ===========================================================================

  /**
   * Reads a required environment variable.
   */
  private static requiredEnv(name: string): string {
    const value = process.env[name]?.trim();

    if (value === undefined || value.length === 0) {
      throw new Error(`${name} is required.`);
    }

    return value;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JwtTokenService;
