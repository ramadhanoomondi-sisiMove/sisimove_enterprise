// src/domains/trust/presentation/rest/dto/revoke-trust-badge.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class RevokeTrustBadgeDto {
  @ApiPropertyOptional({
    example: 'Badge revoked following a verification review.',
    description: 'Optional reason for revoking the badge',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
