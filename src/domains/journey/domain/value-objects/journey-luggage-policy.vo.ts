// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/value-objects/journey-luggage-policy.vo.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Luggage Policy Value Object
//
// Represents the luggage policy configured for a Journey.
//
// Allowed values:
// - NONE
// - LIMITED
// - STANDARD
// - LARGE
//
// Responsibilities:
// - enforce the Journey luggage-policy vocabulary;
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

export enum JourneyLuggagePolicy {
  NONE = 'NONE',
  LIMITED = 'LIMITED',
  STANDARD = 'STANDARD',
  LARGE = 'LARGE',
}

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyLuggagePolicyProps {
  readonly value: JourneyLuggagePolicy;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyLuggagePolicyValueObject extends ValueObject<JourneyLuggagePolicyProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(policy: JourneyLuggagePolicy) {
    if (!Object.values(JourneyLuggagePolicy).includes(policy)) {
      throw new Error(`Invalid journey luggage policy "${policy}".`);
    }

    super({
      value: policy,
    });
  }

  // ===========================================================================
  // Value
  // ===========================================================================

  public get value(): JourneyLuggagePolicy {
    return this.props.value;
  }

  // ===========================================================================
  // Semantic Queries
  // ===========================================================================

  public get isNone(): boolean {
    return this.props.value === JourneyLuggagePolicy.NONE;
  }

  public get isLimited(): boolean {
    return this.props.value === JourneyLuggagePolicy.LIMITED;
  }

  public get isStandard(): boolean {
    return this.props.value === JourneyLuggagePolicy.STANDARD;
  }

  public get isLarge(): boolean {
    return this.props.value === JourneyLuggagePolicy.LARGE;
  }
}
