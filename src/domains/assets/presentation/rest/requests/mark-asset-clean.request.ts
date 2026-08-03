// src/domains/asset/presentation/rest/requests/mark-asset-clean.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsObject, IsOptional, IsString, Matches } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class MarkAssetCleanRequest {
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
    example: {
      engine: 'CLAMAV',
      engineVersion: '1.4.2',
      signatureVersion: '2026.08.03',
      scanDurationMs: 1378,
      scannedBytes: 2847621,
      result: 'CLEAN',
    },
    description: 'Additional scan result metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
