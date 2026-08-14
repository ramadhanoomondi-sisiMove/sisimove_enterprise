// src/domains/social/presentation/rest/dto/create-traveller-profile-preferences.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateTravellerProfilePreferencesDto {
  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether journey history should be visible',
  })
  @IsOptional()
  @IsBoolean()
  showJourneyHistory?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether journey statistics should be visible',
  })
  @IsOptional()
  @IsBoolean()
  showJourneyStatistics?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether the traveller may receive journey invites',
  })
  @IsOptional()
  @IsBoolean()
  allowJourneyInvites?: boolean;
}
