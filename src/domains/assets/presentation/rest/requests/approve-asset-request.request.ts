// src/domains/assets/presentation/rest/requests/approve-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { AssetModerationType } from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class ApproveAssetRequest {
  @ApiProperty({
    enum: AssetModerationType,
    description: 'Moderation type to approve.',
    example: AssetModerationType.MANUAL,
  })
  @IsEnum(AssetModerationType)
  type!: AssetModerationType;

  @ApiPropertyOptional({
    example: 'IDN-WQC6Y7G',
    description: 'Identity of the moderator approving the asset.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDN-[A-Z0-9]+$/, {
    message:
      'moderatorIdentityPublicId must be a valid moderator public identifier.',
  })
  moderatorIdentityPublicId?: string;

  @ApiPropertyOptional({
    example: 98.75,
    description: 'Moderation confidence percentage.',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Min(0)
  @Max(100)
  confidence?: number;
}
