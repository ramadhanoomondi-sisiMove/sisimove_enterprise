// -----------------------------------------------------------------------------
// Financial Disbursement — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating a Financial Disbursement aggregate.
//
// Workflow:
//
// 1. Resolve the source Financial Account.
// 2. Ensure the account is operational.
// 3. Ensure the disbursement currency matches the account currency.
// 4. Resolve the selected Financial Disbursement Destination.
// 5. Ensure the destination belongs to the source Financial Account.
// 6. Create the Financial Disbursement entity.
// 7. Create the Financial Disbursement aggregate.
// 8. Record the Financial Disbursement Created event.
// 9. Persist the aggregate.
//
// Destination handling:
//
// The command contains the public identity of the selected destination.
//
// FinancialDisbursementDestinationEntity is an independently persisted
// Financial-domain entity associated with the source Financial Account.
//
// It is NOT an owned child of the FinancialDisbursementAggregate.
//
// The existing FinancialDisbursementRepository provides destination lookup
// required by the application workflow.
//
// This handler does NOT:
//
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Create a Financial Disbursement Attempt.
// - Execute an external provider.
// - Move money externally.
// - Perform settlement.
// - Perform accounting.
//
// Those responsibilities belong to their respective aggregates,
// application workflows, and integration boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateFinancialDisbursementCommand } from '../commands/create-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

import { FinancialDisbursementEntity } from '../../domain/entities/financial-disbursement.entity';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import {
  FinancialAccountNotFoundException,
  FinancialInvariantException,
} from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateFinancialDisbursementHandler implements CommandHandler<
  CreateFinancialDisbursementCommand,
  FinancialDisbursementAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CreateFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    // -------------------------------------------------------------------------
    // Resolve Financial Account
    // -------------------------------------------------------------------------

    const account = await this.accountRepository.findByPublicId(
      command.sourceAccountPublicId,
    );

    if (account === null) {
      throw new FinancialAccountNotFoundException(
        command.sourceAccountPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Validate Account
    // -------------------------------------------------------------------------
    //
    // A disbursement may only originate from an operational Financial Account.
    //
    // The Financial Account aggregate owns the definition of operational
    // state.
    // -------------------------------------------------------------------------

    account.ensureOperational();

    // -------------------------------------------------------------------------
    // Validate Currency
    // -------------------------------------------------------------------------
    //
    // The disbursement amount must use the same currency as the source
    // Financial Account.
    //
    // The Financial Account aggregate owns this currency invariant.
    // -------------------------------------------------------------------------

    account.ensureCurrency(command.amount.currency);

    // -------------------------------------------------------------------------
    // Resolve Financial Disbursement Destination
    // -------------------------------------------------------------------------
    //
    // The destination is independently persisted and is not owned by the
    // Financial Disbursement aggregate.
    //
    // The application workflow resolves the destination before aggregate
    // construction.
    // -------------------------------------------------------------------------

    const destination =
      await this.disbursementRepository.findDestinationByPublicId(
        command.destinationPublicId,
      );

    if (destination === null) {
      throw new FinancialInvariantException(
        `Financial Disbursement Destination "${command.destinationPublicId.value}" was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Validate Destination Ownership
    // -------------------------------------------------------------------------
    //
    // The destination must belong to the source Financial Account.
    //
    // This invariant is also enforced by FinancialDisbursementAggregate.create()
    // through its aggregate consistency checks.
    // -------------------------------------------------------------------------

    if (!destination.accountId.equals(account.id)) {
      throw new FinancialInvariantException(
        `Financial Disbursement Destination "${command.destinationPublicId.value}" does not belong to Financial Account "${command.sourceAccountPublicId.value}".`,
      );
    }

    // -------------------------------------------------------------------------
    // Create Financial Disbursement Entity
    // -------------------------------------------------------------------------
    //
    // The entity owns:
    //
    // - internal identity;
    // - public identity;
    // - source account identity;
    // - destination identity;
    // - amount;
    // - lifecycle state;
    // - optional business reference;
    // - lifecycle timestamps.
    //
    // Execution attempts are intentionally NOT created here.
    // -------------------------------------------------------------------------

    const disbursementEntity = FinancialDisbursementEntity.create(
      account.id,
      account.publicId,
      destination.id,
      command.amount,
      command.referenceType,
      command.referencePublicId,
    );

    // -------------------------------------------------------------------------
    // Create Financial Disbursement Aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the disbursement lifecycle and associates the
    // selected destination.
    // -------------------------------------------------------------------------

    const aggregate = FinancialDisbursementAggregate.create(
      disbursementEntity,
      destination,
    );

    // -------------------------------------------------------------------------
    // Record Created Event
    // -------------------------------------------------------------------------
    //
    // Creation itself does not implicitly emit the event.
    //
    // The handler supplies application-level correlation and causation
    // metadata.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persisting the disbursement does not:
    //
    // - modify the Financial Account balance;
    // - create a Financial Transaction;
    // - create an execution attempt;
    // - execute an external provider.
    // -------------------------------------------------------------------------

    await this.disbursementRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialDisbursementHandler;
