import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResponse } from './base.response';

import {
  AssetVariantStatus,
  AssetVariantType,
  StorageProvider,
} from '../../../domain/value-objects';

export class AssetVariantResponse extends BaseResponse {
  @ApiProperty({
    enum: AssetVariantType,
    example: AssetVariantType.THUMBNAIL,
  })
  variant!: AssetVariantType;

  @ApiProperty({
    enum: AssetVariantStatus,
    example: AssetVariantStatus.READY,
  })
  status!: AssetVariantStatus;

  @ApiProperty({
    example: true,
  })
  isGenerated!: boolean;

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
    example: 'profiles/2026/avatar-thumbnail.webp',
  })
  objectKey!: string;

  @ApiProperty({
    example: 'image/webp',
  })
  mimeType!: string;

  @ApiPropertyOptional({
    example: 'webp',
  })
  extension?: string | null;

  @ApiProperty({
    example: '24576',
    description: 'Variant size in bytes.',
  })
  sizeBytes!: string;

  @ApiPropertyOptional({
    example: 256,
  })
  width?: number | null;

  @ApiPropertyOptional({
    example: 256,
  })
  height?: number | null;

  @ApiPropertyOptional({
    example: 12.5,
  })
  durationSeconds?: number | null;
}
