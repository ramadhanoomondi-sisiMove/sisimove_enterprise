// src/domains/trust/presentation/rest/dto/change-trust-profile-status.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { TrustProfileStatus } from '../../../domain/value-objects/trust-profile-status.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ChangeTrustProfileStatusDto {
  @ApiProperty({
    enum: TrustProfileStatus,
    example: TrustProfileStatus.RESTRICTED,
    description: 'New trust profile lifecycle status',
  })
  @IsEnum(TrustProfileStatus)
  status!: TrustProfileStatus;
}
