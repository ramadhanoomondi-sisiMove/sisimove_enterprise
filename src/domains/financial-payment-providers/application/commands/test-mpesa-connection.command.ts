import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';

export class TestMpesaConnectionCommand implements Command {
  constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
  ) {}
}

export default TestMpesaConnectionCommand;
