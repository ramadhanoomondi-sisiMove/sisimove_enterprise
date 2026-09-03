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
// `reviewedByPublicId` identifies the Identity that performed the MEMBER
// verification decision.
//
// This is an opaque public identity reference.
//
// The DTO does not resolve or mutate the reviewer Identity.
//
// -----------------------------------------------------------------------------
//
// CORRELATION / CAUSATION
//
// - correlationId identifies the complete MEMBER verification operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this verification decision.
//
// These values are propagated to the application command and, ultimately, to
// the resulting domain event.
//
// -----------------------------------------------------------------------------
//
// TIMESTAMP
//
// `verifiedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// -----------------------------------------------------------------------------
//
// EXPIRATION
//
// `expiresAt` is optional.
//
// When supplied, it specifies when the resulting MEMBER Verification expires.
//
// This applies to the Verification aggregate lifecycle.
//
// It does NOT:
//
// - expire a VerificationRequest;
// - change VerificationRequest status;
// - expire submitted evidence records.
//
// The aggregate requires:
//
//     expiresAt > verifiedAt
//
// when an explicit expiration timestamp is supplied.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "verificationPublicId": "VER-01K3R8Y8M4",
//       "verificationRequestPublicId": "VREQ-01K3R8Y8X7",
//       "reviewedByPublicId": "IDN-01K3R8Y6M2",
//       "correlationId": "COR-01K3R8Y9P6",
//       "causationId": "CMD-01K3R8Y6M4",
//       "verifiedAt": "2026-08-28T13:30:00.000Z",
//       "expiresAt": "2027-08-28T13:30:00.000Z"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, Type, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsDate,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

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
 * - identityPublicId;
 * - verificationPublicId;
 * - verificationRequestPublicId;
 * - reviewedByPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId;
 * - verifiedAt;
 * - expiresAt.
 *
 * The following values are intentionally NOT supplied:
 *
 * - IdentityPublicId value object;
 * - VerificationPublicId value object;
 * - VerificationRequestPublicId value object;
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
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that owns the Verification aggregate.
   *
   * This is an opaque cross-aggregate public identifier and not a
   * persistence/internal database identifier.
   *
   * The application mapping layer converts this transport primitive into the
   * IdentityPublicId value object required by the command.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity that owns the Verification aggregate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Verification Public ID
  // ===========================================================================

  /**
   * Public identifier of the Verification aggregate whose lifecycle is being
   * changed.
   *
   * This identifies the specific Verification aggregate owned by the Identity.
   *
   * The application mapping layer converts this transport primitive into the
   * VerificationPublicId value object required by the command.
   */
  @ApiProperty({
    example: 'VER-01K3R8Y8M4',
    description:
      'Opaque public identifier of the Verification aggregate receiving MEMBER verification.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'verificationPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'verificationPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `verificationPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  verificationPublicId!: string;

  // ===========================================================================
  // Verification Request Public ID
  // ===========================================================================

  /**
   * Public identifier of the approved VerificationRequest providing the
   * evidence required for MEMBER verification.
   *
   * The DTO does not determine whether the request is approved, belongs to
   * the Verification aggregate, or is an eligible MEMBER evidence type.
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

  // ===========================================================================
  // Reviewed By Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that performed the MEMBER verification
   * decision.
   *
   * This is an opaque public identity reference.
   *
   * The DTO does not resolve or mutate the reviewer Identity.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y6M2',
    description:
      'Opaque public identifier of the Identity that performed the MEMBER verification decision.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'reviewedByPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'reviewedByPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `reviewedByPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  reviewedByPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the MEMBER verification operation.
   *
   * This identifies the complete application operation and is propagated to
   * the resulting domain event through the application command.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y9P6',
    description:
      'Correlation identifier for the MEMBER verification operation and resulting domain event.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * MEMBER verification decision.
   *
   * When supplied, this value is passed to the application command and may be
   * propagated to the resulting domain event.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this MEMBER verification decision.',
    nullable: true,
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;

  // ===========================================================================
  // Verified At
  // ===========================================================================

  /**
   * Optional timestamp at which MEMBER verification is considered granted.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which MEMBER verification is considered granted. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'verifiedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'verifiedAt must be a valid date.',
  })
  verifiedAt?: Date;

  // ===========================================================================
  // Expires At
  // ===========================================================================

  /**
   * Optional expiration timestamp for the resulting MEMBER verification.
   *
   * This applies to the Verification aggregate lifecycle and does not modify
   * the lifecycle of any VerificationRequest.
   *
   * The aggregate requires the expiration timestamp to occur after the
   * effective verification timestamp.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2027-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which MEMBER verification expires. When supplied, it must occur after verifiedAt.',
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'expiresAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'expiresAt must be a valid date.',
  })
  expiresAt?: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_GRANT_MEMBER_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_GRANT_MEMBER_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_GRANT_MEMBER_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_GRANT_MEMBER_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_GRANT_MEMBER_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_GRANT_MEMBER_CAUSATION_ID_MAX_LENGTH,
};
