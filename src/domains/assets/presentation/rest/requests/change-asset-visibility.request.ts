// src/domains/asset/presentation/rest/requests/change-asset-visibility.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsEnum, IsString, Matches } from 'class-validator';

import { AssetVisibility } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class ChangeAssetVisibilityRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the asset.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    enum: AssetVisibility,
    example: AssetVisibility.PUBLIC,
    description: 'New visibility level for the asset.',
  })
  @IsEnum(AssetVisibility)
  visibility!: AssetVisibility;
}
