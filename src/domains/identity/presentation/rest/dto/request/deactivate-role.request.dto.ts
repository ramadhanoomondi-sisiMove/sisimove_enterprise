// -----------------------------------------------------------------------------
// Identity — Deactivate Role Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for deactivating a Role aggregate.
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// This DTO represents the transport-level intent to transition a Role into
// the INACTIVE lifecycle state.
//
// The DTO does NOT:
//
// - construct RoleEntity;
// - construct RoleAggregate;
// - mutate RoleEntity directly;
// - persist the Role;
// - assign or revoke the Role from an Identity;
// - modify IdentityRole relationships;
// - modify RolePermission relationships;
// - evaluate permissions;
// - emit domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// The application layer converts this transport request into:
//
//     DeactivateRoleCommand
//
// The application handler resolves the RoleAggregate and invokes:
//
//     roleAggregate.deactivate(...)
//
// The RoleAggregate remains responsible for lifecycle invariants, including
// protection of system Roles.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ACTIVE ───────► INACTIVE
//
// Deactivation is idempotent. Deactivating an already-inactive Role produces
// no additional lifecycle transition or domain event.
//
// System Roles remain protected by the Role domain rules.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - rolePublicId
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
//       "rolePublicId": "ROL-01K3R8Y7Q2",
//       "correlationId": "COR-01K3R8Z1M4",
//       "deactivatedAt": "2026-08-28T13:30:00.000Z",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------
//
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
 * REST request for deactivating a Role aggregate.
 *
 * Represents the transport-level intent to transition an existing Role into
 * the INACTIVE lifecycle state.
 *
 * Required transport input:
 *
 * - rolePublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - deactivatedAt;
 * - causationId.
 *
 * Domain value objects and lifecycle state are intentionally not exposed at
 * the HTTP boundary.
 */
export class DeactivateRoleRequestDto {
  // ===========================================================================
  // Role Public ID
  // ===========================================================================

  /**
   * Public identifier of the Role aggregate to deactivate.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'ROL-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Role aggregate to deactivate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'rolePublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'rolePublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `rolePublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  rolePublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Role deactivation operation and resulting
   * RoleDeactivatedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the Role deactivation operation and resulting domain event.',
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
  // Deactivated At
  // ===========================================================================

  /**
   * Optional timestamp at which the Role is considered deactivated.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the Role is considered deactivated. When omitted, the current time is used.',
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
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or operation that caused this Role
   * deactivation request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this Role deactivation request.',
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
  MIN_PUBLIC_ID_LENGTH as ROLE_DEACTIVATE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as ROLE_DEACTIVATE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as ROLE_DEACTIVATE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as ROLE_DEACTIVATE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as ROLE_DEACTIVATE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as ROLE_DEACTIVATE_CAUSATION_ID_MAX_LENGTH,
};
