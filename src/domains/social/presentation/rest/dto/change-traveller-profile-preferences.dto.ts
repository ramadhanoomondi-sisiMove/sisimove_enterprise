// src/domains/social/presentation/rest/dto/change-traveller-profile-preferences.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeTravellerProfilePreferencesDto {
  @ApiProperty({
    example: true,
    description: 'Whether journey history should be visible',
  })
  @IsBoolean()
  showJourneyHistory!: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether journey statistics should be visible',
  })
  @IsBoolean()
  showJourneyStatistics!: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the traveller may receive journey invites',
  })
  @IsBoolean()
  allowJourneyInvites!: boolean;
}
