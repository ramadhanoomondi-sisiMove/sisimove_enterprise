// -----------------------------------------------------------------------------
// Infrastructure — Security — JWT Strategy
// -----------------------------------------------------------------------------
//
// Passport strategy responsible for extracting and cryptographically
// validating access tokens.
//
// This strategy intentionally does NOT:
//
// - query Prisma;
// - load Identity;
// - load Session;
// - decide whether a Session is revoked;
// - decide whether an Identity is active;
// - perform authorization.
//
// Those concerns belong to the authentication/application layer.
//
// The JWT contains:
//
//     sub -> identityPublicId
//     sid -> sessionPublicId
//     jti -> token identifier
//     typ -> access
//     ver -> authentication/password version snapshot
//     roles -> optional authorization snapshot
//
// IMPORTANT:
//
// JwtStrategy performs cryptographic JWT validation through Passport/JWT.
//
// Application-level authentication checks such as:
//
// - Identity status;
// - Session status;
// - Authentication status;
// - authentication version;
//
// remain outside this strategy.
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

// =============================================================================
// Authenticated Request User
// =============================================================================
//
// Passport places the result of validate() on:
//
//     request.user
//
// This representation is intentionally transport-facing.
//
// It does NOT represent the Identity aggregate.
//
// It represents the authenticated credentials carried by the access token.
//
// =============================================================================

export interface AuthenticatedRequestUser {
  readonly identityPublicId: string;
  readonly sessionPublicId: string;
  readonly tokenId: string;
  readonly authenticationVersion: number;
  readonly roles: readonly string[];
}

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
    //
    // Passport performs:
    //
    // - Bearer-token extraction;
    // - signature verification;
    // - issuer validation;
    // - audience validation;
    // - algorithm validation;
    // - expiration validation.
    //
    // The application-specific payload validation is performed below in
    // validate().
    //
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
  // Passport invokes this method only after the JWT has successfully passed
  // the configured cryptographic and standard JWT checks.
  //
  // This method validates the application-specific access-token structure and
  // converts the canonical TokenPayload into the request.user representation.
  //
  // It does NOT:
  //
  // - query repositories;
  // - load Identity;
  // - load Session;
  // - check SessionStatus;
  // - check IdentityStatus;
  // - perform authorization.
  //
  // ===========================================================================

  public validate(payload: TokenPayload): AuthenticatedRequestUser {
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
    //
    // Roles are an optional authorization snapshot.
    //
    // They are copied into a new frozen array so request.user cannot mutate
    // the array owned by the decoded JWT payload.
    //
    // -------------------------------------------------------------------------

    const roles = Object.freeze([...(payload.roles ?? [])]);

    // -------------------------------------------------------------------------
    // Authenticated Request User
    // -------------------------------------------------------------------------

    return {
      identityPublicId: payload.sub,
      sessionPublicId: payload.sid,
      tokenId: payload.jti,
      authenticationVersion: payload.ver,
      roles,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JwtStrategy;
