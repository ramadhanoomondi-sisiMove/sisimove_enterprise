// -----------------------------------------------------------------------------
// Financial Disbursement — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving an existing Financial Disbursement
// aggregate.
//
// Workflow:
//
// 1. Resolve the Financial Disbursement aggregate by public identity.
// 2. Ensure the aggregate exists.
// 3. Return the fully rehydrated aggregate.
//
// The repository is responsible for rehydrating:
//
// - FinancialDisbursementEntity;
// - all FinancialDisbursementAttemptEntity children;
// - the associated FinancialDisbursementDestinationEntity.
//
// This handler does NOT:
//
// - access persistence directly;
// - expose persistence models;
// - resolve internal entity identifiers;
// - mutate the Financial Disbursement aggregate;
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

import type { GetFinancialDisbursementQuery } from '../queries/get-financial-disbursement.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

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
export class GetFinancialDisbursementHandler implements QueryHandler<
  GetFinancialDisbursementQuery,
  FinancialDisbursementAggregate
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
    query: GetFinancialDisbursementQuery,
  ): Promise<FinancialDisbursementAggregate> {
    // -------------------------------------------------------------------------
    // Resolve Financial Disbursement
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
    // Return Aggregate
    // -------------------------------------------------------------------------
    //
    // The returned aggregate is fully rehydrated by the repository.
    //
    // The application query layer does not expose persistence models or
    // reconstruct aggregate state itself.
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialDisbursementHandler;
