import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  FinancialPaymentProviderPublicId,
  FinancialPaymentProviderStatus,
} from '../../domain/value-objects';

/**
 * Command for changing a provider's integration status.
 *
 * Allowed status transitions remain the responsibility of the aggregate.
 */
export class ChangeFinancialPaymentProviderStatusCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly status: FinancialPaymentProviderStatus,
    public readonly changedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
