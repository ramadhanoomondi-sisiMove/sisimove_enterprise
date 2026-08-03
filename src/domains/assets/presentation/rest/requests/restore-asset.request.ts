// src/domains/asset/presentation/rest/requests/restore-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RestoreAssetRequest {
  @ApiProperty({
    example: 'AST-K8P4X2M',
    description: 'Public identifier of the archived asset to restore.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiPropertyOptional({
    example: 'Asset restored after accidental archival.',
    description: 'Optional reason for restoring the asset.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
