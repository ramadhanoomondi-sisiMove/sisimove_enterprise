import { FinancialAccountWithdrawalException } from './financial-account-withdrawal.exception';

/**
 * Thrown when a withdrawal request conflicts with an existing
 * account-scoped idempotency key.
 */
export class FinancialAccountWithdrawalIdempotencyConflictException extends FinancialAccountWithdrawalException {
  public constructor(
    message: string = 'A withdrawal request already exists for this account and idempotency key.',
  ) {
    super(message);
  }
}
