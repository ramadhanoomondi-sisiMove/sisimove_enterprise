import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class AddWaypointDto {
  @ApiProperty({
    example: 'JRN-ABC12345',
    description: 'Public ID of the Journey to update.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId!: string;

  @ApiProperty({
    example: 'JWP-ABC12345',
    description: 'Public ID of the waypoint.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  waypointPublicId!: string;

  @ApiProperty({
    example: 'WAYPOINT',
    description: 'Type of Journey waypoint.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  type!: string;

  @ApiProperty({
    example: 1,
    description: 'Sequence number of the waypoint.',
  })
  @IsNumber()
  sequence!: number;

  @ApiProperty({
    example: 'Naivasha',
    description: 'Waypoint location name.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiProperty({
    example: -0.7172,
    description: 'Waypoint latitude.',
  })
  @IsNumber()
  latitude!: number;

  @ApiProperty({
    example: 36.431,
    description: 'Waypoint longitude.',
  })
  @IsNumber()
  longitude!: number;

  @ApiProperty({
    example: true,
    description: 'Whether passenger pickup is allowed at this waypoint.',
  })
  @IsBoolean()
  pickupAllowed!: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether passenger dropoff is allowed at this waypoint.',
  })
  @IsBoolean()
  dropoffAllowed!: boolean;

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
}
