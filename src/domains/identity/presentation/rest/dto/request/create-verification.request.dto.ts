// -----------------------------------------------------------------------------
// Verification — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// The command represents the intent to create the Verification aggregate for
// an existing Identity.
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The application handler resolves the required application boundary,
// converts identityPublicId into the appropriate domain value object, invokes:
//
//     VerificationAggregate.create(...)
//
// and persists the resulting aggregate.
//
// The aggregate is responsible for:
//
// - generating VerificationPublicId;
// - creating VerificationEntity;
// - establishing the initial lifecycle state;
// - establishing the initial verification level;
// - initializing the request collection;
// - enforcing aggregate invariants;
// - recording VerificationCreatedEvent.
//
// -----------------------------------------------------------------------------
//
// Initial state:
//
// status  = PENDING
// level   = NONE
// requests = []
//
// No VerificationRequest is created during Verification aggregate creation.
//
// Request creation is a separate application operation:
//
//     VerificationAggregate.createRequest(...)
//
// -----------------------------------------------------------------------------
//
// Identity relationship:
//
// Verification belongs to exactly one Identity.
//
// The request therefore carries IdentityPublicId as an opaque cross-aggregate
// public identifier.
//
// The application layer/repository is responsible for enforcing the
// one-to-one Identity → Verification relationship before aggregate creation.
//
// This DTO does NOT:
//
// - load the Identity aggregate;
// - create or mutate IdentityEntity;
// - create VerificationEntity directly;
// - construct VerificationRequestEntity;
// - create or submit a VerificationRequest;
// - approve or reject verification;
// - perform verification-provider operations;
// - access asset storage;
// - modify Identity lifecycle state;
// - assign Identity roles;
// - emit VerificationCreatedEvent directly;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "correlationId": "COR-01K3R8Y9P6",
//       "causationId": "CMD-01K3R8Y6M4",
//       "createdAt": "2026-08-28T13:30:00.000Z"
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

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for creating a Verification aggregate.
 *
 * Represents the application-level intent to create the Verification
 * aggregate belonging to an existing Identity.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId;
 * - createdAt.
 *
 * The following values are intentionally NOT supplied:
 *
 * - VerificationPublicId;
 * - persistence/internal ID;
 * - initial status;
 * - initial verification level;
 * - VerificationRequestEntity[];
 *
 * Those values are established by VerificationAggregate.create().
 */
export class CreateVerificationRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that owns the Verification aggregate.
   *
   * This is an opaque cross-aggregate public identifier and not a
   * persistence/internal database identifier.
   *
   * The application layer is responsible for resolving and validating the
   * Identity relationship before creating the Verification aggregate.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity that owns the Verification aggregate.',
    minLength: MIN_IDENTITY_PUBLIC_ID_LENGTH,
    maxLength: MAX_IDENTITY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_IDENTITY_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Verification creation operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting VerificationCreatedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y9P6',
    description:
      'Correlation identifier for the Verification creation operation and resulting domain event.',
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
   * Verification creation request.
   *
   * When supplied, this value is propagated to the resulting domain event.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this Verification creation request.',
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
  // Created At
  // ===========================================================================

  /**
   * Optional timestamp at which the Verification aggregate is considered
   * created.
   *
   * When omitted, the application/domain layer uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the Verification aggregate is considered created. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'createdAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'createdAt must be a valid date.',
  })
  createdAt?: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_IDENTITY_PUBLIC_ID_LENGTH as VERIFICATION_CREATE_IDENTITY_PUBLIC_ID_MIN_LENGTH,
  MAX_IDENTITY_PUBLIC_ID_LENGTH as VERIFICATION_CREATE_IDENTITY_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_CREATE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_CREATE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_CREATE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_CREATE_CAUSATION_ID_MAX_LENGTH,
};
