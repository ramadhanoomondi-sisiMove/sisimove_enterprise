// src/domains/social/presentation/rest/dto/change-traveller-profile-country.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangeTravellerProfileCountryDto {
  @ApiProperty({
    example: 'KE',
    description: 'ISO 3166-1 alpha-2 country code',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2)
  countryCode!: string;
}
