import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  FinancialPaymentProviderPublicId,
  FinancialPaymentProviderName,
} from '../../domain/value-objects';

/**
 * Command for updating a Financial Payment Provider's details.
 *
 * The aggregate remains responsible for enforcing domain invariants.
 */
export class UpdateFinancialPaymentProviderCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly name: FinancialPaymentProviderName,
    public readonly changedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
