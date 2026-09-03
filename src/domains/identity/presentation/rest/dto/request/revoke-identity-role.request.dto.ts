// -----------------------------------------------------------------------------
// Identity — Revoke Role Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for revoking a Role assignment from an Identity.
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
// converts the supplied public identifiers as required, invokes:
//
//     identityAggregate.revokeRole(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - locating the currently active Role assignment;
// - validating the Identity aggregate boundary;
// - determining revokedAt;
// - revoking the IdentityRoleEntity;
// - recording IdentityRoleRevokedEvent.
//
// A later assignment of the same Role creates a new IdentityRoleEntity.
// Revocation is terminal for the existing assignment.
//
// This DTO does NOT:
//
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - mutate IdentityEntity directly;
// - determine revokedAt;
// - delete the Identity;
// - delete the Role;
// - modify Role permissions;
// - authenticate or de-authenticate the Identity;
// - create or revoke authentication credentials;
// - create or revoke a Session;
// - emit IdentityRoleRevokedEvent directly;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "rolePublicId": "ROL-01K3R8Y8M4",
//       "correlationId": "COR-01K3R8Y9P6",
//       "revokedByPublicId": "IDN-01K3R8Y6M2",
//       "reason": "Role no longer required",
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

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 500;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for revoking a Role assignment from an Identity.
 *
 * Represents the application-level intent to terminate the currently active
 * IdentityRole assignment.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - rolePublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - revokedByPublicId;
 * - reason;
 * - causationId.
 *
 * The revocation timestamp is intentionally NOT supplied by the caller.
 * IdentityAggregate determines revokedAt when the role assignment is revoked.
 *
 * The following values are intentionally NOT supplied:
 *
 * - IdentityPublicId value object;
 * - Role public identifier value object;
 * - IdentityRoleEntity;
 * - assignment persistence identifier;
 * - revokedAt;
 * - domain events.
 *
 * Those values are handled by the presentation/application and domain
 * boundaries.
 */
export class RevokeIdentityRoleRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity aggregate from which the Role is being
   * revoked.
   *
   * This is an opaque public identifier and not a persistence/internal
   * identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity aggregate from which the Role is being revoked.',
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
   * Public identifier of the Role being revoked.
   *
   * The Role is a separate aggregate. This value therefore represents an
   * opaque cross-aggregate reference to the Role aggregate.
   */
  @ApiProperty({
    example: 'ROL-01K3R8Y8M4',
    description:
      'Opaque public identifier of the Role aggregate whose active assignment is being revoked.',
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
   * Correlation identifier for the Role-revocation operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting IdentityRoleRevokedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y9P6',
    description:
      'Correlation identifier for the Role-revocation operation and resulting domain event.',
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
  // Revoked By Public ID
  // ===========================================================================

  /**
   * Optional public identifier of the Identity that performed the Role
   * revocation.
   *
   * This identifies the actor responsible for the authorization change.
   */
  @ApiPropertyOptional({
    example: 'IDN-01K3R8Y6M2',
    description:
      'Optional opaque public identifier of the Identity that performed the Role revocation.',
    nullable: true,
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'revokedByPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'revokedByPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `revokedByPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  revokedByPublicId?: string;

  // ===========================================================================
  // Reason
  // ===========================================================================

  /**
   * Optional business reason for revoking the Role assignment.
   *
   * The reason is contextual business information and is passed to the
   * aggregate as part of the revocation operation.
   */
  @ApiPropertyOptional({
    example: 'Role no longer required',
    description: 'Optional business reason for revoking the Role assignment.',
    nullable: true,
    minLength: MIN_REASON_LENGTH,
    maxLength: MAX_REASON_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'reason must be a string.',
  })
  @MinLength(MIN_REASON_LENGTH, {
    message: 'reason must not be empty.',
  })
  @MaxLength(MAX_REASON_LENGTH, {
    message: `reason must not exceed ${MAX_REASON_LENGTH} characters.`,
  })
  reason?: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * Role-revocation request.
   *
   * When supplied, this value is propagated through the application workflow
   * and may be included in the resulting domain event metadata.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this Role-revocation request.',
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
  MIN_PUBLIC_ID_LENGTH as IDENTITY_REVOKE_ROLE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as IDENTITY_REVOKE_ROLE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as IDENTITY_REVOKE_ROLE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as IDENTITY_REVOKE_ROLE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as IDENTITY_REVOKE_ROLE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as IDENTITY_REVOKE_ROLE_CAUSATION_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as IDENTITY_REVOKE_ROLE_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as IDENTITY_REVOKE_ROLE_REASON_MAX_LENGTH,
};
