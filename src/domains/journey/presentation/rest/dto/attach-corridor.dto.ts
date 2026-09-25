import { ApiProperty } from '@nestjs/swagger';

import {
  IsLatitude,
  IsLongitude,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request body for attaching corridor configuration to a Journey.
 *
 * The Journey public ID is supplied by the route:
 *
 *     POST /journeys/:journeyPublicId/corridor
 *
 * The JourneyCorridor child entity is created by the application layer.
 *
 * Waypoints are configured separately through the Journey waypoint endpoint
 * after the corridor has been attached.
 *
 * Correlation and causation identifiers are application concerns and are
 * therefore not supplied by the HTTP client.
 */
export class AttachCorridorDto {
  @ApiProperty({
    example: 'Nairobi',
    description: 'Origin location name.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  originName!: string;

  @ApiProperty({
    example: 'Mombasa',
    description: 'Destination location name.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  destinationName!: string;

  @ApiProperty({
    example: -1.286389,
    description: 'Origin latitude.',
  })
  @IsLatitude()
  originLatitude!: number;

  @ApiProperty({
    example: 36.817223,
    description: 'Origin longitude.',
  })
  @IsLongitude()
  originLongitude!: number;

  @ApiProperty({
    example: -4.043477,
    description: 'Destination latitude.',
  })
  @IsLatitude()
  destinationLatitude!: number;

  @ApiProperty({
    example: 39.668206,
    description: 'Destination longitude.',
  })
  @IsLongitude()
  destinationLongitude!: number;
}
