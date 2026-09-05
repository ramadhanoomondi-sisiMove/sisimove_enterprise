// -----------------------------------------------------------------------------
// Assets — Create Asset Request DTO
// -----------------------------------------------------------------------------
//
// Application-boundary request contract for creating an Asset aggregate.
//
// This DTO represents Asset metadata required by CreateAssetHandler.
//
// It is NOT the user-facing physical file upload contract.
//
// The user-facing operation is:
//
//     Upload Asset
//
// The UploadAssetHandler orchestrates the complete workflow and delegates
// Asset aggregate creation to CreateAssetHandler.
//
// -----------------------------------------------------------------------------
//
// Creation workflow:
//
//     UploadAssetRequestDto
//              │
//              │ physical file
//              ▼
//     UploadAssetHandler
//              │
//              ├── AssetStoragePort.upload()
//              │
//              └── CreateAssetCommand
//                       │
//                       ▼
//                CreateAssetHandler
//                       │
//                       ▼
//                AssetAggregate
//
// -----------------------------------------------------------------------------
//
// Client/user-controlled values:
//
//     type
//     category
//     visibility
//
// Technical/application values are supplied by the application workflow:
//
//     ownerIdentityPublicId
//     storageProvider
//     bucket
//     objectKey
//     originalFilename
//     mimeType
//     sizeBytes
//     correlationId
//     causationId
//
// Domain-managed values are NOT supplied:
//
//     publicId
//     status
//     uploadedAt
//     archivedAt
//     deletedAt
//     createdAt
//     updatedAt
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - ownerIdentityPublicId;
// - storageProvider;
// - bucket;
// - objectKey;
// - originalFilename;
// - mimeType;
// - sizeBytes;
// - publicId;
// - status;
// - uploadedAt;
// - archivedAt;
// - deletedAt;
// - createdAt;
// - updatedAt;
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Physical file metadata:
//
// MIME type, size, and original filename are derived from the actual uploaded
// file by the UploadAssetHandler / presentation boundary.
//
// They are not accepted as authoritative values from this DTO.
//
// -----------------------------------------------------------------------------
//
// Storage:
//
// This DTO has no knowledge of:
//
// - Local filesystem;
// - Bunny Storage;
// - AWS S3;
// - Google Cloud Storage;
// - Azure Blob Storage;
// - Cloudinary;
// - storage buckets;
// - storage object keys.
//
// Those concerns remain outside the DTO and behind AssetStoragePort.
//
// -----------------------------------------------------------------------------
//
// Domain:
//
// AssetAggregate / AssetEntity own:
//
// - Asset identity;
// - initial lifecycle state;
// - lifecycle rules;
// - domain invariants;
// - domain events.
//
// Application:
//
// CreateAssetCommand / CreateAssetHandler own:
//
// - Asset aggregate creation;
// - uniqueness coordination;
// - repository interaction.
//
// UploadAssetHandler remains the higher-level orchestrator for the user-facing
// Upload Asset operation.
//
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// Validation Constants
// =============================================================================

const MIN_ASSET_TYPE_LENGTH = 1;
const MAX_ASSET_TYPE_LENGTH = 32;

const MIN_ASSET_CATEGORY_LENGTH = 1;
const MAX_ASSET_CATEGORY_LENGTH = 64;

const MIN_ASSET_VISIBILITY_LENGTH = 1;
const MAX_ASSET_VISIBILITY_LENGTH = 16;

// =============================================================================
// Frozen Asset Values
// =============================================================================

const ASSET_TYPES = ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER'] as const;

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

const ASSET_VISIBILITIES = ['PUBLIC', 'PRIVATE'] as const;

// =============================================================================
// Transformation
// =============================================================================

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// =============================================================================
// DTO
// =============================================================================

/**
 * Request DTO for Asset aggregate creation.
 *
 * This DTO contains only Asset classification and visibility decisions.
 *
 * Physical file content belongs to UploadAssetRequestDto.
 *
 * Technical metadata and domain-managed lifecycle state are supplied or
 * established by the appropriate application/domain layer.
 */
export class CreateAssetRequestDto {
  // ===========================================================================
  // Classification
  // ===========================================================================

  /**
   * Type of Asset being created.
   */
  @ApiProperty({
    enum: ASSET_TYPES,
    example: 'IMAGE',
    description: 'Type of Asset being created.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_ASSET_TYPE_LENGTH)
  @MaxLength(MAX_ASSET_TYPE_LENGTH)
  @IsIn(ASSET_TYPES)
  type!: string;

  /**
   * Business category of the Asset.
   */
  @ApiProperty({
    enum: ASSET_CATEGORIES,
    example: 'PROFILE_PHOTO',
    description: 'Business category of the Asset.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_ASSET_CATEGORY_LENGTH)
  @MaxLength(MAX_ASSET_CATEGORY_LENGTH)
  @IsIn(ASSET_CATEGORIES)
  category!: string;

  // ===========================================================================
  // Visibility
  // ===========================================================================

  /**
   * Requested visibility of the Asset.
   *
   * When omitted, the application/domain workflow uses the Asset default:
   *
   *     PRIVATE
   */
  @ApiPropertyOptional({
    enum: ASSET_VISIBILITIES,
    example: 'PRIVATE',
    default: 'PRIVATE',
    description: 'Visibility requested for the Asset.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(MIN_ASSET_VISIBILITY_LENGTH)
  @MaxLength(MAX_ASSET_VISIBILITY_LENGTH)
  @IsIn(ASSET_VISIBILITIES)
  visibility?: string;
}

// =============================================================================
// Exports
// =============================================================================

export { ASSET_TYPES, ASSET_CATEGORIES, ASSET_VISIBILITIES };

export default CreateAssetRequestDto;
