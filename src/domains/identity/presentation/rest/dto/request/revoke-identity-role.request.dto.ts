// -----------------------------------------------------------------------------
// Identity — Revoke Role Request DTO
// -----------------------------------------------------------------------------
//
// REST body DTO for revoking a Role assignment from an Identity.
//
// Route:
//   PATCH /identities/:identityPublicId/roles/:rolePublicId/revoke
//
// Route parameters:
//   identityPublicId — Identity aggregate public identifier.
//   rolePublicId     — Role aggregate public identifier.
//
// Request body:
//   reason           — Optional business reason for revocation.
//
// Correlation and causation metadata belong to the established application
// request context. The authenticated actor should come from the application's
// authenticated principal, not from an untrusted caller-supplied actor ID.
//
// IdentityAggregate remains responsible for role-assignment lifecycle rules,
// revocation timestamps, and domain-event recording.
//
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 500;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request body for revoking a Role assignment.
 *
 * Identity and Role public identifiers are supplied by the route.
 * Correlation metadata and actor identity are established by the application
 * from its existing request context and authentication mechanisms.
 */
export class RevokeIdentityRoleRequestDto {
  /**
   * Optional business reason for revoking the Role assignment.
   *
   * Omit this property when no reason is provided.
   */
  @ApiPropertyOptional({
    example: 'Role no longer required',
    description: 'Optional business reason for revoking the Role assignment.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_REASON_LENGTH as IDENTITY_REVOKE_ROLE_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as IDENTITY_REVOKE_ROLE_REASON_MAX_LENGTH,
};