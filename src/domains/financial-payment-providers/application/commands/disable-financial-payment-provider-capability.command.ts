import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  FinancialPaymentProviderPublicId,
  FinancialPaymentProviderCapabilityType,
} from '../../domain/value-objects';

/**
 * Command for disabling a capability on a provider.
 */
export class DisableFinancialPaymentProviderCapabilityCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly capabilityType: FinancialPaymentProviderCapabilityType,
    public readonly disabledAt: Date,
    public readonly correlationId: string,
    public readonly reason?: string,
    public readonly causationId?: string,
  ) {}
}
