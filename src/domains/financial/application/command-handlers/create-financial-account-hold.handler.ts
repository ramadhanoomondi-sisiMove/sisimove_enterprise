// -----------------------------------------------------------------------------
// Financial Account Hold — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a new
// Financial Account Hold aggregate.
//
// Responsibilities:
//
// - Resolve the owning Financial Account.
// - Create the FinancialAccountHoldEntity.
// - Create the FinancialAccountHoldAggregate.
// - Record the creation domain event.
// - Persist the aggregate.
//
// Important:
//
// Multiple ACTIVE Financial Account Holds may exist for the same
// Financial Account.
//
// Example:
//
// Financial Account
// └── ACTIVE Hold #1 — Booking A
// └── ACTIVE Hold #2 — Booking B
// └── ACTIVE Hold #3 — Booking C
//
// Therefore this handler MUST NOT enforce:
//
//     "only one ACTIVE hold per account"
//
// Each hold is an independent aggregate.
//
// This handler does NOT:
//
// - Modify Financial Account balances.
// - Create or execute a HOLD transaction.
// - Move money.
// - Communicate with payment providers.
// - Coordinate other Financial Account Holds.
//
// The associated HOLD transaction and balance mutation belong to the
// appropriate financial workflow.
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

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateFinancialAccountHoldCommand } from '../commands/create-financial-account-hold.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountHoldAggregate } from '../../domain/aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { FinancialAccountHoldEntity } from '../../domain/entities/financial-account-hold.entity';

// -----------------------------------------------------------------------------
// Hold Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldRepository } from '../../domain/repositories/financial-account-hold.repository';

// -----------------------------------------------------------------------------
// Financial Account Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Creates a Financial Account Hold aggregate.
 *
 * The hold is initially ACTIVE.
 *
 * Multiple ACTIVE holds may exist for the same Financial Account.
 *
 * The handler resolves the owning Financial Account in order to obtain
 * its internal UniqueEntityId required by FinancialAccountHoldEntity.
 *
 * The Financial Account itself is NOT embedded inside the hold aggregate.
 *
 * The hold stores:
 *
 * - accountId       -> internal persistence reference;
 * - accountPublicId -> opaque cross-aggregate public reference.
 */
@Injectable()
export class CreateFinancialAccountHoldHandler implements CommandHandler<
  CreateFinancialAccountHoldCommand,
  FinancialAccountHoldAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountHoldRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly financialAccountRepository: FinancialAccountRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CreateFinancialAccountHoldCommand,
  ): Promise<FinancialAccountHoldAggregate> {
    // -------------------------------------------------------------------------
    // 1. Resolve owning Financial Account
    // -------------------------------------------------------------------------
    //
    // FinancialAccountHoldEntity requires the internal Financial Account
    // UniqueEntityId for persistence association.
    //
    // The command intentionally carries only the public Financial Account
    // identity.
    //
    // Therefore the application layer resolves:
    //
    //     FinancialAccountPublicId
    //             │
    //             ▼
    //     FinancialAccountAggregate
    //             │
    //             ▼
    //     FinancialAccountAggregate.id
    //
    // The complete Financial Account aggregate is NOT embedded inside the
    // Financial Account Hold aggregate.
    // -------------------------------------------------------------------------

    const account = await this.financialAccountRepository.findByPublicId(
      command.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure Financial Account exists
    // -------------------------------------------------------------------------

    if (account === null) {
      throw new FinancialAccountNotFoundException(
        command.accountPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Create Financial Account Hold entity
    // -------------------------------------------------------------------------
    //
    // Important:
    //
    // The first parameter is the INTERNAL Financial Account identity.
    //
    // The second parameter is the PUBLIC Financial Account identity.
    //
    // They are deliberately different types:
    //
    //     account.id
    //         -> UniqueEntityId
    //
    //     command.accountPublicId
    //         -> FinancialAccountPublicId
    //
    // This prevents accidental mixing of internal and public identities.
    // -------------------------------------------------------------------------

    const hold = FinancialAccountHoldEntity.create(
      account.id,
      command.accountPublicId,
      command.amount,
      account.currency.value,
      command.reference,
      command.expiresAt,
    );

    // -------------------------------------------------------------------------
    // 4. Create aggregate
    // -------------------------------------------------------------------------

    const aggregate = FinancialAccountHoldAggregate.create(hold);

    // -------------------------------------------------------------------------
    // 5. Record creation
    // -------------------------------------------------------------------------
    //
    // The entity is initially ACTIVE.
    //
    // recordCreated() only records the domain event.
    //
    // It does NOT:
    //
    // - modify the Financial Account;
    // - create a HOLD transaction;
    // - execute a HOLD transaction;
    // - move money.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 7. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialAccountHoldHandler;
