import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  FinancialPaymentProviderCode,
  FinancialPaymentProviderName,
  FinancialPaymentProviderType,
  FinancialPaymentProviderEnvironment,
  FinancialPaymentProviderConfigurationReference,
  FinancialPaymentProviderCapabilityType,
} from '../../domain/value-objects';

export interface CreateFinancialPaymentProviderCapabilityInput {
  type: FinancialPaymentProviderCapabilityType;
  isSupported: boolean;
}

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
    public readonly capabilities: readonly CreateFinancialPaymentProviderCapabilityInput[] = [],
  ) {}
}
