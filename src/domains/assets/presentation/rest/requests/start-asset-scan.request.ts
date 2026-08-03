// src/domains/asset/presentation/rest/requests/start-asset-scan.request.ts

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

export class StartAssetScanRequest {
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
    example: 'clamav-worker-01',
    description: 'Worker or service executing the scan.',
    maxLength: 100,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  worker?: string;

  @ApiPropertyOptional({
    example: 'scan-job-01HXB7A8Y4QJ5N8K3',
    description: 'Queue or scheduler job identifier.',
    maxLength: 100,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  jobId?: string;

  @ApiPropertyOptional({
    example: 'node-east-01',
    description: 'Processing node or host name.',
    maxLength: 100,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  node?: string;

  @ApiPropertyOptional({
    example: '8eafef0e-c9e4-4db7-aef6-bf8b44bb4d56',
    description: 'Correlation identifier used for distributed tracing.',
    maxLength: 100,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  correlationId?: string;

  @ApiPropertyOptional({
    example: {
      queue: 'asset-scan',
      priority: 'HIGH',
      initiatedBy: 'UPLOAD_PIPELINE',
    },
    description: 'Additional execution metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
