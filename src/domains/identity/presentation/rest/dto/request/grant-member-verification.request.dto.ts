// -----------------------------------------------------------------------------
// Identity — Grant Member Verification Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for granting MEMBER verification to an Identity.
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
// - approval of submitted evidence;
// - creation of a VerificationRequest;
// - rejection of a VerificationRequest;
// - cancellation of a VerificationRequest.
//
// VerificationRequest approval means:
//
//     "The submitted evidence is accepted."
//
// Granting MEMBER verification means:
//
//     "The Identity has satisfied the requirements for MEMBER verification."
//
// The application layer converts this transport DTO into:
//
//     GrantMemberVerificationCommand
//
// The application handler then loads the VerificationAggregate and invokes:
//
//     verificationAggregate.grantMemberVerification(...)
//
// The aggregate is responsible for:
//
// - validating the Verification lifecycle state;
// - validating the required approved evidence;
// - determining MEMBER verification eligibility;
// - transitioning Verification to VERIFIED;
// - setting VerificationLevel = MEMBER;
// - recording the reviewer;
// - setting memberVerifiedAt;
// - setting verifiedAt;
// - validating and applying expiresAt;
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
// Expected Verification lifecycle:
//
// PENDING ─────────► VERIFIED
//                       │
//                       └── level = MEMBER
//
// REJECTED and EXPIRED must first be reopened to PENDING.
//
// REVOKED is terminal.
//
// The VerificationAggregate remains responsible for enforcing these lifecycle
// rules.
//
// -----------------------------------------------------------------------------
//
// MEMBER VERIFICATION EVIDENCE
//
// MEMBER verification requires the configured MEMBER verification evidence.
//
// Current eligible evidence includes:
//
// - approved PROFILE_PHOTO verification evidence;
// - approved GOVERNMENT_ID verification evidence.
//
// `verificationRequestPublicId` identifies the VerificationRequest that
// provides the evidence for the MEMBER verification decision.
//
// The aggregate remains the authoritative boundary for determining whether
// the request:
//
// - belongs to the Verification aggregate;
// - is approved;
// - is PROFILE_PHOTO or GOVERNMENT_ID;
// - satisfies MEMBER verification requirements.
//
// The DTO does not inspect or interpret verification evidence.
//
// -----------------------------------------------------------------------------
//
// REVIEWER
//
// The Identity performing the MEMBER verification decision is NOT supplied by
// the client.
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
// The resulting Verification expiration policy belongs to the application and
// domain boundaries. If the current GrantMemberVerificationCommand supports an
// explicit expiration value, that value should be established there rather
// than trusted from an arbitrary HTTP client timestamp.
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
 * REST request for granting MEMBER verification.
 *
 * Represents the transport-level intent to transition an existing
 * Verification aggregate to VERIFIED with VerificationLevel = MEMBER.
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
export class GrantMemberVerificationRequestDto {
  // ===========================================================================
  // Verification Request Public ID
  // ===========================================================================

  /**
   * Public identifier of the approved VerificationRequest providing the
   * evidence required for MEMBER verification.
   *
   * The DTO does not determine whether the request:
   *
   * - belongs to the target Verification aggregate;
   * - is approved;
   * - contains eligible evidence;
   * - satisfies MEMBER verification requirements.
   *
   * Those rules belong to the Verification aggregate.
   */
  @ApiProperty({
    example: 'VREQ-01K3R8Y8X7',
    description:
      'Opaque public identifier of the approved VerificationRequest providing the evidence required for MEMBER verification.',
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
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_GRANT_MEMBER_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_GRANT_MEMBER_PUBLIC_ID_MAX_LENGTH,
};
