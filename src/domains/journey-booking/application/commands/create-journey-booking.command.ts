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
 *
 * Correlation and causation identifiers are application-level metadata.
 *
 * The correlation identifier is required because every application command
 * entering the Journey Booking bounded context must have a correlation
 * context. For a direct HTTP request, the controller generates this value
 * using randomUUID().
 *
 * The causation identifier remains optional because a direct HTTP request
 * does not necessarily originate from another application command or event.
 *
 * The passenger reference is supplied by the authenticated application
 * boundary and must not come from untrusted client input.
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
     *
     * This value is derived from the authenticated request rather than
     * accepted from the booking request body.
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
     *
     * Direct HTTP requests receive this value from the application boundary.
     *
     * The controller generates it with randomUUID() and passes it into the
     * command. It is therefore required at the command level and must not
     * come from the untrusted booking request body.
     */
    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Optional identifier of the command or event that caused this command.
     *
     * Direct HTTP requests normally have no causation identifier, so the
     * controller supplies undefined.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
