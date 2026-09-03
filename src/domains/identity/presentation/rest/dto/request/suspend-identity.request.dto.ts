// -----------------------------------------------------------------------------
// Identity — Suspend Identity Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for suspending an Identity aggregate.
//
// The application handler maps this transport DTO to:
//
//     SuspendIdentityCommand
//
// The DTO does NOT:
// - resolve the Identity;
// - perform lifecycle validation;
// - determine suspendedAt;
// - mutate the Identity aggregate;
// - revoke authentication credentials;
// - terminate sessions;
// - revoke verification;
// - perform persistence;
// - emit domain events.
//
// The suspension timestamp is a domain fact determined by
// IdentityAggregate.suspend() when the lifecycle mutation occurs.
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
 * REST request for suspending an Identity aggregate.
 *
 * Represents the transport-level intent to transition an Identity into the
 * SUSPENDED lifecycle state.
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
 * The suspension timestamp is intentionally NOT supplied by the caller.
 * IdentityAggregate determines suspendedAt when the lifecycle mutation occurs.
 *
 * The following values are intentionally NOT supplied:
 *
 * - identity status;
 * - lifecycle state;
 * - suspendedAt;
 * - domain events.
 *
 * Those values are controlled by IdentityAggregate and the application
 * workflow.
 */
export class SuspendIdentityRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity aggregate to suspend.
   *
   * This is an opaque public identifier and not a persistence/database
   * identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity aggregate to suspend.',
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
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the suspension operation and resulting
   * IdentitySuspendedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the suspension operation and resulting domain event.',
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
   * Optional identifier of the command or operation that caused this
   * suspension request.
   *
   * When supplied, this value is propagated through the application workflow
   * and may be included in the resulting domain event metadata.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this suspension request.',
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
  MIN_PUBLIC_ID_LENGTH as IDENTITY_SUSPEND_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as IDENTITY_SUSPEND_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as IDENTITY_SUSPEND_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as IDENTITY_SUSPEND_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as IDENTITY_SUSPEND_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as IDENTITY_SUSPEND_CAUSATION_ID_MAX_LENGTH,
};
