// src/domains/social/presentation/rest/dto/change-traveller-profile-handle.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeTravellerProfileHandleDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'New unique public traveller handle',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  handle!: string;
}
