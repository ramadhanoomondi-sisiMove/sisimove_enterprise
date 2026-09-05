// -----------------------------------------------------------------------------
// Assets — Change Asset Visibility Request DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for changing the visibility of an existing
// Asset.
//
// The request represents the user's/business actor's intent:
//
//     Change Asset Visibility
//
// Only the new visibility is exposed through HTTP.
//
// The Asset public identifier is supplied by the route and is therefore not
// duplicated in this DTO.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies:
//
//     visibility
//
// The application/internal boundary supplies:
//
//     publicId
//     correlationId
//     causationId
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetPublicId;
// - correlationId;
// - causationId;
// - AssetVisibility as a domain value object;
// - AssetStatus;
// - lifecycle timestamps;
// - persistence identifiers;
// - storage information.
//
// -----------------------------------------------------------------------------
//
// Domain conversion:
//
// The controller/application boundary converts the validated transport value:
//
//     "PUBLIC" | "PRIVATE"
//
// into:
//
//     AssetVisibility
//
// The resulting value object is then supplied to
// ChangeAssetVisibilityCommand.
//
// -----------------------------------------------------------------------------
//
// Domain responsibility:
//
// AssetAggregate / AssetEntity remain responsible for determining whether
// the Asset is currently mutable and whether the visibility change is valid.
//
// The DTO contains validation only; it contains no business rules.
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// The visibility field is documented as the finite set of values supported by
// the Asset domain.
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

const MIN_ASSET_VISIBILITY_LENGTH = 1;
const MAX_ASSET_VISIBILITY_LENGTH = 16;

const ASSET_VISIBILITIES = ['PUBLIC', 'PRIVATE'] as const;

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

export class ChangeAssetVisibilityRequestDto {
  // ===========================================================================
  // Visibility
  // ===========================================================================

  @ApiProperty({
    enum: ASSET_VISIBILITIES,
    example: 'PUBLIC',
    description: 'New visibility of the Asset.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_ASSET_VISIBILITY_LENGTH)
  @MaxLength(MAX_ASSET_VISIBILITY_LENGTH)
  @IsIn(ASSET_VISIBILITIES)
  visibility!: string;
}

// -----------------------------------------------------------------------------
// Exported Transport Values
// -----------------------------------------------------------------------------

export { ASSET_VISIBILITIES };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangeAssetVisibilityRequestDto;
