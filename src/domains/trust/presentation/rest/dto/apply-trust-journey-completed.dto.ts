// src/domains/trust/presentation/rest/dto/apply-trust-journey-completed.dto.ts

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

export class ApplyTrustJourneyCompletedDto {
  @ApiProperty({
    example: 'JRN-ABC12345',
    description: 'Public ID of the completed journey',
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
}
