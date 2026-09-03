// -----------------------------------------------------------------------------
// Financial Disbursement — Get Attempts Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the execution attempts belonging
// to an existing Financial Disbursement aggregate.
//
// Workflow:
//
// 1. Resolve the Financial Disbursement aggregate by public identity.
// 2. Ensure the aggregate exists.
// 3. Return its authoritative attempt collection.
//
// FinancialDisbursementAttemptEntity instances are owned by the
// FinancialDisbursementEntity and are therefore never retrieved as an
// independent aggregate.
//
// The repository is responsible for fully rehydrating the Financial
// Disbursement aggregate, including all attempt entities and the associated
// Financial Disbursement Destination.
//
// This handler does NOT:
//
// - mutate the Financial Disbursement aggregate;
// - create or modify execution attempts;
// - execute provider operations;
// - modify Financial Account balances;
// - create or post Financial Transactions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetFinancialDisbursementAttemptsQuery } from '../queries/get-financial-disbursement-attempts.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAttemptEntity } from '../../domain/entities/financial-disbursement-attempt.entity';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialDisbursementException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetFinancialDisbursementAttemptsHandler implements QueryHandler<
  GetFinancialDisbursementAttemptsQuery,
  readonly FinancialDisbursementAttemptEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetFinancialDisbursementAttemptsQuery,
  ): Promise<readonly FinancialDisbursementAttemptEntity[]> {
    // -------------------------------------------------------------------------
    // Resolve Financial Disbursement
    // -------------------------------------------------------------------------
    //
    // The repository must return a fully rehydrated aggregate, including the
    // complete attempt collection owned by the FinancialDisbursementEntity.
    // -------------------------------------------------------------------------

    const aggregate = await this.disbursementRepository.findByPublicId(
      query.disbursementPublicId,
    );

    if (aggregate === null) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${query.disbursementPublicId.value}" was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Return Authoritative Attempts
    // -------------------------------------------------------------------------
    //
    // FinancialDisbursementEntity.attempts is the single source of truth for
    // execution attempts.
    //
    // The handler does not create a second collection or transform the
    // aggregate-owned entities into persistence models.
    // -------------------------------------------------------------------------

    return aggregate.attempts;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialDisbursementAttemptsHandler;
