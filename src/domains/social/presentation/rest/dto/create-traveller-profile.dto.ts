// src/domains/social/presentation/rest/dto/create-traveller-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTravellerProfileDto {
  @ApiProperty({
    example: 'MBR-ABC12345',
    description: 'Public ID of the member owning the traveller profile',
  })
  @IsString()
  memberPublicId!: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique public traveller handle',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  handle!: string;

  @ApiProperty({
    example: 'Traveller and road-trip enthusiast.',
    description: 'Optional traveller biography',
    required: false,
    nullable: true,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string | null;

  @ApiProperty({
    example: 'AST-ABC12345',
    description: 'Optional public ID of the avatar asset',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatarAssetPublicId?: string | null;

  @ApiProperty({
    example: 'KE',
    description: 'ISO 3166-1 alpha-2 country code',
    required: false,
    default: 'KE',
    minLength: 2,
    maxLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  countryCode?: string;
}
