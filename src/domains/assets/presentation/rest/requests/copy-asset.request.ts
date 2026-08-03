// src/domains/asset/presentation/rest/requests/copy-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import {
  AssetCategory,
  AssetVisibility,
  StorageProvider,
} from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CopyAssetRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the source asset.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiPropertyOptional({
    example: 'IDT-WQC6Y7G',
    description: 'New owner of the copied asset.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message:
      'ownerIdentityPublicId must be a valid public identity identifier.',
  })
  ownerIdentityPublicId?: string;

  @ApiPropertyOptional({
    enum: AssetCategory,
    example: AssetCategory.POST_MEDIA,
    description: 'Category for the copied asset.',
  })
  @IsOptional()
  @IsEnum(AssetCategory)
  category?: AssetCategory;

  @ApiPropertyOptional({
    enum: AssetVisibility,
    example: AssetVisibility.PRIVATE,
    description: 'Visibility of the copied asset.',
  })
  @IsOptional()
  @IsEnum(AssetVisibility)
  visibility?: AssetVisibility;

  @ApiPropertyOptional({
    enum: StorageProvider,
    example: StorageProvider.AWS_S3,
    description: 'Destination storage provider.',
  })
  @IsOptional()
  @IsEnum(StorageProvider)
  storageProvider?: StorageProvider;

  @ApiPropertyOptional({
    example: 'production-assets',
    description: 'Destination bucket.',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bucket?: string;

  @ApiPropertyOptional({
    example: 'copies/2026/profile/avatar-copy.png',
    description: 'Destination object key.',
    maxLength: 1024,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  objectKey?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Copy all generated variants.',
  })
  @IsOptional()
  @IsBoolean()
  copyVariants?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Copy asset metadata.',
  })
  @IsOptional()
  @IsBoolean()
  copyMetadata?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Copy asset references.',
  })
  @IsOptional()
  @IsBoolean()
  copyReferences?: boolean;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Copy moderation history.',
  })
  @IsOptional()
  @IsBoolean()
  copyModerations?: boolean;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Copy processing history.',
  })
  @IsOptional()
  @IsBoolean()
  copyProcessings?: boolean;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Copy scan history.',
  })
  @IsOptional()
  @IsBoolean()
  copyScans?: boolean;

  @ApiPropertyOptional({
    example: 'Creating a reusable duplicate for another organization.',
    description: 'Optional reason for copying the asset.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
