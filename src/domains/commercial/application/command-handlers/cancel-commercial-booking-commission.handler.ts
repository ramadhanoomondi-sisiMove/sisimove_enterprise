// -----------------------------------------------------------------------------
// Commercial Booking Commission — Cancel Command Handler
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

import type { CancelCommercialBookingCommissionCommand } from '../commands/cancel-commercial-booking-commission.command';

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
 * Handles cancellation of an existing Commercial Booking Commission
 * aggregate.
 *
 * The command is expected to contain:
 *
 * - the Commercial Booking Commission public identity;
 * - the cancellation timestamp;
 * - a correlation identifier;
 * - an optional causation identifier.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Locate the Commercial Booking Commission aggregate.
 * 2. Ensure the aggregate exists.
 * 3. Delegate the lifecycle transition to the aggregate.
 * 4. Persist the modified aggregate.
 * 5. Return the cancelled aggregate.
 *
 * CommercialBookingCommissionAggregate.cancel() is responsible for:
 *
 * - rejecting an already cancelled commission;
 * - validating whether the commission can be cancelled;
 * - transitioning the entity to CANCELLED state;
 * - recording the cancellation timestamp;
 * - preserving any existing assessment timestamp;
 * - updating the modification timestamp;
 * - recording CommercialBookingCommissionCancelledEvent.
 *
 * The historical commercial assessment snapshot is immutable and is
 * therefore not supplied or recalculated by this handler.
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
export class CancelCommercialBookingCommissionHandler implements CommandHandler<
  CancelCommercialBookingCommissionCommand,
  CommercialBookingCommissionAggregate
> {
  public constructor(
    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.REPOSITORY)
    private readonly repository: CommercialBookingCommissionRepository,
  ) {}

  public async execute(
    command: CancelCommercialBookingCommissionCommand,
  ): Promise<CommercialBookingCommissionAggregate> {
    const aggregate = await this.repository.findByPublicId(command.publicId);

    if (!aggregate) {
      throw new CommercialBookingCommissionNotFoundException(
        command.publicId.value,
      );
    }

    aggregate.cancel(command.cancelledAt, command.correlationId);

    await this.repository.save(aggregate);

    return aggregate;
  }
}

export default CancelCommercialBookingCommissionHandler;
