// -----------------------------------------------------------------------------
// Session — Get Session Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving a single Session by its public identifier.
//
// Query:
//
//     Get Session
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO provides the primitive Session identifier required to construct:
//
//     GetSessionQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     sessionPublicId: string
//              ↓
//     SessionPublicId.create(value)
//              ↓
//     GetSessionQuery
//
// This DTO does NOT:
//
// - load the Session aggregate;
// - access SessionRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity state;
// - validate Device state;
// - contain domain business logic;
// - map the aggregate to a response DTO.
//
// The corresponding query handler is responsible for:
//
// - loading the Session aggregate through the repository;
// - handling the not-found case;
// - mapping the aggregate to the appropriate application read model or DTO.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "sessionPublicId": "SES-01K3R8Y7Q2"
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

const MIN_SESSION_PUBLIC_ID_LENGTH = 1;
const MAX_SESSION_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving a single Session aggregate by its public
 * identifier.
 *
 * Required transport input:
 *
 * - sessionPublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper is responsible for converting it into:
 *
 *     SessionPublicId.create(sessionPublicId)
 *
 * before constructing GetSessionQuery.
 */
export class GetSessionQueryDto {
  // ===========================================================================
  // Session Public ID
  // ===========================================================================

  /**
   * Public identifier of the Session aggregate to retrieve.
   *
   * This remains a primitive transport string.
   *
   * The presentation/application mapper converts this value into the
   * SessionPublicId domain Value Object before constructing the query.
   *
   * Example:
   *
   * - SES-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'SES-01K3R8Y7Q2',
    description:
      'Public identifier of the Session to retrieve. The transport string is converted to the SessionPublicId value object at the application boundary.',
    minLength: MIN_SESSION_PUBLIC_ID_LENGTH,
    maxLength: MAX_SESSION_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'sessionPublicId must be a string.',
  })
  @MinLength(MIN_SESSION_PUBLIC_ID_LENGTH, {
    message: 'sessionPublicId must not be empty.',
  })
  @MaxLength(MAX_SESSION_PUBLIC_ID_LENGTH, {
    message: `sessionPublicId must not exceed ${MAX_SESSION_PUBLIC_ID_LENGTH} characters.`,
  })
  sessionPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_SESSION_PUBLIC_ID_LENGTH, MAX_SESSION_PUBLIC_ID_LENGTH };
