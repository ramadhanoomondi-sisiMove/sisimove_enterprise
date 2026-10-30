// -----------------------------------------------------------------------------
// Financial Payment Provider Capability Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

/**
 * Public identity of a Financial Payment Provider Capability.
 */
export class FinancialPaymentProviderCapabilityPublicId extends PublicEntityId {
  public constructor(value?: string) {
    super(value, 'FPPC');
  }
}
