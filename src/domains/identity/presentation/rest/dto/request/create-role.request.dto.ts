// -----------------------------------------------------------------------------
// Identity — Create Role Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Role aggregate.
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// This DTO represents the transport-level intent to create a new Role.
//
// The DTO does NOT:
//
// - construct RoleEntity;
// - construct RoleAggregate;
// - construct RoleCode;
// - construct RoleName;
// - persist the Role;
// - assign the Role to an Identity;
// - create IdentityRole relationships;
// - create RolePermission relationships;
// - grant permissions;
// - emit domain events;
// - access Prisma;
// - communicate with external systems.
//
// The application layer is responsible for converting the transport values
// into domain value objects and constructing:
//
//     CreateRoleCommand
//
// The RoleAggregate remains responsible for enforcing domain invariants.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - code
// - name
// - displayOrder
// - isSystem
// - correlationId
//
// Optional inputs:
//
// - description
// - causationId
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "code": "DRIVER",
//       "name": "Driver",
//       "displayOrder": 20,
//       "isSystem": false,
//       "description": "Role granted to verified drivers.",
//       "correlationId": "COR-01K3R8Z1M4",
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

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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

const MIN_CODE_LENGTH = 1;
const MAX_CODE_LENGTH = 128;

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 255;

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 1000;

const MIN_DISPLAY_ORDER = 0;
const MAX_DISPLAY_ORDER = 2_147_483_647;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for creating a Role aggregate.
 *
 * Represents the transport-level business inputs required by
 * CreateRoleCommand.
 *
 * Required transport input:
 *
 * - code;
 * - name;
 * - displayOrder;
 * - isSystem;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - description;
 * - causationId.
 *
 * Domain value objects are intentionally not exposed at the HTTP boundary.
 * The application layer converts `code` and `name` into RoleCode and RoleName.
 */
export class CreateRoleRequestDto {
  // ===========================================================================
  // Role Code
  // ===========================================================================

  /**
   * Stable machine-readable Role code.
   *
   * The application layer converts this transport value into RoleCode.
   *
   * The Role domain remains responsible for final business validation.
   */
  @ApiProperty({
    example: 'DRIVER',
    description: 'Stable machine-readable code identifying the Role.',
    minLength: MIN_CODE_LENGTH,
    maxLength: MAX_CODE_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'code must be a string.',
  })
  @MinLength(MIN_CODE_LENGTH, {
    message: 'code must not be empty.',
  })
  @MaxLength(MAX_CODE_LENGTH, {
    message: `code must not exceed ${MAX_CODE_LENGTH} characters.`,
  })
  code!: string;

  // ===========================================================================
  // Role Name
  // ===========================================================================

  /**
   * Human-readable Role name.
   *
   * The application layer converts this transport value into RoleName.
   */
  @ApiProperty({
    example: 'Driver',
    description: 'Human-readable name of the Role.',
    minLength: MIN_NAME_LENGTH,
    maxLength: MAX_NAME_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'name must be a string.',
  })
  @MinLength(MIN_NAME_LENGTH, {
    message: 'name must not be empty.',
  })
  @MaxLength(MAX_NAME_LENGTH, {
    message: `name must not exceed ${MAX_NAME_LENGTH} characters.`,
  })
  name!: string;

  // ===========================================================================
  // Display Order
  // ===========================================================================

  /**
   * Administrative display ordering for the Role.
   *
   * Lower values may be displayed before higher values.
   *
   * The domain remains responsible for any additional business constraints
   * concerning Role ordering.
   */
  @ApiProperty({
    example: 20,
    description: 'Administrative display ordering for the Role.',
    minimum: MIN_DISPLAY_ORDER,
    maximum: MAX_DISPLAY_ORDER,
    type: Number,
  })
  @IsInt({
    message: 'displayOrder must be an integer.',
  })
  @Min(MIN_DISPLAY_ORDER, {
    message: `displayOrder must be at least ${MIN_DISPLAY_ORDER}.`,
  })
  @Max(MAX_DISPLAY_ORDER, {
    message: `displayOrder must not exceed ${MAX_DISPLAY_ORDER}.`,
  })
  displayOrder!: number;

  // ===========================================================================
  // System Role
  // ===========================================================================

  /**
   * Indicates whether the Role is system-managed.
   *
   * System Roles are protected by Role domain rules.
   */
  @ApiProperty({
    example: false,
    description: 'Indicates whether the Role is system-managed.',
    type: Boolean,
  })
  @IsBoolean({
    message: 'isSystem must be a boolean.',
  })
  isSystem!: boolean;

  // ===========================================================================
  // Description
  // ===========================================================================

  /**
   * Optional human-readable description of the Role.
   *
   * An omitted description remains undefined when mapped to
   * CreateRoleCommand.
   */
  @ApiPropertyOptional({
    example: 'Role granted to verified drivers.',
    description: 'Optional human-readable description of the Role.',
    nullable: true,
    minLength: MIN_DESCRIPTION_LENGTH,
    maxLength: MAX_DESCRIPTION_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'description must be a string.',
  })
  @MinLength(MIN_DESCRIPTION_LENGTH, {
    message: 'description must not be empty.',
  })
  @MaxLength(MAX_DESCRIPTION_LENGTH, {
    message: `description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`,
  })
  description?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Role creation operation and resulting
   * RoleCreatedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the Role creation operation and resulting domain event.',
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
   * Optional identifier of the command or operation that caused this Role
   * creation request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this Role creation request.',
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
  MIN_CODE_LENGTH as ROLE_CREATE_CODE_MIN_LENGTH,
  MAX_CODE_LENGTH as ROLE_CREATE_CODE_MAX_LENGTH,
  MIN_NAME_LENGTH as ROLE_CREATE_NAME_MIN_LENGTH,
  MAX_NAME_LENGTH as ROLE_CREATE_NAME_MAX_LENGTH,
  MIN_DESCRIPTION_LENGTH as ROLE_CREATE_DESCRIPTION_MIN_LENGTH,
  MAX_DESCRIPTION_LENGTH as ROLE_CREATE_DESCRIPTION_MAX_LENGTH,
  MIN_DISPLAY_ORDER as ROLE_CREATE_DISPLAY_ORDER_MIN,
  MAX_DISPLAY_ORDER as ROLE_CREATE_DISPLAY_ORDER_MAX,
  MIN_CORRELATION_ID_LENGTH as ROLE_CREATE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as ROLE_CREATE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as ROLE_CREATE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as ROLE_CREATE_CAUSATION_ID_MAX_LENGTH,
};
