// -----------------------------------------------------------------------------
// Session — Get Active Sessions Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving all currently active Sessions belonging to an
// Identity.
//
// Query:
//
//     Get Active Sessions
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO provides the primitive Identity public identifier required to
// construct:
//
//     GetActiveSessionsQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     identityPublicId: string
//              ↓
//     SessionIdentityPublicId.create(value)
//              ↓
//     GetActiveSessionsQuery
//
// An Identity with no active Sessions is a valid result and should produce an
// empty collection rather than a not-found error.
//
// This DTO does NOT:
//
// - load Session aggregates;
// - access SessionRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity state;
// - contain domain business logic;
// - contain refresh tokens;
// - contain authentication credentials;
// - map aggregates to response DTOs.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2"
//     }
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

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving all active Session aggregates belonging to an
 * Identity.
 *
 * Required transport input:
 *
 * - identityPublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper converts this value into the
 * SessionIdentityPublicId value object before constructing
 * GetActiveSessionsQuery.
 */
export class GetActiveSessionsQueryDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity whose active Sessions should be
   * retrieved.
   *
   * This remains a primitive transport string.
   *
   * The presentation/application mapper converts this value into:
   *
   *     SessionIdentityPublicId.create(identityPublicId)
   *
   * before constructing GetActiveSessionsQuery.
   *
   * Example:
   *
   * - IDN-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Public identifier of the Identity whose active Sessions should be retrieved. The transport string is converted to the SessionIdentityPublicId value object at the application boundary.',
    minLength: MIN_IDENTITY_PUBLIC_ID_LENGTH,
    maxLength: MAX_IDENTITY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_IDENTITY_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_IDENTITY_PUBLIC_ID_LENGTH, MAX_IDENTITY_PUBLIC_ID_LENGTH };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetActiveSessionsQueryDto;
