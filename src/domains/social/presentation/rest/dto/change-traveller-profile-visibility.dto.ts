// src/domains/social/presentation/rest/dto/change-traveller-profile-visibility.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { TravellerProfileVisibility } from '../../../domain/value-objects/traveller-profile-visibility.vo';

export class ChangeTravellerProfileVisibilityDto {
  @ApiProperty({
    enum: TravellerProfileVisibility,
    example: TravellerProfileVisibility.PUBLIC,
    description: 'New traveller profile visibility',
  })
  @IsEnum(TravellerProfileVisibility)
  visibility!: TravellerProfileVisibility;
}
