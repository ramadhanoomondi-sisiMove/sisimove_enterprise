// -----------------------------------------------------------------------------
// Identity — Revoke Role Permission Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for revoking a RolePermission authorization relationship.
//
// The request represents the transport-level intent to transition an existing
// RolePermission aggregate into the REVOKED lifecycle state.
//
// The application layer converts this DTO into:
//
//     RevokeRolePermissionCommand
//
// The application handler is responsible for resolving the
// RolePermissionAggregate and invoking:
//
//     rolePermissionAggregate.revoke(...)
//
// The aggregate remains responsible for lifecycle validation, invariants,
// state mutation, and domain-event recording.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ASSIGNED ───────► REVOKED
//
// REVOKED is terminal.
//
// -----------------------------------------------------------------------------
//
// The request does NOT:
//
// - construct RolePermissionEntity;
// - construct RolePermissionAggregate;
// - mutate RoleEntity;
// - mutate PermissionEntity;
// - persist RolePermission;
// - emit RolePermissionRevokedEvent directly;
// - deactivate the Role;
// - deactivate the Permission;
// - revoke the Role from an Identity;
// - modify Identity authentication state;
// - evaluate authorization;
// - access Prisma;
// - communicate with external systems;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// The relationship is already uniquely identified by:
//
//     rolePermissionPublicId
//
// The request therefore does NOT accept:
//
// - roleId;
// - permissionId.
//
// Those identifiers belong to the existing RolePermission relationship and
// do not need to be supplied to revoke it.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - rolePermissionPublicId
// - correlationId
//
// Optional inputs:
//
// - revokedAt
// - causationId
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "rolePermissionPublicId": "RPR-01K3R8Y7Q2",
//       "revokedAt": "2026-08-28T13:30:00.000Z",
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
 * REST request for revoking a RolePermission aggregate.
 *
 * Represents the transport-level intent to revoke an existing
 * RolePermission authorization relationship.
 *
 * Required transport input:
 *
 * - rolePermissionPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - revokedAt;
 * - causationId.
 *
 * The DTO does not perform domain lifecycle decisions. Those remain inside
 * RolePermissionAggregate.
 */
export class RevokeRolePermissionRequestDto {
  // ===========================================================================
  // Role Permission Public ID
  // ===========================================================================

  /**
   * Public identifier of the RolePermission aggregate to revoke.
   *
   * This identifies the existing Role-to-Permission authorization relationship.
   *
   * It is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'RPR-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the RolePermission authorization relationship to revoke.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'rolePermissionPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'rolePermissionPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `rolePermissionPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  rolePermissionPublicId!: string;

  // ===========================================================================
  // Revoked At
  // ===========================================================================

  /**
   * Optional timestamp at which the RolePermission relationship is considered
   * to have been revoked.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the RolePermission relationship is considered to have been revoked. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'revokedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'revokedAt must be a valid date.',
  })
  revokedAt?: Date;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the revocation operation and resulting domain
   * event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the RolePermission revocation operation.',
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
   * RolePermission revocation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this RolePermission revocation.',
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
  MIN_PUBLIC_ID_LENGTH as ROLE_PERMISSION_REVOKE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as ROLE_PERMISSION_REVOKE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as ROLE_PERMISSION_REVOKE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as ROLE_PERMISSION_REVOKE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as ROLE_PERMISSION_REVOKE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as ROLE_PERMISSION_REVOKE_CAUSATION_ID_MAX_LENGTH,
};
