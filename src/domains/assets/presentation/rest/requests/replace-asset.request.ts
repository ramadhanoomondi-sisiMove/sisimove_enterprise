// src/domains/asset/presentation/rest/requests/replace-asset.request.ts

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
  AssetType,
  AssetVisibility,
} from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class ReplaceAssetRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the asset to replace.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    example: 'new-profile-photo.png',
    description: 'Original filename of the replacement file.',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(255)
  originalFilename!: string;

  @ApiProperty({
    example: 'image/png',
    description: 'MIME type of the replacement file.',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(255)
  mimeType!: string;

  @ApiPropertyOptional({
    example: 'png',
    description: 'File extension.',
    maxLength: 32,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(32)
  extension?: string;

  @ApiPropertyOptional({
    enum: AssetType,
    example: AssetType.IMAGE,
    description:
      'Override the asset type. Defaults to the existing asset type.',
  })
  @IsOptional()
  @IsEnum(AssetType)
  type?: AssetType;

  @ApiPropertyOptional({
    enum: AssetCategory,
    example: AssetCategory.PROFILE_PHOTO,
    description:
      'Override the asset category. Defaults to the existing category.',
  })
  @IsOptional()
  @IsEnum(AssetCategory)
  category?: AssetCategory;

  @ApiPropertyOptional({
    enum: AssetVisibility,
    example: AssetVisibility.PRIVATE,
    description:
      'Override the asset visibility. Defaults to the existing visibility.',
  })
  @IsOptional()
  @IsEnum(AssetVisibility)
  visibility?: AssetVisibility;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description:
      'Replace all generated variants after the new upload completes.',
  })
  @IsOptional()
  @IsBoolean()
  regenerateVariants?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Run antivirus scanning on the replacement asset.',
  })
  @IsOptional()
  @IsBoolean()
  runScan?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Run moderation on the replacement asset.',
  })
  @IsOptional()
  @IsBoolean()
  runModeration?: boolean;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Keep the previous asset version for audit/history purposes.',
  })
  @IsOptional()
  @IsBoolean()
  preservePreviousVersion?: boolean;

  @ApiPropertyOptional({
    example: 'Replacing outdated profile picture.',
    description: 'Reason for replacing the asset.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
