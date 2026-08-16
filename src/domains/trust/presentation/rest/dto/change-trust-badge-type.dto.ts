// src/domains/trust/presentation/rest/dto/change-trust-badge-type.dto.ts

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsEnum, IsNotEmpty } from 'class-validator';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { TrustBadgeType } from '../../../domain/value-objects/trust-badge-type.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ChangeTrustBadgeTypeDto {
  @ApiProperty({
    enum: TrustBadgeType,
    enumName: 'TrustBadgeType',
    example: TrustBadgeType.IDENTITY_VERIFIED,
    description: 'New trust badge type.',
  })
  @IsEnum(TrustBadgeType)
  @IsNotEmpty()
  type!: TrustBadgeType;
}
