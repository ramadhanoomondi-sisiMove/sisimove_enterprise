// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get Active Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialCommissionType } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetActiveCommercialCommissionRuleQuery extends Query {
  public constructor(public readonly type: CommercialCommissionType) {
    super();
  }
}

export default GetActiveCommercialCommissionRuleQuery;
