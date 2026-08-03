// src/domains/asset/presentation/rest/requests/request-manual-moderation.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RequestManualModerationRequest {
  @ApiProperty({
    example: 'AST-X7Q29KD',
    description: 'Public identifier of the asset.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid asset public identifier.',
  })
  assetPublicId!: string;

  @ApiPropertyOptional({
    example: 'AI confidence was below the acceptance threshold.',
    description: 'Reason for escalating the asset to manual moderation.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Mark the moderation request as high priority.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  highPriority?: boolean;

  @ApiPropertyOptional({
    example: true,
    description:
      'Assign the moderation request immediately if a moderator is available.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  assignImmediately?: boolean;

  @ApiPropertyOptional({
    example: {
      requestedBy: 'SYSTEM',
      source: 'AI_MODERATION',
      aiConfidence: 63.8,
      aiDecision: 'UNCERTAIN',
      policy: 'CONTENT_POLICY_V3',
      queue: 'manual-review',
    },
    description: 'Additional information supporting the manual review request.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
