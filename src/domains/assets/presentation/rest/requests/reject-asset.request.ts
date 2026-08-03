// src/domains/assets/presentation/rest/requests/reject-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { AssetModerationType } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RejectAssetRequest {
  @ApiProperty({
    enum: AssetModerationType,
    description: 'Moderation type to reject.',
    example: AssetModerationType.MANUAL,
  })
  @IsEnum(AssetModerationType)
  type!: AssetModerationType;

  @ApiPropertyOptional({
    example: 'IDN-WQC6Y7G',
    description: 'Identity rejecting the moderation.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDN-[A-Z0-9]+$/, {
    message:
      'moderatorIdentityPublicId must be a valid moderator public identifier.',
  })
  moderatorIdentityPublicId?: string;

  @ApiProperty({
    example: 'Graphic violence detected.',
    description: 'Reason the moderation was rejected.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(500)
  reason!: string;

  @ApiPropertyOptional({
    example: 99.4,
    description: 'Moderation confidence percentage.',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Min(0)
  @Max(100)
  confidence?: number;
}
