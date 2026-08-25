// -----------------------------------------------------------------------------
// Financial Account Hold — Capture Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for capturing an existing
// Financial Account Hold.
//
// Responsibilities:
//
// - Resolve the Financial Account Hold aggregate.
// - Validate that the hold exists.
// - Delegate the ACTIVE -> CAPTURED lifecycle transition to the aggregate.
// - Record the CAPTURE transaction reference through the aggregate lifecycle.
// - Persist the updated aggregate.
//
// Important:
//
// The associated Financial CAPTURE transaction is a separate aggregate.
//
// This handler does NOT:
//
// - Create the CAPTURE transaction.
// - Execute the CAPTURE transaction.
// - Modify Financial Account balances directly.
// - Move money.
// - Communicate with payment providers.
// - Mutate the Financial Account aggregate.
//
// The appropriate financial workflow is responsible for ensuring that the
// CAPTURE transaction has been created/executed consistently with the hold
// lifecycle.
//
// Lifecycle:
//
//     ACTIVE -> CAPTURED
//
// CAPTURED is a terminal Financial Account Hold state.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../financial-account-hold.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CaptureFinancialAccountHoldCommand } from '../commands/capture-financial-account-hold.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountHoldAggregate } from '../../domain/aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldRepository } from '../../domain/repositories/financial-account-hold.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountHoldException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Captures an existing Financial Account Hold.
 *
 * Lifecycle:
 *
 *     ACTIVE -> CAPTURED
 *
 * The Financial Account Hold aggregate owns the lifecycle invariant.
 *
 * The handler is responsible for:
 *
 * 1. Resolving the hold.
 * 2. Ensuring the hold exists.
 * 3. Delegating capture to the aggregate.
 * 4. Persisting the updated aggregate.
 *
 * Multiple Financial Account Holds may exist for the same Financial Account.
 *
 * Therefore the handler operates exclusively on the supplied hold public ID
 * and does not attempt to coordinate or mutate other holds.
 */
@Injectable()
export class CaptureFinancialAccountHoldHandler implements CommandHandler<
  CaptureFinancialAccountHoldCommand,
  FinancialAccountHoldAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountHoldRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CaptureFinancialAccountHoldCommand,
  ): Promise<FinancialAccountHoldAggregate> {
    // -------------------------------------------------------------------------
    // 1. Resolve Financial Account Hold
    // -------------------------------------------------------------------------
    //
    // The command carries the opaque public identity of the hold.
    //
    // The repository resolves the complete aggregate, including:
    //
    // - owning Financial Account reference;
    // - held amount;
    // - currency;
    // - lifecycle status;
    // - expiry;
    // - transaction references;
    // - lifecycle timestamps.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(command.publicId);

    // -------------------------------------------------------------------------
    // 2. Ensure Financial Account Hold exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialAccountHoldException(
        `Financial Account Hold "${command.publicId.value}" was not found`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Delegate lifecycle transition to aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate delegates the actual invariant enforcement to the entity.
    //
    // The entity validates:
    //
    // - hold is ACTIVE;
    // - hold has not expired;
    // - CAPTURE transaction public ID is valid;
    // - CAPTURE transaction has not already been recorded.
    //
    // The aggregate then:
    //
    // - transitions ACTIVE -> CAPTURED;
    // - records the CAPTURE transaction reference;
    // - emits FinancialAccountHoldCapturedEvent.
    //
    // This handler does not perform those state mutations itself.
    // -------------------------------------------------------------------------

    aggregate.capture(
      command.captureTransactionPublicId,
      command.capturedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence occurs only after the aggregate successfully completes the
    // lifecycle transition.
    //
    // If the aggregate throws because the hold is:
    //
    // - already RELEASED;
    // - already CAPTURED;
    // - CANCELLED;
    // - expired;
    // - associated with another CAPTURE transaction;
    //
    // the repository is not called.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return updated aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CaptureFinancialAccountHoldHandler;
