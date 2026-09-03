// -----------------------------------------------------------------------------
// Verification Request — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating and submitting a VerificationRequestEntity
// within a Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// This DTO represents the transport-level intent to create and submit one
// VerificationRequest.
//
// IMPORTANT:
//
// VerificationRequestEntity creation represents submission.
//
// Therefore this request does NOT:
//
// - create a Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity directly;
// - approve the VerificationRequest;
// - reject the VerificationRequest;
// - cancel the VerificationRequest;
// - expire the VerificationRequest;
// - grant Verification;
// - modify Identity;
// - modify Identity roles;
// - perform verification-provider operations;
// - access or mutate asset storage;
// - perform external side effects.
//
// The application handler resolves the VerificationAggregate and invokes:
//
//     verificationAggregate.createRequest(...)
//
// The aggregate is responsible for:
//
// - validating the Verification lifecycle state;
// - validating the request type;
// - validating the asset public identity;
// - preventing duplicate pending requests of the same type;
// - creating VerificationRequestEntity;
// - establishing aggregate ownership;
// - recording VerificationRequestCreatedEvent;
// - recording VerificationRequestSubmittedEvent.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING
//   ├──> APPROVED
//   ├──> REJECTED
//   └──> CANCELLED
//
// Creation always produces a PENDING request.
//
// VerificationRequest does NOT expire.
//
// Expiration is not part of the VerificationRequest lifecycle and is therefore
// not represented by this DTO.
//
// -----------------------------------------------------------------------------
//
// Verification lifecycle:
//
// The parent Verification aggregate must currently be PENDING before a new
// request may be created.
//
// The request does not decide this rule; the VerificationAggregate enforces it.
//
// -----------------------------------------------------------------------------
//
// Verification Request Type:
//
// Supported values:
//
// - PROFILE_PHOTO
// - GOVERNMENT_ID
// - DRIVER_LICENSE
//
// These values are defined by VerificationRequestType.
//
// -----------------------------------------------------------------------------
//
// Asset:
//
// `assetPublicId` identifies the submitted verification evidence through the
// external asset/storage boundary.
//
// The request carries only the opaque public identifier.
//
// It does not access, validate, or mutate the asset itself.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the complete request-creation/submission
//   operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this request.
//
// Both values are application-level metadata propagated to resulting domain
// events.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `submittedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting submission timestamp.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "type": "GOVERNMENT_ID",
//       "assetPublicId": "AST-01K3R8Y9P6",
//       "correlationId": "COR-01K3R8Z1M4",
//       "causationId": "CMD-01K3R8Y6M4",
//       "submittedAt": "2026-08-28T13:30:00.000Z"
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
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Domain Types
// -----------------------------------------------------------------------------

import {
  VERIFICATION_REQUEST_TYPES,
  type VerificationRequestTypeValue,
} from '../../../../domain/value-objects';

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
 * REST request for creating and submitting a VerificationRequestEntity.
 *
 * Represents the transport-level intent to submit verification evidence
 * against an existing Verification aggregate.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - type;
 * - assetPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId;
 * - submittedAt.
 *
 * The following values are intentionally NOT supplied:
 *
 * - VerificationRequest public ID;
 * - VerificationRequest status;
 * - VerificationRequest lifecycle state;
 * - review information;
 * - approval/rejection information;
 * - persistence/internal identifiers;
 * - domain events.
 *
 * Those values are established and validated by the aggregate.
 */
export class CreateVerificationRequestRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that owns the Verification aggregate.
   *
   * This is an opaque cross-aggregate public identifier and not a
   * persistence/internal database identifier.
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
  // Verification Request Type
  // ===========================================================================

  /**
   * Type of verification evidence being submitted.
   *
   * Supported values:
   *
   * - PROFILE_PHOTO;
   * - GOVERNMENT_ID;
   * - DRIVER_LICENSE.
   *
   * This remains a transport primitive in the REST DTO. The application
   * boundary converts it into VerificationRequestType before constructing
   * CreateVerificationRequestCommand.
   */
  @ApiProperty({
    example: 'GOVERNMENT_ID',
    description:
      'Type of verification evidence being submitted. The aggregate performs final domain validation.',
    enum: VERIFICATION_REQUEST_TYPES,
  })
  @Transform(trimString)
  @IsString({
    message: 'type must be a string.',
  })
  @IsEnum(VERIFICATION_REQUEST_TYPES, {
    message: `type must be one of: ${VERIFICATION_REQUEST_TYPES.join(', ')}.`,
  })
  type!: VerificationRequestTypeValue;

  // ===========================================================================
  // Asset Public ID
  // ===========================================================================

  /**
   * Public identifier of the asset submitted as verification evidence.
   *
   * This is an opaque reference to the external asset/storage boundary.
   *
   * The DTO does not access or mutate the referenced asset.
   */
  @ApiProperty({
    example: 'AST-01K3R8Y9P6',
    description:
      'Opaque public identifier of the asset submitted as verification evidence.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'assetPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'assetPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `assetPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  assetPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the verification-request creation and
   * submission operation.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the VerificationRequest creation and submission operation.',
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
   * VerificationRequest creation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this VerificationRequest creation.',
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
  // Submitted At
  // ===========================================================================

  /**
   * Optional timestamp at which the VerificationRequest is considered
   * submitted.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the VerificationRequest is considered submitted. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'submittedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'submittedAt must be a valid date.',
  })
  submittedAt?: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_CREATE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_CREATE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_CREATE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_CREATE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_CREATE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_CREATE_CAUSATION_ID_MAX_LENGTH,
};
