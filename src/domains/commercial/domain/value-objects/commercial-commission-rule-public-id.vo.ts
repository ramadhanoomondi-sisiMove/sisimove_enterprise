// src/domains/commercial/domain/value-objects/commercial-commission-rule-public-id.vo.ts

// -----------------------------------------------------------------------------
// Commercial Commission Rule Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Commercial Commission Rule.
 *
 * Represents the externally exposed identifier of a commission rule.
 *
 * The public identifier is intentionally distinct from the internal
 * persistence identifier represented by UniqueEntityId.
 */
export class CommercialCommissionRulePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'CCR');
  }
}
