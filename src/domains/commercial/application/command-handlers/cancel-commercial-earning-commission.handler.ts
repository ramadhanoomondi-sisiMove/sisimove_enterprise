// -----------------------------------------------------------------------------
// Commercial Earning Commission — Cancel Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_EARNING_COMMISSION_TOKENS } from '../commercial-earning-commission.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CancelCommercialEarningCommissionCommand } from '../commands/cancel-commercial-earning-commission.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAggregate } from '../../domain/aggregates/commercial-earning-commission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionRepository } from '../../domain/repositories/commercial-earning-commission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles cancellation of an existing Commercial Earning Commission
 * aggregate.
 *
 * The command is expected to contain:
 *
 * - the Commercial Earning Commission public identity;
 * - the cancellation timestamp;
 * - a correlation identifier;
 * - an optional causation identifier.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Locate the Commercial Earning Commission aggregate.
 * 2. Ensure the aggregate exists.
 * 3. Delegate the lifecycle transition to the aggregate.
 * 4. Persist the modified aggregate.
 * 5. Return the cancelled aggregate.
 *
 * CommercialEarningCommissionAggregate.cancel() is responsible for:
 *
 * - rejecting an already cancelled commission;
 * - validating whether the commission can be cancelled;
 * - transitioning the entity to CANCELLED state;
 * - recording the cancellation timestamp;
 * - preserving the historical financial assessment snapshot;
 * - updating the modification timestamp;
 * - recording CommercialEarningCommissionCancelledEvent.
 *
 * The historical financial snapshot is immutable and is therefore not
 * supplied, recalculated, or modified by this handler.
 *
 * Lifecycle invariants are intentionally not enforced directly by this
 * handler because they belong to the Commercial Earning Commission
 * aggregate.
 *
 * The handler does not modify or own:
 *
 * - Journey;
 * - Journey Settlement;
 * - Identity / Provider;
 * - Commercial Commission Rule;
 * - Wallet;
 * - Disbursement;
 * - Treasury;
 * - Accounting.
 */
@Injectable()
export class CancelCommercialEarningCommissionHandler implements CommandHandler<
  CancelCommercialEarningCommissionCommand,
  CommercialEarningCommissionAggregate
> {
  public constructor(
    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.REPOSITORY)
    private readonly repository: CommercialEarningCommissionRepository,
  ) {}

  public async execute(
    command: CancelCommercialEarningCommissionCommand,
  ): Promise<CommercialEarningCommissionAggregate> {
    const aggregate = await this.repository.findByPublicId(command.publicId);

    if (!aggregate) {
      throw new CommercialEarningCommissionNotFoundException(
        command.publicId.value,
      );
    }

    aggregate.cancel(command.cancelledAt, command.correlationId);

    await this.repository.save(aggregate);

    return aggregate;
  }
}

export default CancelCommercialEarningCommissionHandler;
