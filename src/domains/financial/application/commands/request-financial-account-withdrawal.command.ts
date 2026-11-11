import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  FinancialAccountPublicId,
  FinancialAccountWithdrawalDestination,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../domain/value-objects';

/**
 * Command for requesting a Financial Account Withdrawal.
 *
 * Carries the information required by the request handler.
 *
 * Idempotency is scoped to the source Financial Account
 * and remains separate from correlation and causation metadata.
 */
export class RequestFinancialAccountWithdrawalCommand implements Command {
  public constructor(
    /** Public identity of the source Financial Account. */
    public readonly accountId: FinancialAccountPublicId,

    /** Requested withdrawal amount and currency. */
    public readonly amount: Money,

    /** Immutable external withdrawal destination snapshot. */
    public readonly destination: FinancialAccountWithdrawalDestination,

    /** Correlation identifier for the command and resulting domain events. */
    public readonly correlationId: string,

    /** Optional originating business reference type. */
    public readonly referenceType?: FinancialReferenceType,

    /** Optional originating business reference public ID. */
    public readonly referencePublicId?: FinancialReferencePublicId,

    /** Optional identifier of the operation that caused this command. */
    public readonly causationId?: string,

    /**
     * Idempotency key for this withdrawal request.
     *
     * Required for new requests by the request handler.
     * Scoped to accountId.
     *
     * Optional here to preserve compatibility with internal callers.
     */
    public readonly idempotencyKey?: string,
  ) {}
}

export default RequestFinancialAccountWithdrawalCommand;
