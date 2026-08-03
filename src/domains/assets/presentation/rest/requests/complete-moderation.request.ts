// src/domains/asset/presentation/rest/requests/complete-moderation.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CompleteModerationRequest {
  @ApiProperty({
    example: 'AMD-X8P7Q9L',
    description: 'Public identifier of the asset moderation.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AMD-[A-Z0-9]+$/, {
    message:
      'assetModerationPublicId must be a valid asset moderation public identifier.',
  })
  assetModerationPublicId!: string;

  @ApiPropertyOptional({
    example: 'IDT-WQC6Y7G',
    description: 'Identity that completed the moderation.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message:
      'moderatorIdentityPublicId must be a valid public identity identifier.',
  })
  moderatorIdentityPublicId?: string;

  @ApiPropertyOptional({
    example: 97.35,
    description: 'Confidence score assigned by the moderator.',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  confidence?: number;

  @ApiPropertyOptional({
    example: {
      completedBy: 'AI',
      model: 'openai-moderation-v3',
      processingTimeMs: 142,
      policyVersion: '2026.1',
      reviewNotes: 'Moderation completed successfully.',
    },
    description: 'Additional moderation completion metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: 'Moderation completed successfully.',
    description: 'Optional completion notes.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
