// src/domains/trust/presentation/rest/dto/grant-trust-verification.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { TrustVerificationLevel } from '../../../domain/value-objects/trust-verification-level.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class GrantTrustVerificationDto {
  @ApiProperty({
    enum: TrustVerificationLevel,
    example: TrustVerificationLevel.BASIC,
    description: 'Verification level to grant to the trust profile',
  })
  @IsEnum(TrustVerificationLevel)
  verificationLevel!: TrustVerificationLevel;
}
