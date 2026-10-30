import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects';

/**
 * Command for enabling a Financial Payment Provider.
 *
 * Readiness and lifecycle rules are enforced by the aggregate.
 */
export class EnableFinancialPaymentProviderCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly enabledAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
