// -----------------------------------------------------------------------------
// Journey Booking — Create Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateJourneyBookingCommand } from '../commands/create-journey-booking.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyBookingEntity } from '../../domain/entities/journey-booking.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBookingPublicId,
  JourneyBookingStatus,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles creation of a Journey Booking aggregate.
 *
 * The application command is expected to contain already validated domain
 * value objects for:
 *
 * - Journey reference
 * - Passenger reference
 * - Requested seats
 *
 * The handler is therefore responsible for orchestration rather than
 * reconstructing or re-validating those value objects.
 *
 * Workflow:
 *
 * 1. Generate the Journey Booking public identity.
 * 2. Ensure the generated identity does not already exist.
 * 3. Create the Journey Booking entity in PENDING state.
 * 4. Create the Journey Booking aggregate.
 * 5. Persist the aggregate.
 * 6. Return the created aggregate.
 *
 * JourneyBookingAggregate.create() is responsible for recording the
 * JourneyBookingCreatedEvent.
 *
 * Snapshot, pricing, payment, and cancellation components are intentionally
 * not created by this command. They belong to their respective application
 * and domain workflows.
 */
export class CreateJourneyBookingHandler implements CommandHandler<
  CreateJourneyBookingCommand,
  JourneyBookingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBookingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CreateJourneyBookingCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Journey Booking Public Identity
    // -------------------------------------------------------------------------

    const journeyBookingPublicId = new JourneyBookingPublicId();

    // -------------------------------------------------------------------------
    // Uniqueness
    // -------------------------------------------------------------------------

    const alreadyExists = await this.repository.existsByPublicId(
      journeyBookingPublicId,
    );

    if (alreadyExists) {
      throw new Error(
        `Journey booking '${journeyBookingPublicId.value}' already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Journey Booking Entity
    // -------------------------------------------------------------------------

    const journeyBooking = JourneyBookingEntity.create({
      publicId: journeyBookingPublicId,

      journeyPublicId: command.journeyPublicId,

      passengerPublicId: command.passengerPublicId,

      seats: command.seats,

      status: JourneyBookingStatus.pending(),
    });

    // -------------------------------------------------------------------------
    // Journey Booking Aggregate
    // -------------------------------------------------------------------------

    /**
     * JourneyBookingAggregate.create() records the
     * JourneyBookingCreatedEvent internally.
     */
    const aggregate = JourneyBookingAggregate.create(
      journeyBooking,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
