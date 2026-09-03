// -----------------------------------------------------------------------------
// Session — Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the SessionAggregate / SessionEntity domain model into an
// application-facing response DTO.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Mapping principles:
//
// - Expose authentication-safe Session state.
// - Serialize value objects into primitives.
// - Expose the opaque public reference to Identity.
// - Expose the optional opaque public reference to Device.
// - Expose Session lifecycle state.
// - Expose token-family identity without exposing token material.
// - Expose refresh-token replacement lineage.
// - Expose Session context metadata.
// - Expose authentication and activity timestamps.
// - Expose expiry state.
// - Expose revocation state and reason.
// - Expose Session audit state.
// - Do not expose refreshTokenHash.
// - Do not expose internal persistence identifiers.
// - Do not access Prisma or persistence models.
// - Do not resolve Identity or Device.
// - Do not evaluate Session security policy.
// - Do not expose domain entities or value objects directly.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map SessionAggregate -> SessionResponse.
// - Map SessionEntity -> SessionResponse.
// - Provide one canonical Session mapping implementation.
// - Convert Session value objects into primitive response values.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the aggregate.
// - Persist the aggregate.
// - Access Prisma.
// - Generate refresh tokens.
// - Hash refresh tokens.
// - Compare refresh tokens.
// - Sign or verify JWTs.
// - Resolve Identity.
// - Resolve Device.
// - Evaluate token-reuse policy.
// - Revoke token families.
// - Emit domain events.
// - Perform business validation.
// - Expose refreshTokenHash.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// refreshTokenHash is intentionally excluded from SessionResponse.
//
// The response may expose token-family and replacement lineage identifiers,
// but never exposes:
//
// - raw refresh tokens;
// - refresh-token hashes;
// - token secrets;
// - credential material.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { SessionAggregate } from '../../../domain/aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { SessionEntity } from '../../../domain/entities/session.entity';

// =============================================================================
// Response
// =============================================================================

export interface SessionResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Session aggregate.
   */
  publicId: string;

  /**
   * Opaque public reference to the Identity aggregate.
   */
  identityPublicId: string;

  /**
   * Optional opaque public reference to the Device aggregate.
   */
  devicePublicId?: string;

  // ---------------------------------------------------------------------------
  // Session Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Session lifecycle status.
   *
   * Serialized from SessionStatus.
   */
  status: string;

  // ---------------------------------------------------------------------------
  // Token Family
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the refresh-token family.
   *
   * This identifies the token family without exposing token material.
   */
  tokenFamilyPublicId: string;

  /**
   * Public identifier of the Session that replaced this Session.
   *
   * Undefined when this Session has not been replaced.
   */
  replacedBySessionPublicId?: string;

  // ---------------------------------------------------------------------------
  // Session Context
  // ---------------------------------------------------------------------------

  /**
   * Optional IP address associated with the Session.
   */
  ipAddress?: string;

  /**
   * Optional user-agent associated with the Session.
   */
  userAgent?: string;

  /**
   * Optional ISO 3166-1 alpha-2 country code.
   */
  countryCode?: string;

  /**
   * Optional city associated with the Session context.
   */
  city?: string;

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Session was authenticated.
   */
  authenticatedAt: Date;

  // ---------------------------------------------------------------------------
  // Activity
  // ---------------------------------------------------------------------------

  /**
   * Timestamp of the most recent Session activity.
   */
  lastActivityAt: Date;

  // ---------------------------------------------------------------------------
  // Expiry
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Session expires.
   */
  expiresAt: Date;

  // ---------------------------------------------------------------------------
  // Revocation
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Session was revoked.
   *
   * Undefined when the Session has not been revoked.
   */
  revokedAt?: Date;

  /**
   * Reason associated with Session revocation.
   *
   * Undefined when the Session has not been revoked.
   */
  revokedReason?: string;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Session was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Session was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class SessionResponseMapper {
  // ===========================================================================

  // Aggregate -> Response

  // ===========================================================================

  /**
   * Maps a SessionAggregate into a SessionResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(aggregate: SessionAggregate): SessionResponse {
    if (aggregate === undefined) {
      throw new Error('Session aggregate is required.');
    }

    return this.mapSession(aggregate.session);
  }

  // ===========================================================================

  // Entity -> Response

  // ===========================================================================

  /**
   * Maps a SessionEntity directly into a SessionResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(session: SessionEntity): SessionResponse {
    if (session === undefined) {
      throw new Error('Session entity is required.');
    }

    return this.mapSession(session);
  }

  // ===========================================================================

  // Internal Session Mapping

  // ===========================================================================

  /**
   * Maps the SessionEntity portion of the Session aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapSession(session: SessionEntity): SessionResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: session.publicId.value,

      identityPublicId: session.identityPublicId.value,

      ...(session.devicePublicId !== undefined
        ? {
            devicePublicId: session.devicePublicId.value,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Session Lifecycle
      // -----------------------------------------------------------------------

      status: session.status.value,

      // -----------------------------------------------------------------------
      // Token Family
      // -----------------------------------------------------------------------

      tokenFamilyPublicId: session.tokenFamilyPublicId.value,

      ...(session.replacedBySessionPublicId !== undefined
        ? {
            replacedBySessionPublicId: session.replacedBySessionPublicId.value,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Session Context
      // -----------------------------------------------------------------------

      ...(session.ipAddress !== undefined
        ? {
            ipAddress: session.ipAddress.value,
          }
        : {}),

      ...(session.userAgent !== undefined
        ? {
            userAgent: session.userAgent.value,
          }
        : {}),

      ...(session.countryCode !== undefined
        ? {
            countryCode: session.countryCode.value,
          }
        : {}),

      ...(session.city !== undefined
        ? {
            city: session.city.value,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Authentication
      // -----------------------------------------------------------------------

      authenticatedAt: new Date(session.authenticatedAt.value.getTime()),

      // -----------------------------------------------------------------------
      // Activity
      // -----------------------------------------------------------------------

      lastActivityAt: new Date(session.lastActivityAt.value.getTime()),

      // -----------------------------------------------------------------------
      // Expiry
      // -----------------------------------------------------------------------

      expiresAt: new Date(session.expiresAt.value.getTime()),

      // -----------------------------------------------------------------------
      // Revocation
      // -----------------------------------------------------------------------

      ...(session.revokedAt !== undefined
        ? {
            revokedAt: new Date(session.revokedAt.value.getTime()),
          }
        : {}),

      ...(session.revokedReason !== undefined
        ? {
            revokedReason: session.revokedReason.value,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(session.createdAt.getTime()),

      updatedAt: new Date(session.updatedAt.getTime()),
    };
  }
}
