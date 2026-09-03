// -----------------------------------------------------------------------------
// Session — Get Sessions Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving multiple Sessions.
//
// Query:
//
//     Get Sessions
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO optionally provides the primitive Identity public identifier used to
// construct:
//
//     GetSessionsQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     identityPublicId: string
//              ↓
//     SessionIdentityPublicId.create(value)
//              ↓
//     GetSessionsQuery
//
// When identityPublicId is omitted, the query is not scoped to a specific
// Identity.
//
// This DTO does NOT:
//
// - load Session aggregates;
// - access SessionRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity state;
// - contain domain business logic;
// - map aggregates to response DTOs.
//
// The corresponding query handler is responsible for:
//
// - resolving Sessions through the repository;
// - applying the query criteria;
// - handling the result;
// - mapping aggregates to the appropriate application read model or DTO.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2"
//     }
//
// Or:
//
//     {}
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

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

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving multiple Session aggregates.
 *
 * Optional transport input:
 *
 * - identityPublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper is responsible for converting it into:
 *
 *     SessionIdentityPublicId.create(identityPublicId)
 *
 * before constructing GetSessionsQuery.
 *
 * When identityPublicId is omitted, no Identity-specific filter is supplied.
 */
export class GetSessionsQueryDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Optional public identifier of the Identity whose Sessions should be
   * retrieved.
   *
   * This remains a primitive transport string.
   *
   * The presentation/application mapper converts this value into the
   * SessionIdentityPublicId value object before constructing GetSessionsQuery.
   *
   * Example:
   *
   * - IDN-01K3R8Y7Q2
   */
  @ApiPropertyOptional({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Optional public identifier of the Identity whose Sessions should be retrieved. The transport string is converted to the SessionIdentityPublicId value object at the application boundary.',
    minLength: MIN_IDENTITY_PUBLIC_ID_LENGTH,
    maxLength: MAX_IDENTITY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_IDENTITY_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_IDENTITY_PUBLIC_ID_LENGTH, MAX_IDENTITY_PUBLIC_ID_LENGTH };
