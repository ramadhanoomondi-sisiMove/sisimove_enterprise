// src/domains/trust/presentation/rest/dto/apply-trust-dispute-resolved.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ApplyTrustDisputeResolvedDto {
  @ApiProperty({
    example: 'DSP-ABC12345',
    description: 'Public ID of the resolved dispute',
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
    description: 'Optional public ID of the actor who resolved the dispute',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  actorPublicId?: string;

  @ApiPropertyOptional({
    example: 'Dispute resolved in favour of the passenger.',
    description: 'Optional dispute resolution',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resolution?: string;
}
