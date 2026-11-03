
import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentMethodPublicId } from '../../domain/value-objects/financial-payment-method-public-id.vo';

import type { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';

/**
 * Command for deactivating an owned Financial Payment Method.
 *
 * The account identity is resolved from the authenticated member
 * at the HTTP boundary. It is never trusted from client input.
 */
export class DeactivateFinancialPaymentMethodCommand implements Command {
  constructor(
    public readonly paymentMethodPublicId: FinancialPaymentMethodPublicId,

    public readonly accountPublicId: FinancialAccountPublicId,

    public readonly correlationId: string,

    public readonly causationId?: string,

    public readonly deactivatedAt?: Date,
  ) {}
}

export default DeactivateFinancialPaymentMethodCommand;
