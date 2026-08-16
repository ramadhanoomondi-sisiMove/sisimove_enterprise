// src/domains/trust/presentation/rest/dto/remove-trust-review.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class RemoveTrustReviewDto {
  @ApiPropertyOptional({
    example: 'Review removed following a moderation decision.',
    description: 'Optional reason for removing the review',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
