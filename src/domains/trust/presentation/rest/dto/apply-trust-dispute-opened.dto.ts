// src/domains/trust/presentation/rest/dto/apply-trust-dispute-opened.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ApplyTrustDisputeOpenedDto {
  @ApiProperty({
    example: 'DSP-ABC12345',
    description: 'Public ID of the opened dispute',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  disputePublicId!: string;

  @ApiPropertyOptional({
    example: 'JRN-ABC12345',
    description: 'Optional public ID of the related journey',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId?: string;

  @ApiPropertyOptional({
    example: 'BKG-ABC12345',
    description: 'Optional public ID of the related booking',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  bookingPublicId?: string;

  @ApiPropertyOptional({
    example: 'ACT-ABC12345',
    description: 'Optional public ID of the actor who opened the dispute',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  actorPublicId?: string;

  @ApiPropertyOptional({
    example: 'Passenger reported a serious journey issue.',
    description: 'Optional dispute reason',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
