// -----------------------------------------------------------------------------
// Identity — Activate Permission Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for activating a Permission aggregate.
//
// The request represents the transport-level intent to transition an existing
// Permission into the ACTIVE lifecycle state.
//
// The application layer converts this DTO into:
//
//     ActivatePermissionCommand
//
// The application handler is responsible for resolving the PermissionAggregate
// and invoking:
//
//     permissionAggregate.activate(...)
//
// The aggregate remains responsible for lifecycle validation, invariants,
// state mutation, and domain-event recording.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// INACTIVE ───────► ACTIVE
//
// Activation is idempotent. Activating an already-active Permission does not
// produce another lifecycle transition or domain event.
//
// -----------------------------------------------------------------------------
//
// The request does NOT:
//
// - construct PermissionEntity;
// - construct PermissionAggregate;
// - mutate PermissionEntity directly;
// - persist the Permission;
// - emit PermissionActivatedEvent directly;
// - assign the Permission to a Role;
// - create or modify RolePermission relationships;
// - evaluate authorization;
// - access Prisma;
// - communicate with external systems;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - permissionPublicId
// - correlationId
//
// Optional inputs:
//
// - activatedAt
// - causationId
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "permissionPublicId": "PER-01K3R8Y7Q2",
//       "activatedAt": "2026-08-28T13:30:00.000Z",
//       "correlationId": "COR-01K3R8Z1M4",
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
 * REST request for activating a Permission aggregate.
 *
 * Represents the transport-level intent to activate an existing Permission.
 *
 * Required transport input:
 *
 * - permissionPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - activatedAt;
 * - causationId.
 *
 * The DTO does not perform domain lifecycle decisions. Those remain inside
 * PermissionAggregate.
 */
export class ActivatePermissionRequestDto {
  // ===========================================================================
  // Permission Public ID
  // ===========================================================================

  /**
   * Public identifier of the Permission aggregate to activate.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'PER-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Permission aggregate to activate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'permissionPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'permissionPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `permissionPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  permissionPublicId!: string;

  // ===========================================================================
  // Activated At
  // ===========================================================================

  /**
   * Optional timestamp at which the Permission activation is considered to
   * have occurred.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the Permission activation is considered to have occurred. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'activatedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'activatedAt must be a valid date.',
  })
  activatedAt?: Date;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the activation operation and resulting domain
   * event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the Permission activation operation.',
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
   * Permission activation request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this Permission activation request.',
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
  MIN_PUBLIC_ID_LENGTH as PERMISSION_ACTIVATE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as PERMISSION_ACTIVATE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as PERMISSION_ACTIVATE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as PERMISSION_ACTIVATE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as PERMISSION_ACTIVATE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as PERMISSION_ACTIVATE_CAUSATION_ID_MAX_LENGTH,
};
