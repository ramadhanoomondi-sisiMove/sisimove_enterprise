// src/domains/asset/presentation/rest/requests/archive-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class ArchiveAssetRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the asset to archive.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiPropertyOptional({
    example: 'Asset is no longer required and has been archived.',
    description: 'Optional reason for archiving the asset.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
