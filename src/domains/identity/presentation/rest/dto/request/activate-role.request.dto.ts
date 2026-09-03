// -----------------------------------------------------------------------------
// Identity — Activate Role Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for activating a Role aggregate.
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// This DTO represents the transport-level intent to transition a Role into
// the ACTIVE lifecycle state.
//
// The DTO does NOT:
//
// - construct RoleEntity;
// - construct RoleAggregate;
// - mutate RoleEntity directly;
// - persist the Role;
// - assign the Role to an Identity;
// - modify IdentityRole relationships;
// - modify RolePermission relationships;
// - evaluate permissions;
// - emit domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// The application layer converts this transport request into:
//
//     ActivateRoleCommand
//
// The application handler resolves the RoleAggregate and invokes:
//
//     roleAggregate.activate(...)
//
// The RoleAggregate remains responsible for lifecycle invariants and domain
// behavior.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// INACTIVE ───────► ACTIVE
//
// Activation is idempotent. Activating an already-active Role produces no
// additional lifecycle transition or domain event.
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
// - activatedAt
// - causationId
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "rolePublicId": "ROL-01K3R8Y7Q2",
//       "correlationId": "COR-01K3R8Z1M4",
//       "activatedAt": "2026-08-28T13:30:00.000Z",
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
 * REST request for activating a Role aggregate.
 *
 * Represents the transport-level intent to transition an existing Role into
 * the ACTIVE lifecycle state.
 *
 * Required transport input:
 *
 * - rolePublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - activatedAt;
 * - causationId.
 *
 * Domain value objects and lifecycle state are intentionally not exposed at
 * the HTTP boundary.
 */
export class ActivateRoleRequestDto {
  // ===========================================================================
  // Role Public ID
  // ===========================================================================

  /**
   * Public identifier of the Role aggregate to activate.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'ROL-01K3R8Y7Q2',
    description: 'Opaque public identifier of the Role aggregate to activate.',
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
   * Correlation identifier for the Role activation operation and resulting
   * RoleActivatedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the Role activation operation and resulting domain event.',
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
  // Activated At
  // ===========================================================================

  /**
   * Optional timestamp at which the Role is considered activated.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the Role is considered activated. When omitted, the current time is used.',
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
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or operation that caused this Role
   * activation request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this Role activation request.',
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
  MIN_PUBLIC_ID_LENGTH as ROLE_ACTIVATE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as ROLE_ACTIVATE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as ROLE_ACTIVATE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as ROLE_ACTIVATE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as ROLE_ACTIVATE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as ROLE_ACTIVATE_CAUSATION_ID_MAX_LENGTH,
};
