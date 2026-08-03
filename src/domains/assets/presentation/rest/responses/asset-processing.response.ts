import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResponse } from './base.response';

import {
  AssetProcessingOperation,
  AssetProcessingStatus,
  AssetProcessor,
} from '../../../domain/value-objects';

export class AssetProcessingResponse extends BaseResponse {
  @ApiProperty({
    enum: AssetProcessingOperation,
    example: AssetProcessingOperation.THUMBNAIL,
  })
  operation!: AssetProcessingOperation;

  @ApiProperty({
    enum: AssetProcessingStatus,
    example: AssetProcessingStatus.COMPLETED,
  })
  status!: AssetProcessingStatus;

  @ApiPropertyOptional({
    enum: AssetProcessor,
    example: AssetProcessor.LIBVIPS,
  })
  processor?: AssetProcessor | null;

  @ApiPropertyOptional({
    example: '2026-08-03T10:15:00.000Z',
  })
  startedAt?: Date | null;

  @ApiPropertyOptional({
    example: '2026-08-03T10:15:03.000Z',
  })
  completedAt?: Date | null;

  @ApiPropertyOptional({
    example: '2026-08-03T10:15:01.000Z',
  })
  failedAt?: Date | null;

  @ApiPropertyOptional({
    example: 'Image exceeds maximum dimensions.',
  })
  failureReason?: string | null;

  @ApiPropertyOptional({
    type: Object,
    additionalProperties: true,
    example: {
      width: 512,
      height: 512,
      quality: 85,
    },
  })
  metadata?: Record<string, unknown> | null;
}
