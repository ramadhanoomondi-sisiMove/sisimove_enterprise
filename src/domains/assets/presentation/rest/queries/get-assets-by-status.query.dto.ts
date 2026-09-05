// -----------------------------------------------------------------------------
// Assets — Get Assets By Status Query DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for retrieving Asset aggregates by lifecycle
// status.
//
// The request represents a read-only persistence lookup by Asset lifecycle
// state.
//
// Only the status value is exposed through HTTP.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies:
//
//     status
//
// The application/internal boundary converts the transport primitive into:
//
//     AssetStatus
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetStatus as a domain value object;
// - persistence identifiers;
// - internal repository criteria;
// - storage-provider details;
// - lifecycle timestamps;
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Query responsibility:
//
// GetAssetsByStatusQuery performs a read-only Asset lookup.
//
// It does NOT:
//
// - determine whether an Asset may perform a business operation;
// - modify Asset state;
// - perform lifecycle transitions;
// - modify physical storage;
// - directly access Prisma.
//
// -----------------------------------------------------------------------------
//
// Validation:
//
// The status is restricted to the lifecycle states supported by the Asset
// domain.
//
// Domain conversion remains responsible for constructing AssetStatus from the
// validated transport value.
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// The status is documented as the finite set of Asset lifecycle states
// supported by the public HTTP contract.
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

const MIN_ASSET_STATUS_LENGTH = 1;
const MAX_ASSET_STATUS_LENGTH = 16;

const ASSET_STATUSES = [
  'UPLOADING',
  'UPLOADED',
  'READY',
  'ARCHIVED',
  'DELETED',
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

export class GetAssetsByStatusQueryDto {
  // ===========================================================================
  // Asset Lifecycle Status
  // ===========================================================================

  @ApiProperty({
    enum: ASSET_STATUSES,
    example: 'READY',
    description: 'Asset lifecycle status used for the lookup.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_ASSET_STATUS_LENGTH)
  @MaxLength(MAX_ASSET_STATUS_LENGTH)
  @IsIn(ASSET_STATUSES)
  status!: string;
}

// -----------------------------------------------------------------------------
// Exported Transport Values
// -----------------------------------------------------------------------------

export { ASSET_STATUSES };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByStatusQueryDto;
