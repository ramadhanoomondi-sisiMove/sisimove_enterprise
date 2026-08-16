// src/domains/trust/presentation/rest/dto/update-trust-review.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UpdateTrustReviewDto {
  @ApiProperty({
    example:
      'Great traveller. Very punctual, respectful, and communication was excellent.',
    description: 'Updated content of the trust review',
    minLength: 1,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;
}
