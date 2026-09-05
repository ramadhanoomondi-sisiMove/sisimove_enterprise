// -----------------------------------------------------------------------------
// Assets — Get Assets By Owner Query DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for retrieving Assets belonging to an Identity.
//
// The request identifies the owning Identity through its opaque public
// identifier.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies:
//
//     identityPublicId
//
// The application/internal boundary converts the transport primitive into:
//
//     AssetIdentityPublicId
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetIdentityPublicId as a domain value object;
// - Identity internal database ID;
// - Identity aggregate;
// - Identity state;
// - authorization information;
// - repository criteria;
// - persistence details.
//
// -----------------------------------------------------------------------------
//
// Query responsibility:
//
// GetAssetsByOwnerQuery performs a read-only lookup.
//
// It does NOT:
//
// - load the Identity aggregate;
// - validate Identity state;
// - modify Identity;
// - modify Asset state;
// - perform authorization;
// - directly access Prisma.
//
// -----------------------------------------------------------------------------
//
// Validation:
//
// The identifier is validated as a non-empty string at the HTTP boundary.
//
// The AssetIdentityPublicId value object remains responsible for domain-level
// identifier validation when the application converts the transport value.
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// The opaque Identity public identifier is documented as a required query
// parameter.
//
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// Transformation
// =============================================================================

const trimString = ({ value }: TransformFnParams): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim();
};

// =============================================================================
// DTO
// =============================================================================

export class GetAssetsByOwnerQueryDto {
  // ===========================================================================
  // Owner Identity
  // ===========================================================================

  @ApiProperty({
    example: 'ID-5GH3MK',
    description: 'Opaque public identifier of the owning Identity.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH)
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH)
  identityPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByOwnerQueryDto;
