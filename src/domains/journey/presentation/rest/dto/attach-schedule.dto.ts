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

/**
 * Request body for attaching schedule configuration to a Journey.
 *
 * The Journey public ID is supplied by the route:
 *
 *     POST /journeys/:journeyPublicId/schedule
 *
 * The JourneySchedule child entity is created by the application layer.
 *
 * Correlation and causation identifiers are application concerns and are
 * therefore not supplied by the HTTP client.
 */
export class AttachScheduleDto {
  @ApiProperty({
    example: '2026-10-15T07:00:00.000Z',
    description: 'Scheduled Journey departure time in ISO 8601 format.',
  })
  @IsDateString()
  departureAt!: string;

  @ApiPropertyOptional({
    example: '2026-10-15T13:30:00.000Z',
    nullable: true,
    description:
      'Expected Journey arrival time in ISO 8601 format. Optional when the arrival time is not known.',
  })
  @IsOptional()
  @IsDateString()
  arrivalAt?: string;

  @ApiProperty({
    example: 'Africa/Nairobi',
    description:
      'IANA timezone used to interpret and display the Journey schedule.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  timezone!: string;
}
