// -----------------------------------------------------------------------------
// Financial Account Hold — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for cancelling an existing
// Financial Account Hold.
//
// Responsibilities:
//
// - Resolve the Financial Account Hold aggregate.
// - Validate that the hold exists.
// - Delegate the ACTIVE -> CANCELLED lifecycle transition to the aggregate.
// - Record the Financial RELEASE transaction reference through the aggregate.
// - Persist the updated aggregate.
//
// Important:
//
// Cancellation is a business invalidation of the hold.
//
// Because a cancelled hold must no longer reserve funds, the cancellation
// requires a Financial RELEASE transaction.
//
// The RELEASE transaction is a separate Financial aggregate.
//
// This handler does NOT:
//
// - Create the RELEASE transaction.
// - Execute the RELEASE transaction.
// - Modify Financial Account balances directly.
// - Move money.
// - Communicate with payment providers.
// - Mutate the Financial Account aggregate.
// - Coordinate other Financial Account Holds.
//
// The appropriate financial workflow is responsible for ensuring that the
// RELEASE transaction has been created/executed consistently with the hold
// cancellation lifecycle.
//
// Lifecycle:
//
//     ACTIVE -> CANCELLED
//
// CANCELLED is a terminal Financial Account Hold state.
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

import type { CancelFinancialAccountHoldCommand } from '../commands/cancel-financial-account-hold.command';

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
 * Cancels an existing Financial Account Hold.
 *
 * Lifecycle:
 *
 *     ACTIVE -> CANCELLED
 *
 * Cancellation represents business invalidation of the hold.
 *
 * The Financial Account Hold aggregate owns the lifecycle invariant.
 *
 * The handler is responsible for:
 *
 * 1. Resolving the hold.
 * 2. Ensuring the hold exists.
 * 3. Delegating cancellation to the aggregate.
 * 4. Persisting the updated aggregate.
 *
 * The cancellation operation also records the RELEASE transaction that
 * resolves the reserved funds.
 *
 * Multiple Financial Account Holds may exist for the same Financial Account.
 *
 * Therefore the handler operates exclusively on the supplied hold public ID
 * and does not attempt to coordinate or mutate other holds.
 */
@Injectable()
export class CancelFinancialAccountHoldHandler implements CommandHandler<
  CancelFinancialAccountHoldCommand,
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
    command: CancelFinancialAccountHoldCommand,
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
    // 3. Delegate cancellation to aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate delegates the complete cancellation invariant to the
    // FinancialAccountHoldEntity.
    //
    // The entity validates:
    //
    // - hold is ACTIVE;
    // - RELEASE transaction public ID is valid;
    // - no RELEASE transaction has already been recorded.
    //
    // The entity then:
    //
    // - transitions ACTIVE -> CANCELLED;
    // - records the RELEASE transaction public ID;
    // - records cancelledAt.
    //
    // The aggregate then:
    //
    // - verifies that the RELEASE transaction reference was recorded;
    // - emits FinancialAccountHoldCancelledEvent.
    //
    // This handler does not perform those state mutations itself.
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.releaseTransactionPublicId,
      command.cancelledAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence occurs only after the aggregate successfully completes the
    // cancellation lifecycle transition.
    //
    // If the aggregate throws because the hold is:
    //
    // - already RELEASED;
    // - already CAPTURED;
    // - already CANCELLED;
    // - associated with another RELEASE transaction;
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

export default CancelFinancialAccountHoldHandler;
