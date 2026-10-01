// src/domains/journey/presentation/dtos/attach-capacity.dto.ts

// -----------------------------------------------------------------------------
// NestJS / Validation
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Configures the passenger-seat capacity of a Journey.
 *
 * Booked seats are not supplied by the client.
 * A newly configured Journey always starts with zero booked seats.
 */
export class AttachCapacityDto {
  /**
   * Total passenger seats available on the Journey.
   */
  @ApiProperty({
    example: 4,
    description: 'Total number of passenger seats available on the Journey.',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  totalSeats!: number;
}
