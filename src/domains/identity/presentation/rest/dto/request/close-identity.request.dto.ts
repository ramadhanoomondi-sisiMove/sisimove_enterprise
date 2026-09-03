// -----------------------------------------------------------------------------
// Identity — Close Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for closing an Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The request identifies the Identity aggregate to close and carries the
// correlation metadata required for the lifecycle transition.
//
// Expected lifecycle:
//
// PENDING   ───────► CLOSED
// ACTIVE    ───────► CLOSED
// SUSPENDED ───────► CLOSED
//
// CLOSED is terminal. Closing an already-closed Identity is idempotent
// according to the Identity lifecycle policy.
//
// The closure timestamp is determined by IdentityAggregate when the mutation
// occurs. It is therefore NOT supplied by the request.
//
// Closing an Identity does not directly close or mutate other aggregates.
//
// Authentication, sessions, verification, roles, notifications, and other
// concerns remain separate lifecycle boundaries and may react to the
// IdentityClosedEvent independently.
//
// This DTO does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - perform persistence;
// - emit IdentityClosedEvent directly;
// - determine closedAt;
// - delete the Identity record;
// - revoke authentication sessions directly;
// - delete authentication credentials;
// - remove role assignments;
// - delete verification records;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the IdentityAggregate using identityPublicId,
// invokes identityAggregate.close(correlationId), and persists the aggregate.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
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

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
 * REST request for closing an Identity.
 *
 * Represents the application-level intent to transition an existing Identity
 * aggregate into the terminal CLOSED lifecycle state.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * The closure timestamp is intentionally NOT supplied by the caller.
 * IdentityAggregate determines closedAt when the lifecycle mutation occurs.
 *
 * The following values are intentionally NOT supplied:
 *
 * - identity status;
 * - identity roles;
 * - lifecycle state;
 * - closedAt;
 * - domain events.
 *
 * Those values are controlled by IdentityAggregate and the application
 * workflow.
 */
export class CloseIdentityRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity aggregate to close.
   *
   * This is an opaque public identifier used by the application layer to
   * resolve the IdentityAggregate from its repository.
   *
   * It is not a persistence/internal identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description: 'Opaque public identifier of the Identity aggregate to close.',
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
   * Correlation identifier for the Identity closure operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting IdentityClosedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Identity closure operation and resulting domain event.',
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
   * closure request.
   *
   * When supplied, this value is propagated through the application workflow
   * and may be included in the resulting domain event metadata.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this closure request.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_IDENTITY_PUBLIC_ID_LENGTH as IDENTITY_CLOSE_PUBLIC_ID_MIN_LENGTH,
  MAX_IDENTITY_PUBLIC_ID_LENGTH as IDENTITY_CLOSE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as IDENTITY_CLOSE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as IDENTITY_CLOSE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as IDENTITY_CLOSE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as IDENTITY_CLOSE_CAUSATION_ID_MAX_LENGTH,
};
