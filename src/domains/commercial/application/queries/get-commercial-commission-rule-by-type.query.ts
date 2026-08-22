// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get By Type Query
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

export class GetCommercialCommissionRuleByTypeQuery extends Query {
  public constructor(public readonly type: CommercialCommissionType) {
    super();
  }
}

export default GetCommercialCommissionRuleByTypeQuery;
