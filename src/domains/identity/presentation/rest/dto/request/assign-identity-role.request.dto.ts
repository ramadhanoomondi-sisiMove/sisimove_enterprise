// -----------------------------------------------------------------------------
// Identity — Assign Role Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for assigning a Role to an Identity.
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity
//
// The Role remains a separate aggregate.
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The application handler loads the IdentityAggregate using identityPublicId,
// converts the supplied public identifiers and timestamps as required, invokes:
//
//     identityAggregate.assignRole(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - preventing duplicate active role assignments;
// - determining the assignment timestamp;
// - creating IdentityRoleEntity;
// - establishing aggregate ownership;
// - recording IdentityRoleAssignedEvent.
//
// This DTO does NOT:
//
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - mutate IdentityEntity directly;
// - create the Role;
// - modify Role permissions;
// - authenticate the Identity;
// - create authentication credentials;
// - create a Session;
// - emit IdentityRoleAssignedEvent directly;
// - determine assignedAt;
// - perform external side effects.
//
// The assignment timestamp is a domain fact determined by IdentityAggregate
// when the Role assignment actually occurs.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "rolePublicId": "ROL-01K3R8Y8M4",
//       "correlationId": "COR-01K3R8Y9P6",
//       "assignedByPublicId": "IDN-01K3R8Y6M2",
//       "expiresAt": "2027-08-28T13:30:00.000Z",
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
 * REST request for assigning a Role to an Identity.
 *
 * Represents the application-level intent to establish an IdentityRole
 * assignment within the Identity aggregate.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - rolePublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - assignedByPublicId;
 * - expiresAt;
 * - causationId.
 *
 * The assignment timestamp is intentionally NOT supplied by the caller.
 * IdentityAggregate determines assignedAt when the Role assignment occurs.
 *
 * The following values are intentionally NOT supplied:
 *
 * - IdentityPublicId value object;
 * - Role public identifier value object;
 * - IdentityRoleEntity;
 * - assignment persistence identifier;
 * - assignment occurrence timestamp;
 * - domain events.
 *
 * Those values are handled by the presentation/application and domain
 * boundaries.
 */
export class AssignIdentityRoleRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity aggregate receiving the Role.
   *
   * This is an opaque public identifier and not a persistence/internal
   * identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity aggregate receiving the Role.',
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
  // Role Public ID
  // ===========================================================================

  /**
   * Public identifier of the Role being assigned.
   *
   * The Role is a separate aggregate. This value therefore represents an
   * opaque cross-aggregate reference and does not embed Role state.
   */
  @ApiProperty({
    example: 'ROL-01K3R8Y8M4',
    description:
      'Opaque public identifier of the Role aggregate being assigned to the Identity.',
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
   * Correlation identifier for the Role-assignment operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting IdentityRoleAssignedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y9P6',
    description:
      'Correlation identifier for the Role-assignment operation and resulting domain event.',
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
  // Assigned By Public ID
  // ===========================================================================

  /**
   * Optional public identifier of the Identity that performed the Role
   * assignment.
   *
   * This records the actor responsible for the authorization change. It does
   * not establish an ownership relationship with that Identity.
   */
  @ApiPropertyOptional({
    example: 'IDN-01K3R8Y6M2',
    description:
      'Optional opaque public identifier of the Identity that performed the Role assignment. This records the actor and does not establish ownership.',
    nullable: true,
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'assignedByPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'assignedByPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `assignedByPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  assignedByPublicId?: string;

  // ===========================================================================
  // Expires At
  // ===========================================================================

  /**
   * Optional expiration timestamp for the Role assignment.
   *
   * Unlike assignedAt, expiresAt is a business input. It expresses the
   * requested validity boundary of the Role assignment and may therefore be
   * supplied by the caller.
   *
   * When omitted, the assignment has no explicit expiration.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2027-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the Role assignment expires. When omitted, the assignment has no explicit expiration.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'expiresAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'expiresAt must be a valid date.',
  })
  expiresAt?: Date;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * Role-assignment request.
   *
   * When supplied, this value is propagated through the application workflow
   * and associated with the resulting domain event.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this Role-assignment request.',
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
  MIN_PUBLIC_ID_LENGTH as IDENTITY_ASSIGN_ROLE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as IDENTITY_ASSIGN_ROLE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as IDENTITY_ASSIGN_ROLE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as IDENTITY_ASSIGN_ROLE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as IDENTITY_ASSIGN_ROLE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as IDENTITY_ASSIGN_ROLE_CAUSATION_ID_MAX_LENGTH,
};
