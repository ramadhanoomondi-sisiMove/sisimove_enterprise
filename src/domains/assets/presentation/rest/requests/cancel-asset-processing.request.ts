// src/domains/asset/presentation/rest/requests/cancel-asset-processing.request.ts

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

export class CancelAssetProcessingRequest {
  @ApiProperty({
    example: 'APR-8KQ72XZ',
    description: 'Public identifier of the asset processing job.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^APR-[A-Z0-9]+$/, {
    message:
      'assetProcessingPublicId must be a valid asset processing identifier.',
  })
  assetProcessingPublicId!: string;

  @ApiProperty({
    example: 'Processing cancelled by administrator.',
    description: 'Reason for cancelling the processing job.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(500)
  reason!: string;

  @ApiPropertyOptional({
    example: {
      cancelledBy: 'IDT-WQC6Y7G',
      source: 'ADMIN_PORTAL',
      notifyClient: true,
    },
    description: 'Additional cancellation metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
