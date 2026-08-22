// -----------------------------------------------------------------------------
// Commercial Booking Commission — Assess Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_BOOKING_COMMISSION_TOKENS } from '../commercial-booking-commission.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AssessCommercialBookingCommissionCommand } from '../commands/assess-commercial-booking-commission.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAggregate } from '../../domain/aggregates/commercial-booking-commission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionRepository } from '../../domain/repositories/commercial-booking-commission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles assessment of an existing Commercial Booking Commission aggregate.
 *
 * The command is expected to contain:
 *
 * - the Commercial Booking Commission public identity;
 * - the assessment timestamp;
 * - a correlation identifier;
 * - an optional causation identifier.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Locate the Commercial Booking Commission aggregate.
 * 2. Ensure the aggregate exists.
 * 3. Delegate the lifecycle transition to the aggregate.
 * 4. Persist the modified aggregate.
 * 5. Return the assessed aggregate.
 *
 * CommercialBookingCommissionAggregate.assess() is responsible for:
 *
 * - rejecting an already assessed commission;
 * - validating whether the commission can be assessed;
 * - transitioning the entity to ASSESSED state;
 * - recording the assessment timestamp;
 * - updating the modification timestamp;
 * - recording CommercialBookingCommissionAssessedEvent.
 *
 * The assessment snapshot itself is immutable and is therefore not supplied
 * by this command or recalculated by the handler.
 *
 * Lifecycle invariants are intentionally not enforced directly by this
 * handler because they belong to the Commercial Booking Commission
 * aggregate.
 *
 * The handler does not modify or own:
 *
 * - Booking;
 * - Journey;
 * - Commercial Commission Rule;
 * - Wallet;
 * - Settlement;
 * - Accounting;
 * - Identity.
 */
@Injectable()
export class AssessCommercialBookingCommissionHandler implements CommandHandler<
  AssessCommercialBookingCommissionCommand,
  CommercialBookingCommissionAggregate
> {
  public constructor(
    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.REPOSITORY)
    private readonly repository: CommercialBookingCommissionRepository,
  ) {}

  public async execute(
    command: AssessCommercialBookingCommissionCommand,
  ): Promise<CommercialBookingCommissionAggregate> {
    const aggregate = await this.repository.findByPublicId(command.publicId);

    if (!aggregate) {
      throw new CommercialBookingCommissionNotFoundException(
        command.publicId.value,
      );
    }

    aggregate.assess(command.assessedAt, command.correlationId);

    await this.repository.save(aggregate);

    return aggregate;
  }
}

export default AssessCommercialBookingCommissionHandler;
