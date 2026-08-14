// src/domains/social/presentation/rest/dto/change-traveller-profile-status.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { TravellerProfileStatus } from '../../../domain/value-objects/traveller-profile-status.vo';

export class ChangeTravellerProfileStatusDto {
  @ApiProperty({
    enum: TravellerProfileStatus,
    example: TravellerProfileStatus.ACTIVE,
    description: 'New traveller profile lifecycle status',
  })
  @IsEnum(TravellerProfileStatus)
  status!: TravellerProfileStatus;
}
