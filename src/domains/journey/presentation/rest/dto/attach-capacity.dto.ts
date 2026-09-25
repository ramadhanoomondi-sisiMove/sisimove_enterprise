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
 * Configures the seat capacity of a Journey.
 *
 * The Journey aggregate owns its capacity child, so the caller supplies only
 * the capacity configuration. The application layer generates the child
 * public ID when creating JourneyCapacityEntity.
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

  /**
   * Number of seats already booked.
   *
   * This is normally zero during Journey creation, but the command supports
   * an explicit value because the domain entity contains booked-seat state.
   */
  @ApiProperty({
    example: 0,
    description: 'Number of passenger seats already booked.',
    minimum: 0,
    default: 0,
  })
  @IsInt()
  @Min(0)
  bookedSeats!: number;
}
