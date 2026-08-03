// src/domains/asset/presentation/rest/requests/fail-asset-scan.request.ts

import { ApiProperty } from '@nestjs/swagger';
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

export class FailAssetScanRequest {
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

  @ApiProperty({
    example: 'Unable to contact the antivirus engine after multiple retries.',
    description: 'Reason why the asset scan failed.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(500)
  failureReason!: string;

  @ApiProperty({
    example: {
      engine: 'CLAMAV',
      engineVersion: '1.4.2',
      exitCode: 1,
      worker: 'scan-worker-03',
      node: 'node-east-01',
      elapsedMilliseconds: 1245,
      retryable: true,
      errorCode: 'ENGINE_UNAVAILABLE',
    },
    description: 'Additional diagnostic information about the scan failure.',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
