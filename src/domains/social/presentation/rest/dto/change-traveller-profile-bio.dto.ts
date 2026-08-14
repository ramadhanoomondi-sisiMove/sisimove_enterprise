// src/domains/social/presentation/rest/dto/change-traveller-profile-bio.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ChangeTravellerProfileBioDto {
  @ApiProperty({
    example: 'Traveller and road-trip enthusiast.',
    description: 'New traveller biography',
    required: false,
    nullable: true,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string | null;
}
