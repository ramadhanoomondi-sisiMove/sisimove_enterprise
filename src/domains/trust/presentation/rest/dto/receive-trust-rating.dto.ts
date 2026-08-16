// src/domains/trust/presentation/rest/dto/receive-trust-rating.dto.ts

// -----------------------------------------------------------------------------
// NestJS / Validation
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { TrustRatingRole } from '../../../domain/value-objects/trust-rating-role.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ReceiveTrustRatingDto {
  // ===========================================================================
  // Rating Identity
  // ===========================================================================

  @ApiProperty({
    example: 'RAT-ABC12345',
    description: 'Public ID of the rating being received.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  ratingId!: string;

  // ===========================================================================
  // Participants
  // ===========================================================================

  @ApiProperty({
    example: 'USR-REVIEWER123',
    description: 'Public ID of the member giving the rating.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  reviewerPublicId!: string;

  @ApiProperty({
    example: 'USR-REVIEWEE123',
    description: 'Public ID of the member receiving the rating.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  revieweePublicId!: string;

  // ===========================================================================
  // Journey
  // ===========================================================================

  @ApiProperty({
    example: 'JRN-ABC12345',
    description: 'Public ID of the journey associated with the rating.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId!: string;

  @ApiPropertyOptional({
    example: 'BKG-ABC12345',
    description:
      'Optional public ID of the booking associated with the rating.',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  bookingPublicId?: string;

  // ===========================================================================
  // Rating
  // ===========================================================================

  @ApiProperty({
    example: 5,
    description: 'Rating score from 1 to 5.',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @ApiProperty({
    enum: TrustRatingRole,
    example: TrustRatingRole.PASSENGER,
    description: 'Role of the rated participant in the journey.',
  })
  @IsEnum(TrustRatingRole)
  role!: TrustRatingRole;
}
