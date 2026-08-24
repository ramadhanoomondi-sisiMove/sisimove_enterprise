// -----------------------------------------------------------------------------
// Financial Payment Method — Set Default Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for setting an existing Financial
// Payment Method as the default payment method for its owning Financial
// Account.
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
// 3. Ensure the payment method belongs to the expected Financial Account.
// 4. Resolve the current default payment method for the account.
// 5. Clear the previous default through its aggregate behavior.
// 6. Mark the requested payment method as default through its aggregate
//    behavior.
// 7. Persist the affected aggregate(s).
// 8. Return the updated Financial Payment Method aggregate.
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
// The Financial Payment Method aggregate owns payment-method lifecycle
// invariants.
//
// The application boundary coordinates the cross-aggregate invariant:
//
//     one Financial Account -> at most one default Financial Payment Method
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

import type { SetDefaultFinancialPaymentMethodCommand } from '../commands/set-default-financial-payment-method.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodException } from '../../domain/exceptions/financial-payment-method.exception';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles SetDefaultFinancialPaymentMethodCommand.
 *
 * Application orchestration:
 *
 * 1. Load the requested Financial Payment Method aggregate.
 * 2. Ensure the aggregate exists.
 * 3. Resolve the owning account through the aggregate.
 * 4. Resolve the current default payment method for that account.
 * 5. Clear the previous default when necessary.
 * 6. Mark the requested payment method as default.
 * 7. Persist the affected aggregate(s).
 * 8. Return the updated aggregate.
 *
 * The handler intentionally coordinates the account-level invariant rather
 * than placing sibling aggregate coordination inside
 * FinancialPaymentMethodAggregate.
 */
@Injectable()
export class SetDefaultFinancialPaymentMethodHandler implements CommandHandler<
  SetDefaultFinancialPaymentMethodCommand,
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
    command: SetDefaultFinancialPaymentMethodCommand,
  ): Promise<FinancialPaymentMethodAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load requested Financial Payment Method aggregate
    // -------------------------------------------------------------------------
    //
    // The repository rehydrates the complete aggregate:
    //
    // FinancialPaymentMethodAggregate
    // └── FinancialPaymentMethodEntity
    //
    // The handler intentionally works through the aggregate root.
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
    // 3. Resolve current default payment method
    // -------------------------------------------------------------------------
    //
    // The owning Financial Account is represented by an opaque public
    // reference on the Financial Payment Method aggregate.
    //
    // The Financial Account aggregate itself is not embedded or loaded here.
    // -------------------------------------------------------------------------

    const existingDefault = await this.repository.findDefaultByAccountPublicId(
      aggregate.accountId,
    );

    // -------------------------------------------------------------------------
    // 4. Idempotency
    // -------------------------------------------------------------------------
    //
    // If this payment method is already the default, there is nothing to
    // change.
    //
    // Returning the aggregate without invoking default() avoids emitting a
    // duplicate FinancialPaymentMethodDefaultedEvent.
    // -------------------------------------------------------------------------

    if (aggregate.isDefaultMethod()) {
      return aggregate;
    }

    // -------------------------------------------------------------------------
    // 5. Clear previous default
    // -------------------------------------------------------------------------
    //
    // The single-default invariant spans multiple aggregates.
    //
    // The previous default is therefore cleared through its own aggregate
    // boundary.
    //
    // The aggregate exposes clearDefault() specifically for this coordination
    // operation.
    // -------------------------------------------------------------------------

    if (existingDefault !== null) {
      // -----------------------------------------------------------------------
      // Defensive consistency check
      // -----------------------------------------------------------------------
      //
      // The repository lookup is account-scoped, so the existing default
      // should belong to the same account.
      //
      // Keep this guard here because violating this relationship indicates a
      // persistence consistency problem rather than a normal domain state.
      // -----------------------------------------------------------------------

      if (existingDefault.accountId.value !== aggregate.accountId.value) {
        throw new FinancialPaymentMethodException(
          'Financial Payment Method default lookup returned a payment method belonging to a different Financial Account',
        );
      }

      existingDefault.clearDefault();

      await this.repository.save(existingDefault);
    }

    // -------------------------------------------------------------------------
    // 6. Set requested payment method as default
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - active-state validation;
    // - default-state mutation;
    // - FinancialPaymentMethodDefaultedEvent creation.
    //
    // The handler supplies correlation/causation metadata for the resulting
    // domain event.
    // -------------------------------------------------------------------------

    aggregate.default(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 7. Persist requested payment method
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 8. Return updated aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SetDefaultFinancialPaymentMethodHandler;
