// src/domains/asset/presentation/rest/requests/mark-asset-infected.request.ts

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

export class MarkAssetInfectedRequest {
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
    example: 'Win.Trojan.Emotet',
    description: 'Detected malware or threat name.',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(255)
  threatName!: string;

  @ApiPropertyOptional({
    example: {
      engine: 'CLAMAV',
      engineVersion: '1.4.2',
      signatureVersion: '2026.08.03',
      severity: 'HIGH',
      category: 'Trojan',
      infectedFile: '/uploads/avatar.png',
      quarantineRecommended: true,
    },
    description: 'Additional malware detection details.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
