// -----------------------------------------------------------------------------
// Financial Payment Method — Deactivate Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for deactivating an existing
// Financial Payment Method aggregate.
//
// Aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// Responsibilities:
//
// 1. Load the Financial Payment Method aggregate.
// 2. Ensure the aggregate exists.
// 3. Deactivate the Financial Payment Method through the aggregate.
// 4. Persist the updated aggregate.
// 5. Return the updated aggregate.
//
// The handler does NOT:
//
// - execute provider APIs;
// - communicate with external payment providers;
// - execute Financial Payments;
// - create Financial Transactions;
// - modify Financial Account balances;
// - move money;
// - perform settlement;
// - perform accounting.
//
// The Financial Payment Method aggregate owns the deactivation lifecycle
// transition and its invariants.
//
// In particular, deactivation may remove the default designation from the
// payment method. That state transition is owned by the aggregate/entity.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { DeactivateFinancialPaymentMethodCommand } from '../commands/deactivate-financial-payment-method.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodException } from '../../domain/exceptions/financial-payment-method.exception';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles DeactivateFinancialPaymentMethodCommand.
 *
 * Application orchestration:
 *
 * 1. Load the Financial Payment Method aggregate.
 * 2. Ensure the aggregate exists.
 * 3. Deactivate the payment method through the aggregate.
 * 4. Persist the updated aggregate.
 * 5. Return the updated aggregate.
 *
 * The aggregate owns the lifecycle transition and emits the appropriate
 * FinancialPaymentMethodDeactivatedEvent.
 */
@Injectable()
export class DeactivateFinancialPaymentMethodHandler implements CommandHandler<
  DeactivateFinancialPaymentMethodCommand,
  FinancialPaymentMethodAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentMethodRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: DeactivateFinancialPaymentMethodCommand,
  ): Promise<FinancialPaymentMethodAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Financial Payment Method aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating the complete aggregate:
    //
    // FinancialPaymentMethodAggregate
    // └── FinancialPaymentMethodEntity
    //
    // The handler intentionally works with the aggregate root.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.paymentMethodPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialPaymentMethodException(
        `Financial Payment Method "${command.paymentMethodPublicId.value}" was not found`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Deactivate Financial Payment Method
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the deactivation lifecycle transition.
    //
    // The aggregate:
    //
    // - verifies that the payment method is currently active;
    // - captures whether it was previously the default;
    // - deactivates the entity;
    // - removes the default designation when necessary;
    // - updates the lifecycle timestamp;
    // - emits FinancialPaymentMethodDeactivatedEvent.
    //
    // Provider-side deactivation is intentionally outside this aggregate.
    // -------------------------------------------------------------------------

    aggregate.deactivate(
      new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist updated aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Financial Payment Method
    // aggregate.
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

export default DeactivateFinancialPaymentMethodHandler;
