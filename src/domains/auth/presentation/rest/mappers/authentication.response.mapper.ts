// -----------------------------------------------------------------------------
// Identity — Authentication Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the AuthenticationAggregate / AuthenticationEntity domain model into an
// application-facing response DTO.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Mapping principles:
//
// - Expose authentication-safe Authentication state.
// - Serialize value objects into primitives.
// - Expose the opaque public reference to Identity.
// - Expose authentication lifecycle state.
// - Expose password credential lifecycle metadata without exposing credentials.
// - Expose authentication failure state.
// - Expose authentication lock state.
// - Expose authentication audit state.
// - Do not expose passwordHash.
// - Do not expose internal persistence identifiers.
// - Do not access Prisma or persistence models.
// - Do not resolve Identity.
// - Do not evaluate authentication policy.
// - Do not expose domain entities or value objects directly.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map AuthenticationAggregate -> AuthenticationResponse.
// - Map AuthenticationEntity -> AuthenticationResponse.
// - Provide one canonical Authentication mapping implementation.
// - Convert Authentication value objects into primitive response values.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the aggregate.
// - Persist the aggregate.
// - Access Prisma.
// - Hash passwords.
// - Compare passwords.
// - Resolve Identity.
// - Evaluate lock thresholds.
// - Authenticate credentials.
// - Generate sessions.
// - Manage devices.
// - Execute recovery.
// - Generate OTPs.
// - Emit domain events.
// - Perform business validation.
// - Expose passwordHash.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// passwordHash is intentionally excluded from AuthenticationResponse.
//
// The response contains password lifecycle metadata such as:
// - passwordVersion;
// - passwordChangedAt;
// - passwordMustChange.
//
// Credential material itself never crosses the response boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { AuthenticationAggregate } from '../../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AuthenticationEntity } from '../../../domain/entities/authentication.entity';

// =============================================================================
// Response
// =============================================================================

export interface AuthenticationResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Authentication aggregate.
   */
  publicId: string;

  /**
   * Opaque public reference to the Identity aggregate.
   */
  identityPublicId: string;

  // ---------------------------------------------------------------------------
  // Authentication Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Authentication lifecycle status.
   *
   * Serialized from AuthenticationStatus.
   */
  status: string;

  // ---------------------------------------------------------------------------
  // Password State
  // ---------------------------------------------------------------------------

  /**
   * Version of the current password credential.
   */
  passwordVersion: number;

  /**
   * Timestamp of the most recent password change.
   *
   * NULL when the password has never been changed.
   */
  passwordChangedAt?: Date;

  /**
   * Indicates whether the password must currently be changed.
   */
  passwordMustChange: boolean;

  // ---------------------------------------------------------------------------
  // Authentication Failure State
  // ---------------------------------------------------------------------------

  /**
   * Number of failed authentication attempts currently recorded.
   */
  failedAuthenticationCount: number;

  /**
   * Timestamp of the most recent failed authentication attempt.
   */
  lastFailedAuthenticationAt?: Date;

  /**
   * Reason associated with the current authentication failure/lock state.
   */
  lockReason?: string;

  // ---------------------------------------------------------------------------
  // Lock State
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which Authentication was locked.
   */
  lockedAt?: Date;

  /**
   * Timestamp until which Authentication remains temporarily locked.
   *
   * Undefined for a permanent lock.
   */
  lockedUntil?: Date;

  // ---------------------------------------------------------------------------
  // Authentication Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp of the most recent successful authentication.
   */
  lastAuthenticatedAt?: Date;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which Authentication was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which Authentication was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class AuthenticationResponseMapper {
  // ===========================================================================

  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps an AuthenticationAggregate into an AuthenticationResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: AuthenticationAggregate,
  ): AuthenticationResponse {
    if (aggregate === undefined) {
      throw new Error('Authentication aggregate is required.');
    }

    return this.mapAuthentication(aggregate.authentication);
  }

  // ===========================================================================

  // Entity -> Response
  // ===========================================================================

  /**
   * Maps an AuthenticationEntity directly into an AuthenticationResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(
    authentication: AuthenticationEntity,
  ): AuthenticationResponse {
    if (authentication === undefined) {
      throw new Error('Authentication entity is required.');
    }

    return this.mapAuthentication(authentication);
  }

  // ===========================================================================

  // Internal Authentication Mapping
  // ===========================================================================

  /**
   * Maps the AuthenticationEntity portion of the Authentication aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapAuthentication(
    authentication: AuthenticationEntity,
  ): AuthenticationResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: authentication.publicId.value,

      identityPublicId: authentication.identityPublicId.value,

      // -----------------------------------------------------------------------
      // Authentication Lifecycle
      // -----------------------------------------------------------------------

      status: authentication.status.value,

      // -----------------------------------------------------------------------
      // Password State
      // -----------------------------------------------------------------------

      passwordVersion: authentication.passwordVersion.value,

      ...(authentication.passwordChangedAt !== undefined
        ? {
            passwordChangedAt: new Date(
              authentication.passwordChangedAt.value.getTime(),
            ),
          }
        : {}),

      passwordMustChange: authentication.passwordMustChange.value,

      // -----------------------------------------------------------------------
      // Authentication Failure State
      // -----------------------------------------------------------------------

      failedAuthenticationCount: authentication.failedAuthenticationCount.value,

      ...(authentication.lastFailedAuthenticationAt !== undefined
        ? {
            lastFailedAuthenticationAt: new Date(
              authentication.lastFailedAuthenticationAt.value.getTime(),
            ),
          }
        : {}),

      ...(authentication.lockReason !== undefined
        ? {
            lockReason: authentication.lockReason.value,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Lock State
      // -----------------------------------------------------------------------

      ...(authentication.lockedAt !== undefined
        ? {
            lockedAt: new Date(authentication.lockedAt.value.getTime()),
          }
        : {}),

      ...(authentication.lockedUntil !== undefined
        ? {
            lockedUntil: new Date(authentication.lockedUntil.value.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Authentication Audit
      // -----------------------------------------------------------------------

      ...(authentication.lastAuthenticatedAt !== undefined
        ? {
            lastAuthenticatedAt: new Date(
              authentication.lastAuthenticatedAt.value.getTime(),
            ),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(authentication.createdAt.getTime()),

      updatedAt: new Date(authentication.updatedAt.getTime()),
    };
  }
}
