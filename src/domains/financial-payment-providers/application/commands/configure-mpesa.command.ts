import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';

export class ConfigureMpesaCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly environment: FinancialPaymentProviderEnvironment,
    public readonly consumerKey: string,
    public readonly consumerSecret: string,
    public readonly shortcode: string,
    public readonly passkey: string,
    public readonly createdAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}

export default ConfigureMpesaCommand;
