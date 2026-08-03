// src/domains/asset/presentation/rest/requests/rename-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RenameAssetRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the asset to rename.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    example: 'profile-photo-2026.png',
    description: 'New original filename.',
    minLength: 1,
    maxLength: 255,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  originalFilename!: string;

  @ApiPropertyOptional({
    example: 'Renamed to match the new profile image convention.',
    description: 'Optional reason for renaming the asset.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}