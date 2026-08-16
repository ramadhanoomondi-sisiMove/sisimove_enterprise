// src/domains/trust/presentation/rest/dto/create-trust-badge.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateTrustBadgeDto {
  @ApiProperty({
    enum: TrustBadgeType,
    enumName: 'TrustBadgeType',
    example: TrustBadgeType.IDENTITY_VERIFIED,
    description: 'Trust badge type.',
  })
  @IsEnum(TrustBadgeType)
  type!: TrustBadgeType;

  @ApiProperty({
    example: 'Identity Verified',
    description: 'Display name of the trust badge.',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    example: 'Identity verification has been successfully completed.',
    description: 'Optional trust badge description.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: 'AST-ABC12345',
    description: 'Optional public ID of the asset used by the badge.',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  assetPublicId?: string;
}
