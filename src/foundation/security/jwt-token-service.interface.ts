// -----------------------------------------------------------------------------
// Foundation — Security — JWT Token Service
// -----------------------------------------------------------------------------
//
// Application-facing abstraction for short-lived JWT access tokens.
//
// The foundation defines the contract.
// Infrastructure provides the concrete JWT implementation.
//
// JWTs are used ONLY for short-lived access credentials.
//
// Refresh tokens are intentionally excluded from this abstraction because
// refresh tokens are opaque cryptographically random credentials handled by
// the Session / authentication workflow.
//
// -----------------------------------------------------------------------------
//
// Access Token Claims
//
// Application input:
//
//     identityPublicId
//     sessionPublicId
//     authenticationVersion
//     roles?
//     permissions?
//
// -----------------------------------------------------------------------------
//
// Access Token Payload
//
// Final JWT claims:
//
//     sub
//         Identity public ID.
//
//     sid
//         Session public ID.
//
//     jti
//         Unique JWT identifier.
//
//     typ
//         access.
//
//     ver
//         Authentication/password version snapshot.
//
//     roles
//         Optional authorization role snapshot.
//
//     permissions
//         Optional authorization permission snapshot.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// - This abstraction does not know JWT secrets.
// - This abstraction does not access Prisma.
// - This abstraction does not load Identity.
// - This abstraction does not validate session state.
// - This abstraction does not determine whether an Identity is active.
// - This abstraction does not perform authorization.
//
// Token verification only establishes that the token itself is authentic and
// structurally valid. Application authentication remains responsible for
// checking current Identity, Authentication, and Session state.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Token Payload
// =============================================================================

/**
 * Canonical representation of a verified access-token payload.
 *
 * This is the representation reused by the authentication boundary after
 * cryptographic JWT verification.
 */
export interface TokenPayload {
  /**
   * Identity public ID represented by the JWT `sub` claim.
   */
  readonly sub: string;

  /**
   * Session public ID represented by the JWT `sid` claim.
   */
  readonly sid: string;

  /**
   * Unique JWT identifier represented by the JWT `jti` claim.
   */
  readonly jti: string;

  /**
   * Token type.
   *
   * This foundation currently supports access tokens only.
   */
  readonly typ: 'access';

  /**
   * Authentication/password version snapshot.
   *
   * Incrementing the Authentication password version can invalidate
   * previously issued access tokens when the application compares this
   * snapshot against current authentication state.
   */
  readonly ver: number;

  /**
   * Optional role authorization snapshot.
   *
   * Roles are represented by their stable public authorization identifiers
   * or codes, according to the application's authorization policy.
   */
  readonly roles?: readonly string[];

  /**
   * Optional permission authorization snapshot.
   *
   * Permissions are represented by their stable permission codes.
   *
   * Example:
   *
   *     identity.read
   *     identity.update
   *     verification.review
   *
   * The permission snapshot allows authorization guards to evaluate the
   * already-verified token without making the JWT infrastructure responsible
   * for loading RolePermission relationships.
   */
  readonly permissions?: readonly string[];
}

// =============================================================================
// Access Token Claims
// =============================================================================

/**
 * Application-level claims used when creating an access token.
 *
 * These are deliberately different from TokenPayload because infrastructure
 * is responsible for creating JWT-specific claims such as `jti`, `sub`, and
 * `typ`.
 */
export interface AccessTokenClaims {
  /**
   * Identity public ID represented by the access token.
   */
  readonly identityPublicId: string;

  /**
   * Session public ID represented by the access token.
   */
  readonly sessionPublicId: string;

  /**
   * Current Authentication password/version snapshot.
   */
  readonly authenticationVersion: number;

  /**
   * Optional role authorization snapshot.
   */
  readonly roles?: readonly string[];

  /**
   * Optional permission authorization snapshot.
   *
   * Permission values should normally be stable permission codes rather
   * than database/internal IDs.
   */
  readonly permissions?: readonly string[];
}

// =============================================================================
// JWT Token Service
// =============================================================================

/**
 * Foundation abstraction for access-token generation and verification.
 *
 * Infrastructure implementations are responsible for:
 *
 * - signing JWTs;
 * - cryptographically verifying JWTs;
 * - enforcing JWT issuer/audience/algorithm;
 * - decoding tokens when explicitly required as untrusted data.
 *
 * Implementations MUST NOT introduce application concerns such as:
 *
 * - loading Identity;
 * - loading Session;
 * - checking SessionStatus;
 * - checking IdentityStatus;
 * - checking AuthenticationStatus;
 * - evaluating permissions;
 * - accessing Prisma.
 */
export interface JwtTokenService {
  /**
   * Creates a short-lived access token.
   *
   * The implementation generates JWT-specific values such as:
   *
   * - `jti`;
   * - `sub`;
   * - `sid`;
   * - `typ`.
   */
  signAccessToken(claims: AccessTokenClaims): string;

  /**
   * Cryptographically verifies an access token and returns its verified
   * payload.
   *
   * Verification must enforce the implementation's configured:
   *
   * - signature;
   * - issuer;
   * - audience;
   * - algorithm;
   * - expiration;
   * - access-token type;
   * - required application claims.
   */
  verifyAccessToken(token: string): TokenPayload;

  /**
   * Decodes an access token WITHOUT authenticating it.
   *
   * The returned value MUST be treated as untrusted data.
   *
   * This method must never be used by an authentication guard to establish
   * the authenticated Identity.
   */
  decodeAccessToken(token: string): TokenPayload | null;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JwtTokenService;
