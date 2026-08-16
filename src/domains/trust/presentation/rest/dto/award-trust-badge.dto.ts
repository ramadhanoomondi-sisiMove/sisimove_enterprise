// src/domains/trust/presentation/rest/dto/award-trust-badge.dto.ts

// -----------------------------------------------------------------------------
// NestJS / Validation
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class AwardTrustBadgeDto {
  // ===========================================================================
  // Badge
  // ===========================================================================

  @ApiProperty({
    example: 'TBD-ABC12345',
    description: 'Public ID of the Trust Badge to award.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  badgeId!: string;

  // ===========================================================================
  // Profile Badge
  // ===========================================================================

  @ApiProperty({
    example: 'TPB-ABC12345',
    description:
      'Public ID of the Trust Profile Badge representing this badge award.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  profileBadgeId!: string;
}
