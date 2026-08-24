// -----------------------------------------------------------------------------
// Financial Payment Method — Add Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for adding a new Financial Payment
// Method aggregate.
//
// Aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// Responsibilities:
//
// 1. Resolve the owning Financial Account.
// 2. Ensure the Financial Account exists.
// 3. Validate provider-reference uniqueness.
// 4. Coordinate the account-level single-default-method invariant.
// 5. Create the Financial Payment Method entity.
// 6. Create the Financial Payment Method aggregate.
// 7. Record the FinancialPaymentMethodAddedEvent.
// 8. Persist the new aggregate.
// 9. Return the created aggregate.
//
// The handler does NOT:
//
// - execute provider APIs;
// - communicate with external payment providers;
// - store raw payment credentials;
// - execute Financial Payments;
// - modify Financial Account balances;
// - create Financial Transactions;
// - post Financial Transactions;
// - perform settlement;
// - perform accounting.
//
// Domain invariants belonging to the Financial Payment Method aggregate/entity
// remain inside the domain.
//
// The application boundary coordinates invariants spanning multiple
// Financial Payment Method aggregates, including:
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

import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AddFinancialPaymentMethodCommand } from '../commands/add-financial-payment-method.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodEntity } from '../../domain/entities/financial-payment-method.entity';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodException } from '../../domain/exceptions/financial-payment-method.exception';

// -----------------------------------------------------------------------------
// Repository — Financial Payment Method
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Repository — Financial Account
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles AddFinancialPaymentMethodCommand.
 *
 * Application orchestration:
 *
 * 1. Load the owning Financial Account.
 * 2. Ensure the account exists.
 * 3. Validate provider-reference uniqueness when supplied.
 * 4. If the new method is default, clear the existing account default.
 * 5. Create the Financial Payment Method entity.
 * 6. Create the Financial Payment Method aggregate.
 * 7. Record the creation domain event.
 * 8. Persist the new aggregate.
 *
 * The handler returns the created aggregate.
 *
 * Cross-aggregate coordination:
 *
 * The Financial Payment Method aggregate cannot coordinate sibling payment
 * methods. Therefore this handler coordinates the Financial Account-level
 * invariant:
 *
 *     one Financial Account -> at most one default Financial Payment Method
 *
 * The existing default payment method is mutated through aggregate behavior,
 * never by directly modifying its entity from this application handler.
 */
@Injectable()
export class AddFinancialPaymentMethodHandler implements CommandHandler<
  AddFinancialPaymentMethodCommand,
  FinancialPaymentMethodAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly financialAccountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly financialPaymentMethodRepository: FinancialPaymentMethodRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: AddFinancialPaymentMethodCommand,
  ): Promise<FinancialPaymentMethodAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load owning Financial Account
    // -------------------------------------------------------------------------
    //
    // The Financial Payment Method belongs to a Financial Account.
    //
    // The command carries only the account public identity. The account
    // repository resolves the owning aggregate.
    // -------------------------------------------------------------------------

    const account = await this.financialAccountRepository.findByPublicId(
      command.accountId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure Financial Account exists
    // -------------------------------------------------------------------------

    if (account === null) {
      throw new FinancialPaymentMethodException(
        `Financial Account "${command.accountId.value}" was not found`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Validate provider-reference uniqueness
    // -------------------------------------------------------------------------
    //
    // Provider references are opaque external identifiers.
    //
    // When supplied, the reference must not already be registered for the
    // same provider.
    //
    // No provider API is contacted here.
    // -------------------------------------------------------------------------

    if (command.providerReference !== undefined) {
      const existing =
        await this.financialPaymentMethodRepository.findByProviderAndProviderReference(
          command.provider,
          command.providerReference,
        );

      if (existing !== null) {
        throw new FinancialPaymentMethodException(
          `Financial Payment Method with provider reference "${command.providerReference.value}" already exists`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 4. Coordinate account-level default invariant
    // -------------------------------------------------------------------------
    //
    // The Financial Payment Method aggregate cannot coordinate sibling
    // aggregates.
    //
    // Therefore the application boundary coordinates:
    //
    //     one account -> at most one default payment method
    //
    // If the new method is requested as default, locate the existing default
    // payment method and remove its default designation through its aggregate
    // behavior.
    //
    // IMPORTANT:
    //
    // Do NOT call:
    //
    //     existingDefault.paymentMethod.clearDefault()
    //
    // because that bypasses the aggregate boundary.
    //
    // The aggregate owns mutation of its entity.
    // -------------------------------------------------------------------------

    if (command.isDefault === true) {
      const existingDefault =
        await this.financialPaymentMethodRepository.findDefaultByAccountPublicId(
          command.accountId,
        );

      if (existingDefault !== null) {
        existingDefault.clearDefault();

        await this.financialPaymentMethodRepository.save(existingDefault);
      }
    }

    // -------------------------------------------------------------------------
    // 5. Create Financial Payment Method Entity
    // -------------------------------------------------------------------------
    //
    // The entity requires:
    //
    // - Financial Account internal identity;
    // - Financial Account public identity;
    // - payment-method type;
    // - provider;
    // - optional provider reference;
    // - optional display metadata;
    // - default designation.
    //
    // The entity determines the initial active lifecycle state.
    // -------------------------------------------------------------------------

    const paymentMethod = FinancialPaymentMethodEntity.create(
      account.id,
      account.publicId,
      command.type,
      command.provider,
      command.providerReference,
      command.displayName,
      command.lastFour,
      command.isDefault ?? false,
    );

    // -------------------------------------------------------------------------
    // 6. Create Financial Payment Method Aggregate
    // -------------------------------------------------------------------------

    const aggregate = FinancialPaymentMethodAggregate.create(paymentMethod);

    // -------------------------------------------------------------------------
    // 7. Record creation domain event
    // -------------------------------------------------------------------------
    //
    // Aggregate creation intentionally does not emit the Added event.
    //
    // The application boundary records the event after the aggregate has
    // been successfully constructed.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 8. Persist Financial Payment Method aggregate
    // -------------------------------------------------------------------------

    await this.financialPaymentMethodRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 9. Return created aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AddFinancialPaymentMethodHandler;
