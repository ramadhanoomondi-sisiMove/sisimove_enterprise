// -----------------------------------------------------------------------------
// Financial Payment Provider Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

/**
 * Public identity of a Financial Payment Provider.
 *
 * Independent of the persistence-layer primary key.
 */
export class FinancialPaymentProviderPublicId extends PublicEntityId {
  public constructor(value?: string) {
    super(value, 'FPP');
  }
}
