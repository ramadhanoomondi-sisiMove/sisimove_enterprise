// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/value-objects/journey-smoking-policy.vo.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Smoking Policy Value Object
//
// Represents the smoking policy configured for a Journey.
//
// Allowed values:
// - ALLOWED
// - NOT_ALLOWED
//
// Responsibilities:
// - enforce the Journey smoking-policy vocabulary;
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

export enum JourneySmokingPolicy {
  ALLOWED = 'ALLOWED',
  NOT_ALLOWED = 'NOT_ALLOWED',
}

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneySmokingPolicyProps {
  readonly value: JourneySmokingPolicy;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneySmokingPolicyValueObject extends ValueObject<JourneySmokingPolicyProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(policy: JourneySmokingPolicy) {
    if (!Object.values(JourneySmokingPolicy).includes(policy)) {
      throw new Error(`Invalid journey smoking policy "${policy}".`);
    }

    super({
      value: policy,
    });
  }

  // ===========================================================================
  // Value
  // ===========================================================================

  public get value(): JourneySmokingPolicy {
    return this.props.value;
  }

  // ===========================================================================
  // Semantic Queries
  // ===========================================================================

  public get isAllowed(): boolean {
    return this.props.value === JourneySmokingPolicy.ALLOWED;
  }

  public get isNotAllowed(): boolean {
    return this.props.value === JourneySmokingPolicy.NOT_ALLOWED;
  }
}
