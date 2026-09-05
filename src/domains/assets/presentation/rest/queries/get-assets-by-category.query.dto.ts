// -----------------------------------------------------------------------------
// Assets — Get Assets By Category Query DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for retrieving Asset aggregates by Asset
// category.
//
// The request represents a read-only category lookup.
//
// Only the category value is exposed through HTTP.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies:
//
//     category
//
// The application/internal boundary converts the transport primitive into:
//
//     AssetCategory
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetCategory as a domain value object;
// - persistence identifiers;
// - internal repository criteria;
// - storage-provider details;
// - lifecycle mutation data;
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Query responsibility:
//
// GetAssetsByCategoryQuery performs a read-only Asset lookup.
//
// It does NOT:
//
// - modify Asset state;
// - modify physical storage;
// - perform lifecycle transitions;
// - directly access Prisma.
//
// -----------------------------------------------------------------------------
//
// Validation:
//
// The category is restricted to the categories supported by the Asset domain.
//
// Domain conversion remains responsible for constructing AssetCategory from
// the validated transport value.
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// The category is documented as the finite set of Asset categories supported
// by the public HTTP contract.
//
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

const MIN_ASSET_CATEGORY_LENGTH = 1;
const MAX_ASSET_CATEGORY_LENGTH = 64;

const ASSET_CATEGORIES = [
  'PROFILE_PHOTO',
  'COVER_PHOTO',
  'AVATAR',
  'GOVERNMENT_ID',
  'DRIVER_LICENSE',
  'PASSPORT',
  'SELFIE',
  'VEHICLE_PHOTO',
  'CHAT_ATTACHMENT',
  'OTHER',
] as const;

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

export class GetAssetsByCategoryQueryDto {
  // ===========================================================================
  // Asset Category
  // ===========================================================================

  @ApiProperty({
    enum: ASSET_CATEGORIES,
    example: 'PROFILE_PHOTO',
    description: 'Asset category used for the lookup.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_ASSET_CATEGORY_LENGTH)
  @MaxLength(MAX_ASSET_CATEGORY_LENGTH)
  @IsIn(ASSET_CATEGORIES)
  category!: string;
}

// -----------------------------------------------------------------------------
// Exported Transport Values
// -----------------------------------------------------------------------------

export { ASSET_CATEGORIES };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByCategoryQueryDto;
