// src/domains/asset/presentation/rest/requests/complete-asset-scan.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CompleteAssetScanRequest {
  @ApiProperty({
    example: 'ASC-8XQ72ZK',
    description: 'Public identifier of the asset scan.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^ASC-[A-Z0-9]+$/, {
    message: 'assetScanPublicId must be a valid asset scan public identifier.',
  })
  assetScanPublicId!: string;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description:
      'Threat or malware name detected during scanning. Leave empty for clean scans.',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  threatName?: string;

  @ApiPropertyOptional({
    example: {
      engineVersion: '1.2.0',
      signatureVersion: '2026.08.03',
      scanDurationMs: 1432,
      scannedBytes: 2456789,
      result: 'CLEAN',
    },
    description: 'Additional scan result metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
