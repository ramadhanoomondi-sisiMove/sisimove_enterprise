// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/value-objects/journey-conversation-preference.vo.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Conversation Preference Value Object
//
// Represents the preferred level of conversation configured for a Journey.
//
// Allowed values:
// - QUIET
// - MODERATE
// - SOCIAL
//
// Responsibilities:
// - enforce the Journey conversation-preference vocabulary;
// - provide immutable domain representation;
// - expose semantic convenience getters.
//
// This Value Object does NOT:
// - perform persistence concerns;
// - perform HTTP validation;
// - depend on Prisma.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Value
// -----------------------------------------------------------------------------

export enum JourneyConversationPreference {
  QUIET = 'QUIET',
  MODERATE = 'MODERATE',
  SOCIAL = 'SOCIAL',
}

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyConversationPreferenceProps {
  readonly value: JourneyConversationPreference;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyConversationPreferenceValueObject extends ValueObject<JourneyConversationPreferenceProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(preference: JourneyConversationPreference) {
    if (!Object.values(JourneyConversationPreference).includes(preference)) {
      throw new Error(
        `Invalid journey conversation preference "${preference}".`,
      );
    }

    super({
      value: preference,
    });
  }

  // ===========================================================================
  // Value
  // ===========================================================================

  public get value(): JourneyConversationPreference {
    return this.props.value;
  }

  // ===========================================================================
  // Semantic Queries
  // ===========================================================================

  public get isQuiet(): boolean {
    return this.props.value === JourneyConversationPreference.QUIET;
  }

  public get isModerate(): boolean {
    return this.props.value === JourneyConversationPreference.MODERATE;
  }

  public get isSocial(): boolean {
    return this.props.value === JourneyConversationPreference.SOCIAL;
  }
}
