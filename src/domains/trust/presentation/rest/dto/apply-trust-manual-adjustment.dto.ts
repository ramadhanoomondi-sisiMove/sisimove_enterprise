// src/domains/trust/presentation/rest/dto/apply-trust-manual-adjustment.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ApplyTrustManualAdjustmentDto {
  @ApiProperty({
    example: 'ACT-ABC12345',
    description: 'Public ID of the actor making the adjustment',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  actorPublicId!: string;

  @ApiProperty({
    example: 'Correction following trust review.',
    description: 'Reason for the manual adjustment',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  reason!: string;

  @ApiProperty({
    example: 'INCREASE_TRUST_SCORE',
    description: 'Description or type of manual trust adjustment',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  adjustment!: string;

  @ApiPropertyOptional({
    example: {
      source: 'ADMIN_REVIEW',
      caseId: 'CASE-12345',
    },
    description: 'Optional metadata associated with the adjustment',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}