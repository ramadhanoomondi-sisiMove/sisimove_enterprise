// -----------------------------------------------------------------------------
// Identity — Deactivate Permission Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for deactivating a Permission aggregate.
//
// The request represents the transport-level intent to transition an existing
// Permission into the INACTIVE lifecycle state.
//
// The application layer converts this DTO into:
//
//     DeactivatePermissionCommand
//
// The application handler is responsible for resolving the PermissionAggregate
// and invoking:
//
//     permissionAggregate.deactivate(...)
//
// The aggregate remains responsible for lifecycle validation, invariants,
// state mutation, system-Permission protection, and domain-event recording.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ACTIVE ───────► INACTIVE
//
// Deactivation is idempotent. Deactivating an already-inactive Permission does
// not produce another lifecycle transition or domain event.
//
// System Permissions remain protected by the domain rules.
//
// -----------------------------------------------------------------------------
//
// The request does NOT:
//
// - construct PermissionEntity;
// - construct PermissionAggregate;
// - mutate PermissionEntity directly;
// - persist the Permission;
// - emit PermissionDeactivatedEvent directly;
// - assign or revoke the Permission from a Role;
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
// - deactivatedAt
// - causationId
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "permissionPublicId": "PER-01K3R8Y7Q2",
//       "deactivatedAt": "2026-08-28T13:30:00.000Z",
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
 * REST request for deactivating a Permission aggregate.
 *
 * Represents the transport-level intent to deactivate an existing Permission.
 *
 * Required transport input:
 *
 * - permissionPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - deactivatedAt;
 * - causationId.
 *
 * The DTO does not perform domain lifecycle decisions. Those remain inside
 * PermissionAggregate.
 */
export class DeactivatePermissionRequestDto {
  // ===========================================================================
  // Permission Public ID
  // ===========================================================================

  /**
   * Public identifier of the Permission aggregate to deactivate.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'PER-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Permission aggregate to deactivate.',
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
  // Deactivated At
  // ===========================================================================

  /**
   * Optional timestamp at which the Permission deactivation is considered to
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
      'Optional ISO 8601 timestamp at which the Permission deactivation is considered to have occurred. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'deactivatedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'deactivatedAt must be a valid date.',
  })
  deactivatedAt?: Date;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the deactivation operation and resulting
   * domain event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the Permission deactivation operation.',
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
   * Permission deactivation request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this Permission deactivation request.',
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
  MIN_PUBLIC_ID_LENGTH as PERMISSION_DEACTIVATE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as PERMISSION_DEACTIVATE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as PERMISSION_DEACTIVATE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as PERMISSION_DEACTIVATE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as PERMISSION_DEACTIVATE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as PERMISSION_DEACTIVATE_CAUSATION_ID_MAX_LENGTH,
};
