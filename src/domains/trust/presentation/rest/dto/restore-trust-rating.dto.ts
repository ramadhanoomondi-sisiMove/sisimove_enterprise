// src/domains/trust/presentation/rest/dto/restore-trust-rating.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class RestoreTrustRatingDto {
  @ApiPropertyOptional({
    example: 'Rating restored after moderation review.',
    description: 'Optional reason for restoring the rating',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
