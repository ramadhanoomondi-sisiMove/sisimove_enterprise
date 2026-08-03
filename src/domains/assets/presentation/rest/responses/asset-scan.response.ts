import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResponse } from './base.response';

import {
  AssetScanEngine,
  AssetScanStatus,
} from '../../../domain/value-objects';

export class AssetScanResponse extends BaseResponse {
  @ApiProperty({
    enum: AssetScanEngine,
    example: AssetScanEngine.CLAMAV,
  })
  engine!: AssetScanEngine;

  @ApiProperty({
    enum: AssetScanStatus,
    example: AssetScanStatus.CLEAN,
  })
  status!: AssetScanStatus;

  @ApiPropertyOptional({
    example: '2026-08-03T10:20:00.000Z',
  })
  scannedAt?: Date | null;

  @ApiPropertyOptional({
    example: 'Eicar-Test-File',
  })
  threatName?: string | null;

  @ApiPropertyOptional({
    type: Object,
    additionalProperties: true,
    example: {
      engineVersion: '1.4.2',
      scanDurationMs: 186,
      signatureVersion: '20260803',
    },
  })
  metadata?: Record<string, unknown> | null;
}
