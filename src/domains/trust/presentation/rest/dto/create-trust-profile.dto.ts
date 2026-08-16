// src/domains/trust/presentation/rest/dto/create-trust-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class CreateTrustProfileDto {
  @ApiProperty({
    example: 'MBR-ABC12345',
    description: 'Public ID of the member owning the trust profile',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  memberPublicId!: string;
}
