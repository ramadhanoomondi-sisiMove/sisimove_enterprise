import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

import type { JourneySmokingPolicy } from '../../../domain/value-objects/journey-smoking-policy.vo';
import type { JourneyPetsPolicy } from '../../../domain/value-objects/journey-pets-policy.vo';
import type { JourneyLuggagePolicy } from '../../../domain/value-objects/journey-luggage-policy.vo';
import type { JourneyConversationPreference } from '../../../domain/value-objects/journey-conversation-preference.vo';
import type { JourneyMusicPreference } from '../../../domain/value-objects/journey-music-preference.vo';

export class AttachPreferencesCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey being configured.
     */
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * Smoking policy selected for the Journey.
     */
    public readonly smoking: JourneySmokingPolicy,

    /**
     * Pets policy selected for the Journey.
     */
    public readonly pets: JourneyPetsPolicy,

    /**
     * Luggage policy selected for the Journey.
     */
    public readonly luggage: JourneyLuggagePolicy,

    /**
     * Conversation preference selected for the Journey.
     */
    public readonly conversation: JourneyConversationPreference,

    /**
     * Music preference selected for the Journey.
     */
    public readonly music: JourneyMusicPreference,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
