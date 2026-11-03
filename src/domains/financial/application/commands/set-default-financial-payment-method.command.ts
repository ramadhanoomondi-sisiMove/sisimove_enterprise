import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentMethodPublicId } from '../../domain/value-objects/financial-payment-method-public-id.vo';

import type { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';

export class SetDefaultFinancialPaymentMethodCommand implements Command {
  constructor(
    public readonly paymentMethodPublicId: FinancialPaymentMethodPublicId,
    public readonly accountPublicId: FinancialAccountPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly defaultedAt?: Date,
  ) {}
}
