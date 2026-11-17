// -----------------------------------------------------------------------------
// Financial Payment — Process Command
// -----------------------------------------------------------------------------
//
// Application command requesting the processing of a Financial Payment.
//
// This is the common payment-processing command for supported payment
// channels, including:
//
// 1. STK_PUSH — Customer-initiated payment request through M-PESA STK Push.
// 2. C2B      — Customer-initiated payment through M-PESA PayBill or Till.
//
// The command represents the application intent to begin or continue
// processing a Financial Payment.
//
// Channel-specific application and integration workflows determine how
// processing is performed.
//
// STK_PUSH:
// - Initiates the provider-processing workflow.
// - Provider execution is handled by the appropriate integration workflow.
//
// C2B:
// - Processing is driven by the incoming provider confirmation callback.
// - Callback validation, account resolution, payment matching and confirmation
//   are handled by the dedicated C2B application workflow.
// - No STK Push request is initiated.
//
// Responsibilities:
//
// - Identify the Financial Payment to process.
// - Carry correlation and causation metadata.
// - Request the Financial Payment aggregate to transition into PROCESSING
//   when required by its channel-specific workflow.
//
// This command does NOT:
//
// - Execute provider APIs.
// - Communicate directly with payment providers.
// - Validate provider callback payloads.
// - Resolve Financial Accounts.
// - Perform C2B payment matching or reconciliation.
// - Create Financial Payment Attempts.
// - Confirm externally completed payments.
// - Move funds.
// - Create Financial Transactions.
// - Modify Financial Account balances.
// - Perform settlement.
// - Perform accounting.
//
// Those responsibilities belong to the appropriate application,
// integration, transaction, settlement, and accounting boundaries.
//
// Both payment channels ultimately use the same Financial Payment aggregate,
// FinancialPaymentSucceededEvent and successful-payment posting workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Foundation Value Objects
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Common command for requesting Financial Payment processing.
 *
 * The command identifies the Financial Payment aggregate that should be
 * processed.
 *
 * The actual lifecycle transition is enforced by the
 * FinancialPaymentAggregate.
 *
 * Channel-specific workflows determine the processing behaviour.
 *
 * Required inputs:
 *
 * - paymentPublicId
 * - correlationId
 *
 * Optional input:
 *
 * - causationId
 */
export class ProcessFinancialPaymentCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment to process.
     *
     * This is the externally meaningful identity of the payment aggregate.
     */
    public readonly paymentPublicId: PublicEntityId,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialPaymentCommand;
