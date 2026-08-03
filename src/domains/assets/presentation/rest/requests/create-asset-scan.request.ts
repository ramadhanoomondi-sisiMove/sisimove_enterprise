// src/domains/asset/presentation/rest/requests/create-asset-scan.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { AssetScanEngine } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAssetScanRequest {
  @ApiProperty({
    example: 'AST-8XQ72ZK',
    description: 'Public identifier of the asset to scan.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid asset public identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    enum: AssetScanEngine,
    example: AssetScanEngine.CLAMAV,
    description: 'Scanning engine to use.',
  })
  @IsEnum(AssetScanEngine)
  engine!: AssetScanEngine;

  @ApiPropertyOptional({
    example: true,
    description: 'Execute the scan asynchronously.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  asynchronous?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Force a new scan even if one already exists.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Replace an existing scan result.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  overwriteExisting?: boolean;

  @ApiPropertyOptional({
    example: 'Routine malware verification before publishing.',
    description: 'Reason for initiating the scan.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    example: {
      priority: 'HIGH',
      requestedBy: 'IDT-WQC6Y7G',
      source: 'UPLOAD_PIPELINE',
    },
    description: 'Additional scan configuration.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
