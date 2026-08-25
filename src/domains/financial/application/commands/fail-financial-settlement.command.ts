// -----------------------------------------------------------------------------
// Financial Settlement — Fail Command
// -----------------------------------------------------------------------------
//
// Application command for failing a Financial Settlement aggregate.
//
// The command represents the intent to transition an existing Financial
// Settlement aggregate into the FAILED lifecycle state.
//
// A Financial Settlement may fail from any non-terminal state:
//
//     PENDING    → FAILED
//     PROCESSING → FAILED
//
// The FinancialSettlementAggregate remains responsible for validating the
// lifecycle transition and applying the failure timestamp.
//
// The failure reason is an operational/domain explanation of why settlement
// processing could not successfully continue.
//
// Sensitive provider information must NOT be placed in the failure reason,
// including:
//
// - provider credentials;
// - access tokens;
// - API secrets;
// - authentication material;
// - private provider payloads;
// - other sensitive financial-provider data.
//
// This command does NOT:
//
// - Reverse previously executed Financial Transactions.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
//
// Any required reversal or compensating financial movement belongs to the
// Financial Transaction lifecycle and appropriate application orchestration.
//
// Correlation and causation identifiers are carried for application-level
// tracing and domain-event correlation.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle transitions:
//
//     PENDING    → FAILED
//     PROCESSING → FAILED
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialSettlementPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for failing a Financial Settlement.
 *
 * The command identifies the Settlement through its public identity and
 * provides the reason for the lifecycle failure.
 *
 * The target lifecycle status is intentionally NOT supplied by the command.
 * The FinancialSettlementAggregate owns the transition:
 *
 *     PENDING    → FAILED
 *     PROCESSING → FAILED
 *
 * The aggregate is also responsible for validating that the Settlement is
 * not already in a terminal state.
 */
export class FailFinancialSettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Settlement to fail.
     */
    public readonly settlementPublicId: FinancialSettlementPublicId,

    /**
     * Human-readable reason explaining why the Financial Settlement failed.
     *
     * Sensitive provider credentials, secrets, tokens, or private provider
     * payloads must never be supplied here.
     */
    public readonly reason: string,

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
