// -----------------------------------------------------------------------------
// Infrastructure — Security — JWT Strategy
// -----------------------------------------------------------------------------
//
// Passport strategy responsible for extracting and cryptographically
// validating access tokens.
//
// Passport performs:
//
// - Bearer-token extraction;
// - JWT signature verification;
// - issuer validation;
// - audience validation;
// - algorithm validation;
// - expiration validation.
//
// This strategy additionally validates the application-level structure of the
// access-token payload and converts it into AuthenticatedIdentity.
//
// Passport attaches the result of validate() to:
//
//     request.user
//
// This strategy does NOT:
//
// - query Prisma;
// - load Identity;
// - load Session;
// - decide whether a Session is revoked;
// - decide whether an Identity is active;
// - evaluate permissions;
// - modify authentication state.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable, UnauthorizedException } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Passport
// -----------------------------------------------------------------------------

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type { TokenPayload } from '../../foundation/security/jwt-token-service.interface';

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import type { AuthenticatedIdentity } from '../../foundation/security/auth/authenticated-identity.interface';

// =============================================================================
// JWT Strategy
// =============================================================================

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor() {
    // -------------------------------------------------------------------------
    // JWT Secret
    // -------------------------------------------------------------------------

    const secret = process.env.JWT_ACCESS_SECRET?.trim();

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is required.');
    }

    if (secret.length < 32) {
      throw new Error('JWT_ACCESS_SECRET must contain at least 32 characters.');
    }

    // -------------------------------------------------------------------------
    // JWT Issuer
    // -------------------------------------------------------------------------

    const issuer = process.env.JWT_ISSUER?.trim();

    if (!issuer) {
      throw new Error('JWT_ISSUER is required.');
    }

    // -------------------------------------------------------------------------
    // JWT Audience
    // -------------------------------------------------------------------------

    const audience = process.env.JWT_AUDIENCE?.trim();

    if (!audience) {
      throw new Error('JWT_AUDIENCE is required.');
    }

    // -------------------------------------------------------------------------
    // Passport JWT Configuration
    // -------------------------------------------------------------------------

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: secret,

      issuer,

      audience,

      algorithms: ['HS256'],

      ignoreExpiration: false,
    });
  }

  // ===========================================================================
  // Validate
  // ===========================================================================
  //
  // Passport invokes validate() only after the JWT has passed:
  //
  // - signature validation;
  // - issuer validation;
  // - audience validation;
  // - algorithm validation;
  // - expiration validation.
  //
  // This method validates the application-specific token structure and creates
  // the authenticated request principal.
  //
  // ===========================================================================

  public validate(payload: TokenPayload): AuthenticatedIdentity {
    // -------------------------------------------------------------------------
    // Payload
    // -------------------------------------------------------------------------

    if (!payload || typeof payload !== 'object') {
      throw new UnauthorizedException('Invalid access token.');
    }

    // -------------------------------------------------------------------------
    // Token Type
    // -------------------------------------------------------------------------

    if (payload.typ !== 'access') {
      throw new UnauthorizedException('Invalid access token type.');
    }

    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    if (typeof payload.sub !== 'string' || payload.sub.trim().length === 0) {
      throw new UnauthorizedException('Access token identity is missing.');
    }

    // -------------------------------------------------------------------------
    // Session
    // -------------------------------------------------------------------------

    if (typeof payload.sid !== 'string' || payload.sid.trim().length === 0) {
      throw new UnauthorizedException('Access token session is missing.');
    }

    // -------------------------------------------------------------------------
    // JWT Identifier
    // -------------------------------------------------------------------------

    if (typeof payload.jti !== 'string' || payload.jti.trim().length === 0) {
      throw new UnauthorizedException('Access token identifier is missing.');
    }

    // -------------------------------------------------------------------------
    // Authentication Version
    // -------------------------------------------------------------------------

    if (
      typeof payload.ver !== 'number' ||
      !Number.isSafeInteger(payload.ver) ||
      payload.ver < 1
    ) {
      throw new UnauthorizedException('Invalid authentication version.');
    }

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------

    const roles = Object.freeze([...(payload.roles ?? [])]);

    // -------------------------------------------------------------------------
    // Permissions
    // -------------------------------------------------------------------------

    const permissions = Object.freeze([...(payload.permissions ?? [])]);

    // -------------------------------------------------------------------------
    // Authenticated Identity
    // -------------------------------------------------------------------------

    return {
      identityPublicId: payload.sub,
      sessionPublicId: payload.sid,
      tokenId: payload.jti,
      authenticationVersion: payload.ver,
      roles,
      permissions,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JwtStrategy;
