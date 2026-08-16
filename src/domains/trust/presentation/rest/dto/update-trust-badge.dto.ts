// src/domains/trust/presentation/rest/dto/update-trust-badge.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { TrustBadgeType } from '../../../domain/value-objects/trust-badge-type.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UpdateTrustBadgeDto {
  @ApiPropertyOptional({
    enum: TrustBadgeType,
    enumName: 'TrustBadgeType',
    example: TrustBadgeType.IDENTITY_VERIFIED,
    description: 'Updated trust badge type.',
  })
  @IsOptional()
  @IsEnum(TrustBadgeType)
  type?: TrustBadgeType;

  @ApiPropertyOptional({
    example: 'Identity Verified',
    description: 'Updated trust badge name.',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'Identity verification has been successfully completed.',
    description: 'Updated trust badge description.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: 'AST-ABC12345',
    description: 'Updated public ID of the badge asset.',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  assetPublicId?: string;
}
