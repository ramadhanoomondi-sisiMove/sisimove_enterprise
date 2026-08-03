// src/domains/asset/presentation/rest/dto/complete-asset-processing.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { AssetProcessingStatus } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CompleteAssetProcessingRequest {
  @ApiProperty({
    example: 'APR-8XQ72ZK9',
    description: 'Public identifier of the asset processing job.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^APR-[A-Z0-9]+$/, {
    message:
      'assetProcessingPublicId must be a valid asset processing public identifier.',
  })
  assetProcessingPublicId!: string;

  @ApiProperty({
    enum: [AssetProcessingStatus.COMPLETED],
    example: AssetProcessingStatus.COMPLETED,
    description: 'Final status of the processing job.',
  })
  @IsEnum(AssetProcessingStatus)
  status!: AssetProcessingStatus;

  @ApiPropertyOptional({
    example: {
      generatedVariants: ['ASTV-9KD82LQ', 'ASTV-1PP28XM'],
      processingTimeMs: 1842,
      width: 1920,
      height: 1080,
    },
    description: 'Processor output metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: 'Thumbnail generation completed successfully.',
    description: 'Optional completion message.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
