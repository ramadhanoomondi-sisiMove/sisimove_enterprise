import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialAccountWithdrawalPublicId } from '../../domain/value-objects';

/**
 * Command for processing an existing Financial Account Withdrawal.
 *
 * Requests the lifecycle transition:
 *
 *     PENDING -> PROCESSING
 *
 * The aggregate owns lifecycle validation and state mutation.
 * External disbursement execution belongs to the Financial Disbursement
 * workflow.
 */
export class ProcessFinancialAccountWithdrawalCommand implements Command {
  public constructor(
    /** Public identity of the withdrawal to process. */
    public readonly withdrawalId: FinancialAccountWithdrawalPublicId,

    /** Correlation identifier for tracing and domain events. */
    public readonly correlationId: string,

    /** Optional identifier of the operation that caused this command. */
    public readonly causationId?: string,
  ) {}
}

export default ProcessFinancialAccountWithdrawalCommand;
