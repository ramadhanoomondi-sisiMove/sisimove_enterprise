// -----------------------------------------------------------------------------
// OTP Challenge — Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the OtpChallengeAggregate / OtpChallengeEntity domain model into an
// application-facing response DTO.
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// Mapping principles:
//
// - Expose security-safe OTP Challenge state.
// - Serialize value objects into primitives.
// - Expose the opaque public reference to Identity.
// - Expose OTP Challenge lifecycle state.
// - Expose verification attempt state.
// - Expose expiration state.
// - Expose verification lifecycle metadata.
// - Expose OTP Challenge audit state.
// - Do not expose otpHash.
// - Do not expose destination.
// - Do not expose internal persistence identifiers.
// - Do not access Prisma or persistence models.
// - Do not resolve Identity.
// - Do not evaluate OTP policy.
// - Do not expose domain entities or value objects directly.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map OtpChallengeAggregate -> OtpChallengeResponse.
// - Map OtpChallengeEntity -> OtpChallengeResponse.
// - Provide one canonical OtpChallenge mapping implementation.
// - Convert OTP Challenge value objects into primitive response values.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the aggregate.
// - Persist the aggregate.
// - Access Prisma.
// - Generate OTPs.
// - Hash OTPs.
// - Compare OTPs.
// - Resolve Identity.
// - Evaluate OTP policy.
// - Authenticate users.
// - Send OTPs.
// - Manage Authentication.
// - Manage Recovery.
// - Manage Sessions.
// - Emit domain events.
// - Perform business validation.
// - Expose otpHash.
// - Expose destination.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// otpHash is intentionally excluded from OtpChallengeResponse.
//
// destination is intentionally excluded because it may contain sensitive
// contact information such as an email address or phone number.
//
// The response exposes only the information required by application/read
// consumers to understand the state of the OTP Challenge.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { OtpChallengeAggregate } from '../../../domain/aggregates/otp-challenge.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { OtpChallengeEntity } from '../../../domain/entities/otp-challenge.entity';

// =============================================================================
// Response
// =============================================================================

export interface OtpChallengeResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the OTP Challenge aggregate.
   */
  publicId: string;

  /**
   * Opaque public reference to the Identity aggregate.
   */
  identityPublicId: string;

  // ---------------------------------------------------------------------------
  // OTP Challenge Purpose
  // ---------------------------------------------------------------------------

  /**
   * Business purpose for which the OTP Challenge was created.
   *
   * Serialized from OtpChallengePurpose.
   */
  purpose: string;

  // ---------------------------------------------------------------------------
  // OTP Challenge Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current OTP Challenge lifecycle status.
   *
   * Serialized from OtpChallengeStatus.
   */
  status: string;

  // ---------------------------------------------------------------------------
  // Verification Attempts
  // ---------------------------------------------------------------------------

  /**
   * Number of verification attempts already consumed.
   */
  attempts: number;

  /**
   * Maximum number of verification attempts permitted.
   */
  maxAttempts: number;

  /**
   * Number of verification attempts remaining.
   */
  attemptsRemaining: number;

  // ---------------------------------------------------------------------------
  // Expiration
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the OTP Challenge expires.
   */
  expiresAt: Date;

  // ---------------------------------------------------------------------------
  // Verification
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the OTP Challenge was successfully verified.
   *
   * Undefined until the Challenge is verified.
   */
  verifiedAt?: Date;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the OTP Challenge was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the OTP Challenge was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class OtpChallengeResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps an OtpChallengeAggregate into an OtpChallengeResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: OtpChallengeAggregate,
  ): OtpChallengeResponse {
    if (aggregate === undefined) {
      throw new Error('OTP Challenge aggregate is required.');
    }

    return this.mapOtpChallenge(aggregate.otpChallenge);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps an OtpChallengeEntity directly into an OtpChallengeResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(
    otpChallenge: OtpChallengeEntity,
  ): OtpChallengeResponse {
    if (otpChallenge === undefined) {
      throw new Error('OTP Challenge entity is required.');
    }

    return this.mapOtpChallenge(otpChallenge);
  }

  // ===========================================================================
  // Internal OTP Challenge Mapping
  // ===========================================================================

  /**
   * Maps the OtpChallengeEntity portion of the OTP Challenge aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapOtpChallenge(
    otpChallenge: OtpChallengeEntity,
  ): OtpChallengeResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: otpChallenge.publicId.value,

      identityPublicId: otpChallenge.identityPublicId.value,

      // -----------------------------------------------------------------------
      // OTP Challenge Purpose
      // -----------------------------------------------------------------------

      purpose: otpChallenge.purpose.value,

      // -----------------------------------------------------------------------
      // OTP Challenge Lifecycle
      // -----------------------------------------------------------------------

      status: otpChallenge.status.value,

      // -----------------------------------------------------------------------
      // Verification Attempts
      // -----------------------------------------------------------------------

      attempts: otpChallenge.attempts.value,

      maxAttempts: otpChallenge.maxAttempts.value,

      attemptsRemaining:
        otpChallenge.maxAttempts.value - otpChallenge.attempts.value,

      // -----------------------------------------------------------------------
      // Expiration
      // -----------------------------------------------------------------------

      expiresAt: new Date(otpChallenge.expiresAt.value.getTime()),

      // -----------------------------------------------------------------------
      // Verification
      // -----------------------------------------------------------------------

      ...(otpChallenge.verifiedAt !== undefined
        ? {
            verifiedAt: new Date(otpChallenge.verifiedAt.value.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(otpChallenge.createdAt.getTime()),

      updatedAt: new Date(otpChallenge.updatedAt.getTime()),
    };
  }
}
