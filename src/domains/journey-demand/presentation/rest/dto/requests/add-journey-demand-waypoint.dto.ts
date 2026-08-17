import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { JourneyDemandWaypointType } from '../../../../domain/value-objects/journey-demand-waypoint-type.vo';

export class AddJourneyDemandWaypointDto {
  // ---------------------------------------------------------------------------
  // Waypoint Type
  // ---------------------------------------------------------------------------

  @ApiProperty({
    enum: JourneyDemandWaypointType,
    example: JourneyDemandWaypointType.PICKUP,
    description:
      'Type of waypoint. Pickup/dropoff semantics are derived from this type.',
  })
  @IsEnum(JourneyDemandWaypointType)
  type!: JourneyDemandWaypointType;

  // ---------------------------------------------------------------------------
  // Sequence
  // ---------------------------------------------------------------------------

  @ApiProperty({
    example: 1,
    minimum: 0,
    description: 'Position of the waypoint within the Journey Demand corridor.',
  })
  @IsInt()
  @Min(0)
  sequence!: number;

  // ---------------------------------------------------------------------------
  // Name
  // ---------------------------------------------------------------------------

  @ApiProperty({
    example: 'Voi',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  // ---------------------------------------------------------------------------
  // Latitude
  // ---------------------------------------------------------------------------

  @ApiProperty({
    example: -3.3967,
    description: 'Latitude of the waypoint.',
  })
  @IsNumber()
  latitude!: number;

  // ---------------------------------------------------------------------------
  // Longitude
  // ---------------------------------------------------------------------------

  @ApiProperty({
    example: 38.5561,
    description: 'Longitude of the waypoint.',
  })
  @IsNumber()
  longitude!: number;

  // ---------------------------------------------------------------------------
  // Event Correlation
  // ---------------------------------------------------------------------------

  @ApiProperty({
    example: 'corr-01J8XYZ123',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  // ---------------------------------------------------------------------------
  // Event Causation
  // ---------------------------------------------------------------------------

  @ApiPropertyOptional({
    example: 'cmd-01J8XYZ456',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;
}
