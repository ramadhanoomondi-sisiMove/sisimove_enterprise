// src/domains/asset/presentation/rest/requests/retry-asset-processing.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RetryAssetProcessingRequest {
  @ApiProperty({
    example: 'APR-8KQ72XZ',
    description: 'Public identifier of the asset processing job.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^APR-[A-Z0-9]+$/, {
    message:
      'assetProcessingPublicId must be a valid asset processing public identifier.',
  })
  assetProcessingPublicId!: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Force a retry even if the processing job is not currently in a failed state.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Reset the current processing state before retrying.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  resetState?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Execute the retry asynchronously using the processing queue.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  asynchronous?: boolean;

  @ApiPropertyOptional({
    example: 30,
    description: 'Delay before retry execution in seconds.',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  retryDelaySeconds?: number;

  @ApiPropertyOptional({
    example: 300,
    description: 'Processing timeout in seconds.',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  timeoutSeconds?: number;

  @ApiPropertyOptional({
    example: 'Retry after temporary storage outage.',
    description: 'Reason for retrying the processing job.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    example: {
      initiatedBy: 'IDT-WQC6Y7G',
      retryAttempt: 2,
      workerPool: 'high-priority',
    },
    description: 'Additional retry metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
