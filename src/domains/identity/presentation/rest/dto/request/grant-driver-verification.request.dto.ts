// -----------------------------------------------------------------------------
// Identity — Grant Driver Verification Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for granting DRIVER verification to an Identity.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// -----------------------------------------------------------------------------
//
// IMPORTANT DISTINCTION
//
// This request targets the Verification aggregate-level outcome.
//
// It is NOT:
//
// - approval of a VerificationRequest;
// - approval of submitted driver-license evidence;
// - creation of a VerificationRequest;
// - rejection of a VerificationRequest;
// - cancellation of a VerificationRequest.
//
// VerificationRequest approval means:
//
//     "The submitted evidence is accepted."
//
// Granting DRIVER verification means:
//
//     "The Identity has satisfied the requirements for DRIVER verification."
//
// The application layer converts this transport DTO into:
//
//     GrantDriverVerificationCommand
//
// The command handler then loads the VerificationAggregate and invokes:
//
//     verificationAggregate.grantDriverVerification(...)
//
// The aggregate is responsible for:
//
// - validating the Verification lifecycle state;
// - validating the required approved driver-license evidence;
// - determining DRIVER verification eligibility;
// - transitioning Verification to VERIFIED;
// - setting VerificationLevel = DRIVER;
// - recording the reviewer;
// - setting driverVerifiedAt;
// - setting verifiedAt;
// - validating and applying expiration;
// - recording the resulting domain event.
//
// The DTO does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate either entity;
// - approve a VerificationRequest;
// - reject a VerificationRequest;
// - cancel a VerificationRequest;
// - modify Identity;
// - assign or modify Identity roles;
// - authenticate the Identity;
// - create sessions;
// - perform persistence;
// - emit domain events;
// - perform external verification-provider operations;
// - perform asset-storage operations;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// EXPECTED VERIFICATION LIFECYCLE
//
// PENDING ─────────► VERIFIED
//                       │
//                       └── level = DRIVER
//
// REJECTED and EXPIRED must first be reopened to PENDING.
//
// REVOKED is terminal.
//
// The VerificationAggregate remains responsible for enforcing these
// lifecycle rules.
//
// -----------------------------------------------------------------------------
//
// DRIVER VERIFICATION EVIDENCE
//
// DRIVER verification requires:
//
// - an approved DRIVER_LICENSE verification request.
//
// `verificationRequestPublicId` identifies the VerificationRequest that
// provides the required evidence.
//
// The aggregate remains the authoritative boundary for determining whether
// the request:
//
// - belongs to the Verification aggregate;
// - is approved;
// - is DRIVER_LICENSE;
// - satisfies DRIVER verification requirements.
//
// The DTO does not inspect or interpret verification evidence.
//
// -----------------------------------------------------------------------------
//
// REVIEWER
//
// The Identity performing the DRIVER verification decision is NOT supplied
// by the client.
//
// The application resolves the authenticated reviewer from:
//
//     req.user.sub
//
// -----------------------------------------------------------------------------
//
// APPLICATION METADATA
//
// The application layer is responsible for establishing:
//
// - verificationPublicId from the route;
// - identityPublicId from the resolved Verification aggregate;
// - reviewedByPublicId from the authenticated security context;
// - correlationId;
// - causationId;
// - verifiedAt.
//
// These values are deliberately excluded from the request body.
//
// -----------------------------------------------------------------------------
//
// EXPIRATION
//
// `expiresAt` is intentionally not supplied by this DTO.
//
// Verification expiration is aggregate lifecycle metadata and should be
// established by the application/domain policy rather than trusted from an
// arbitrary HTTP client timestamp.
//
// This applies to the Verification aggregate lifecycle.
//
// It does NOT:
//
// - expire a VerificationRequest;
// - change VerificationRequest status;
// - expire submitted evidence records.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "verificationRequestPublicId": "VREQ-01K3R8Y8X7"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for granting DRIVER verification.
 *
 * Represents the transport-level intent to transition an existing
 * Verification aggregate to VERIFIED with VerificationLevel = DRIVER.
 *
 * Required transport input:
 *
 * - verificationRequestPublicId.
 *
 * The Verification aggregate is identified by the route parameter:
 *
 *     :verificationPublicId
 *
 * The authenticated reviewer is resolved from the security context.
 *
 * The following values are intentionally NOT supplied by the client:
 *
 * - identityPublicId;
 * - verificationPublicId;
 * - reviewedByPublicId;
 * - correlationId;
 * - causationId;
 * - verifiedAt;
 * - expiresAt;
 * - Verification status;
 * - Verification level;
 * - VerificationRequest status;
 * - VerificationRequest approval state;
 * - persistence/internal identifiers;
 * - aggregate state;
 * - domain events.
 *
 * Those values are established and validated by the application/domain
 * boundaries.
 */
export class GrantDriverVerificationRequestDto {
  // ===========================================================================
  // Verification Request Public ID
  // ===========================================================================

  /**
   * Public identifier of the approved VerificationRequest providing the
   * DRIVER_LICENSE evidence required for DRIVER verification.
   *
   * The DTO does not determine whether the request:
   *
   * - belongs to the Verification aggregate;
   * - is approved;
   * - has DRIVER_LICENSE type.
   *
   * Those rules belong to the Verification aggregate.
   */
  @ApiProperty({
    example: 'VREQ-01K3R8Y8X7',
    description:
      'Opaque public identifier of the approved DRIVER_LICENSE verification request providing the evidence required for DRIVER verification.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'verificationRequestPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'verificationRequestPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `verificationRequestPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  verificationRequestPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_GRANT_DRIVER_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_GRANT_DRIVER_PUBLIC_ID_MAX_LENGTH,
};
