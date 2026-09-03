// -----------------------------------------------------------------------------
// Authentication — Get Authentication By Identity Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving the Authentication associated with a specific
// Identity.
//
// Relationship:
//
// Identity
//        │
//        │ identityPublicId
//        ▼
// AuthenticationAggregate
// └── AuthenticationEntity
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO provides the primitive Identity identifier required to construct:
//
//     GetAuthenticationByIdentityQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     identityPublicId: string
//              ↓
//     AuthenticationIdentityPublicId.create(value)
//              ↓
//     GetAuthenticationByIdentityQuery
//
// This DTO does NOT:
//
// - load the Authentication aggregate;
// - access AuthenticationRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity domain state;
// - contain domain business logic;
// - resolve Authentication itself;
// - map the aggregate to a response DTO.
//
// The corresponding query handler is responsible for:
//
// - loading Authentication through the repository;
// - resolving Authentication by its Identity public reference;
// - handling the not-found case;
// - mapping the aggregate to the appropriate application read model or DTO.
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
 * REST query DTO for retrieving the Authentication associated with a specific
 * Identity.
 *
 * Required transport input:
 *
 * - identityPublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper is responsible for converting it into:
 *
 *     AuthenticationIdentityPublicId.create(identityPublicId)
 *
 * before constructing GetAuthenticationByIdentityQuery.
 *
 * Authentication is resolved through its opaque reference to the Identity
 * aggregate rather than through Authentication's own public identifier.
 */
export class GetAuthenticationByIdentityQueryDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity associated with the Authentication to
   * retrieve.
   *
   * This remains a primitive transport string.
   *
   * The presentation/application mapper converts this value into the
   * AuthenticationIdentityPublicId domain Value Object before constructing
   * the query.
   *
   * Example:
   *
   * - IDN-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Public identifier of the Identity associated with the Authentication to retrieve. The transport string is converted to the AuthenticationIdentityPublicId value object at the application boundary.',
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
