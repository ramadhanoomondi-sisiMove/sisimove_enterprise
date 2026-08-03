// src/domains/asset/presentation/rest/requests/create-asset-moderation.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { AssetModerationType } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAssetModerationRequest {
  @ApiProperty({
    example: 'AST-X7Q29KD',
    description: 'Public identifier of the asset to moderate.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid asset public identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    enum: AssetModerationType,
    example: AssetModerationType.AI,
    description: 'Moderation method to perform.',
  })
  @IsEnum(AssetModerationType)
  type!: AssetModerationType;

  @ApiPropertyOptional({
    example: {
      requestedBy: 'system',
      aiModel: 'openai-moderation-v2',
      queue: 'content-moderation',
      priority: 'HIGH',
    },
    description: 'Optional metadata associated with the moderation request.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
