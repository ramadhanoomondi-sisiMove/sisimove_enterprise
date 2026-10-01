// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/value-objects/journey-pets-policy.vo.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Pets Policy Value Object
//
// Represents the pet policy configured for a Journey.
//
// Allowed values:
// - ALLOWED
// - NOT_ALLOWED
// - SERVICE_ANIMALS_ONLY
//
// Responsibilities:
// - enforce the Journey pets-policy vocabulary;
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

export enum JourneyPetsPolicy {
  ALLOWED = 'ALLOWED',
  NOT_ALLOWED = 'NOT_ALLOWED',
  SERVICE_ANIMALS_ONLY = 'SERVICE_ANIMALS_ONLY',
}

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyPetsPolicyProps {
  readonly value: JourneyPetsPolicy;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyPetsPolicyValueObject extends ValueObject<JourneyPetsPolicyProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(policy: JourneyPetsPolicy) {
    if (!Object.values(JourneyPetsPolicy).includes(policy)) {
      throw new Error(`Invalid journey pets policy "${policy}".`);
    }

    super({
      value: policy,
    });
  }

  // ===========================================================================
  // Value
  // ===========================================================================

  public get value(): JourneyPetsPolicy {
    return this.props.value;
  }

  // ===========================================================================
  // Semantic Queries
  // ===========================================================================

  public get isAllowed(): boolean {
    return this.props.value === JourneyPetsPolicy.ALLOWED;
  }

  public get isNotAllowed(): boolean {
    return this.props.value === JourneyPetsPolicy.NOT_ALLOWED;
  }

  public get isServiceAnimalsOnly(): boolean {
    return this.props.value === JourneyPetsPolicy.SERVICE_ANIMALS_ONLY;
  }
}
