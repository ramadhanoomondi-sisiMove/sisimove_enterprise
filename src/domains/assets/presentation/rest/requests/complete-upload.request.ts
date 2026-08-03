// src/domains/asset/presentation/rest/requests/complete-upload.request.ts

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
} from 'class-validator';

import { ChecksumAlgorithm } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CompleteUploadRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the uploaded asset.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    example: 245876,
    description: 'Final file size in bytes.',
  })
  @IsInt()
  @IsPositive()
  sizeBytes!: number;

  @ApiPropertyOptional({
    enum: ChecksumAlgorithm,
    example: ChecksumAlgorithm.SHA256,
    description: 'Checksum algorithm used to calculate the checksum.',
  })
  @IsOptional()
  @IsEnum(ChecksumAlgorithm)
  checksumAlgorithm?: ChecksumAlgorithm;

  @ApiPropertyOptional({
    example: '8d969eef6ecad3c29a3a629280e686cff8fabd6db1d7e8d1a6e9d5f4b7c0c123',
    description: 'Computed checksum of the uploaded file.',
    maxLength: 512,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(512)
  checksum?: string;

  @ApiPropertyOptional({
    example: 1920,
    description: 'Image width in pixels.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  width?: number;

  @ApiPropertyOptional({
    example: 1080,
    description: 'Image height in pixels.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  height?: number;

  @ApiPropertyOptional({
    example: 24,
    description: 'Image color depth.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(128)
  colorDepth?: number;

  @ApiPropertyOptional({
    example: 180,
    description: 'Media duration in seconds.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @ApiPropertyOptional({
    example: 320000,
    description: 'Media bitrate.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bitrate?: number;

  @ApiPropertyOptional({
    example: 29.97,
    description: 'Video frame rate.',
  })
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 3,
  })
  @Min(0)
  frameRate?: number;

  @ApiPropertyOptional({
    example: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    description: 'Generated BlurHash.',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  blurHash?: string;

  @ApiPropertyOptional({
    example: {
      camera: 'Sony A7 IV',
      orientation: 'landscape',
      gps: false,
    },
    description: 'Extracted metadata.',
  })
  @IsOptional()
  @IsJSON()
  metadata?: Record<string, unknown>;
}
