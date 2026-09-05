// -----------------------------------------------------------------------------
// Assets — Get Asset By Object Key Query DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for retrieving an Asset aggregate by its
// storage object key.
//
// The object key is treated as an opaque Asset storage identifier.
//
// The query does NOT communicate with the physical storage provider.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies:
//
//     objectKey
//
// The application/internal boundary converts the transport primitive into:
//
//     AssetObjectKey
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetObjectKey as a domain value object;
// - storageProvider;
// - bucket;
// - physical storage provider SDK types;
// - Asset aggregate state;
// - persistence identifiers;
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Query responsibility:
//
// GetAssetByObjectKeyQuery performs a read-only persistence lookup.
//
// It does NOT:
//
// - communicate with the physical storage provider;
// - modify Asset state;
// - modify physical storage;
// - perform lifecycle transitions;
// - directly access Prisma.
//
// -----------------------------------------------------------------------------
//
// Validation:
//
// The object key must be a non-empty string.
//
// Domain-level validation remains the responsibility of AssetObjectKey when
// the application converts the validated transport value.
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// The object key is documented as a required opaque storage identifier.
//
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

const MIN_ASSET_OBJECT_KEY_LENGTH = 1;
const MAX_ASSET_OBJECT_KEY_LENGTH = 1024;

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

export class GetAssetByObjectKeyQueryDto {
  // ===========================================================================
  // Storage Object Key
  // ===========================================================================

  @ApiProperty({
    example: 'assets/AS-5GH3MK/profile/photo.jpg',
    description: 'Opaque storage object key identifying the Asset.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_ASSET_OBJECT_KEY_LENGTH)
  @MaxLength(MAX_ASSET_OBJECT_KEY_LENGTH)
  objectKey!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetByObjectKeyQueryDto;
