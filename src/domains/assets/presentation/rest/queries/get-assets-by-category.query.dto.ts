// -----------------------------------------------------------------------------
// Asset — Get Assets By Category Query DTO
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { AssetCategory } from '../../../domain/value-objects';

import type { AssetCategoryValue } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

const ASSET_CATEGORY_VALUES: readonly AssetCategoryValue[] = [
  AssetCategory.PROFILE_PHOTO,
  AssetCategory.COVER_PHOTO,
  AssetCategory.AVATAR,
  AssetCategory.GOVERNMENT_ID,
  AssetCategory.DRIVER_LICENSE,
  AssetCategory.PASSPORT,
  AssetCategory.SELFIE,
  AssetCategory.VEHICLE_PHOTO,
  AssetCategory.CHAT_ATTACHMENT,
  AssetCategory.OTHER,
];

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class GetAssetsByCategoryQueryDto {
  @ApiProperty({
    type: 'string',
    enum: ASSET_CATEGORY_VALUES,
    example: AssetCategory.PROFILE_PHOTO,
    description: 'Asset category used to filter the results.',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ASSET_CATEGORY_VALUES)
  category!: AssetCategoryValue;
}
