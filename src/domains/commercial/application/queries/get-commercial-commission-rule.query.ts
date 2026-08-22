// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialCommissionRulePublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetCommercialCommissionRuleQuery extends Query {
  public constructor(
    public readonly publicId: CommercialCommissionRulePublicId,
  ) {
    super();
  }
}

export default GetCommercialCommissionRuleQuery;
