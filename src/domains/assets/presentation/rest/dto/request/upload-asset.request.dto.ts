// -----------------------------------------------------------------------------
// Asset — Upload Asset Request DTO
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  AssetCategory,
  AssetType,
  AssetVisibility,
} from '../../../../domain/value-objects';

import type {
  AssetCategoryValue,
  AssetTypeValue,
  AssetVisibilityValue,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Runtime Validation Values
// -----------------------------------------------------------------------------

const ASSET_TYPE_VALUES = {
  IMAGE: AssetType.IMAGE,
  VIDEO: AssetType.VIDEO,
  AUDIO: AssetType.AUDIO,
  DOCUMENT: AssetType.DOCUMENT,
  OTHER: AssetType.OTHER,
} as const;

const ASSET_CATEGORY_VALUES = {
  PROFILE_PHOTO: AssetCategory.PROFILE_PHOTO,
  COVER_PHOTO: AssetCategory.COVER_PHOTO,
  AVATAR: AssetCategory.AVATAR,
  GOVERNMENT_ID: AssetCategory.GOVERNMENT_ID,
  DRIVER_LICENSE: AssetCategory.DRIVER_LICENSE,
  PASSPORT: AssetCategory.PASSPORT,
  SELFIE: AssetCategory.SELFIE,
  VEHICLE_PHOTO: AssetCategory.VEHICLE_PHOTO,
  CHAT_ATTACHMENT: AssetCategory.CHAT_ATTACHMENT,
  OTHER: AssetCategory.OTHER,
} as const;

const ASSET_VISIBILITY_VALUES = {
  PUBLIC: AssetVisibility.PUBLIC,
  PRIVATE: AssetVisibility.PRIVATE,
} as const;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UploadAssetRequestDto {
  @ApiProperty({
    type: 'string',
    enum: Object.values(ASSET_TYPE_VALUES),
    example: AssetType.IMAGE,
    description: 'Primary media or content type of the Asset.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @IsEnum(ASSET_TYPE_VALUES)
  type!: AssetTypeValue;

  @ApiProperty({
    type: 'string',
    enum: Object.values(ASSET_CATEGORY_VALUES),
    example: AssetCategory.PROFILE_PHOTO,
    description: 'Functional category of the Asset.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsEnum(ASSET_CATEGORY_VALUES)
  category!: AssetCategoryValue;

  @ApiPropertyOptional({
    type: 'string',
    enum: Object.values(ASSET_VISIBILITY_VALUES),
    example: AssetVisibility.PRIVATE,
    default: AssetVisibility.PRIVATE,
    description: 'Visibility of the Asset. Defaults to PRIVATE.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ASSET_VISIBILITY_VALUES)
  visibility?: AssetVisibilityValue;
}
