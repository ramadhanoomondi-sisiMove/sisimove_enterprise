// -----------------------------------------------------------------------------
// Identity — Assign Role Permission Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for assigning a Permission to a Role.
//
// The request represents the transport-level intent to create a
// RolePermission authorization relationship.
//
// The application layer converts this DTO into:
//
//     AssignRolePermissionCommand
//
// The application handler is responsible for resolving and validating the
// referenced Role and Permission, enforcing authorization, constructing the
// RolePermission aggregate, and persisting it.
//
// The RolePermission aggregate remains responsible for relationship invariants
// and domain-event recording.
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
// The request does NOT:
//
// - construct RolePermissionEntity;
// - construct RolePermissionAggregate;
// - mutate RoleEntity;
// - mutate PermissionEntity;
// - persist RolePermission;
// - emit RolePermissionAssignedEvent directly;
// - assign a Role to an Identity;
// - grant permissions directly to an Identity;
// - authenticate an Identity;
// - evaluate authorization;
// - access Prisma;
// - communicate with external systems;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - roleId
// - permissionId
// - correlationId
//
// Optional inputs:
//
// - assignedAt
// - causationId
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "roleId": "ROL-01K3R8Y7Q2",
//       "permissionId": "PER-01K3R8Y9P6",
//       "assignedAt": "2026-08-28T13:30:00.000Z",
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
 * REST request for assigning a Permission to a Role.
 *
 * Represents the transport-level intent to establish a RolePermission
 * authorization relationship.
 *
 * Required transport input:
 *
 * - roleId;
 * - permissionId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - assignedAt;
 * - causationId.
 *
 * The DTO does not resolve the Role or Permission and does not perform
 * authorization or domain lifecycle decisions.
 */
export class AssignRolePermissionRequestDto {
  // ===========================================================================
  // Role Public ID
  // ===========================================================================

  /**
   * Public identifier of the Role receiving the Permission.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'ROL-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Role receiving the Permission.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'roleId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'roleId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `roleId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  roleId!: string;

  // ===========================================================================
  // Permission Public ID
  // ===========================================================================

  /**
   * Public identifier of the Permission being assigned.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'PER-01K3R8Y9P6',
    description: 'Opaque public identifier of the Permission being assigned.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'permissionId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'permissionId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `permissionId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  permissionId!: string;

  // ===========================================================================
  // Assigned At
  // ===========================================================================

  /**
   * Optional timestamp at which the RolePermission relationship is considered
   * to have been established.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the RolePermission relationship is considered to have been established. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'assignedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'assignedAt must be a valid date.',
  })
  assignedAt?: Date;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the assignment operation and resulting domain
   * event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the RolePermission assignment operation.',
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
   * RolePermission assignment request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this RolePermission assignment.',
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
  MIN_PUBLIC_ID_LENGTH as ROLE_PERMISSION_ASSIGN_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as ROLE_PERMISSION_ASSIGN_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as ROLE_PERMISSION_ASSIGN_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as ROLE_PERMISSION_ASSIGN_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as ROLE_PERMISSION_ASSIGN_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as ROLE_PERMISSION_ASSIGN_CAUSATION_ID_MAX_LENGTH,
};
