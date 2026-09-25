import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { JourneyConversationPreference } from '../../../domain/value-objects/journey-conversation-preference.vo';
import { JourneyLuggagePolicy } from '../../../domain/value-objects/journey-luggage-policy.vo';
import { JourneyMusicPreference } from '../../../domain/value-objects/journey-music-preference.vo';
import { JourneyPetsPolicy } from '../../../domain/value-objects/journey-pets-policy.vo';
import { JourneySmokingPolicy } from '../../../domain/value-objects/journey-smoking-policy.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request body for attaching preference configuration to a Journey.
 *
 * The Journey public ID is supplied by the route:
 *
 *     POST /journeys/:journeyPublicId/preferences
 *
 * The JourneyPreferences child entity is created by the application layer.
 *
 * Correlation and causation identifiers are application concerns and are
 * therefore not supplied by the HTTP client.
 */
export class AttachPreferencesDto {
  @ApiProperty({
    enum: JourneySmokingPolicy,
    example: JourneySmokingPolicy.NOT_ALLOWED,
    description: 'Smoking policy for the Journey.',
  })
  @IsEnum(JourneySmokingPolicy)
  smoking!: JourneySmokingPolicy;

  @ApiProperty({
    enum: JourneyPetsPolicy,
    example: JourneyPetsPolicy.ALLOWED,
    description: 'Pet policy for the Journey.',
  })
  @IsEnum(JourneyPetsPolicy)
  pets!: JourneyPetsPolicy;

  @ApiProperty({
    enum: JourneyLuggagePolicy,
    example: JourneyLuggagePolicy.STANDARD,
    description: 'Luggage policy for the Journey.',
  })
  @IsEnum(JourneyLuggagePolicy)
  luggage!: JourneyLuggagePolicy;

  @ApiProperty({
    enum: JourneyConversationPreference,
    description: 'Preferred level of conversation during the Journey.',
  })
  @IsEnum(JourneyConversationPreference)
  conversation!: JourneyConversationPreference;

  @ApiProperty({
    enum: JourneyMusicPreference,
    example: JourneyMusicPreference.MODERATE,
    description: 'Preferred music level during the Journey.',
  })
  @IsEnum(JourneyMusicPreference)
  music!: JourneyMusicPreference;
}
