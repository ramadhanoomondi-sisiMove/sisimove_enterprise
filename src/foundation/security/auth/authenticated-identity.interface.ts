// -----------------------------------------------------------------------------
// Authentication — Authenticated Identity
// -----------------------------------------------------------------------------
//
// Request-scoped representation of the authenticated credentials.
//
// JwtStrategy verifies the access token and converts the canonical JWT
// TokenPayload into this request-facing representation.
//
// Passport attaches this object to:
//
//     request.user
//
// This type intentionally uses application-facing property names rather than
// JWT claim names.
//
// JWT:
//
//     sub → identityPublicId
//     sid → sessionPublicId
//     jti → tokenId
//     ver → authenticationVersion
//
// AuthenticatedIdentity does NOT:
//
// - verify tokens;
// - generate tokens;
// - evaluate permissions;
// - load Identity aggregates;
// - load Session aggregates;
// - access Prisma;
// - modify authentication state.
//
// Authentication is handled by JwtAuthGuard / JwtStrategy.
//
// Authorization is handled by PermissionsGuard.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type { TokenPayload } from '../../../foundation/security/jwt-token-service.interface';

// =============================================================================
// Authenticated Identity
// =============================================================================

export interface AuthenticatedIdentity {
  /**
   * Public identifier of the authenticated Identity.
   *
   * Source:
   *
   *     JWT.sub
   */
  readonly identityPublicId: TokenPayload['sub'];

  /**
   * Public identifier of the authenticated Session.
   *
   * Source:
   *
   *     JWT.sid
   */
  readonly sessionPublicId: TokenPayload['sid'];

  /**
   * Unique identifier of the access token.
   *
   * Source:
   *
   *     JWT.jti
   */
  readonly tokenId: TokenPayload['jti'];

  /**
   * Authentication/password-version snapshot carried by the access token.
   *
   * Source:
   *
   *     JWT.ver
   */
  readonly authenticationVersion: TokenPayload['ver'];

  /**
   * Authorization role snapshot carried by the access token.
   */
  readonly roles: readonly string[];

  /**
   * Authorization permission snapshot carried by the access token.
   */
  readonly permissions: readonly string[];
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticatedIdentity;
