// -----------------------------------------------------------------------------
// Asset — Change Visibility Request DTO
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { AssetVisibility } from '../../../../domain/value-objects';

import type { AssetVisibilityValue } from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

const ASSET_VISIBILITY_VALUES: readonly AssetVisibilityValue[] = [
  AssetVisibility.PUBLIC,
  AssetVisibility.PRIVATE,
];

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ChangeAssetVisibilityRequestDto {
  @ApiProperty({
    type: 'string',
    enum: ASSET_VISIBILITY_VALUES,
    example: AssetVisibility.PUBLIC,
    description: 'New visibility of the Asset.',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ASSET_VISIBILITY_VALUES)
  visibility!: AssetVisibilityValue;
}
