// src/domains/trust/presentation/rest/dto/change-trust-rating-score.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ChangeTrustRatingScoreDto {
  @ApiProperty({
    example: 4,
    description: 'New rating score',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  score!: number;
}
