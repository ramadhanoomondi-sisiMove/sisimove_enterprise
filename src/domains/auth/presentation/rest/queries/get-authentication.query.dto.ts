// -----------------------------------------------------------------------------
// Authentication — Get Authentication Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving an Authentication by its public identifier.
//
// Query:
//
//     Get Authentication
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO provides the primitive identifier required to construct:
//
//     GetAuthenticationQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     authenticationPublicId: string
//                 ↓
//     AuthenticationPublicId.create(value)
//                 ↓
//     GetAuthenticationQuery
//
// This DTO does NOT:
//
// - load the Authentication aggregate;
// - access AuthenticationRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity state;
// - contain domain business logic;
// - map the aggregate to a response DTO.
//
// The query handler remains responsible for retrieving the Authentication
// aggregate and mapping the result to the appropriate read model.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "authenticationPublicId": "AUTH-01K3R8Y7Q2"
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

const MIN_AUTHENTICATION_PUBLIC_ID_LENGTH = 1;
const MAX_AUTHENTICATION_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving a single Authentication aggregate by its
 * public identifier.
 *
 * Required transport input:
 *
 * - authenticationPublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper is responsible for converting it into:
 *
 *     AuthenticationPublicId.create(authenticationPublicId)
 *
 * before constructing GetAuthenticationQuery.
 */
export class GetAuthenticationQueryDto {
  // ===========================================================================
  // Authentication Public ID
  // ===========================================================================

  /**
   * Public identifier of the Authentication aggregate to retrieve.
   *
   * This is a transport-level primitive.
   *
   * The presentation/application mapper converts this value into the
   * AuthenticationPublicId domain Value Object before constructing the query.
   *
   * Example:
   *
   * - AUTH-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'AUTH-01K3R8Y7Q2',
    description:
      'Public identifier of the Authentication to retrieve. The transport string is converted to the AuthenticationPublicId value object at the application boundary.',
    minLength: MIN_AUTHENTICATION_PUBLIC_ID_LENGTH,
    maxLength: MAX_AUTHENTICATION_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'authenticationPublicId must be a string.',
  })
  @MinLength(MIN_AUTHENTICATION_PUBLIC_ID_LENGTH, {
    message: 'authenticationPublicId must not be empty.',
  })
  @MaxLength(MAX_AUTHENTICATION_PUBLIC_ID_LENGTH, {
    message: `authenticationPublicId must not exceed ${MAX_AUTHENTICATION_PUBLIC_ID_LENGTH} characters.`,
  })
  authenticationPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_AUTHENTICATION_PUBLIC_ID_LENGTH,
  MAX_AUTHENTICATION_PUBLIC_ID_LENGTH,
};
