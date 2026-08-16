import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class CancelJourneyDto {
  @ApiProperty({
    example: 'JRN-ABC12345',
    description: 'Public ID of the Journey to cancel.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId!: string;

  @ApiPropertyOptional({
    example: 'Provider is no longer available for the journey.',
    description: 'Optional reason for cancellation.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;

  @ApiProperty({
    example: 'corr-01J8XYZ123',
    description: 'Correlation identifier for distributed tracing.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  @ApiPropertyOptional({
    example: 'cmd-01J8XYZ456',
    description: 'Optional causation identifier for distributed tracing.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  @ApiPropertyOptional({
    example: '2026-08-15T09:30:00.000Z',
    description:
      'Optional effective cancellation timestamp. Defaults to handler execution time.',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  cancelledAt?: string;
}
