import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request body for attaching vehicle configuration to a Journey.
 *
 * The Journey public ID is supplied by the route:
 *
 *     POST /journeys/:journeyPublicId/vehicle
 *
 * The JourneyVehicle child entity is created by the application layer.
 *
 * The optional assetPublicId references an existing Asset owned by the Asset
 * domain. It does not create or transfer ownership of that Asset.
 *
 * Correlation and causation identifiers are application concerns and are
 * therefore not supplied by the HTTP client.
 */
export class AttachVehicleDto {
  @ApiProperty({
    example: 'Toyota',
    description: 'Vehicle manufacturer.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  make!: string;

  @ApiProperty({
    example: 'Noah',
    description: 'Vehicle model.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  model!: string;

  @ApiPropertyOptional({
    example: 2022,
    description: 'Vehicle manufacturing year.',
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({
    example: 'White',
    description: 'Vehicle exterior color.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({
    example: 'KDA 123A',
    description: 'Vehicle registration number.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  registration?: string;

  @ApiPropertyOptional({
    example: 'AST-ABC12345',
    description:
      'Public ID of an existing Asset representing the vehicle image.',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  assetPublicId?: string;
}
