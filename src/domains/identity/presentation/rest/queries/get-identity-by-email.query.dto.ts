// -----------------------------------------------------------------------------
// Identity — Get Identity By Email Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving an existing Identity aggregate by its
// email address.
//
// The DTO maps transport input into:
//
//     GetIdentityByEmailQuery
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose persistence or ORM models;
// - resolve internal entity identifiers;
// - mutate the Identity aggregate;
// - authenticate the Identity;
// - manage sessions;
// - evaluate permissions;
// - manage verification;
// - communicate with external systems.
//
// The query handler is responsible for resolving the complete IdentityAggregate
// through IdentityRepository.findByEmail().
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const normalizeEmail = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_EMAIL_LENGTH = 3;
const MAX_EMAIL_LENGTH = 320;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Transport DTO for retrieving an existing Identity aggregate by email address.
 *
 * The raw transport email is normalized at the presentation boundary before
 * being converted into the IdentityEmail domain value object used by
 * GetIdentityByEmailQuery.
 *
 * Required transport input:
 *
 * - email.
 *
 * The DTO performs transport-level validation only. Final domain validation and
 * normalization remain the responsibility of IdentityEmail.
 */
export class GetIdentityByEmailQueryDto {
  // ===========================================================================
  // Email
  // ===========================================================================

  /**
   * Email address used to locate the Identity aggregate.
   *
   * The value is trimmed and normalized to lowercase at the transport boundary.
   * The application mapping layer converts the validated primitive into the
   * IdentityEmail domain value object.
   */
  @ApiProperty({
    example: 'ramadhan@example.com',
    description: 'Email address used to locate the Identity aggregate.',
    format: 'email',
    minLength: MIN_EMAIL_LENGTH,
    maxLength: MAX_EMAIL_LENGTH,
  })
  @Transform(normalizeEmail)
  @IsString({
    message: 'email must be a string.',
  })
  @MinLength(MIN_EMAIL_LENGTH, {
    message: 'email must not be empty.',
  })
  @MaxLength(MAX_EMAIL_LENGTH, {
    message: `email must not exceed ${MAX_EMAIL_LENGTH} characters.`,
  })
  @IsEmail(
    {},
    {
      message: 'email must be a valid email address.',
    },
  )
  email!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_EMAIL_LENGTH as IDENTITY_QUERY_EMAIL_MIN_LENGTH,
  MAX_EMAIL_LENGTH as IDENTITY_QUERY_EMAIL_MAX_LENGTH,
};
