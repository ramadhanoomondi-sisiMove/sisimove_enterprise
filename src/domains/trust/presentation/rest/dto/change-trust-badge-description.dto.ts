// src/domains/trust/presentation/rest/dto/change-trust-badge-description.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ChangeTrustBadgeDescriptionDto {
  @ApiProperty({
    example: 'Identity verification has been successfully completed.',
    description: 'New trust badge description',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description!: string;
}
