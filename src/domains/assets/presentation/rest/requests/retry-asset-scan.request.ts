// src/domains/asset/presentation/rest/requests/retry-asset-scan.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsObject, IsOptional, IsString, Matches } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RetryAssetScanRequest {
  @ApiProperty({
    example: 'ASC-8XQ72ZK',
    description: 'Public identifier of the asset scan to retry.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^ASC-[A-Z0-9]+$/, {
    message: 'assetScanPublicId must be a valid asset scan public identifier.',
  })
  assetScanPublicId!: string;

  @ApiPropertyOptional({
    example: {
      requestedBy: 'system',
      reason: 'Engine recovered after temporary outage',
      retryAttempt: 2,
      worker: 'scan-worker-02',
    },
    description: 'Optional metadata describing the retry request.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
