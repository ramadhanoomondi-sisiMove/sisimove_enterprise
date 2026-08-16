// src/domains/trust/presentation/rest/dto/create-trust-review.dto.ts

// -----------------------------------------------------------------------------
// NestJS / Validation
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class CreateTrustReviewDto {
  // ===========================================================================
  // Review Identity
  // ===========================================================================

  @ApiProperty({
    example: 'REV-ABC12345',
    description: 'Public ID of the review being created.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  reviewId!: string;

  // ===========================================================================
  // Rating
  // ===========================================================================

  @ApiProperty({
    example: 'RTG-ABC12345',
    description: 'Public ID of the rating this review belongs to.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  ratingId!: string;

  // ===========================================================================
  // Content
  // ===========================================================================

  @ApiProperty({
    example:
      'Great traveller. Very punctual, respectful, and easy to communicate with.',
    description: 'Content of the trust review.',
    minLength: 1,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;
}
