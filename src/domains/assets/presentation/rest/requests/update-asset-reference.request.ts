// src/domains/asset/presentation/rest/requests/update-asset-reference.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

import {
  AssetReferenceField,
  AssetResourceType,
} from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateAssetReferenceRequest {
  @ApiProperty({
    example: 'ARF-X9K72QP',
    description: 'Public identifier of the asset reference.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^ARF-[A-Z0-9]+$/, {
    message:
      'assetReferencePublicId must be a valid asset reference public identifier.',
  })
  assetReferencePublicId!: string;

  @ApiPropertyOptional({
    enum: AssetResourceType,
    example: AssetResourceType.IDENTITY,
    description: 'New resource type.',
  })
  @IsOptional()
  @IsEnum(AssetResourceType)
  resourceType?: AssetResourceType;

  @ApiPropertyOptional({
    example: 'IDT-WQC6Y7G',
    description: 'New referenced resource public identifier.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}-[A-Z0-9]+$/, {
    message: 'resourcePublicId must be a valid public identifier.',
  })
  resourcePublicId?: string;

  @ApiPropertyOptional({
    enum: AssetReferenceField,
    example: AssetReferenceField.AVATAR,
    description: 'New reference field.',
  })
  @IsOptional()
  @IsEnum(AssetReferenceField)
  referenceField?: AssetReferenceField;
}
