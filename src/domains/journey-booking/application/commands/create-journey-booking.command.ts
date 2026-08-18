// src/domains/journey-booking/application/commands/create-journey-booking.command.ts

// -----------------------------------------------------------------------------
// Journey Booking — Create Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBookingJourneyPublicId,
  JourneyBookingPassengerPublicId,
  JourneyBookingSeats,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Creates a new Journey Booking.
 *
 * The command receives already validated domain value objects for:
 *
 * - Journey reference
 * - Passenger reference
 * - Requested seat count
 *
 * Journey snapshot, pricing, payment, and lifecycle state are established
 * by their respective application/domain workflows.
 */
export class CreateJourneyBookingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey being booked.
     *
     * References Journey.publicId across the bounded-context boundary.
     */
    public readonly journeyPublicId: JourneyBookingJourneyPublicId,

    // -------------------------------------------------------------------------
    // Passenger
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the passenger making the booking.
     *
     * References Identity.publicId across the bounded-context boundary.
     */
    public readonly passengerPublicId: JourneyBookingPassengerPublicId,

    // -------------------------------------------------------------------------
    // Seats
    // -------------------------------------------------------------------------

    /**
     * Number of seats requested for the booking.
     *
     * The value object guarantees that the seat count is a valid positive
     * integer.
     */
    public readonly seats: JourneyBookingSeats,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
