// -----------------------------------------------------------------------------
// Financial Disbursement — Complete Command
// -----------------------------------------------------------------------------
//
// Application command for completing and financially posting a successful
// Financial Disbursement.
//
// The command identifies the Financial Disbursement aggregate whose successful
// provider execution should trigger financial posting and final completion.
//
// The application handler is responsible for:
//
// - loading the Financial Disbursement aggregate;
// - validating its successful provider attempt;
// - creating and posting the Financial Transaction;
// - applying the appropriate Financial Account balance movements;
// - creating and posting the Accounting Journal;
// - linking the Financial Transaction to the disbursement;
// - completing the Financial Disbursement aggregate;
// - persisting all changes atomically.
//
// The command does NOT:
//
// - execute a payment provider;
// - communicate with an external provider;
// - create another execution attempt;
// - independently supply financial amounts or account details;
// - perform financial posting itself;
// - persist itself.
//
// Provider confirmation belongs to the Financial Disbursement domain.
// Financial posting and final completion belong to the application handler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialDisbursementPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class CompleteFinancialDisbursementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Disbursement to post and complete.
     */
    public readonly disbursementPublicId: FinancialDisbursementPublicId,

    /**
     * Correlation identifier for the posting command and resulting
     * domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the event or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
