// -----------------------------------------------------------------------------
// Commercial Booking Commission — Create Command Handler
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

import type { CreateCommercialBookingCommissionCommand } from '../commands/create-commercial-booking-commission.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAggregate } from '../../domain/aggregates/commercial-booking-commission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionEntity } from '../../domain/entities/commercial-booking-commission.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionRepository } from '../../domain/repositories/commercial-booking-commission.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionPublicId } from '../../domain/value-objects/commercial-booking-commission-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAlreadyExistsException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles creation of a Commercial Booking Commission aggregate.
 *
 * The command is expected to contain already validated domain value objects
 * for:
 *
 * - Commercial Commission Rule reference;
 * - Booking reference;
 * - Journey reference;
 * - commission percentage;
 * - commission base amount;
 * - commission amount;
 * - currency.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Ensure a Commercial Booking Commission does not already exist for the
 *    Booking.
 * 2. Generate the Commercial Booking Commission public identity.
 * 3. Create the Commercial Booking Commission entity in PENDING state.
 * 4. Create the Commercial Booking Commission aggregate.
 * 5. Persist the aggregate.
 * 6. Return the created aggregate.
 *
 * CommercialBookingCommissionEntity.create() is responsible for:
 *
 * - entity creation;
 * - creation invariant enforcement;
 * - initializing the commission lifecycle in PENDING state.
 *
 * CommercialBookingCommissionAggregate.create() is responsible for:
 *
 * - aggregate creation;
 * - recording CommercialBookingCommissionCreatedEvent.
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
 *
 * Those concepts remain independent aggregates or bounded contexts and are
 * referenced through public identifiers.
 */
@Injectable()
export class CreateCommercialBookingCommissionHandler implements CommandHandler<
  CreateCommercialBookingCommissionCommand,
  CommercialBookingCommissionAggregate
> {
  public constructor(
    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.REPOSITORY)
    private readonly repository: CommercialBookingCommissionRepository,
  ) {}

  public async execute(
    command: CreateCommercialBookingCommissionCommand,
  ): Promise<CommercialBookingCommissionAggregate> {
    const alreadyExists = await this.repository.existsByBookingPublicId(
      command.bookingPublicId,
    );

    if (alreadyExists) {
      throw new CommercialBookingCommissionAlreadyExistsException(
        command.bookingPublicId.value,
      );
    }

    const commercialBookingCommissionPublicId =
      new CommercialBookingCommissionPublicId();

    const commercialBookingCommission =
      CommercialBookingCommissionEntity.create({
        publicId: commercialBookingCommissionPublicId,
        commissionRulePublicId: command.commissionRulePublicId,
        bookingPublicId: command.bookingPublicId,
        journeyPublicId: command.journeyPublicId,
        percentage: command.percentage,
        baseAmount: command.baseAmount,
        commissionAmount: command.commissionAmount,
        currency: command.currency,
      });

    const aggregate = CommercialBookingCommissionAggregate.create(
      commercialBookingCommission,
      command.correlationId,
    );

    await this.repository.save(aggregate);

    return aggregate;
  }
}

export default CreateCommercialBookingCommissionHandler;
