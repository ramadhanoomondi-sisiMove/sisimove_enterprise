// src/domains/trust/presentation/rest/dto/set-trust-badge-asset.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class SetTrustBadgeAssetDto {
  @ApiProperty({
    example: 'AST-ABC12345',
    description: 'Public ID of the asset associated with the trust badge',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  assetPublicId!: string;
}
