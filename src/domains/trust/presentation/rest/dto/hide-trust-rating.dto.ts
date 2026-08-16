// src/domains/trust/presentation/rest/dto/hide-trust-rating.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class HideTrustRatingDto {
  @ApiPropertyOptional({
    example: 'Rating hidden following a moderation review.',
    description: 'Optional reason for hiding the rating',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
