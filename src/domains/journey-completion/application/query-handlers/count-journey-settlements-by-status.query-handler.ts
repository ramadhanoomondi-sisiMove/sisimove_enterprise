// -----------------------------------------------------------------------------
// Journey Settlement — Count By Status Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { CountJourneySettlementsByStatusQuery } from '../queries/count-journey-settlements-by-status.query';

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

import { JourneySettlementStatus } from '../../domain/value-objects/journey-settlement-status.vo';

import { JOURNEY_SETTLEMENT_TOKENS } from '../journey-settlement.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CountJourneySettlementsByStatusQueryHandler implements QueryHandler<
  CountJourneySettlementsByStatusQuery,
  number
> {
  constructor(
    @Inject(JOURNEY_SETTLEMENT_TOKENS.REPOSITORY)
    private readonly repository: JourneySettlementRepository,
  ) {}

  public async execute(
    query: CountJourneySettlementsByStatusQuery,
  ): Promise<number> {
    const status = JourneySettlementStatus.create(query.status);

    return this.repository.countByStatus(status);
  }
}
