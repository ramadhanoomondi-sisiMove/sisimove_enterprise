// src/domains/asset/presentation/rest/requests/create-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsJSON,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import {
  AssetCategory,
  AssetType,
  AssetVisibility,
  ChecksumAlgorithm,
  StorageProvider,
} from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAssetRequest {
  @ApiPropertyOptional({
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the asset owner.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message:
      'ownerIdentityPublicId must be a valid public identity identifier.',
  })
  ownerIdentityPublicId?: string;

  @ApiProperty({
    enum: AssetType,
    example: AssetType.IMAGE,
  })
  @IsEnum(AssetType)
  type!: AssetType;

  @ApiProperty({
    enum: AssetCategory,
    example: AssetCategory.PROFILE_PHOTO,
  })
  @IsEnum(AssetCategory)
  category!: AssetCategory;

  @ApiPropertyOptional({
    enum: AssetVisibility,
    example: AssetVisibility.PRIVATE,
    default: AssetVisibility.PRIVATE,
  })
  @IsOptional()
  @IsEnum(AssetVisibility)
  visibility?: AssetVisibility;

  @ApiProperty({
    enum: StorageProvider,
    example: StorageProvider.AWS_S3,
  })
  @IsEnum(StorageProvider)
  storageProvider!: StorageProvider;

  @ApiProperty({
    example: 'identity-assets',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  bucket!: string;

  @ApiProperty({
    example: 'profiles/2026/08/avatar.png',
    maxLength: 1024,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  objectKey!: string;

  @ApiPropertyOptional({
    example: 'avatar.png',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  originalFilename?: string;

  @ApiPropertyOptional({
    example: 'a18c9d92-avatar.png',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  storedFilename?: string;

  @ApiProperty({
    example: 'image/png',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(255)
  mimeType!: string;

  @ApiPropertyOptional({
    example: 'png',
    maxLength: 32,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(32)
  extension?: string;

  @ApiProperty({
    example: 245876,
    description: 'File size in bytes.',
  })
  @IsInt()
  @IsPositive()
  sizeBytes!: number;

  @ApiPropertyOptional({
    enum: ChecksumAlgorithm,
    example: ChecksumAlgorithm.SHA256,
  })
  @IsOptional()
  @IsEnum(ChecksumAlgorithm)
  checksumAlgorithm?: ChecksumAlgorithm;

  @ApiPropertyOptional({
    example: '8d969eef6ecad3c29a3a629280e686cff8fabd6db1d7e8d1a6e9d5f4b7c0c123',
    maxLength: 512,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(512)
  checksum?: string;

  @ApiPropertyOptional({
    example: 1920,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  width?: number;

  @ApiPropertyOptional({
    example: 1080,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  height?: number;

  @ApiPropertyOptional({
    example: 24,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(128)
  colorDepth?: number;

  @ApiPropertyOptional({
    example: 180,
    description: 'Duration in seconds.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @ApiPropertyOptional({
    example: 320000,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bitrate?: number;

  @ApiPropertyOptional({
    example: 29.97,
  })
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 3,
  })
  @Min(0)
  frameRate?: number;

  @ApiPropertyOptional({
    example: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  blurHash?: string;

  @ApiPropertyOptional({
    example: {
      source: 'mobile-app',
      camera: 'iPhone 15 Pro',
    },
    description: 'Additional asset metadata.',
  })
  @IsOptional()
  @IsJSON()
  metadata?: Record<string, unknown>;
}
