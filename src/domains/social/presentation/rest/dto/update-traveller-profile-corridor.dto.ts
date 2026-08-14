// src/domains/social/presentation/rest/dto/update-traveller-profile-corridor.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateTravellerProfileCorridorDto {
  @ApiProperty({
    example: 'Nairobi',
    description: 'Human-readable origin name',
  })
  @IsString()
  @MaxLength(200)
  originName!: string;

  @ApiProperty({
    example: 'Mombasa',
    description: 'Human-readable destination name',
  })
  @IsString()
  @MaxLength(200)
  destinationName!: string;

  @ApiProperty({
    example: -1.286389,
    description: 'Origin latitude',
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  originLatitude!: number;

  @ApiProperty({
    example: 36.817223,
    description: 'Origin longitude',
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  originLongitude!: number;

  @ApiProperty({
    example: -4.043477,
    description: 'Destination latitude',
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  destinationLatitude!: number;

  @ApiProperty({
    example: 39.668206,
    description: 'Destination longitude',
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  destinationLongitude!: number;

  @ApiPropertyOptional({
    example: 'KE-NRB-MSA',
    description: 'Stable corridor discovery and matching key',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  corridorKey?: string | null;
}
