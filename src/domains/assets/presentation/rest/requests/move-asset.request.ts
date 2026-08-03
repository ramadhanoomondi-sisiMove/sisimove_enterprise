// src/domains/asset/presentation/rest/requests/move-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { StorageProvider } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class MoveAssetRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the asset to move.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    enum: StorageProvider,
    example: StorageProvider.AWS_S3,
    description: 'Destination storage provider.',
  })
  @IsEnum(StorageProvider)
  storageProvider!: StorageProvider;

  @ApiProperty({
    example: 'production-assets',
    description: 'Destination storage bucket.',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(255)
  bucket!: string;

  @ApiProperty({
    example: 'images/profiles/2026/avatar.png',
    description: 'Destination object key.',
    maxLength: 1024,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(1024)
  objectKey!: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Delete the original object after a successful move. If false, the operation behaves like a copy.',
    default: true,
  })
  @IsOptional()
  deleteSource?: boolean;

  @ApiPropertyOptional({
    example: 'Migrating assets to a new storage provider.',
    description: 'Optional reason for the move operation.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
