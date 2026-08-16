// src/domains/trust/presentation/rest/dto/apply-trust-journey-cancelled.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ApplyTrustJourneyCancelledDto {
  @ApiProperty({
    example: 'JRN-ABC12345',
    description: 'Public ID of the cancelled journey',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId!: string;

  @ApiProperty({
    example: 'PROVIDER',
    description: 'Role of the trust profile participant in the journey',
    enum: ['PROVIDER', 'PASSENGER'],
  })
  @IsEnum(['PROVIDER', 'PASSENGER'])
  role!: 'PROVIDER' | 'PASSENGER';

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
    example: 'Journey cancelled by the provider.',
    description: 'Optional cancellation reason',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
