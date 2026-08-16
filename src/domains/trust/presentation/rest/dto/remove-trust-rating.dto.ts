// src/domains/trust/presentation/rest/dto/remove-trust-rating.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class RemoveTrustRatingDto {
  @ApiPropertyOptional({
    example: 'Rating removed after policy violation.',
    description: 'Optional reason for removing the rating',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
