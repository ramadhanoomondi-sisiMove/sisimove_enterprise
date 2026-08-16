// src/domains/trust/presentation/rest/dto/change-trust-badge-name.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ChangeTrustBadgeNameDto {
  @ApiProperty({
    example: 'Identity Verified',
    description: 'New trust badge display name',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;
}
