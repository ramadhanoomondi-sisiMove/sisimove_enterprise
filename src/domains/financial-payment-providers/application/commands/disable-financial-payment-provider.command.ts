import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects';

/**
 * Command for disabling a Financial Payment Provider.
 */
export class DisableFinancialPaymentProviderCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly disabledAt: Date,
    public readonly correlationId: string,
    public readonly reason?: string,
    public readonly causationId?: string,
  ) {}
}
