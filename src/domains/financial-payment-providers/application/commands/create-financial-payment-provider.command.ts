import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  FinancialPaymentProviderCode,
  FinancialPaymentProviderName,
  FinancialPaymentProviderType,
  FinancialPaymentProviderEnvironment,
  FinancialPaymentProviderConfigurationReference,
} from '../../domain/value-objects';

/**
 * Command for creating a Financial Payment Provider aggregate.
 *
 * The handler creates the aggregate, persists it, and dispatches its
 * resulting domain events.
 */
export class CreateFinancialPaymentProviderCommand implements Command {
  constructor(
    public readonly code: FinancialPaymentProviderCode,
    public readonly name: FinancialPaymentProviderName,
    public readonly type: FinancialPaymentProviderType,
    public readonly environment: FinancialPaymentProviderEnvironment,
    public readonly createdAt: Date,
    public readonly correlationId: string,
    public readonly description?: string,
    public readonly configurationReference?: FinancialPaymentProviderConfigurationReference,
    public readonly causationId?: string,
  ) {}
}
