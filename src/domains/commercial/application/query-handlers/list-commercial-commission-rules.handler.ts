// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Commission Rule — List Query Handler
//
// Handles the application request to retrieve all Commercial Commission Rule
// aggregates.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives ListCommercialCommissionRulesQuery;
// - delegates retrieval to CommercialCommissionRuleRepository;
// - returns the complete collection of Commercial Commission Rule aggregates.
//
// The handler contains no commercial business rules.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   ListCommercialCommissionRulesQuery
//
// Handler:
//
//   ListCommercialCommissionRulesHandler
//
// Repository:
//
//   CommercialCommissionRuleRepository.findAll()
//
// -----------------------------------------------------------------------------
// DOMAIN BOUNDARY
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - create commission rules;
// - update commission rules;
// - activate commission rules;
// - deactivate commission rules;
// - validate commission-rule policy;
// - calculate commissions.
//
// Those responsibilities remain within the appropriate command handlers and
// the CommercialCommissionRule aggregate.
//
// -----------------------------------------------------------------------------
// DEPENDENCY INJECTION
// -----------------------------------------------------------------------------
//
// The repository is resolved through:
//
//   COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY
//
// This keeps the application layer independent from the Prisma persistence
// implementation.
//
// -----------------------------------------------------------------------------
// RETURN CONTRACT
// -----------------------------------------------------------------------------
//
// Returns:
//
//   Promise<CommercialCommissionRuleAggregate[]>
//
// The repository determines persistence ordering. The handler does not
// reorder or transform the result.
//
// =============================================================================

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Token
// -----------------------------------------------------------------------------

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from '../commercial-commission-rule.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { ListCommercialCommissionRulesQuery } from '../queries/list-commercial-commission-rules.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleAggregate } from '../../domain/aggregates/commercial-commission-rule.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleRepository } from '../../domain/repositories/commercial-commission-rule.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ListCommercialCommissionRulesHandler implements QueryHandler<
  ListCommercialCommissionRulesQuery,
  CommercialCommissionRuleAggregate[]
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY)
    private readonly repository: CommercialCommissionRuleRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    query: ListCommercialCommissionRulesQuery,
  ): Promise<CommercialCommissionRuleAggregate[]> {
    void query;

    return this.repository.findAll();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default ListCommercialCommissionRulesHandler;
