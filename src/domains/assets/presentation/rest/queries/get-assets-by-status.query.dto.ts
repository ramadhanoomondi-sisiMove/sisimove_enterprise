// -----------------------------------------------------------------------------
// Asset — Get Assets By Status Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { AssetStatus } from '../../../domain/value-objects';

import type { AssetStatusValue } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const ASSET_STATUS_VALUES: readonly AssetStatusValue[] = [
  AssetStatus.UPLOADING,
  AssetStatus.UPLOADED,
  AssetStatus.READY,
  AssetStatus.ARCHIVED,
  AssetStatus.DELETED,
];

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class GetAssetsByStatusQueryDto {
  @ApiProperty({
    type: 'string',
    enum: ASSET_STATUS_VALUES,
    example: AssetStatus.READY,
    description: 'Asset lifecycle status used to filter the results.',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ASSET_STATUS_VALUES)
  status!: AssetStatusValue;
}
