import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  FinancialPaymentProviderPublicId,
  FinancialPaymentProviderCapabilityType,
} from '../../domain/value-objects';

/**
 * Command for enabling a supported capability on a provider.
 *
 * The aggregate verifies that the capability is supported before enabling it.
 */
export class EnableFinancialPaymentProviderCapabilityCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly capabilityType: FinancialPaymentProviderCapabilityType,
    public readonly enabledAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
