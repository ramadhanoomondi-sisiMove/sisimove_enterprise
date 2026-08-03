// src/domains/asset/presentation/rest/responses/asset.response.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResponse } from './base.response';

import {
  AssetCategory,
  AssetStatus,
  AssetType,
  AssetVisibility,
  ChecksumAlgorithm,
  StorageProvider,
} from '../../../domain/value-objects';

export class AssetResponse extends BaseResponse {
  @ApiProperty({
    example: 'IDT-WQC6Y7G',
  })
  ownerIdentityPublicId!: string | null;

  @ApiProperty({
    enum: AssetType,
    example: AssetType.IMAGE,
  })
  type!: AssetType;

  @ApiProperty({
    enum: AssetCategory,
    example: AssetCategory.PROFILE_PHOTO,
  })
  category!: AssetCategory;

  @ApiProperty({
    enum: AssetStatus,
    example: AssetStatus.READY,
  })
  status!: AssetStatus;

  @ApiProperty({
    enum: AssetVisibility,
    example: AssetVisibility.PRIVATE,
  })
  visibility!: AssetVisibility;

  @ApiProperty({
    enum: StorageProvider,
    example: StorageProvider.AWS_S3,
  })
  storageProvider!: StorageProvider;

  @ApiProperty({
    example: 'user-assets',
  })
  bucket!: string;

  @ApiProperty({
    example: 'profiles/2026/avatar.webp',
  })
  objectKey!: string;

  @ApiPropertyOptional({
    example: 'avatar.jpg',
  })
  originalFilename?: string | null;

  @ApiPropertyOptional({
    example: '8f4e8d6b.webp',
  })
  storedFilename?: string | null;

  @ApiProperty({
    example: 'image/webp',
  })
  mimeType!: string;

  @ApiPropertyOptional({
    example: 'webp',
  })
  extension?: string | null;

  @ApiProperty({
    example: '245760',
    description: 'Asset size in bytes.',
  })
  sizeBytes!: string;

  @ApiPropertyOptional({
    enum: ChecksumAlgorithm,
    example: ChecksumAlgorithm.SHA256,
  })
  checksumAlgorithm?: ChecksumAlgorithm | null;

  @ApiPropertyOptional({
    example: '8d969eef6ecad3c29a3a629280e686cff8fabd7d6b8a1e9d4cb0c8b8d3d4e5f1',
  })
  checksum?: string | null;

  @ApiPropertyOptional({
    example: 1024,
  })
  width?: number | null;

  @ApiPropertyOptional({
    example: 768,
  })
  height?: number | null;

  @ApiPropertyOptional({
    example: 24,
  })
  colorDepth?: number | null;

  @ApiPropertyOptional({
    example: 180,
  })
  durationSeconds?: number | null;

  @ApiPropertyOptional({
    example: 320000,
  })
  bitrate?: number | null;

  @ApiPropertyOptional({
    example: 29.97,
  })
  frameRate?: number | null;

  @ApiPropertyOptional({
    example: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
  })
  blurHash?: string | null;

  @ApiPropertyOptional({
    type: Object,
    additionalProperties: true,
  })
  metadata?: Record<string, unknown> | null;

  @ApiPropertyOptional()
  uploadedAt?: Date | null;

  @ApiPropertyOptional()
  archivedAt?: Date | null;

  @ApiPropertyOptional()
  deletedAt?: Date | null;
}
